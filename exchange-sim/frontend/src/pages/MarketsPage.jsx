import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMarkets, getTicker } from '../shared/api/markets.api'
import { formatPrice, formatPercent } from '../shared/lib/format'
import Card from '../shared/ui/Card'

export default function MarketsPage() {
  const [markets, setMarkets] = useState([])
  const [tickers, setTickers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let interval

    async function loadMarkets() {
      try {
        const list = await getMarkets()
        if (cancelled) return
        setMarkets(list)
        await fetchTickers(list)

        // Update prices every 3 seconds
        interval = setInterval(() => {
          if (!cancelled) fetchTickers(list)
        }, 3000)
      } catch (err) {
        console.error('Failed to load markets:', err)
      }
      if (!cancelled) setLoading(false)
    }

    async function fetchTickers(marketList) {
      const updates = {}
      for (const m of marketList) {
        try {
          const ticker = await getTicker(m.symbol)
          if (cancelled) return
          updates[m.symbol] = {
            price: parseFloat(ticker.price),
            prevPrice: tickers[m.symbol]?.price || parseFloat(ticker.price)
          }
        } catch (err) {
          console.error(`Failed to fetch ${m.symbol}:`, err)
        }
      }
      if (!cancelled) setTickers(prev => ({ ...prev, ...updates }))
    }

    loadMarkets()
    return () => {
      cancelled = true
      if (interval) clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted">Loading markets...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Markets</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-muted border-b border-border">
                <th className="text-left py-3 px-4">Pair</th>
                <th className="text-right py-3 px-4">Last Price</th>
                <th className="text-right py-3 px-4">24h Change</th>
                <th className="text-right py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m) => {
                const ticker = tickers[m.symbol]
                const price = ticker?.price
                const prevPrice = ticker?.prevPrice || price
                const priceChange = price && prevPrice ? ((price - prevPrice) / prevPrice) * 100 : 0
                const isUp = priceChange >= 0

                return (
                  <tr
                    key={m.symbol}
                    className="border-b border-border/30 hover:bg-surface/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green font-bold">
                          {m.base_asset.code[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{m.symbol}</div>
                          <div className="text-xs text-muted">{m.base_asset.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="font-mono text-lg font-semibold">
                        {formatPrice(price)}
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className={`font-semibold ${isUp ? 'text-green' : 'text-red'}`}>
                        {isUp ? '+' : ''}{formatPercent(priceChange)}
                      </span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <Link
                        to={`/trade/${m.symbol}`}
                        className="inline-block px-4 py-2 bg-green hover:bg-green/80 text-background rounded-lg font-semibold transition-colors"
                      >
                        Trade
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
