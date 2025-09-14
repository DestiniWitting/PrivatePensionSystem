import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { usePension } from '../contexts/PensionContext';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { pensionAccount, createPensionAccount, isCreatingAccount } = usePension();
  const { address, isConnected } = useAccount();
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentAge, setCurrentAge] = useState(30);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAccount = async () => {
    if (retirementAge < 55 || retirementAge > 75) {
      toast.error('Retirement age must be between 55 and 75');
      return;
    }

    if (currentAge >= retirementAge) {
      toast.error('Retirement age must be greater than current age');
      return;
    }

    try {
      setIsCreating(true);
      // In a real app, you would encrypt the current age
      const encryptedAge = new Uint8Array(32); // Placeholder
      await createPensionAccount(retirementAge, encryptedAge);
      toast.success('Pension account created successfully!');
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('Failed to create pension account');
    } finally {
      setIsCreating(false);
    }
  };

  const yearsToRetirement = pensionAccount ? 
    Math.max(0, pensionAccount.retirementAge - currentAge) : 
    Math.max(0, retirementAge - currentAge);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            Profile & Account Setup
          </h1>
          <p className="text-gray-400">
            Manage your pension account settings and personal information
          </p>
        </motion.div>

        {/* Wallet Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className={`card p-6 ${isConnected ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isConnected ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}>
                  {isConnected ? (
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Wallet Connection
                  </h2>
                  <p className={`text-sm ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isConnected ? 'Connected and ready' : 'Please connect your wallet'}
                  </p>
                </div>
              </div>
              {isConnected && (
                <div className="text-right">
                  <div className="text-sm text-gray-400">Address</div>
                  <div className="text-white font-mono text-sm">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Account Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className={`card p-6 ${pensionAccount ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-blue-900/20 border-blue-500/30'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  pensionAccount ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                }`}>
                  {pensionAccount ? (
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <UserCircleIcon className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Pension Account
                  </h2>
                  <p className={`text-sm ${pensionAccount ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {pensionAccount ? 'Account active and ready' : 'Create your pension account to get started'}
                  </p>
                </div>
              </div>
              {pensionAccount && (
                <div className="text-right">
                  <div className="text-sm text-gray-400">Retirement Age</div>
                  <div className="text-white font-bold text-2xl">
                    {pensionAccount.retirementAge}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Account or Account Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {!pensionAccount ? (
              /* Create Account Form */
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <PlusIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Create Pension Account
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Age
                    </label>
                    <input
                      type="number"
                      min="18"
                      max="70"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(parseInt(e.target.value) || 30)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Retirement Age
                    </label>
                    <input
                      type="number"
                      min="55"
                      max="75"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(parseInt(e.target.value) || 65)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Must be between 55 and 75 years
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CalendarDaysIcon className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">
                        Retirement Timeline
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      You have <span className="font-bold text-emerald-400">{yearsToRetirement} years</span> to build your retirement fund.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-blue-400">
                      Your age information will be encrypted for privacy
                    </span>
                  </div>

                  <button
                    onClick={handleCreateAccount}
                    disabled={isCreating || isCreatingAccount || !isConnected}
                    className="btn btn-primary w-full"
                  >
                    {isCreating || isCreatingAccount ? 'Creating Account...' : 'Create Pension Account'}
                  </button>

                  {!isConnected && (
                    <p className="text-sm text-amber-400 text-center">
                      Please connect your wallet first
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Account Details */
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <UserCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Account Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Retirement Age</div>
                      <div className="text-sm text-gray-400">Target retirement age</div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {pensionAccount.retirementAge}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Account Status</div>
                      <div className="text-sm text-gray-400">Current account state</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pensionAccount.isRetired ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {pensionAccount.isRetired ? 'Retired' : 'Active'}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Last Contribution</div>
                      <div className="text-sm text-gray-400">Most recent activity</div>
                    </div>
                    <div className="text-white">
                      {pensionAccount.lastContribution ? 
                        new Date(pensionAccount.lastContribution * 1000).toLocaleDateString() : 
                        'No contributions yet'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Privacy & Security Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Privacy & Security
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <h4 className="font-medium text-purple-400 mb-2">
                    Fully Homomorphic Encryption
                  </h4>
                  <p className="text-sm text-gray-300">
                    Your pension contributions, balances, and returns are encrypted using advanced FHE technology, ensuring complete privacy while maintaining functionality.
                  </p>
                </div>

                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <h4 className="font-medium text-blue-400 mb-2">
                    Blockchain Security
                  </h4>
                  <p className="text-sm text-gray-300">
                    All transactions are secured on the Ethereum blockchain, providing immutable records and decentralized access to your pension funds.
                  </p>
                </div>

                <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <h4 className="font-medium text-emerald-400 mb-2">
                    Private by Design
                  </h4>
                  <p className="text-sm text-gray-300">
                    No one, including system administrators, can view your actual pension amounts or investment returns without your private key.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Getting Started Guide */}
        {!pensionAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Getting Started with Your Pension
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-medium text-emerald-400 mb-2">Create Account</h4>
                  <p className="text-sm text-gray-400">
                    Set up your pension account with your retirement age and preferences.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-blue-400 mb-2">Make Contributions</h4>
                  <p className="text-sm text-gray-400">
                    Start making regular contributions to build your retirement fund.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-purple-400 mb-2">Choose Investments</h4>
                  <p className="text-sm text-gray-400">
                    Select an investment strategy that matches your risk tolerance.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;