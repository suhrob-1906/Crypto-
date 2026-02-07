import { useState, useEffect, useRef } from 'react';
import BinanceStream from '../../shared/api/binance.ws';

export const useMarketData = (symbol = 'BTCUSDT') => {
    const [ticker, setTicker] = useState(null);
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
    const [trades, setTrades] = useState([]);

    const streamRef = useRef(null);

    useEffect(() => {
        // Cleanup previous stream
        if (streamRef.current) {
            streamRef.current.disconnect();
        }

        setTrades([]); // Clear trades on symbol change

        streamRef.current = new BinanceStream(symbol, (data) => {
            // Dispatch based on event type
            // e = event type

            if (data.e === '24hrMiniTicker') {
                // Normalizing Ticker
                // c: close, o: open, h: high, l: low, v: volume, q: quote volume
                setTicker({
                    lastPrice: parseFloat(data.c),
                    priceChangePercent: ((parseFloat(data.c) - parseFloat(data.o)) / parseFloat(data.o)) * 100,
                    high: parseFloat(data.h),
                    low: parseFloat(data.l),
                    volume: parseFloat(data.v),
                    quoteVolume: parseFloat(data.q),
                });
            } else if (data.lastUpdateId) {
                // OrderBook (depthUpdate or snapshot)
                // For depth20 stream, data has 'bids' and 'asks' arrays directly
                // Stream: @depth20 returns { lastUpdateId, bids: [], asks: [] }
                setOrderBook({
                    bids: data.bids.map(b => [parseFloat(b[0]), parseFloat(b[1])]),
                    asks: data.asks.map(a => [parseFloat(a[0]), parseFloat(a[1])]),
                });
            } else if (data.e === 'aggTrade') {
                // aggTrade
                // p: price, q: quantity, T: timestamp, m: isBuyerMaker
                const newTrade = {
                    price: parseFloat(data.p),
                    qty: parseFloat(data.q),
                    time: data.T,
                    isBuyerMaker: data.m, // true = Sell (red), false = Buy (green)
                };
                setTrades(prev => [newTrade, ...prev].slice(0, 50)); // Keep last 50
            }
        });

        streamRef.current.connect();

        return () => {
            if (streamRef.current) {
                streamRef.current.disconnect();
            }
        };
    }, [symbol]);

    return { ticker, orderBook, trades };
};
