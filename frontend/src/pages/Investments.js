import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PresentationChartLineIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { usePension } from '../contexts/PensionContext';
import toast from 'react-hot-toast';

const Investments = () => {
  const { investmentOptions, selectInvestmentOption, pensionAccount, isSelectingInvestment } = usePension();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectInvestment = async (optionId) => {
    try {
      await selectInvestmentOption(optionId);
      toast.success('Investment option updated successfully!');
    } catch (error) {
      console.error('Error selecting investment:', error);
      toast.error('Failed to update investment option');
    }
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel <= 3) return 'text-green-400';
    if (riskLevel <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBgColor = (riskLevel) => {
    if (riskLevel <= 3) return 'from-green-500 to-emerald-500';
    if (riskLevel <= 6) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const investmentDetails = {
    0: {
      description: 'Conservative fixed-income securities with stable returns and low volatility.',
      expectedReturn: '3-5%',
      volatility: 'Low',
      timeHorizon: 'Long-term',
      benefits: ['Capital preservation', 'Steady income', 'Lower risk'],
      risks: ['Inflation risk', 'Lower growth potential']
    },
    1: {
      description: 'Diversified mix of stocks and bonds for balanced growth and income.',
      expectedReturn: '5-8%',
      volatility: 'Moderate',
      timeHorizon: 'Medium to Long-term',
      benefits: ['Balanced growth', 'Diversification', 'Moderate risk'],
      risks: ['Market volatility', 'Economic cycles']
    },
    2: {
      description: 'Equity-focused portfolio targeting higher returns with increased volatility.',
      expectedReturn: '7-12%',
      volatility: 'High',
      timeHorizon: 'Long-term',
      benefits: ['High growth potential', 'Inflation protection', 'Compound growth'],
      risks: ['Higher volatility', 'Market risk', 'Potential losses']
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            Investment Options
          </h1>
          <p className="text-gray-400">
            Choose an investment strategy that matches your risk tolerance and retirement goals
          </p>
        </motion.div>

        {/* Current Selection */}
        {pensionAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="card p-6 bg-emerald-900/20 border border-emerald-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Current Investment Strategy
                </h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-emerald-400">
                    {investmentOptions[pensionAccount.selectedInvestment]?.name || 'Loading...'}
                  </div>
                  <div className="text-sm text-gray-300">
                    Risk Level: {investmentOptions[pensionAccount.selectedInvestment]?.riskLevel}/10
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Returns Protected</div>
                  <div className="text-emerald-400 font-medium">Private</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Investment Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
        >
          {investmentOptions.map((option, index) => {
            const details = investmentDetails[option.id] || {};
            const isCurrentSelection = pensionAccount?.selectedInvestment === option.id;
            
            return (
              <div
                key={option.id}
                className={`card p-6 transition-all duration-300 cursor-pointer ${
                  isCurrentSelection ? 'ring-2 ring-emerald-500 bg-emerald-900/10' : 'hover:scale-105'
                } ${selectedOption === option.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedOption(selectedOption === option.id ? null : option.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {option.name}
                  </h3>
                  {isCurrentSelection && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/20 rounded-full">
                      <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400">Active</span>
                    </div>
                  )}
                </div>

                {/* Risk Indicator */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-gray-400">Risk Level:</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < option.riskLevel ? 'bg-gradient-to-r ' + getRiskBgColor(option.riskLevel) : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm font-medium ${getRiskColor(option.riskLevel)}`}>
                    {option.riskLevel}/10
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <TrendingUpIcon className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-400">Expected Return</div>
                    <div className="text-sm font-medium text-white">{details.expectedReturn}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                    <ChartBarIcon className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-400">Volatility</div>
                    <div className="text-sm font-medium text-white">{details.volatility}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4">
                  {details.description}
                </p>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isCurrentSelection) {
                      handleSelectInvestment(option.id);
                    }
                  }}
                  disabled={isSelectingInvestment || isCurrentSelection || !pensionAccount}
                  className={`btn w-full text-sm ${
                    isCurrentSelection ? 'btn-outline opacity-50 cursor-not-allowed' : 'btn-primary'
                  }`}
                >
                  {isCurrentSelection ? 'Currently Active' : 
                   isSelectingInvestment ? 'Updating...' : 
                   'Select Strategy'}
                </button>
              </div>
            );
          })}
        </motion.div>

        {/* Detailed Information */}
        {selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <InformationCircleIcon className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">
                  Strategy Details: {investmentOptions[selectedOption]?.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-emerald-400 mb-3">Benefits</h4>
                  <ul className="space-y-2">
                    {investmentDetails[selectedOption]?.benefits?.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        <span className="text-sm text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-red-400 mb-3">Risks</h4>
                  <ul className="space-y-2">
                    {investmentDetails[selectedOption]?.risks?.map((risk, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        <span className="text-sm text-gray-300">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-blue-400 font-medium mb-1">Time Horizon</h5>
                    <p className="text-sm text-gray-300">
                      {investmentDetails[selectedOption]?.timeHorizon} - Consider your retirement timeline when selecting this strategy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Investment Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Investment Principles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PresentationChartLineIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-emerald-400 mb-2">Diversification</h4>
                <p className="text-sm text-gray-400">
                  Spread risk across different asset classes and investment types.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-blue-400 mb-2">Long-term Focus</h4>
                <p className="text-sm text-gray-400">
                  Retirement investing benefits from time and compound growth.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-purple-400 mb-2">Privacy Protection</h4>
                <p className="text-sm text-gray-400">
                  All investment amounts and returns are encrypted for your privacy.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Investments;