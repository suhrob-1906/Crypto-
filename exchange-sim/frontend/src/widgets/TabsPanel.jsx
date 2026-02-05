import { useState } from 'react'
import Card from '../shared/ui/Card'
import { formatPrice, formatAmount } from '../shared/lib/format'
import Button from '../shared/ui/Button'
import { cancelOrder } from '../shared/api/trading.api'

const tabs = ['Open Orders', 'Order History', 'Trades', 'Balances']

export default function TabsPanel({ symbol, openOrders = [], orderHistory = [], trades = [], balances = [], onRefresh, onOrderUpdate }) {
  const [active, setActive] = useState(0)
  const [canceling, setCanceling] = useState(null)

  const handleCancel = async (id) => {
    setCanceling(id)
    try {
      await cancelOrder(id)
      onRefresh?.()
      onOrderUpdate?.()
    } finally {
      setCanceling(null)
    }
  }

  const list = active === 0 ? openOrders : active === 1 ? orderHistory : active === 2 ? trades : balances

  return (
    <Card>
      <div className="flex gap-2 border-b border-border pb-2 mb-2">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActive(i)}
            className={`px-3 py-1 rounded text-sm ${active === i ? 'bg-green text-black' : 'text-muted hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="max-h-80 overflow-y-auto text-sm font-mono">
        {active === 0 && openOrders.map((o) => (
          <div key={o.id} className="flex items-center justify-between py-2 border-b border-border/50">
            <span>{o.side} {formatPrice(o.price)} × {formatAmount(o.amount)} ({o.status})</span>
            <Button variant="secondary" disabled={canceling === o.id} onClick={() => handleCancel(o.id)}>
              {canceling === o.id ? '...' : 'Cancel'}
            </Button>
          </div>
        ))}
        {active === 1 && orderHistory.map((o) => (
          <div key={o.id} className="py-2 border-b border-border/50">
            {o.side} {formatPrice(o.price)} × {formatAmount(o.amount)} filled {formatAmount(o.filled_amount)} — {o.status}
          </div>
        ))}
        {active === 2 && trades.map((t) => (
          <div key={t.id} className={`py-2 border-b border-border/50 ${t.taker_side === 'BUY' ? 'text-green' : 'text-red'}`}>
            {formatPrice(t.price)} × {formatAmount(t.amount)} {t.taker_side}
          </div>
        ))}
        {active === 3 && balances.map((b) => (
          <div key={b.asset_code} className="py-2 border-b border-border/50">
            {b.asset_code}: {formatAmount(b.available)} available, {formatAmount(b.locked)} locked
          </div>
        ))}
        {list?.length === 0 && <div className="text-muted py-4">No data</div>}
      </div>
    </Card>
  )
}
