import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

const PensionContext = createContext();

export const usePension = () => {
  const context = useContext(PensionContext);
  if (!context) {
    throw new Error('usePension must be used within a PensionProvider');
  }
  return context;
};

const CONTRACT_ADDRESS = '0xF71045bd12Ef5F0E0C30734dD6dCB75BB9b3aD78'; // Updated after deployment
const CONTRACT_ABI = [
  "function createPensionAccount(uint256 _retirementAge, bytes calldata encryptedAge) external",
  "function makeContribution(bytes calldata encryptedAmount) external",
  "function selectInvestmentOption(uint256 optionId) external",
  "function calculateReturns() external",
  "function initiateRetirement() external",
  "function withdraw(bytes calldata encryptedAmount) external",
  "function getAccountInfo() external view returns (uint256, uint256, bool, uint256)",
  "function getInvestmentOption(uint256 optionId) external view returns (string memory, uint256, bool)",
  "function getEncryptedBalance(bytes32 publicKey, bytes calldata signature) external view returns (bytes memory)",
  "event AccountCreated(address indexed user, uint256 retirementAge)",
  "event ContributionMade(address indexed user, bytes encryptedAmount)",
  "event InvestmentOptionSelected(address indexed user, uint256 optionId)",
  "event RetirementInitiated(address indexed user)",
  "event WithdrawalMade(address indexed user, bytes encryptedAmount)"
];

export const PensionProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [pensionAccount, setPensionAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [investmentOptions, setInvestmentOptions] = useState([]);

  // Read account info
  const { data: accountInfo, isError, isLoading } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAccountInfo',
    enabled: isConnected && address,
  });

  // Contract write functions
  const { write: createAccount, isLoading: isCreatingAccount } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'createPensionAccount',
  });

  const { write: makeContribution, isLoading: isContributing } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'makeContribution',
  });

  const { write: selectInvestment, isLoading: isSelectingInvestment } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'selectInvestmentOption',
  });
  
  const { write: initiateRetirement, isLoading: isInitiatingRetirement } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'initiateRetirement',
  });
  
  const { write: withdrawFunds, isLoading: isWithdrawing } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'withdraw',
  });

  useEffect(() => {
    if (accountInfo) {
      setPensionAccount({
        retirementAge: accountInfo[0],
        lastContribution: accountInfo[1],
        isRetired: accountInfo[2],
        selectedInvestment: accountInfo[3],
      });
    }
  }, [accountInfo]);

  useEffect(() => {
    // Load investment options
    const loadInvestmentOptions = async () => {
      const options = [
        { id: 0, name: 'Conservative Bonds', riskLevel: 2 },
        { id: 1, name: 'Balanced Portfolio', riskLevel: 5 },
        { id: 2, name: 'Growth Stocks', riskLevel: 8 },
      ];
      setInvestmentOptions(options);
    };

    loadInvestmentOptions();
  }, []);

  const createPensionAccount = async (retirementAge, encryptedAge) => {
    try {
      setLoading(true);
      await createAccount({
        args: [retirementAge, encryptedAge],
      });
    } catch (error) {
      console.error('Error creating pension account:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const contribute = async (encryptedAmount) => {
    try {
      setLoading(true);
      await makeContribution({
        args: [encryptedAmount],
      });
    } catch (error) {
      console.error('Error making contribution:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const selectInvestmentOption = async (optionId) => {
    try {
      setLoading(true);
      await selectInvestment({
        args: [optionId],
      });
    } catch (error) {
      console.error('Error selecting investment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const startRetirement = async () => {
    try {
      setLoading(true);
      await initiateRetirement();
    } catch (error) {
      console.error('Error initiating retirement:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const withdraw = async (encryptedAmount) => {
    try {
      setLoading(true);
      await withdrawFunds({
        args: [encryptedAmount],
      });
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    pensionAccount,
    investmentOptions,
    loading: loading || isLoading,
    isCreatingAccount,
    isContributing,
    isSelectingInvestment,
    isInitiatingRetirement,
    isWithdrawing,
    createPensionAccount,
    contribute,
    selectInvestmentOption,
    startRetirement,
    withdraw,
  };

  return (
    <PensionContext.Provider value={value}>
      {children}
    </PensionContext.Provider>
  );
};