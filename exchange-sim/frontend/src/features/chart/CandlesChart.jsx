import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

const TIMEFRAMES = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
];

const CandlesChart = ({ symbol = 'BTCUSDT' }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const lineSeriesRef = useRef(null);

  const [interval, setInterval] = useState('1h');
  const [mode, setMode] = useState('candles'); // 'candles' or 'line'

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#b7bdc6', // muted
      },
      grid: {
        vertLines: { color: '#2b3139' },
        horzLines: { color: '#2b3139' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#2b3139',
      },
      rightPriceScale: {
        borderColor: '#2b3139',
      },
    });

    // 1. Candlestick Series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#0ecb81',
      downColor: '#f6465d',
      borderVisible: false,
      wickUpColor: '#0ecb81',
      wickDownColor: '#f6465d',
    });
    candlestickSeriesRef.current = candlestickSeries;

    // 2. Volume Series
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // overlay
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // highest volume bar takes up bottom 20%
        bottom: 0,
      },
    });
    volumeSeriesRef.current = volumeSeries;

    // 3. Line Series (Hidden by default)
    const lineSeries = chart.addLineSeries({
      color: '#fcd535', // primary color
      lineWidth: 2,
      visible: false,
    });
    lineSeriesRef.current = lineSeries;

    chartRef.current = chart;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Fetch Data on Symbol/Interval Change
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using our backend proxy
        // /api/markets/{symbol}/candles?interval={interval}&limit=1000
        const res = await fetch(`http://localhost:8000/api/markets/${symbol}/candles/?interval=${interval}&limit=1000`);
        const data = await res.json();

        if (!Array.isArray(data)) return;

        // Binance kline format: 
        // [ openTime, open, high, low, close, volume, closeTime, ... ]
        // Lightweight charts expects: { time, open, high, low, close }
        // time must be in seconds for lightweight charts if using unix timestamp

        const candles = data.map(k => ({
          time: k[0] / 1000,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));

        const volumes = data.map(k => ({
          time: k[0] / 1000,
          value: parseFloat(k[5]),
          color: parseFloat(k[4]) >= parseFloat(k[1]) ? 'rgba(14, 203, 129, 0.5)' : 'rgba(246, 70, 93, 0.5)',
        }));

        const lineData = data.map(k => ({
          time: k[0] / 1000,
          value: parseFloat(k[4]),
        }));

        if (candlestickSeriesRef.current) candlestickSeriesRef.current.setData(candles);
        if (volumeSeriesRef.current) volumeSeriesRef.current.setData(volumes);
        if (lineSeriesRef.current) lineSeriesRef.current.setData(lineData);

      } catch (err) {
        console.error("Failed to fetch candles", err);
      }
    };

    fetchData();
  }, [symbol, interval]);

  // Handle Mode Switch
  useEffect(() => {
    if (!candlestickSeriesRef.current || !lineSeriesRef.current) return;

    if (mode === 'candles') {
      candlestickSeriesRef.current.applyOptions({ visible: true });
      lineSeriesRef.current.applyOptions({ visible: false });
    } else {
      candlestickSeriesRef.current.applyOptions({ visible: false });
      lineSeriesRef.current.applyOptions({ visible: true });
    }
  }, [mode]);

  return (
    <div className="flex flex-col h-full bg-bg-1 relative">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-panel">
        {/* Timeframes */}
        <div className="flex space-x-2">
          {TIMEFRAMES.map(tf => (
            <button
              key={tf.value}
              onClick={() => setInterval(tf.value)}
              className={`text-xs font-medium px-2 py-1 rounded hover:bg-surfaceHover transition-colors ${interval === tf.value ? 'text-primary' : 'text-textDim'}`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* View Options */}
        <div className="flex space-x-2 bg-bg-0 rounded p-0.5">
          <button
            onClick={() => setMode('candles')}
            className={`p-1 rounded transition-colors ${mode === 'candles' ? 'bg-surface text-primary' : 'text-muted hover:text-text'}`}
            title="Candlesticks"
          >
            {/* Candle Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10H15V6H17V10ZM17 18H15V14H17V18ZM7 12H9V8H7V12ZM9 20H7V16H9V20ZM12 2H12.01V22H12V2Z" /></svg>
          </button>
          <button
            onClick={() => setMode('line')}
            className={`p-1 rounded transition-colors ${mode === 'line' ? 'bg-surface text-primary' : 'text-muted hover:text-text'}`}
            title="Line"
          >
            {/* Line Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full relative" ref={chartContainerRef} />

      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary opacity-5 pointer-events-none text-6xl font-black select-none">
        CryptoEx
      </div>
    </div>
  );
};

export default CandlesChart;
