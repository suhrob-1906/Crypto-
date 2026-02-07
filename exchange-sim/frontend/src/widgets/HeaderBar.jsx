import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function HeaderBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('1000');

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLang);
    toast.success(t('language_changed'));
  };

  const handleDeposit = () => {
    toast.success(t('deposit_success', { amount: depositAmount }));
    setShowWalletModal(false);
    setDepositAmount('1000');
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-surface border-b border-border-0 px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-6">
          <Link to="/trade" className="text-xl font-bold text-primary tracking-tight hover:scale-105 transition-transform">
            CryptoEx
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Wallet Button */}
          <motion.button
            onClick={() => setShowWalletModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-primary text-bg-0 rounded-lg font-semibold text-sm shadow-glow-primary hover:shadow-xl transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>{t('wallet')}</span>
          </motion.button>

          {/* Language Switcher */}
          <motion.button
            onClick={toggleLang}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs font-mono uppercase text-text-2 hover:text-primary transition-all duration-300 border border-border-0 rounded px-3 py-2 hover:border-primary hover:shadow-glow-primary"
          >
            {i18n.language === 'en' ? '🇬🇧 EN' : '🇷🇺 RU'}
          </motion.button>

          <motion.button
            onClick={() => { logout(); navigate('/auth'); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-text-2 hover:text-sell transition-all duration-300 text-sm font-medium"
          >
            {t('logout')}
          </motion.button>
        </div>
      </motion.header>

      {/* Wallet Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowWalletModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="glass-dark border border-border-0 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text-0">{t('wallet_deposit')}</h2>
                  <button
                    onClick={() => setShowWalletModal(false)}
                    className="text-text-3 hover:text-text-0 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-text-2 text-sm mb-2">{t('deposit_amount')}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full bg-bg-2 border border-border-0 rounded-lg px-4 py-3 text-text-0 focus:outline-none focus:border-primary focus:shadow-glow-primary transition-all duration-300"
                        placeholder="1000"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3 font-semibold">USDT</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[100, 500, 1000, 5000].map((amount) => (
                      <motion.button
                        key={amount}
                        onClick={() => setDepositAmount(amount.toString())}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 bg-bg-2 text-text-1 rounded-lg text-sm font-medium hover:bg-primary hover:text-bg-0 transition-all duration-300"
                      >
                        ${amount}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    onClick={handleDeposit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-primary text-bg-0 rounded-lg font-bold shadow-glow-primary hover:shadow-xl transition-all duration-300"
                  >
                    {t('confirm_deposit')}
                  </motion.button>

                  <p className="text-xs text-text-3 text-center">
                    {t('demo_mode_notice')}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
