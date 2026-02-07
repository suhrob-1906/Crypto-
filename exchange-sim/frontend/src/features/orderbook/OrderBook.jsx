import React from 'react';

const OrderBookRow = ({ price, amount, total, type, maxTotal }) => {
    const bgWidth = maxTotal ? (total / maxTotal) * 100 : 0;
    const colorClass = type === 'bid' ? 'bg-greenLight' : 'bg-redLight';
    const textColor = type === 'bid' ? 'text-green' : 'text-red';

    return (
        <div className="relative flex justify-between text-xs py-0.5 hover:bg-surfaceHover cursor-pointer">
            <div
                className={`absolute top-0 right-0 h-full ${colorClass} opacity-20`}
                style={{ width: `${bgWidth}%` }}
            />
            <span className={`z-10 pl-2 ${textColor}`}>{price.toFixed(2)}</span>
            <span className="z-10 text-textDim">{amount.toFixed(4)}</span>
            <span className="z-10 pr-2 text-textDim">{total.toFixed(4)}</span>
        </div>
    );
};

const OrderBook = ({ bids = [], asks = [] }) => {
    // Take top 15
    const limit = 15;
    const visibleAsks = asks.slice(0, limit).reverse(); // Show lowest asks at bottom
    const visibleBids = bids.slice(0, limit);

    // Calc max total for depth visualization
    // Simple sum for depth visual not strictly creating a cumulative volume chart here but row-relative
    // For depth bars usually usage is cumulative sum. 
    // Let's do simple relative to max volume in visible view for now to look "active"
    const maxVol = Math.max(
        ...visibleBids.map(b => b[1]),
        ...visibleAsks.map(a => a[1]),
        1 // avoid zero div
    );

    return (
        <div className="flex flex-col h-full bg-panel border-l border-border text-xs">
            <div className="p-3 border-b border-border font-semibold text-muted">
                Order Book
            </div>

            {/* Asks (Sells) - Red */}
            <div className="flex-1 overflow-hidden flex flex-col justify-end">
                {visibleAsks.map(([price, amount], i) => (
                    <OrderBookRow
                        key={i}
                        price={price}
                        amount={amount}
                        total={amount} // Todo: cumulative
                        type="ask"
                        maxTotal={maxVol}
                    />
                ))}
            </div>

            {/* Spread / Last Price */}
            <div className="py-2 text-center border-y border-border text-lg font-bold text-green">
                {/* Placeholder for real-time last price from props or context */}
                ---
            </div>

            {/* Bids (Buys) - Green */}
            <div className="flex-1 overflow-hidden">
                {visibleBids.map(([price, amount], i) => (
                    <OrderBookRow
                        key={i}
                        price={price}
                        amount={amount}
                        total={amount}
                        type="bid"
                        maxTotal={maxVol}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrderBook;
