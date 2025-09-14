import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  BanknotesIcon,
  ChartBarIcon,
  CalendarIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { usePension } from '../contexts/PensionContext';
import { useFHE } from '../contexts/FHEContext';
import toast from 'react-hot-toast';

const Contributions = () => {
  const { pensionAccount, contribute, isContributing } = usePension();
  const { encryptValue } = useFHE();
  const [contributionAmount, setContributionAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContribution = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error('Please enter a valid contribution amount');
      return;
    }

    try {
      setIsLoading(true);
      const encryptedAmount = await encryptValue(parseFloat(contributionAmount));
      await contribute(encryptedAmount);
      toast.success('Contribution made successfully!');
      setContributionAmount('');
    } catch (error) {
      console.error('Error making contribution:', error);
      toast.error('Failed to make contribution');
    } finally {
      setIsLoading(false);
    }
  };

  const contributionHistory = [
    { date: '2024-01-15', amount: 'Private', status: 'Completed', txHash: '0x123...' },
    { date: '2023-12-15', amount: 'Private', status: 'Completed', txHash: '0x456...' },
    { date: '2023-11-15', amount: 'Private', status: 'Completed', txHash: '0x789...' },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            Pension Contributions
          </h1>
          <p className="text-gray-400">
            Make secure, private contributions to your retirement fund
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Make Contribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <PlusIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Make Contribution
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contribution Amount (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center space-x-2 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <LockClosedIcon className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400">
                    Amount will be encrypted for privacy
                  </span>
                </div>

                <button
                  onClick={handleContribution}
                  disabled={isLoading || isContributing || !pensionAccount}
                  className="btn btn-primary w-full"
                >
                  {isLoading || isContributing ? 'Processing...' : 'Make Contribution'}
                </button>

                {!pensionAccount && (
                  <p className="text-sm text-amber-400 text-center">
                    Please create a pension account first
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contribution Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6 text-center">
                <BanknotesIcon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">Private</div>
                <div className="text-sm text-gray-400">Total Contributed</div>
              </div>

              <div className="card p-6 text-center">
                <ChartBarIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">Private</div>
                <div className="text-sm text-gray-400">Current Balance</div>
              </div>

              <div className="card p-6 text-center">
                <CalendarIcon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {pensionAccount?.lastContribution ? 
                    new Date(pensionAccount.lastContribution * 1000).toLocaleDateString() : 
                    'N/A'
                  }
                </div>
                <div className="text-sm text-gray-400">Last Contribution</div>
              </div>
            </div>

            {/* Contribution History */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Contribution History
              </h3>
              
              <div className="space-y-4">
                {contributionHistory.map((contribution, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          Contribution Made
                        </div>
                        <div className="text-sm text-gray-400">
                          {contribution.date}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {contribution.amount}
                      </div>
                      <div className="text-xs text-emerald-400">
                        {contribution.status}
                      </div>
                    </div>
                  </div>
                ))}
                
                {contributionHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No contributions yet. Make your first contribution above.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Contribution Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-emerald-400 mb-2">Regular Contributions</h4>
                <p className="text-sm text-gray-400">
                  Consider making regular monthly contributions to take advantage of compound growth over time.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-emerald-400 mb-2">Privacy Protection</h4>
                <p className="text-sm text-gray-400">
                  All contribution amounts are encrypted using FHE technology, ensuring complete privacy.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-emerald-400 mb-2">Investment Growth</h4>
                <p className="text-sm text-gray-400">
                  Your contributions are automatically invested according to your selected investment strategy.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-emerald-400 mb-2">Tax Benefits</h4>
                <p className="text-sm text-gray-400">
                  Consult with tax professionals about potential benefits of pension contributions in your jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contributions;