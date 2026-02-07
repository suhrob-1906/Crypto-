import React from 'react';
import { motion } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const TradeTape = ({ trades = [] }) => {
    const [listRef] = useAutoAnimate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full text-xs overflow-hidden"
        >
            {/* Trades List */}
            <div ref={listRef} className="flex-1 overflow-y-auto">
                {trades.map((trade, i) => {
                    const isBuyerMaker = trade.isBuyerMaker;
                    const color = isBuyerMaker ? 'text-sell' : 'text-buy';
                    const bgColor = isBuyerMaker ? 'hover:bg-sell-soft' : 'hover:bg-buy-soft';
                    const time = new Date(trade.time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    });

                    return (
                        <motion.div
                            key={`${trade.id}-${i}`}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.02, type: 'spring', damping: 20 }}
                            whileHover={{ x: -2, scale: 1.01 }}
                            className={`flex items-center justify-between px-3 py-1 ${bgColor} cursor-pointer transition-all duration-300`}
                        >
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`w-1/3 font-mono font-semibold ${color}`}
                            >
                                {parseFloat(trade.price).toFixed(2)}
                            </motion.span>
                            <span className="w-1/3 text-right font-mono text-text-1">
                                {parseFloat(trade.qty).toFixed(4)}
                            </span>
                            <span className="w-1/3 text-right font-mono text-text-3">
                                {time}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default TradeTape;
