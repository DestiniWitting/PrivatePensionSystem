import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BanknotesIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  TrendingUpIcon,
  PlusIcon,
  EyeIcon,
  LockClosedIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { usePension } from '../contexts/PensionContext';
import { useAccount } from 'wagmi';

const Dashboard = () => {
  const { pensionAccount, investmentOptions } = usePension();
  const { isConnected } = useAccount();

  const quickActions = [
    {
      icon: PlusIcon,
      title: 'Make Contribution',
      description: 'Add funds to your pension',
      href: '/contributions',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Change Investment',
      description: 'Update your investment strategy',
      href: '/investments',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: CalendarDaysIcon,
      title: 'Retirement Planning',
      description: 'Manage retirement timeline',
      href: '/retirement',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to view your dashboard</p>
        </div>
      </div>
    );
  }

  if (!pensionAccount) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4">
              Welcome to SecurePension
            </h1>
            <p className="text-gray-400 mb-8">
              Create your pension account to start securing your retirement
            </p>
            <Link
              to="/profile"
              className="btn btn-primary text-lg px-8 py-4"
            >
              Create Pension Account
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Pension Dashboard
          </h1>
          <p className="text-gray-400">
            Overview of your retirement savings and investment performance
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6 text-center">
            <BanknotesIcon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <div className="flex items-center justify-center space-x-2 mb-2">
              <LockClosedIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-2xl font-bold text-white">Private</span>
            </div>
            <div className="text-sm text-gray-400">Total Balance</div>
          </div>

          <div className="card p-6 text-center">
            <TrendingUpIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="flex items-center justify-center space-x-2 mb-2">
              <LockClosedIcon className="w-4 h-4 text-blue-400" />
              <span className="text-2xl font-bold text-white">Private</span>
            </div>
            <div className="text-sm text-gray-400">Total Returns</div>
          </div>

          <div className="card p-6 text-center">
            <ChartBarIcon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-2">
              {investmentOptions[pensionAccount.selectedInvestment]?.name?.split(' ')[0] || 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Investment Strategy</div>
          </div>

          <div className="card p-6 text-center">
            <CalendarDaysIcon className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-2">
              {pensionAccount.retirementAge}
            </div>
            <div className="text-sm text-gray-400">Retirement Age</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Account Overview
                </h3>
                <div className="flex items-center space-x-2">
                  <EyeIcon className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">Privacy Protected</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <BanknotesIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Total Contributions</div>
                      <div className="text-sm text-gray-400">All-time contributions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">Private</div>
                    <div className="text-xs text-emerald-400">Encrypted</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <TrendingUpIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Investment Returns</div>
                      <div className="text-sm text-gray-400">Growth from investments</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">Private</div>
                    <div className="text-xs text-blue-400">Encrypted</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <ChartBarIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Current Strategy</div>
                      <div className="text-sm text-gray-400">Active investment plan</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">
                      {investmentOptions[pensionAccount.selectedInvestment]?.name || 'Loading...'}
                    </div>
                    <div className="text-xs text-purple-400">
                      Risk: {investmentOptions[pensionAccount.selectedInvestment]?.riskLevel}/10
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <PlusIcon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Account Created</div>
                    <div className="text-sm text-gray-400">
                      Pension account setup completed
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                
                {pensionAccount.lastContribution > 0 && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <BanknotesIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Last Contribution</div>
                      <div className="text-sm text-gray-400">
                        Contribution amount encrypted
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(pensionAccount.lastContribution * 1000).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions & Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.href}
                    className="flex items-center space-x-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors group"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${action.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{action.title}</div>
                      <div className="text-xs text-gray-400">{action.description}</div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Account Status */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account Active</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-400 text-sm">Yes</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Retirement Status</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    pensionAccount.isRetired 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {pensionAccount.isRetired ? 'Retired' : 'Contributing'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Privacy Level</span>
                  <div className="flex items-center space-x-2">
                    <LockClosedIcon className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm">Maximum</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Summary */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Investment Summary
              </h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {investmentOptions[pensionAccount.selectedInvestment]?.name || 'Loading...'}
                </div>
                <div className="text-sm text-gray-400 mb-4">Current Strategy</div>
                
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < (investmentOptions[pensionAccount.selectedInvestment]?.riskLevel || 0)
                          ? 'bg-emerald-400' 
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                <Link
                  to="/investments"
                  className="btn btn-outline w-full text-sm"
                >
                  Change Strategy
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;