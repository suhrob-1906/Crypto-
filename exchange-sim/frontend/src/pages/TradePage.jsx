import React, { useEffect, useState } from 'react';
import { useMarketData } from '../features/markets/useMarketData';
import MarketsSidebar from '../features/markets/MarketsSidebar';
import OrderBook from '../features/orderbook/OrderBook';
import TradeTape from '../features/trades/TradeTape';
import CandlesChart from '../features/chart/CandlesChart';
import TradingPanel from '../features/trading/TradingPanel';

const TradePage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const { ticker, orderBook, trades } = useMarketData(selectedSymbol);

  // Update title
  useEffect(() => {
    if (ticker) {
      document.title = `${ticker.lastPrice} | ${selectedSymbol} | CryptoEx`;
    }
  }, [ticker, selectedSymbol]);

  const formatNumber = (num, decimals = 2) => {
    if (!num) return '0.00';
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <div className="flex flex-col h-screen bg-bg-0 text-text overflow-hidden">
      {/* Top Header */}
      <header className="h-12 border-b border-border-0 flex items-center px-4 bg-surface shrink-0">
        <div className="flex items-center space-x-8 flex-1">
          {/* Logo */}
          <div className="text-base font-bold text-primary tracking-tight">CryptoEx</div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-primary font-medium">Trade</a>
            <a href="#" className="text-text-2 hover:text-text-1">Markets</a>
            <a href="#" className="text-text-2 hover:text-text-1">Futures</a>
            <a href="#" className="text-text-2 hover:text-text-1">Earn</a>
            <a href="#" className="text-text-2 hover:text-text-1">NFT</a>
          </nav>

          {/* Right Side */}
          <div className="ml-auto flex items-center space-x-4">
            <button className="p-2 hover:bg-surface-hover rounded">
              <svg className="w-4 h-4 text-text-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2 hover:bg-surface-hover rounded">
              <svg className="w-4 h-4 text-text-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="px-4 py-1.5 bg-primary text-bg-0 rounded font-semibold text-sm hover:bg-primary-hover">
              Account
            </button>
          </div>
        </div>
      </header>

      {/* Price Ticker Bar */}
      {ticker && (
        <div className="h-10 border-b border-border-0 flex items-center px-4 bg-surface shrink-0 overflow-x-auto">
          <div className="flex items-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-text-0 font-bold">{selectedSymbol.replace('USDT', '')}/USDT</span>
              <span className={`font-mono font-bold text-base ${ticker.priceChangePercent >= 0 ? 'text-buy' : 'text-sell'}`}>
                ${formatNumber(ticker.lastPrice, 2)}
              </span>
            </div>
            <div className={`px-2 py-0.5 rounded ${ticker.priceChangePercent >= 0 ? 'bg-buy-soft text-buy' : 'bg-sell-soft text-sell'}`}>
              <span className="font-mono text-xs font-semibold">
                {ticker.priceChangePercent >= 0 ? '+' : ''}{ticker.priceChangePercent.toFixed(2)}%
              </span>
            </div>
            <div>
              <span className="text-text-3">24h High: </span>
              <span className="text-text-1 font-mono">${formatNumber(ticker.high, 2)}</span>
            </div>
            <div>
              <span className="text-text-3">24h Low: </span>
              <span className="text-text-1 font-mono">${formatNumber(ticker.low, 2)}</span>
            </div>
            <div>
              <span className="text-text-3">24h Volume: </span>
              <span className="text-text-1 font-mono">{formatNumber(ticker.volume / 1000, 2)}K BTC</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Markets Sidebar */}
        <MarketsSidebar selectedSymbol={selectedSymbol} onSelectSymbol={setSelectedSymbol} />

        {/* Center: Chart + Bottom Panels */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chart Area */}
          <div className="flex-1 bg-bg-1 border-r border-border-0 relative min-h-0">
            <CandlesChart symbol={selectedSymbol} />
          </div>

          {/* Bottom Section: Order Book + Trades */}
          <div className="h-64 flex border-t border-border-0">
            {/* Order Book */}
            <div className="flex-1 bg-surface border-r border-border-0">
              <OrderBook bids={orderBook.bids} asks={orderBook.asks} midPrice={ticker?.lastPrice} />
            </div>

            {/* Recent Trades */}
            <div className="flex-1 bg-surface">
              <div className="px-3 py-2 border-b border-border-0">
                <span className="font-semibold text-text-0 text-xs">Recent Trades</span>
              </div>
              <TradeTape trades={trades} />
            </div>
          </div>
        </div>

        {/* Right: Trading Panel */}
        <TradingPanel symbol={selectedSymbol} />
      </div>
    </div>
  );
};

export default TradePage;
