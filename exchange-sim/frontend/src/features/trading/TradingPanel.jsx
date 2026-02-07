import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const TradingPanel = ({ symbol }) => {
    const [orderType, setOrderType] = useState('limit');
    const [side, setSide] = useState('buy');
    const [price, setPrice] = useState('45000');
    const [amount, setAmount] = useState('0.5');
    const [percentage, setPercentage] = useState(25);

    const total = parseFloat(price) * parseFloat(amount) || 0;

    const handlePlaceOrder = () => {
        const orderSide = side === 'buy' ? 'покупку' : 'продажу';
        toast.success(`Ордер на ${orderSide} ${amount} BTC успешно размещен!`, {
            description: `Цена: $${price} | Всего: $${total.toFixed(2)}`,
            duration: 3000,
        });
    };

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-80 bg-surface flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-border-0">
                <motion.h3
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-0 font-semibold text-sm mb-3"
                >
                    Spot Trading
                </motion.h3>

                {/* Order Type Tabs */}
                <div className="flex space-x-1 bg-bg-2 rounded p-1">
                    {['limit', 'market', 'stop'].map((type, index) => (
                        <motion.button
                            key={type}
                            onClick={() => setOrderType(type)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1, type: 'spring', damping: 15 }}
                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-all duration-300 ${orderType === type
                                    ? 'bg-primary text-bg-0 shadow-glow-primary'
                                    : 'text-text-2 hover:text-text-1 hover:bg-bg-3'
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Buy/Sell Tabs */}
            <div className="flex border-b border-border-0">
                <motion.button
                    onClick={() => setSide('buy')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 text-sm font-semibold transition-all duration-300 ${side === 'buy'
                            ? 'text-buy border-b-2 border-buy shadow-glow-buy'
                            : 'text-text-2 hover:text-text-1'
                        }`}
                >
                    Buy
                </motion.button>
                <motion.button
                    onClick={() => setSide('sell')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 text-sm font-semibold transition-all duration-300 ${side === 'sell'
                            ? 'text-sell border-b-2 border-sell shadow-glow-sell'
                            : 'text-text-2 hover:text-text-1'
                        }`}
                >
                    Sell
                </motion.button>
            </div>

            {/* Form */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Price Input */}
                <AnimatePresence mode="wait">
                    {orderType !== 'market' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label className="block text-text-2 text-xs mb-2">Price</label>
                            <div className="relative">
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-bg-2 border border-border-0 rounded px-3 py-2.5 text-sm text-text-0 focus:outline-none focus:border-primary focus:shadow-glow-primary transition-all duration-300"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 text-xs">USDT</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Amount Input */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="block text-text-2 text-xs mb-2">Amount</label>
                    <div className="relative">
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-bg-2 border border-border-0 rounded px-3 py-2.5 text-sm text-text-0 focus:outline-none focus:border-primary focus:shadow-glow-primary transition-all duration-300"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 text-xs">BTC</span>
                    </div>
                </motion.div>

                {/* Percentage Slider */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex justify-between mb-2">
                        {[25, 50, 75, 100].map((pct, index) => (
                            <motion.button
                                key={pct}
                                onClick={() => setPercentage(pct)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.05, type: 'spring', damping: 15 }}
                                className={`px-3 py-1 text-xs rounded transition-all duration-300 ${percentage === pct
                                        ? side === 'buy'
                                            ? 'bg-buy-soft text-buy shadow-glow-buy'
                                            : 'bg-sell-soft text-sell shadow-glow-sell'
                                        : 'bg-bg-2 text-text-2 hover:text-text-1 hover:bg-bg-3'
                                    }`}
                            >
                                {pct}%
                            </motion.button>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={percentage}
                            onChange={(e) => setPercentage(parseInt(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer transition-all duration-300"
                            style={{
                                background: `linear-gradient(to right, ${side === 'buy' ? 'var(--color-buy)' : 'var(--color-sell)'} 0%, ${side === 'buy' ? 'var(--color-buy)' : 'var(--color-sell)'} ${percentage}%, var(--color-bg-2) ${percentage}%, var(--color-bg-2) 100%)`,
                            }}
                        />
                    </div>
                </motion.div>

                {/* Total */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-between items-center py-3 border-t border-border-0"
                >
                    <span className="text-text-2 text-xs">Total</span>
                    <motion.span
                        key={total}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-text-0 font-mono font-semibold text-lg"
                    >
                        {total.toFixed(2)} USDT
                    </motion.span>
                </motion.div>

                {/* Action Button */}
                <motion.button
                    onClick={handlePlaceOrder}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', damping: 15 }}
                    className={`w-full py-3 rounded font-semibold text-sm transition-all duration-300 ${side === 'buy'
                            ? 'bg-gradient-buy text-white shadow-glow-buy hover:shadow-xl'
                            : 'bg-gradient-sell text-white shadow-glow-sell hover:shadow-xl'
                        }`}
                >
                    {side === 'buy' ? 'Buy' : 'Sell'} BTC
                </motion.button>

                {/* Fees */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-1 text-xs"
                >
                    <div className="flex justify-between text-text-3">
                        <span>Maker Fee</span>
                        <span className="text-buy">0.1%</span>
                    </div>
                    <div className="flex justify-between text-text-3">
                        <span>Taker Fee</span>
                        <span className="text-buy">0.1%</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default TradingPanel;
