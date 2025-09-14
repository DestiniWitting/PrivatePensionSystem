import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon,
  EyeSlashIcon,
  ChartBarIcon,
  BanknotesIcon,
  ArrowRightIcon,
  SparklesIcon,
  CalendarDaysIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { usePension } from '../contexts/PensionContext';
import { useAccount } from 'wagmi';

const Home = () => {
  const { pensionAccount, investmentOptions, loading } = usePension();
  const { isConnected } = useAccount();

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Encrypted Pension Balances',
      description: 'Your pension contributions and balance are protected with advanced FHE encryption.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: EyeSlashIcon,
      title: 'Private Investment Returns',
      description: 'Investment performance and returns remain confidential while still being verifiable.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Secure Portfolio Management',
      description: 'Choose from multiple investment strategies without revealing your allocation amounts.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: BanknotesIcon,
      title: 'Confidential Contributions',
      description: 'Make pension contributions with complete privacy of contribution amounts.',
      gradient: 'from-teal-500 to-green-500'
    }
  ];

  const stats = [
    { label: 'Active Accounts', value: isConnected && pensionAccount ? '1' : '0', suffix: '' },
    { label: 'Privacy Protected', value: '100', suffix: '%' },
    { label: 'Investment Options', value: investmentOptions.length.toString(), suffix: '' },
    { label: 'Security Level', value: 'FHE', suffix: '' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-teal-900/20" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
                <SparklesIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">
                  Secure Pension Management with FHE
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
                <span className="gradient-text">
                  Private Pension
                </span>
                <br />
                <span className="text-white">
                  Management System
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Secure your retirement with our private pension system. Make contributions, select investment strategies, 
                and track your retirement savings with complete privacy using advanced encryption technology.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to={isConnected && pensionAccount ? "/dashboard" : "/profile"}
                className="btn btn-primary text-lg px-8 py-4 group"
              >
                {isConnected && pensionAccount ? 'View Dashboard' : 'Create Account'}
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/investments"
                className="btn btn-outline text-lg px-8 py-4"
              >
                Investment Options
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white mb-4">
              Secure Retirement Planning
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on cutting-edge Fully Homomorphic Encryption technology for complete privacy in pension management
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card p-6 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Investment Options Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Investment Strategies
              </h2>
              <p className="text-xl text-gray-300">
                Choose from various risk profiles to match your retirement goals
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {investmentOptions.slice(0, 3).map((option) => (
                <div key={option.id} className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {option.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < option.riskLevel ? 'bg-emerald-400' : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Risk Level:</span>
                      <span className="text-emerald-400">{option.riskLevel}/10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Strategy:</span>
                      <span className="text-purple-400">
                        {option.riskLevel <= 3 ? 'Conservative' : 
                         option.riskLevel <= 6 ? 'Balanced' : 'Growth'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <LockClosedIcon className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">Returns Protected</span>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <Link
                to="/investments"
                className="btn btn-primary"
              >
                View All Options
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-900/50 to-teal-900/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <CalendarDaysIcon className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Secure Your Retirement?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join the future of private pension management. 
                Your retirement savings, your privacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={isConnected ? "/profile" : "/"}
                  className="btn btn-primary text-lg px-8 py-4"
                >
                  {isConnected ? 'Create Pension Account' : 'Connect Wallet'}
                </Link>
                <Link
                  to="/dashboard"
                  className="btn btn-outline text-lg px-8 py-4"
                >
                  View Dashboard
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;