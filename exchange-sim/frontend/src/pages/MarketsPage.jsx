import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMarkets, getTicker } from '../shared/api/markets.api'
import { formatPrice, formatPercent } from '../shared/lib/format'
import Header from '../shared/ui/Header'
import ParticleBackground from '../shared/ui/ParticleBackground'
import AnimatedNumber from '../shared/ui/AnimatedNumber'

export default function MarketsPage() {
  const [markets, setMarkets] = useState([])
  const [tickers, setTickers] = useState({})
  const [loading, setLoading] = useState(true)
  const [priceAnimations, setPriceAnimations] = useState({})

  useEffect(() => {
    let cancelled = false
    let interval

    async function loadMarkets() {
      try {
        const list = await getMarkets()
        if (cancelled) return
        setMarkets(list)
        await fetchTickers(list)

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
          const newPrice = parseFloat(ticker.price)
          const oldPrice = tickers[m.symbol]?.price

          updates[m.symbol] = {
            price: newPrice,
            prevPrice: oldPrice || newPrice
          }

          if (oldPrice && newPrice !== oldPrice) {
            setPriceAnimations(prev => ({ ...prev, [m.symbol]: newPrice > oldPrice ? 'up' : 'down' }))
            setTimeout(() => {
              setPriceAnimations(prev => ({ ...prev, [m.symbol]: null }))
            }, 500)
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
      <div className="min-h-screen bg-background relative overflow-hidden">
        <ParticleBackground />
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-panel border border-border rounded-lg p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface rounded-full animate-shimmer"></div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-surface rounded animate-shimmer"></div>
                      <div className="w-16 h-3 bg-surface rounded animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="w-32 h-6 bg-surface rounded animate-shimmer"></div>
                  <div className="w-20 h-8 bg-surface rounded animate-shimmer"></div>
                  <div className="w-24 h-10 bg-surface rounded-lg animate-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-yellow/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Header />

      {/* Ticker Bar with gradient animation */}
      <div className="bg-panel border-b border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer"></div>
        <div className="flex gap-8 px-6 py-3 animate-slide-down relative z-10">
          {markets.slice(0, 5).map((m, idx) => {
            const ticker = tickers[m.symbol]
            const price = ticker?.price
            const prevPrice = ticker?.prevPrice || price
            const priceChange = price && prevPrice ? ((price - prevPrice) / prevPrice) * 100 : 0
            const isUp = priceChange >= 0

            return (
              <div
                key={m.symbol}
                className="flex items-center gap-3 whitespace-nowrap animate-fade-in group cursor-pointer hover:scale-110 transition-transform duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <span className="text-text font-semibold group-hover:text-primary transition-colors">{m.symbol}</span>
                <span className={`text-text font-mono font-bold transition-all duration-300 ${priceAnimations[m.symbol] === 'up' ? 'text-primary scale-125 drop-shadow-glow-primary' :
                    priceAnimations[m.symbol] === 'down' ? 'text-red scale-125 drop-shadow-glow-red' : ''
                  }`}>
                  <AnimatedNumber value={price} prefix="$" />
                </span>
                <span className={`text-sm font-bold ${isUp ? 'text-primary' : 'text-red'}`}>
                  {isUp ? '↑' : '↓'} {formatPercent(Math.abs(priceChange))}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Hero Title with gradient animation */}
        <div className="mb-8 text-center animate-fade-in-down">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-blue to-yellow bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            Cryptocurrency Markets
          </h1>
          <p className="text-mutedLight text-lg">Real-time prices • Live updates every 3 seconds</p>
        </div>

        {/* Stats Cards with 3D hover */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '💰', label: 'Market Cap', value: 2100000000000, change: '+2.34%', color: 'yellow', delay: 0 },
            { icon: '📊', label: '24h Volume', value: 95400000000, change: '+24.6%', color: 'blue', delay: 100 },
            { icon: '⚡', label: 'Active Traders', value: 1200000, change: '+12.5%', color: 'primary', delay: 200 },
            { icon: '🔥', label: 'Gas Price', value: 25, change: '-15.3%', color: 'green', delay: 300 },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-panel border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up cursor-pointer group perspective-1000"
              style={{ animationDelay: `${stat.delay}ms`, transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-2xl animate-bounce-in group-hover:scale-125 transition-transform duration-300`} style={{ animationDelay: `${stat.delay + 200}ms` }}>
                  {stat.icon}
                </span>
                <span className="text-muted text-sm font-medium">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold text-text mb-1">
                <AnimatedNumber value={stat.value} prefix="$" suffix={stat.label === 'Gas Price' ? ' Gwei' : ''} />
              </div>
              <div className={`text-sm font-bold ${stat.change.startsWith('+') ? 'text-primary' : 'text-red'}`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Markets Table with ripple effect */}
        <div className="bg-panel border border-border rounded-xl overflow-hidden animate-fade-in-up shadow-2xl" style={{ animationDelay: '400ms' }}>
          <div className="p-6 border-b border-border bg-gradient-to-r from-surface/50 to-transparent">
            <h2 className="text-2xl font-bold text-text">Live Markets</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="text-left py-4 px-6 text-muted font-semibold text-sm uppercase tracking-wider">Pair</th>
                  <th className="text-right py-4 px-6 text-muted font-semibold text-sm uppercase tracking-wider">Price</th>
                  <th className="text-right py-4 px-6 text-muted font-semibold text-sm uppercase tracking-wider">24h Change</th>
                  <th className="text-right py-4 px-6 text-muted font-semibold text-sm uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {markets.map((m, idx) => {
                  const ticker = tickers[m.symbol]
                  const price = ticker?.price
                  const prevPrice = ticker?.prevPrice || price
                  const priceChange = price && prevPrice ? ((price - prevPrice) / prevPrice) * 100 : 0
                  const isUp = priceChange >= 0
                  const animation = priceAnimations[m.symbol]

                  return (
                    <tr
                      key={m.symbol}
                      className={`border-b border-border/50 hover:bg-gradient-to-r hover:from-surface/50 hover:to-transparent transition-all duration-300 group animate-fade-in-up ${animation === 'up' ? 'animate-price-up' : animation === 'down' ? 'animate-price-down' : ''
                        }`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg ${isUp ? 'bg-gradient-primary shadow-glow-primary' : 'bg-gradient-red shadow-glow-red'
                            }`}>
                            <span className="text-background drop-shadow-lg">{m.base_asset.code[0]}</span>
                          </div>
                          <div>
                            <div className="text-text font-bold text-lg group-hover:text-primary transition-colors">
                              {m.symbol}
                            </div>
                            <div className="text-sm text-muted">{m.base_asset.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-5 px-6">
                        <div className={`font-mono text-2xl font-bold text-text transition-all duration-300 ${animation === 'up' ? 'text-primary scale-125 drop-shadow-glow-primary' :
                            animation === 'down' ? 'text-red scale-125 drop-shadow-glow-red' : ''
                          }`}>
                          <AnimatedNumber value={price} prefix="$" />
                        </div>
                      </td>
                      <td className="text-right py-5 px-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg transition-all duration-300 group-hover:scale-110 ${isUp
                            ? 'bg-primary/10 text-primary border-2 border-primary/30 shadow-glow-primary'
                            : 'bg-red/10 text-red border-2 border-red/30 shadow-glow-red'
                          }`}>
                          <span className="text-2xl animate-pulse">{isUp ? '↑' : '↓'}</span>
                          <span>{formatPercent(Math.abs(priceChange))}</span>
                        </div>
                      </td>
                      <td className="text-right py-5 px-6">
                        <Link
                          to={`/trade/${m.symbol}`}
                          className="inline-block px-8 py-3 bg-gradient-primary hover:shadow-2xl hover:shadow-primary/50 text-background rounded-xl font-bold text-lg transition-all duration-300 hover:scale-110 hover:-rotate-2 relative overflow-hidden group/btn"
                        >
                          <span className="relative z-10">Trade Now</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with pulse */}
        <div className="mt-8 text-center text-muted text-sm animate-pulse-slow">
          <p>⚡ Live data • 🔄 Updates every 3s • 📡 Powered by Binance API</p>
        </div>
      </div>
    </div>
  )
}
