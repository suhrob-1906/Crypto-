import { formatPrice, formatAmount } from '../shared/lib/format'
export default function OrderBook({ bids = [], asks = [], loading }) {
  const b = bids.slice(0, 15)
  const a = [...asks].reverse().slice(0, 15)
  if (loading) return <div className="p-4 text-muted">Loading...</div>
  return (
    <div className="flex flex-col text-sm font-mono">
      <div className="grid grid-cols-3 gap-2 px-2 py-1 text-muted border-b border-border"><span>Price</span><span className="text-right">Amount</span><span className="text-right">Total</span></div>
      {a.map(([price, qty], i) => <div key={'a-' + i} className="grid grid-cols-3 gap-2 px-2 py-0.5 text-red"><span>{formatPrice(price)}</span><span className="text-right">{formatAmount(qty)}</span><span className="text-right">{formatPrice(Number(price) * Number(qty))}</span></div>)}
      <div className="border-t border-b border-border my-1 py-1 px-2 text-muted text-center">—</div>
      {b.map(([price, qty], i) => <div key={'b-' + i} className="grid grid-cols-3 gap-2 px-2 py-0.5 text-green"><span>{formatPrice(price)}</span><span className="text-right">{formatAmount(qty)}</span><span className="text-right">{formatPrice(Number(price) * Number(qty))}</span></div>)}
    </div>
  )
}
