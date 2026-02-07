import React from 'react';
import { motion } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const OrderBookRow = ({ price, amount, total, type, maxTotal, index }) => {
    const bgWidth = maxTotal ? (total / maxTotal) * 100 : 0;
    const bgClass = type === 'bid' ? 'bg-buy-soft' : 'bg-sell-soft';
    const textColor = type === 'bid' ? 'text-buy' : 'text-sell';

    return (
        <motion.div
            initial={{ x: type === 'bid' ? -20 : 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.02, type: 'spring', damping: 20 }}
            whileHover={{ x: 2, backgroundColor: 'var(--color-surface-hover)' }}
            className="relative flex justify-between text-xs py-0.5 cursor-pointer transition-all duration-200 group"
        >
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bgWidth}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`absolute top-0 left-0 h-full ${bgClass}`}
            />
            <span className={`z-10 pl-2 font-mono font-semibold ${textColor} group-hover:scale-105 transition-transform`}>{price.toFixed(2)}</span>
            <span className="z-10 font-mono text-text-1 group-hover:text-text-0 transition-colors">{amount.toFixed(4)}</span>
            <span className="z-10 pr-2 font-mono text-text-2 group-hover:text-text-1 transition-colors">{total.toFixed(2)}</span>
        </motion.div>
    );
};

const OrderBook = ({ bids = [], asks = [], midPrice }) => {
    const [asksRef] = useAutoAnimate();
    const [bidsRef] = useAutoAnimate();

    // Take top 8 for horizontal layout
    const limit = 8;
    const visibleAsks = asks.slice(0, limit).reverse();
    const visibleBids = bids.slice(0, limit);

    // Calculate max volume for depth visualization
    const maxVol = Math.max(
        ...visibleBids.map(b => b[1]),
        ...visibleAsks.map(a => a[1]),
        1
    );

    const formatPrice = (price) => {
        return price ? parseFloat(price).toFixed(2) : '---';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full"
        >
            {/* Header */}
            <div className="px-3 py-2 border-b border-border-0 flex items-center justify-between">
                <span className="font-semibold text-text-0 text-xs">Order Book</span>
                <div className="flex space-x-1">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-buy rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        className="w-2 h-2 bg-sell rounded-full"
                    />
                </div>
            </div>

            {/* Column Headers */}
            <div className="flex justify-between px-2 py-1 text-xs text-text-2 font-medium border-b border-border-subtle">
                <span>Price (USDT)</span>
                <span>Amount (BTC)</span>
                <span>Total</span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Asks (Sells) - Red */}
                <div ref={asksRef}>
                    {visibleAsks.map(([price, amount], i) => (
                        <OrderBookRow
                            key={`ask-${price}-${i}`}
                            price={price}
                            amount={amount}
                            total={price * amount}
                            type="ask"
                            maxTotal={maxVol}
                            index={i}
                        />
                    ))}
                </div>

                {/* Spread / Last Price */}
                <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="py-2 px-2 text-center border-y border-border-0 bg-bg-2 my-1"
                >
                    <motion.div
                        key={midPrice}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-base font-mono font-bold text-buy"
                    >
                        ${formatPrice(midPrice)}
                    </motion.div>
                </motion.div>

                {/* Bids (Buys) - Green */}
                <div ref={bidsRef}>
                    {visibleBids.map(([price, amount], i) => (
                        <OrderBookRow
                            key={`bid-${price}-${i}`}
                            price={price}
                            amount={amount}
                            total={price * amount}
                            type="bid"
                            maxTotal={maxVol}
                            index={i}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default OrderBook;
