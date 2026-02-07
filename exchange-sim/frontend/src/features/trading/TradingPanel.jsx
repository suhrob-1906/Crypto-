import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const TradingPanel = ({ symbol, currentPrice }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('buy');
    const [orderType, setOrderType] = useState('market');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState({ USDT: 10000, BTC: 0.5 }); // Demo balance

    // Update price when currentPrice changes
    useEffect(() => {
        if (currentPrice && orderType === 'limit') {
            setPrice(currentPrice.toFixed(2));
        }
    }, [currentPrice, orderType]);

    const calculateTotal = () => {
        const priceValue = orderType === 'market' ? currentPrice : parseFloat(price) || 0;
        const amountValue = parseFloat(amount) || 0;
        return (priceValue * amountValue).toFixed(2);
    };

    const handleOrder = () => {
        const priceValue = orderType === 'market' ? currentPrice : parseFloat(price);
        const amountValue = parseFloat(amount);
        const total = parseFloat(calculateTotal());

        // Validation
        if (!amountValue || amountValue <= 0) {
            toast.error(t('error_invalid_amount') || 'Invalid amount');
            return;
        }

        if (orderType === 'limit' && (!priceValue || priceValue <= 0)) {
            toast.error(t('error_invalid_price') || 'Invalid price');
            return;
        }

        // Check balance
        if (activeTab === 'buy') {
            if (total > balance.USDT) {
                toast.error(t('error_insufficient_balance') || 'Insufficient USDT balance');
                return;
            }
            // Update balance (demo)
            setBalance(prev => ({
                ...prev,
                USDT: prev.USDT - total,
                BTC: prev.BTC + amountValue
            }));
        } else {
            if (amountValue > balance.BTC) {
                toast.error(t('error_insufficient_balance') || 'Insufficient BTC balance');
                return;
            }
            // Update balance (demo)
            setBalance(prev => ({
                ...prev,
                USDT: prev.USDT + total,
                BTC: prev.BTC - amountValue
            }));
        }

        // Success notification
        toast.success(
            `${activeTab === 'buy' ? t('trade.buy') : t('trade.sell')} ${t('order_placed')}`,
            {
                description: `${amountValue} ${symbol.replace('USDT', '')} @ $${priceValue.toFixed(2)} = $${total}`,
                duration: 3000,
            }
        );

        // Reset form
        setAmount('');
        if (orderType === 'limit') {
            setPrice(currentPrice?.toFixed(2) || '');
        }
    };

    const getAvailableBalance = () => {
        return activeTab === 'buy'
            ? `${balance.USDT.toFixed(2)} USDT`
            : `${balance.BTC.toFixed(6)} ${symbol.replace('USDT', '')}`;
    };

    const setPercentage = (percent) => {
        if (activeTab === 'buy') {
            const priceValue = orderType === 'market' ? currentPrice : parseFloat(price) || currentPrice;
            const maxAmount = (balance.USDT * percent) / priceValue;
            setAmount(maxAmount.toFixed(6));
        } else {
            const maxAmount = balance.BTC * percent;
            setAmount(maxAmount.toFixed(6));
        }
    };

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col h-full bg-surface border border-border-0 rounded-lg overflow-hidden"
        >
            {/* Tabs */}
            <div className="flex border-b border-border-0">
                <motion.button
                    onClick={() => setActiveTab('buy')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 font-semibold text-sm transition-all duration-300 ${activeTab === 'buy'
                            ? 'bg-buy-soft text-buy border-b-2 border-buy shadow-glow-buy'
                            : 'text-text-2 hover:text-text-0 hover:bg-surface-hover'
                        }`}
                >
                    {t('trade.buy')}
                </motion.button>
                <motion.button
                    onClick={() => setActiveTab('sell')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 font-semibold text-sm transition-all duration-300 ${activeTab === 'sell'
                            ? 'bg-sell-soft text-sell border-b-2 border-sell shadow-glow-sell'
                            : 'text-text-2 hover:text-text-0 hover:bg-surface-hover'
                        }`}
                >
                    {t('trade.sell')}
                </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Order Type */}
                <div className="flex space-x-2 bg-bg-2 rounded p-0.5">
                    <motion.button
                        onClick={() => setOrderType('market')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 py-2 rounded text-xs font-medium transition-all duration-300 ${orderType === 'market'
                                ? 'bg-surface text-text-0 shadow-md'
                                : 'text-text-3 hover:text-text-1'
                            }`}
                    >
                        {t('trade.market')}
                    </motion.button>
                    <motion.button
                        onClick={() => setOrderType('limit')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 py-2 rounded text-xs font-medium transition-all duration-300 ${orderType === 'limit'
                                ? 'bg-surface text-text-0 shadow-md'
                                : 'text-text-3 hover:text-text-1'
                            }`}
                    >
                        {t('trade.limit')}
                    </motion.button>
                </div>

                {/* Available Balance */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between text-xs"
                >
                    <span className="text-text-3">{t('trade.available')}</span>
                    <motion.span
                        key={getAvailableBalance()}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-text-0 font-mono font-semibold"
                    >
                        {getAvailableBalance()}
                    </motion.span>
                </motion.div>

                {/* Price Input (Limit only) */}
                <AnimatePresence>
                    {orderType === 'limit' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label className="block text-text-2 text-xs mb-2">{t('trade.price')}</label>
                            <motion.input
                                whileFocus={{ scale: 1.02, borderColor: 'var(--color-primary)' }}
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-bg-2 border border-border-0 rounded px-3 py-2 text-text-0 focus:outline-none focus:border-primary focus:shadow-glow-primary transition-all duration-300"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Amount Input */}
                <div>
                    <label className="block text-text-2 text-xs mb-2">{t('trade.amount')}</label>
                    <motion.input
                        whileFocus={{ scale: 1.02, borderColor: 'var(--color-primary)' }}
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-bg-2 border border-border-0 rounded px-3 py-2 text-text-0 focus:outline-none focus:border-primary focus:shadow-glow-primary transition-all duration-300"
                    />
                </div>

                {/* Percentage Buttons */}
                <div className="grid grid-cols-4 gap-2">
                    {[0.25, 0.5, 0.75, 1].map((percent, index) => (
                        <motion.button
                            key={percent}
                            onClick={() => setPercentage(percent)}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-2 py-1 bg-bg-2 text-text-2 rounded text-xs font-medium hover:bg-primary hover:text-bg-0 transition-all duration-300"
                        >
                            {percent * 100}%
                        </motion.button>
                    ))}
                </div>

                {/* Total */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between text-xs"
                >
                    <span className="text-text-3">{t('trade.total')}</span>
                    <motion.span
                        key={calculateTotal()}
                        initial={{ scale: 1.2, color: 'var(--color-primary)' }}
                        animate={{ scale: 1, color: 'var(--color-text-0)' }}
                        transition={{ duration: 0.3 }}
                        className="text-text-0 font-mono font-bold text-base"
                    >
                        ${calculateTotal()} USDT
                    </motion.span>
                </motion.div>

                {/* Order Button */}
                <motion.button
                    onClick={handleOrder}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3 rounded-lg font-bold text-sm shadow-lg transition-all duration-300 ${activeTab === 'buy'
                            ? 'bg-gradient-buy text-white shadow-glow-buy hover:shadow-xl'
                            : 'bg-gradient-sell text-white shadow-glow-sell hover:shadow-xl'
                        }`}
                >
                    {activeTab === 'buy' ? t('trade.buy') : t('trade.sell')} {symbol.replace('USDT', '')}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default TradingPanel;
