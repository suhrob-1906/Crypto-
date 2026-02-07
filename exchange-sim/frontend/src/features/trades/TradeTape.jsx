import React from 'react';

const TradeTape = ({ trades = [] }) => {
    return (
        <div className="flex flex-col h-full text-xs bg-panel border-l border-border mt-px">
            <div className="flex items-center px-3 py-2 text-muted border-b border-border">
                <span className="w-1/3">Price(USDT)</span>
                <span className="w-1/3 text-right">Amount(BTC)</span>
                <span className="w-1/3 text-right">Time</span>
            </div>
            <div className="flex-1 overflow-y-auto">
                {trades.map((trade, i) => {
                    // isBuyerMaker = true -> Sell (Red), false -> Buy (Green)
                    const color = trade.isBuyerMaker ? 'text-red' : 'text-green';
                    const date = new Date(trade.time);
                    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

                    return (
                        <div key={i} className="flex items-center px-3 py-1 hover:bg-surfaceHover">
                            <span className={`w-1/3 ${color}`}>{trade.price.toFixed(2)}</span>
                            <span className="w-1/3 text-right text-textDim">{trade.qty.toFixed(5)}</span>
                            <span className="w-1/3 text-right text-muted">{timeStr}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default TradeTape;
