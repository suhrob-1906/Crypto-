import { formatPrice, formatAmount } from '../shared/lib/format'
export default function TradeTape({ trades = [], loading }) {
  if (loading) return <div className="p-4 text-muted">Loading...</div>
  return (
    <div className="flex flex-col text-sm font-mono">
      <div className="grid grid-cols-4 gap-2 px-2 py-1 text-muted border-b border-border"><span>Price</span><span className="text-right">Amount</span><span className="text-right">Side</span><span className="text-right">Time</span></div>
      {trades.slice(0, 20).map((t, i) => <div key={t.id || i} className={`grid grid-cols-4 gap-2 px-2 py-0.5 ${(t.taker_side || t.takerSide) === 'BUY' ? 'text-green' : 'text-red'}`}><span>{formatPrice(t.price)}</span><span className="text-right">{formatAmount(t.amount)}</span><span className="text-right">{t.taker_side || t.takerSide}</span><span className="text-right text-muted">{t.created_at ? new Date(t.created_at).toLocaleTimeString() : t.ts ? new Date(t.ts).toLocaleTimeString() : '—'}</span></div>)}
    </div>
  )
}
