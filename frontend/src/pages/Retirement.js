import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { 
  CalendarDaysIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { usePension } from '../contexts/PensionContext';
import toast from 'react-hot-toast';

const Retirement = () => {
  const { pensionAccount } = usePension();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [contract, setContract] = useState(null);
  
  // Contract configuration
  const CONTRACT_ADDRESS = "0xF71045bd12Ef5F0E0C30734dD6dCB75BB9b3aD78";
  const CONTRACT_ABI = [
    "function withdraw(uint64 amount) external payable",
    "function initiateRetirement() external",
    "function getAccountInfo() external view returns (uint256, uint256, bool, uint256)",
    "event WithdrawalMade(address indexed user, bytes encryptedAmount)",
    "event RetirementInitiated(address indexed user)"
  ];
  
  // Initialize contract connection
  React.useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);
      }
    };
    initContract();
  }, []);

  const calculateYearsToRetirement = () => {
    if (!pensionAccount?.retirementAge) return 0;
    const currentYear = new Date().getFullYear();
    const currentAge = 30; // This would come from user profile in a real app
    return Math.max(0, pensionAccount.retirementAge - currentAge);
  };

  const handleInitiateRetirement = async () => {
    if (!contract) {
      toast.error('Contract not connected. Please refresh the page.');
      return;
    }
    
    try {
      setIsProcessing(true);
      toast.loading('Initiating retirement on blockchain...');
      
      const tx = await contract.initiateRetirement();
      toast.loading('Transaction sent! Waiting for confirmation...');
      
      await tx.wait();
      
      toast.dismiss();
      toast.success('Retirement initiated successfully! 🎉');
    } catch (error) {
      console.error('Error initiating retirement:', error);
      toast.dismiss();
      toast.error('Failed to initiate retirement. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }
    
    if (!contract) {
      toast.error('Contract not connected. Please refresh the page.');
      return;
    }

    try {
      setIsProcessing(true);
      toast.loading('Processing encrypted withdrawal...');
      
      // Process withdrawal with amount
      const amount = Math.floor(parseFloat(withdrawAmount));
      
      toast.loading('Sending withdrawal transaction to blockchain...');
      
      const tx = await contract.withdraw(amount, {
        value: ethers.parseEther("0.001") // Small ETH amount for gas
      });
      toast.loading('Transaction sent! Waiting for blockchain confirmation...');
      
      await tx.wait();
      
      toast.dismiss();
      toast.success(`Withdrawal of ${withdrawAmount} ETH processed successfully! 💰`);
      setWithdrawAmount('');
      
      // Listen for the WithdrawalMade event
      contract.once('WithdrawalMade', (user, amount) => {
        console.log('Withdrawal event detected:', { user, amount });
      });
      
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.dismiss();
      
      // Handle specific error cases
      if (error.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected by user');
      } else if (error.message.includes('Must be retired')) {
        toast.error('You must be in retirement status to make withdrawals');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient balance for withdrawal');
      } else {
        toast.error('Failed to process withdrawal. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const yearsToRetirement = calculateYearsToRetirement();
  const isEligibleForRetirement = pensionAccount?.isRetired || yearsToRetirement <= 0;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            Retirement Planning
          </h1>
          <p className="text-gray-400">
            Manage your retirement timeline and access your pension benefits
          </p>
        </motion.div>

        {/* Retirement Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className={`card p-6 ${
            isEligibleForRetirement ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-blue-900/20 border-blue-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isEligibleForRetirement ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                }`}>
                  {isEligibleForRetirement ? (
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <ClockIcon className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isEligibleForRetirement ? 'Retirement Eligible' : 'Building Your Future'}
                  </h2>
                  <p className={`text-sm ${isEligibleForRetirement ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {isEligibleForRetirement 
                      ? 'You can now access your pension benefits'
                      : `${yearsToRetirement} years until retirement eligibility`
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {pensionAccount?.retirementAge || 65}
                </div>
                <div className="text-sm text-gray-400">Target Age</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Retirement Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              {/* Initiate Retirement */}
              {!pensionAccount?.isRetired && isEligibleForRetirement && (
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <CalendarDaysIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Initiate Retirement
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">
                    Begin your retirement phase to unlock withdrawal capabilities.
                  </p>
                  
                  <button
                    onClick={handleInitiateRetirement}
                    disabled={isProcessing}
                    className="btn btn-primary w-full"
                  >
                    {isProcessing ? 'Processing...' : 'Start Retirement'}
                  </button>
                </div>
              )}

              {/* Withdrawal */}
              {pensionAccount?.isRetired && (
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <BanknotesIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Make Withdrawal
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Withdrawal Amount (ETH)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <button
                      onClick={handleWithdrawal}
                      disabled={isProcessing}
                      className="btn btn-primary w-full"
                    >
                      {isProcessing ? 'Processing...' : 'Withdraw Funds'}
                    </button>
                  </div>
                </div>
              )}

              {/* Not Eligible Notice */}
              {!isEligibleForRetirement && (
                <div className="card p-6 bg-amber-900/20 border border-amber-500/30">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Retirement Pending
                      </h3>
                      <p className="text-sm text-amber-400 mb-3">
                        You're not yet eligible for retirement benefits.
                      </p>
                      <p className="text-xs text-gray-400">
                        Continue making contributions and let your pension grow until you reach retirement age.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Retirement Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              {/* Pension Summary */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-6">
                  Pension Summary
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <BanknotesIcon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">Private</div>
                    <div className="text-sm text-gray-400">Total Balance</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <ChartBarIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">Private</div>
                    <div className="text-sm text-gray-400">Total Returns</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <CalendarDaysIcon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{yearsToRetirement}</div>
                    <div className="text-sm text-gray-400">Years to Retirement</div>
                  </div>
                </div>
              </div>

              {/* Retirement Timeline */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-6">
                  Retirement Timeline
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Account Created</div>
                      <div className="text-sm text-gray-400">Pension account established and active</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      pensionAccount?.contributions ? 'bg-emerald-500' : 'bg-gray-600'
                    }`}>
                      {pensionAccount?.contributions ? (
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      ) : (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Contributions Phase</div>
                      <div className="text-sm text-gray-400">
                        {pensionAccount?.contributions ? 'Active contributions ongoing' : 'Start making contributions'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isEligibleForRetirement ? 'bg-emerald-500' : 'bg-gray-600'
                    }`}>
                      {isEligibleForRetirement ? (
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      ) : (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Retirement Eligibility</div>
                      <div className="text-sm text-gray-400">
                        {isEligibleForRetirement ? 'Eligible for benefits' : `Eligible in ${yearsToRetirement} years`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      pensionAccount?.isRetired ? 'bg-emerald-500' : 'bg-gray-600'
                    }`}>
                      {pensionAccount?.isRetired ? (
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      ) : (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Retirement Phase</div>
                      <div className="text-sm text-gray-400">
                        {pensionAccount?.isRetired ? 'Withdrawals enabled' : 'Future benefit phase'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Retirement Planning Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Retirement Planning Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-emerald-400 mb-2">Start Early</h4>
                <p className="text-sm text-gray-400">
                  The earlier you start contributing, the more time your investments have to grow through compound returns.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-emerald-400 mb-2">Regular Contributions</h4>
                <p className="text-sm text-gray-400">
                  Consistent contributions help build a substantial retirement fund and smooth out market volatility.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-emerald-400 mb-2">Review Investment Strategy</h4>
                <p className="text-sm text-gray-400">
                  Periodically review your investment allocation to ensure it aligns with your retirement timeline.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-emerald-400 mb-2">Privacy Protection</h4>
                <p className="text-sm text-gray-400">
                  Your pension details remain private and secure throughout your entire retirement journey.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Retirement;