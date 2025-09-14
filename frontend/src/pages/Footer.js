import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    pension: [
      { name: 'How it Works', href: '/' },
      { name: 'Investment Options', href: '/investments' },
      { name: 'Security Features', href: '/' },
      { name: 'FAQ', href: '/' },
    ],
    account: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Contributions', href: '/contributions' },
      { name: 'Retirement Planning', href: '/retirement' },
      { name: 'Profile', href: '/profile' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Contact', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <CalendarDaysIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                SecurePension
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Secure your retirement with private, encrypted pension management powered by FHE technology.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400">
                Privacy Protected
              </span>
            </div>
          </div>

          {/* Pension */}
          <div>
            <h3 className="text-white font-semibold mb-4">Pension</h3>
            <ul className="space-y-2">
              {links.pension.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              {links.account.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © {currentYear} SecurePension. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4 text-xs text-gray-500">
            <span>Powered by Zama FHE</span>
            <span>•</span>
            <span>Sepolia Testnet</span>
            <span>•</span>
            <span>Privacy First</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;