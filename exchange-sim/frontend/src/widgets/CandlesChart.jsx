import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'

export default function CandlesChart({ symbol, interval, candles: initialCandles }) {
  const chartRef = useRef(null)
  useEffect(() => {
    if (!chartRef.current || !initialCandles?.length) return
    const chart = createChart(chartRef.current, {
      layout: { background: { color: '#1a1d24' }, textColor: '#848e9c' },
      grid: { vertLines: { color: '#2d3139' }, horzLines: { color: '#2d3139' } },
      width: chartRef.current.clientWidth,
      height: 400,
      timeScale: { timeVisible: true },
      rightPriceScale: { borderColor: '#2d3139' },
    })
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#0ecb81',
      downColor: '#f6465d',
      borderVisible: false,
    })
    const data = initialCandles.map((c) => ({
      time: c.time,
      open: parseFloat(c.open),
      high: parseFloat(c.high),
      low: parseFloat(c.low),
      close: parseFloat(c.close),
    }))
    candleSeries.setData(data)
    return () => chart.remove()
  }, [symbol, interval, initialCandles])
  return <div ref={chartRef} className="w-full" style={{ minHeight: 400 }} />
}
