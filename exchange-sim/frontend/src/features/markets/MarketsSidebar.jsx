import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const MARKETS = [
    { symbol: 'BTC/USDT', price: 43421.44, change: -1.89, volume: 24.6 },
    { symbol: 'ETH/USDT', price: 2356.78, change: 3.24, volume: 17.3 },
    { symbol: 'BNB/USDT', price: 456.89, change: -0.5, volume: 5.8 },
    { symbol: 'SOL/USDT', price: 123.45, change: 8.9, volume: 9.2 },
    { symbol: 'XRP/USDT', price: 0.568, change: -1.2, volume: 2.1 },
    { symbol: 'ADA/USDT', price: 0.647, change: 4.5, volume: 1.8 },
];

const MarketsSidebar = ({ selectedSymbol, onSelectSymbol }) => {
    const [listRef] = useAutoAnimate();

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-64 bg-surface border-r border-border-0 flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-border-0">
                <motion.h2
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-0 font-semibold text-sm mb-3"
                >
                    Markets
                </motion.h2>
                <motion.input
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    type="text"
                    placeholder="Search markets..."
                    className="w-full bg-bg-2 border border-border-0 rounded px-3 py-2 text-xs text-text-0 placeholder-text-3 focus:outline-none focus:border-primary focus:shadow-glow-primary transition-all duration-300"
                />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border-0">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 text-xs font-medium text-primary border-b-2 border-primary transition-all duration-300"
                >
                    All
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 text-xs font-medium text-text-2 hover:text-text-1 transition-all duration-300"
                >
                    Favorites
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 text-xs font-medium text-text-2 hover:text-text-1 transition-all duration-300"
                >
                    Gainers
                </motion.button>
            </div>

            {/* Markets List */}
            <div ref={listRef} className="flex-1 overflow-y-auto">
                {MARKETS.map((market, index) => {
                    const isSelected = selectedSymbol === market.symbol.replace('/', '');
                    const isPositive = market.change >= 0;

                    return (
                        <motion.div
                            key={market.symbol}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
                            whileHover={{ x: 4, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectSymbol(market.symbol.replace('/', ''))}
                            className={`px-4 py-3 cursor-pointer border-b border-border-subtle transition-all duration-300 ${isSelected ? 'bg-surface-hover border-l-2 border-l-primary shadow-glow-primary' : ''
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                    <span className="text-text-0 font-medium text-sm">{market.symbol.split('/')[0]}</span>
                                    <span className="text-text-3 text-xs">/{market.symbol.split('/')[1]}</span>
                                </div>
                                <motion.span
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className={`text-xs font-semibold px-2 py-0.5 rounded ${isPositive ? 'bg-buy-soft text-buy' : 'bg-sell-soft text-sell'}`}
                                >
                                    {isPositive ? '+' : ''}{market.change}%
                                </motion.span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-text-1 font-mono text-xs font-semibold">${market.price.toLocaleString()}</span>
                                <span className="text-text-3 text-xs">Vol {market.volume}B</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default MarketsSidebar;
