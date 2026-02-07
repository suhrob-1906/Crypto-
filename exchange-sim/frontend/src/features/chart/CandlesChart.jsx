import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, LineStyle } from 'lightweight-charts';
import { motion, AnimatePresence } from 'framer-motion';

const TIMEFRAMES = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
];

const DRAWING_TOOLS = [
  { id: 'line', label: 'Line', icon: '📏' },
  { id: 'horizontal', label: 'Horizontal', icon: '➖' },
  { id: 'trend', label: 'Trend', icon: '📈' },
  { id: 'fibonacci', label: 'Fibonacci', icon: '🔢' },
];

const CandlesChart = ({ symbol = 'BTCUSDT' }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const lineSeriesRef = useRef(null);
  const drawingsRef = useRef([]);

  const [interval, setInterval] = useState('1h');
  const [mode, setMode] = useState('candles'); // 'candles' or 'line'
  const [drawingMode, setDrawingMode] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#b7bdc6',
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
      crosshair: {
        mode: drawingMode ? 1 : 0, // Magnet mode when drawing
      },
    });

    // Candlestick Series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#0ecb81',
      downColor: '#f6465d',
      borderVisible: false,
      wickUpColor: '#0ecb81',
      wickDownColor: '#f6465d',
    });
    candlestickSeriesRef.current = candlestickSeries;

    // Volume Series
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeriesRef.current = volumeSeries;

    // Line Series
    const lineSeries = chart.addLineSeries({
      color: '#00d4aa',
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
  }, [drawingMode]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const res = await fetch(`${API_BASE_URL}/api/markets/${symbol}/candles/?interval=${interval}&limit=1000`);
        const data = await res.json();

        if (!Array.isArray(data)) return;

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

  const handleDrawingTool = (toolId) => {
    if (drawingMode === toolId) {
      setDrawingMode(null);
    } else {
      setDrawingMode(toolId);
    }
  };

  const clearDrawings = () => {
    drawingsRef.current = [];
    // In a real implementation, you would remove the drawings from the chart
    // This requires more complex integration with lightweight-charts
  };

  return (
    <div className="flex flex-col h-full bg-bg-1 relative">
      {/* Chart Toolbar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-4 py-2 border-b border-border bg-panel"
      >
        {/* Timeframes */}
        <div className="flex space-x-2">
          {TIMEFRAMES.map((tf, index) => (
            <motion.button
              key={tf.value}
              onClick={() => setInterval(tf.value)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`text-xs font-medium px-2 py-1 rounded hover:bg-surfaceHover transition-all duration-300 ${interval === tf.value ? 'text-primary bg-primary-soft shadow-glow-primary' : 'text-textDim'
                }`}
            >
              {tf.label}
            </motion.button>
          ))}
        </div>

        {/* View Options & Drawing Tools */}
        <div className="flex items-center space-x-2">
          {/* Chart Type */}
          <div className="flex space-x-2 bg-bg-0 rounded p-0.5">
            <motion.button
              onClick={() => setMode('candles')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1 rounded transition-all duration-300 ${mode === 'candles' ? 'bg-surface text-primary shadow-glow-primary' : 'text-muted hover:text-text'
                }`}
              title="Candlesticks"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10H15V6H17V10ZM17 18H15V14H17V18ZM7 12H9V8H7V12ZM9 20H7V16H9V20ZM12 2H12.01V22H12V2Z" />
              </svg>
            </motion.button>
            <motion.button
              onClick={() => setMode('line')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1 rounded transition-all duration-300 ${mode === 'line' ? 'bg-surface text-primary shadow-glow-primary' : 'text-muted hover:text-text'
                }`}
              title="Line"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </motion.button>
          </div>

          {/* Drawing Tools Toggle */}
          <motion.button
            onClick={() => setShowDrawingTools(!showDrawingTools)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded transition-all duration-300 ${showDrawingTools ? 'bg-primary text-bg-0 shadow-glow-primary' : 'bg-bg-0 text-text-2 hover:text-text-0'
              }`}
            title="Drawing Tools"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Drawing Tools Panel */}
      <AnimatePresence>
        {showDrawingTools && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-border bg-surface overflow-hidden"
          >
            <div className="flex items-center space-x-2 px-4 py-2">
              <span className="text-xs text-text-2 font-medium mr-2">Drawing Tools:</span>
              {DRAWING_TOOLS.map((tool, index) => (
                <motion.button
                  key={tool.id}
                  onClick={() => handleDrawingTool(tool.id)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium transition-all duration-300 ${drawingMode === tool.id
                      ? 'bg-primary text-bg-0 shadow-glow-primary'
                      : 'bg-bg-2 text-text-2 hover:text-text-0 hover:bg-bg-3'
                    }`}
                  title={tool.label}
                >
                  <span>{tool.icon}</span>
                  <span>{tool.label}</span>
                </motion.button>
              ))}
              <div className="flex-1" />
              <motion.button
                onClick={clearDrawings}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 rounded text-xs font-medium bg-sell-soft text-sell hover:bg-sell hover:text-white transition-all duration-300"
              >
                Clear All
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawing Mode Indicator */}
      <AnimatePresence>
        {drawingMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-primary text-bg-0 rounded-lg shadow-glow-primary text-sm font-medium"
          >
            Drawing: {DRAWING_TOOLS.find(t => t.id === drawingMode)?.label} - Click on chart to draw
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 w-full relative"
        ref={chartContainerRef}
        style={{ cursor: drawingMode ? 'crosshair' : 'default' }}
      />

      {/* Watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ delay: 0.5 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary pointer-events-none text-6xl font-black select-none"
      >
        CryptoEx
      </motion.div>
    </div>
  );
};

export default CandlesChart;
