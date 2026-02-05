import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMarkets } from '../shared/api/markets.api'
import { apiFetch } from '../shared/api/http'
import { formatPrice, formatPercent } from '../shared/lib/format'
import Card from '../shared/ui/Card'

export default function MarketsPage() {
  const [markets, setMarkets] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const list = await getMarkets()
        if (cancelled) return
        setMarkets(list)
        const syms = list.map((m) => m.symbol)
        for (const sym of syms) {
          try {
            const s = await apiFetch(`/api/stats/market/?symbol=${sym}`)
            if (cancelled) return
            setStats((prev) => ({ ...prev, [sym]: s }))
          } catch (_) {}
        }
      } catch (_) {}
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="p-8 text-muted">Loading markets...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Markets</h1>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted border-b border-border">
              <th className="text-left py-2">Symbol</th>
              <th className="text-right py-2">Last Price</th>
              <th className="text-right py-2">24h Change</th>
              <th className="text-right py-2">24h Volume</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((m) => {
              const s = stats[m.symbol]
              const last = s?.last_price ? Number(s.last_price) : null
              const low = s?.low_24h ? Number(s.low_24h) : null
              const high = s?.high_24h ? Number(s.high_24h) : null
              const change = last != null && low != null && high != null && low !== high ? (((last - low) / (high - low)) - 0.5) * 2 * 100 : null
              return (
                <tr key={m.symbol} className="border-b border-border/50 hover:bg-surface/50">
                  <td className="py-2">
                    <Link to={`/trade/${m.symbol}`} className="text-green hover:underline">
                      {m.symbol}
                    </Link>
                  </td>
                  <td className="text-right py-2">{formatPrice(last)}</td>
                  <td className={`text-right py-2 ${change != null && change >= 0 ? 'text-green' : 'text-red'}`}>{formatPercent(change)}</td>
                  <td className="text-right py-2">{formatPrice(s?.volume_24h_quote)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
