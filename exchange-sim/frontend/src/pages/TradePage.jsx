import React, { useEffect } from 'react';
import { useMarketData } from '../features/markets/useMarketData';
import OrderBook from '../features/orderbook/OrderBook';
import TradeTape from '../features/trades/TradeTape';
import CandlesChart from '../features/chart/CandlesChart';

const TradePage = () => {
  const symbol = 'BTCUSDT';
  const { ticker, orderBook, trades } = useMarketData(symbol);

  // Update title
  useEffect(() => {
    if (ticker) {
      document.title = `${ticker.lastPrice} | ${symbol} | CryptoEx`;
    }
  }, [ticker, symbol]);

  return (
    <div className="flex flex-col h-screen bg-background text-text overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center px-4 bg-panel shrink-0">
        <div className="text-xl font-bold text-primary mr-8">CryptoEx</div>
        {ticker && (
          <div className="flex items-center space-x-6 text-sm">
            <div>
              <span className="block text-textDim text-xs">Symbol</span>
              <span className="font-bold">{symbol}</span>
            </div>
            <div>
              <span className="block text-textDim text-xs">Last Price</span>
              <span className={`font-bold ${ticker.priceChangePercent >= 0 ? 'text-green' : 'text-red'}`}>
                {ticker.lastPrice}
              </span>
            </div>
            <div>
              <span className="block text-textDim text-xs">24h Change</span>
              <span className={`font-bold ${ticker.priceChangePercent >= 0 ? 'text-green' : 'text-red'}`}>
                {ticker.priceChangePercent.toFixed(2)}%
              </span>
            </div>
            <div>
              <span className="block text-textDim text-xs">24h High</span>
              <span>{ticker.high}</span>
            </div>
            <div>
              <span className="block text-textDim text-xs">24h Low</span>
              <span>{ticker.low}</span>
            </div>
            <div>
              <span className="block text-textDim text-xs">24h Volume</span>
              <span>{parseInt(ticker.volume).toLocaleString()}</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chart & Trading Tabs */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chart Area */}
          <div className="flex-1 bg-bg-1 border-r border-b border-border relative min-h-0">
            <CandlesChart symbol={symbol} />
          </div>
          {/* Tabs Area (Orders, History) */}
          <div className="h-64 bg-panel border-r border-border p-4">
            <div className="text-muted">User Orders / History Tabs</div>
          </div>
        </div>

        {/* Right: Order Book & Trades & Forms */}
        <div className="w-80 flex flex-col shrink-0 border-l border-border bg-panel">
          {/* Order Book */}
          <div className="h-1/2 flex flex-col border-b border-border">
            <OrderBook bids={orderBook.bids} asks={orderBook.asks} midPrice={ticker?.lastPrice} />
          </div>

          {/* Trade Form or Trades Tape */}
          <div className="flex-1 flex flex-col border-t border-border min-h-0">
            <div className="p-2 border-b border-border font-semibold text-muted text-xs">Market Trades</div>
            <TradeTape trades={trades} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradePage;
