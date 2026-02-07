import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MARKETS = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', icon: '₿' },
    { symbol: 'ETHUSDT', name: 'Ethereum', icon: 'Ξ' },
    { symbol: 'BNBUSDT', name: 'Binance Coin', icon: 'BNB' },
    { symbol: 'SOLUSDT', name: 'Solana', icon: 'SOL' },
    { symbol: 'XRPUSDT', name: 'Ripple', icon: 'XRP' },
    { symbol: 'ADAUSDT', name: 'Cardano', icon: 'ADA' },
];

const PAGES = [
    { path: '/markets', name: 'Markets', icon: '📊' },
    { path: '/trade/BTCUSDT', name: 'Trade', icon: '💹' },
    { path: '/wallet', name: 'Wallet', icon: '💰' },
];

const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleSelect = (callback) => {
        callback();
        setOpen(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={() => setOpen(false)}
                    />

                    {/* Command Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
                    >
                        <Command className="glass-dark border border-border-0 rounded-xl shadow-2xl overflow-hidden">
                            <div className="flex items-center border-b border-border-0 px-4">
                                <svg className="w-5 h-5 text-text-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <Command.Input
                                    placeholder="Search markets, pages, or actions..."
                                    className="w-full bg-transparent border-none outline-none py-4 text-text-0 placeholder-text-3"
                                />
                                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-text-3 bg-bg-2 rounded">
                                    ESC
                                </kbd>
                            </div>

                            <Command.List className="max-h-96 overflow-y-auto p-2">
                                <Command.Empty className="py-8 text-center text-text-3">
                                    No results found.
                                </Command.Empty>

                                <Command.Group heading="Markets" className="text-text-2 text-xs font-semibold px-2 py-2">
                                    {MARKETS.map((market) => (
                                        <Command.Item
                                            key={market.symbol}
                                            onSelect={() => handleSelect(() => navigate(`/trade/${market.symbol}`))}
                                            className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer hover:bg-surface-hover transition-colors"
                                        >
                                            <span className="text-2xl">{market.icon}</span>
                                            <div className="flex-1">
                                                <div className="text-text-0 font-medium">{market.name}</div>
                                                <div className="text-text-3 text-xs">{market.symbol}</div>
                                            </div>
                                            <kbd className="px-2 py-1 text-xs text-text-3 bg-bg-2 rounded">↵</kbd>
                                        </Command.Item>
                                    ))}
                                </Command.Group>

                                <Command.Separator className="h-px bg-border-0 my-2" />

                                <Command.Group heading="Pages" className="text-text-2 text-xs font-semibold px-2 py-2">
                                    {PAGES.map((page) => (
                                        <Command.Item
                                            key={page.path}
                                            onSelect={() => handleSelect(() => navigate(page.path))}
                                            className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer hover:bg-surface-hover transition-colors"
                                        >
                                            <span className="text-2xl">{page.icon}</span>
                                            <div className="flex-1">
                                                <div className="text-text-0 font-medium">{page.name}</div>
                                                <div className="text-text-3 text-xs">{page.path}</div>
                                            </div>
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                            </Command.List>

                            <div className="border-t border-border-0 px-4 py-2 text-xs text-text-3 flex items-center justify-between">
                                <span>Press <kbd className="px-1.5 py-0.5 bg-bg-2 rounded">↑↓</kbd> to navigate</span>
                                <span>Press <kbd className="px-1.5 py-0.5 bg-bg-2 rounded">⌘K</kbd> to toggle</span>
                            </div>
                        </Command>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
