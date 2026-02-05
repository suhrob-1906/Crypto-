import { useState } from 'react'
import Button from '../shared/ui/Button'
import Input from '../shared/ui/Input'
import { createOrder } from '../shared/api/trading.api'

export default function OrderForm({ symbol, onSuccess }) {
  const [side, setSide] = useState('BUY')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const p = parseFloat(price)
    const a = parseFloat(amount)
    if (!Number.isFinite(p) || !Number.isFinite(a) || p <= 0 || a <= 0) {
      setError('Invalid price or amount')
      return
    }
    setLoading(true)
    try {
      await createOrder(symbol, side, p, a)
      setPrice('')
      setAmount('')
      onSuccess?.()
    } catch (err) {
      setError(err.message || 'Order failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSide('BUY')}
          className={`flex-1 py-2 rounded font-medium ${side === 'BUY' ? 'bg-green text-black' : 'bg-surface text-muted'}`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setSide('SELL')}
          className={`flex-1 py-2 rounded font-medium ${side === 'SELL' ? 'bg-red text-white' : 'bg-surface text-muted'}`}
        >
          Sell
        </button>
      </div>
      <Input label="Price" type="number" step="any" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <Input label="Amount" type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      {error && <p className="text-red text-sm">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Placing...' : `${side} ${symbol}`}
      </Button>
    </form>
  )
}
