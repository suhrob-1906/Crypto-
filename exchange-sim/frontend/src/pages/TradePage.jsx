import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getTicker, getCandles } from '../shared/api/markets.api'
import { getOrderbook, getTrades, getOpenOrders, getOrderHistory } from '../shared/api/trading.api'
import { getWallet as getBalances } from '../shared/api/wallet.api'
import { createMarketWS, createUserWS } from '../shared/api/ws'
import CandlesChart from '../widgets/CandlesChart'
import OrderBook from '../widgets/OrderBook'
import TradeTape from '../widgets/TradeTape'
import OrderForm from '../widgets/OrderForm'
import TabsPanel from '../widgets/TabsPanel'
import { formatPrice } from '../shared/lib/format'

export default function TradePage() {
  const { symbol } = useParams()
  const sym = symbol || 'BTCUSDT'
  const [ticker, setTicker] = useState(null)
  const [candles, setCandles] = useState([])
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] })
  const [trades, setTrades] = useState([])
  const [openOrders, setOpenOrders] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const [balances, setBalances] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const [ob, tr, oo, oh, bal] = await Promise.all([
        getOrderbook(sym),
        getTrades(sym),
        getOpenOrders(),
        getOrderHistory(100),
        getBalances(),
      ])
      setOrderbook({ bids: ob.bids || [], asks: ob.asks || [] })
      setTrades(tr || [])
      setOpenOrders(oo || [])
      setOrderHistory(oh || [])
      setBalances(bal || [])
    } catch (_) {}
  }, [sym])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [t, c] = await Promise.all([getTicker(sym), getCandles(sym, '1d', 365)])
        if (cancelled) return
        setTicker(t)
        setCandles(c || [])
      } catch (_) {}
      await refresh()
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [sym, refresh])

  useEffect(() => {
    const wsTicker = createMarketWS(sym, 'ticker', (event, data) => {
      if (event === 'ticker:update') setTicker((prev) => ({ ...prev, price: data.price }))
    })
    const wsOb = createMarketWS(sym, 'orderbook', (event, data) => {
      if (event === 'orderbook:update' || event === 'orderbook:snapshot') {
        setOrderbook({ bids: data.bids || [], asks: data.asks || [] })
      }
    })
    const wsTrades = createMarketWS(sym, 'trades', (event, data) => {
      if (event === 'trade:new') setTrades((prev) => [{ ...data, id: Date.now() }, ...prev].slice(0, 50))
    })
    const wsUser = createUserWS((event) => {
      if (event === 'order:update' || event === 'balance:update') refresh()
    })
    return () => {
      wsTicker?.close()
      wsOb?.close()
      wsTrades?.close()
      wsUser?.close()
    }
  }, [sym, refresh])

  return (
    <div className="p-4 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-xl font-semibold">{sym}</h1>
        <span className="text-2xl font-mono">{formatPrice(ticker?.price)}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <CandlesChart symbol={sym} interval="1d" candles={candles} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-sm text-muted mb-2">Order Book</h3>
              <OrderBook bids={orderbook.bids} asks={orderbook.asks} loading={loading} />
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-sm text-muted mb-2">Recent Trades</h3>
              <TradeTape trades={trades} loading={loading} />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <OrderForm symbol={sym} onSuccess={refresh} />
          </div>
          <TabsPanel
            symbol={sym}
            openOrders={openOrders}
            orderHistory={orderHistory}
            trades={trades}
            balances={balances}
            onRefresh={refresh}
          />
        </div>
      </div>
    </div>
  )
}
