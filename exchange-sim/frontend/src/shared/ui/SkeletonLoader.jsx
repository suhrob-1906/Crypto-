import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'card' }) => {
    const shimmer = {
        animate: {
            backgroundPosition: ['200% 0', '-200% 0'],
        },
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
        },
    };

    if (type === 'orderbook') {
        return (
            <div className="space-y-1 p-3">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="h-6 bg-gradient-to-r from-bg-2 via-bg-3 to-bg-2 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={{ ...shimmer.transition, delay: i * 0.05 }}
                    />
                ))}
            </div>
        );
    }

    if (type === 'chart') {
        return (
            <div className="w-full h-full flex flex-col p-4 space-y-4">
                <motion.div
                    className="h-8 w-48 bg-gradient-to-r from-bg-2 via-bg-3 to-bg-2 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                />
                <motion.div
                    className="flex-1 bg-gradient-to-r from-bg-2 via-bg-3 to-bg-2 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                />
            </div>
        );
    }

    if (type === 'tradingPanel') {
        return (
            <div className="p-4 space-y-4">
                <motion.div
                    className="h-10 bg-gradient-to-r from-bg-2 via-bg-3 to-bg-2 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                />
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="h-12 bg-gradient-to-r from-bg-2 via-bg-3 to-bg-2 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={{ ...shimmer.transition, delay: i * 0.1 }}
                    />
                ))}
            </div>
        );
    }

    // Default card skeleton
    return (
        <motion.div
            className="h-32 bg-gradient-to-r from-bg-2 via-bg-3 to-bg-2 rounded-lg"
            style={{ backgroundSize: '200% 100%' }}
            animate={shimmer.animate}
            transition={shimmer.transition}
        />
    );
};

export default SkeletonLoader;
