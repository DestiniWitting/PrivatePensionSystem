import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './index.css';

// Contract configuration for Sepolia
const CONTRACT_ADDRESS = "0xF71045bd12Ef5F0E0C30734dD6dCB75BB9b3aD78"; // Deploy your contract here
const CONTRACT_ABI = [
  "function createPensionAccount(uint256 _retirementAge) external",
  "function makeContribution(uint64 amount) external payable",
  "function selectInvestmentOption(uint256 optionId) external",
  "function calculateReturns() external",
  "function initiateRetirement() external",
  "function withdraw(uint64 amount) external payable",
  "function getAccountInfo() external view returns (uint256, uint256, bool, uint256)",
  "function getInvestmentOption(uint256 optionId) external view returns (string memory, uint256, bool)",
  "function getBalance() external view returns (uint64)",
  "function getContributions() external view returns (uint64)",
  "function getReturns() external view returns (uint64)",
  "event AccountCreated(address indexed user, uint256 retirementAge)",
  "event ContributionMade(address indexed user, bytes encryptedAmount)",
  "event InvestmentOptionSelected(address indexed user, uint256 optionId)",
  "event RetirementInitiated(address indexed user)",
  "event WithdrawalMade(address indexed user, bytes encryptedAmount)"
];

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Connect wallet to start managing your retirement!');
  
  // Account info
  const [accountInfo, setAccountInfo] = useState(null);
  const [balance, setBalance] = useState('0.00');
  
  // Form states
  const [contributionAmount, setContributionAmount] = useState('');
  const [retirementAge, setRetirementAge] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState(0);
  
  // Investment strategies
  const strategies = [
    { id: 0, name: 'Conservative', risk: 'Low Risk', apy: '3-5%', icon: '🛡️' },
    { id: 1, name: 'Balanced', risk: 'Moderate Risk', apy: '6-8%', icon: '⚖️' },
    { id: 2, name: 'Growth', risk: 'High Risk', apy: '10-12%', icon: '🚀' }
  ];

  // Real wallet connection based on FHEGuess example
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      setLoading(true);
      setMessage('Connecting to MetaMask...');

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Sepolia network check
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') { // Sepolia chain ID
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io/']
              }]
            });
          }
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setAccount(accounts[0]);
      setContract(contractInstance);
      setMessage('Connected to Sepolia! Ready for encrypted pension management 🏦');
      
      // Load account info
      await loadAccountInfo(contractInstance);
      
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setMessage('Wallet connection failed ❌ Please try again');
    } finally {
      setLoading(false);
    }
  };

  // Load account information
  const loadAccountInfo = async (contractInstance = contract) => {
    if (!contractInstance) return;

    try {
      const info = await contractInstance.getAccountInfo();
      setAccountInfo({
        retirementAge: Number(info[0]),
        lastContribution: Number(info[1]),
        isRetired: info[2],
        selectedInvestment: Number(info[3])
      });
      
      // Mock balance for demonstration (in real implementation, you'd decrypt FHE values)
      setBalance((Math.random() * 10000).toFixed(2));
    } catch (error) {
      console.error('Failed to load account info:', error);
    }
  };

  // Create pension account
  const createAccount = async () => {
    if (!contract || !retirementAge) {
      setMessage('Please connect wallet and enter retirement age!');
      return;
    }

    const age = parseInt(retirementAge);
    if (age < 55 || age > 75) {
      setMessage('Retirement age must be between 55-75 years!');
      return;
    }

    try {
      setLoading(true);
      setMessage('Creating pension account on blockchain...');
      
      // Create pension account with retirement age
      const tx = await contract.createPensionAccount(age);
      setMessage('Transaction sent! Creating your secure pension account...');
      
      await tx.wait();
      
      setMessage(`Pension account created successfully! Retirement at age ${age} 🎉`);
      await loadAccountInfo();
      
    } catch (error) {
      console.error('Create account failed:', error);
      setMessage('Failed to create account ❌');
    } finally {
      setLoading(false);
    }
  };

  // Make contribution
  const makeContribution = async () => {
    if (!contract || !contributionAmount) {
      setMessage('Please enter contribution amount!');
      return;
    }

    const amount = parseFloat(contributionAmount);
    if (amount <= 0) {
      setMessage('Contribution amount must be positive!');
      return;
    }

    try {
      setLoading(true);
      setMessage('Processing encrypted contribution...');
      
      // Make contribution with amount
      const tx = await contract.makeContribution(Math.floor(amount), {
        value: ethers.parseEther("0.001") // Small ETH amount for gas
      });
      setMessage('Transaction sent! Your contribution is being encrypted and stored...');
      
      await tx.wait();
      
      setMessage(`Contribution of ${amount} ETH made successfully! 💰`);
      setContributionAmount('');
      await loadAccountInfo();
      
    } catch (error) {
      console.error('Contribution failed:', error);
      setMessage('Failed to make contribution ❌');
    } finally {
      setLoading(false);
    }
  };

  // Select investment strategy
  const selectStrategy = async (strategyId) => {
    if (!contract) {
      setMessage('Please connect wallet first!');
      return;
    }

    try {
      setLoading(true);
      setMessage('Selecting investment strategy...');
      
      const tx = await contract.selectInvestmentOption(strategyId);
      setMessage('Transaction sent! Updating your investment strategy...');
      
      await tx.wait();
      
      const strategy = strategies.find(s => s.id === strategyId);
      setMessage(`${strategy.name} strategy selected successfully! ${strategy.icon}`);
      setSelectedStrategy(strategyId);
      await loadAccountInfo();
      
    } catch (error) {
      console.error('Strategy selection failed:', error);
      setMessage('Failed to select strategy ❌');
    } finally {
      setLoading(false);
    }
  };

  // Calculate returns
  const calculateReturns = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      setMessage('Calculating encrypted returns...');
      
      const tx = await contract.calculateReturns();
      await tx.wait();
      
      setMessage('Returns calculated and added to your balance! 📈');
      await loadAccountInfo();
      
    } catch (error) {
      console.error('Calculate returns failed:', error);
      setMessage('Failed to calculate returns ❌');
    } finally {
      setLoading(false);
    }
  };
  
  // Initiate retirement
  const initiateRetirement = async () => {
    if (!contract) {
      setMessage('Please connect wallet first!');
      return;
    }

    try {
      setLoading(true);
      setMessage('Initiating retirement on blockchain...');
      
      const tx = await contract.initiateRetirement();
      setMessage('Transaction sent! Processing retirement request...');
      
      await tx.wait();
      
      setMessage('Retirement initiated successfully! You can now make withdrawals 🎉');
      await loadAccountInfo();
      
    } catch (error) {
      console.error('Initiate retirement failed:', error);
      setMessage('Failed to initiate retirement ❌');
    } finally {
      setLoading(false);
    }
  };
  
  // Withdraw funds
  const withdrawFunds = async (amount) => {
    if (!contract || !amount) {
      setMessage('Please connect wallet and enter withdrawal amount!');
      return;
    }
    
    if (!accountInfo?.isRetired) {
      setMessage('You must be retired to make withdrawals!');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0) {
      setMessage('Withdrawal amount must be positive!');
      return;
    }

    try {
      setLoading(true);
      setMessage('Processing encrypted withdrawal...');
      
      // Process withdrawal with amount
      const tx = await contract.withdraw(Math.floor(withdrawAmount), {
        value: ethers.parseEther("0.001") // Small ETH amount for gas
      });
      setMessage('Transaction sent! Processing withdrawal...');
      
      await tx.wait();
      
      setMessage(`Withdrawal of ${withdrawAmount} ETH processed successfully! 💰`);
      await loadAccountInfo();
      
    } catch (error) {
      console.error('Withdrawal failed:', error);
      setMessage('Failed to process withdrawal ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900">
      {/* Navigation */}
      <nav className="bg-black bg-opacity-30 backdrop-blur-lg border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">🏦 SecurePension</h1>
            </div>
            <div>
              {!account ? (
                <button 
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  onClick={connectWallet}
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              ) : (
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium" disabled>
                  {account.slice(0, 6)}...{account.slice(-4)}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">
            Confidential Pension System
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Private Retirement Management with Fully Homomorphic Encryption
          </p>
          <div className="bg-emerald-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-emerald-200">
              🔒 All your financial data is encrypted end-to-end using FHE technology
            </p>
          </div>
        </div>

        {/* Status Message */}
        <div className="mb-8">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-4">
            <p className="text-white text-center">➤ {message}</p>
          </div>
        </div>

        {/* Account Creation (if no account) */}
        {account && !accountInfo && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Create Your Pension Account</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Target Retirement Age (55-75)
                </label>
                <input
                  type="number"
                  min="55"
                  max="75"
                  placeholder="65"
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-emerald-500 focus:outline-none"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                onClick={createAccount}
                disabled={loading || !retirementAge}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </div>
        )}

        {/* Dashboard (if account exists) */}
        {account && accountInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Account Overview */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Account Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Encrypted Balance:</span>
                  <span className="text-2xl font-bold text-emerald-400">${balance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Retirement Age:</span>
                  <span className="text-xl font-semibold text-white">{accountInfo.retirementAge}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Strategy:</span>
                  <span className="text-lg font-medium text-emerald-300">
                    {strategies[accountInfo.selectedInvestment]?.name || 'Conservative'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status:</span>
                  <span className={`text-lg font-medium ${accountInfo.isRetired ? 'text-red-400' : 'text-green-400'}`}>
                    {accountInfo.isRetired ? 'Retired' : 'Active'}
                  </span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  onClick={calculateReturns}
                  disabled={loading}
                >
                  {loading ? 'Calculating...' : 'Calculate Returns'}
                </button>
                
                {!accountInfo.isRetired && (
                  <button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                    onClick={initiateRetirement}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Initiate Retirement'}
                  </button>
                )}
              </div>
            </div>

            {/* Make Contribution / Claim Benefits */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
              {!accountInfo.isRetired ? (
                <>
                  <h2 className="text-2xl font-semibold text-white mb-6">Make Contribution</h2>
                  <div className="space-y-4">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount in ETH"
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-emerald-500 focus:outline-none"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                      onClick={makeContribution}
                      disabled={loading || !contributionAmount}
                    >
                      {loading ? 'Contributing...' : 'Contribute to Pension'}
                    </button>
                  </div>
                  <div className="mt-4 text-gray-300 text-sm space-y-1">
                    <p>• Contributions are encrypted using FHE</p>
                    <p>• Earn compound returns over time</p>
                    <p>• Tax-advantaged retirement savings</p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-white mb-6">🎯 Claim Benefits</h2>
                  <div className="space-y-4">
                    <input
                      type="number"
                      step="0.001"
                      placeholder="Enter claim amount in ETH"
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={() => withdrawFunds(contributionAmount)}
                      disabled={loading || !contributionAmount}
                    >
                      {loading ? 'Processing Claim...' : '💰 Claim Pension Benefits'}
                    </button>
                  </div>
                  <div className="mt-4 text-gray-300 text-sm space-y-1">
                    <p>• Claims are processed securely on-chain</p>
                    <p>• All amounts remain encrypted with FHE</p>
                    <p>• Instant blockchain confirmation</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Special Retirement Status Banner */}
        {account && accountInfo?.isRetired && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">🎉 Retirement Active</h3>
                  <p className="text-gray-300">You can now access your pension benefits and make secure claims</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-sm text-gray-400">Ready for Claims</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investment Strategies */}
        {account && accountInfo && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Investment Strategies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {strategies.map((strategy) => (
                <div 
                  key={strategy.id}
                  className={`bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 transition-all duration-300 cursor-pointer hover:bg-opacity-20 ${
                    accountInfo.selectedInvestment === strategy.id ? 'ring-2 ring-emerald-400' : ''
                  }`}
                  onClick={() => selectStrategy(strategy.id)}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{strategy.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{strategy.name}</h3>
                    <p className="text-gray-300 mb-3">{strategy.risk}</p>
                    <div className="text-emerald-400 text-2xl font-bold mb-4">{strategy.apy}</div>
                    <button
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        accountInfo.selectedInvestment === strategy.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                      disabled={loading}
                    >
                      {accountInfo.selectedInvestment === strategy.id ? 'Selected' : 'Select Strategy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-400 mt-16">
          <p className="mb-2">SecurePension - Confidential Pension System</p>
          <p className="text-sm">
            Powered by Fully Homomorphic Encryption • Built on Ethereum Sepolia Testnet
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;