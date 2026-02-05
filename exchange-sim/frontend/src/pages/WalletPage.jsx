import { useEffect, useState } from 'react'
import Card from '../shared/ui/Card'
import Button from '../shared/ui/Button'
import Input from '../shared/ui/Input'
import { getWallet, deposit, withdraw, getLedger, getCashflows } from '../shared/api/wallet.api'
import { formatAmount } from '../shared/lib/format'

export default function WalletPage() {
  const [balances, setBalances] = useState([])
  const [ledger, setLedger] = useState([])
  const [cashflows, setCashflows] = useState([])
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeForm, setActiveForm] = useState(null)

  const load = async () => {
    try {
      const [b, l, c] = await Promise.all([getWallet(), getLedger(100), getCashflows(100)])
      setBalances(b || [])
      setLedger(l || [])
      setCashflows(c || [])
    } catch (_) {}
  }

  useEffect(() => {
    load()
  }, [])

  const doDeposit = async (e) => {
    e.preventDefault()
    const v = parseFloat(amount)
    if (!Number.isFinite(v) || v <= 0) { setError('Invalid amount'); return }
    setError('')
    setLoading(true)
    try {
      await deposit(v)
      setAmount('')
      setActiveForm(null)
      await load()
    } catch (err) {
      setError(err.message || 'Deposit failed')
    } finally {
      setLoading(false)
    }
  }

  const doWithdraw = async (e) => {
    e.preventDefault()
    const v = parseFloat(amount)
    if (!Number.isFinite(v) || v <= 0) { setError('Invalid amount'); return }
    setError('')
    setLoading(true)
    try {
      await withdraw(v)
      setAmount('')
      setActiveForm(null)
      await load()
    } catch (err) {
      setError(err.message || 'Withdraw failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Wallet</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card title="Balances">
          {balances.map((b) => (
            <div key={b.asset_code} className="flex justify-between py-2 border-b border-border/50">
              <span>{b.asset_code}</span>
              <span className="font-mono">{formatAmount(b.available)} available, {formatAmount(b.locked)} locked</span>
            </div>
          ))}
        </Card>
        <Card title="Deposit / Withdraw">
          {activeForm === 'deposit' && (
            <form onSubmit={doDeposit} className="space-y-2">
              <Input label="Amount USDT" type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} />
              {error && <p className="text-red text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>Deposit</Button>
                <Button type="button" variant="secondary" onClick={() => { setActiveForm(null); setError('') }}>Cancel</Button>
              </div>
            </form>
          )}
          {activeForm === 'withdraw' && (
            <form onSubmit={doWithdraw} className="space-y-2">
              <Input label="Amount USDT" type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} />
              {error && <p className="text-red text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>Withdraw</Button>
                <Button type="button" variant="secondary" onClick={() => { setActiveForm(null); setError('') }}>Cancel</Button>
              </div>
            </form>
          )}
          {!activeForm && (
            <div className="flex gap-2">
              <Button onClick={() => setActiveForm('deposit')}>Deposit</Button>
              <Button variant="danger" onClick={() => setActiveForm('withdraw')}>Withdraw</Button>
            </div>
          )}
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Ledger">
          <div className="text-sm font-mono max-h-96 overflow-y-auto">
            {ledger.map((e) => (
              <div key={e.id} className="py-1 border-b border-border/50">
                {e.asset_code} {e.delta} ({e.kind}) {e.created_at && new Date(e.created_at).toLocaleString()}
              </div>
            ))}
          </div>
        </Card>
        <Card title="Cashflows">
          <div className="text-sm font-mono max-h-96 overflow-y-auto">
            {cashflows.map((c) => (
              <div key={c.id} className="py-1 border-b border-border/50">
                {c.type} {c.asset_code} {formatAmount(c.amount)} {c.status} {c.created_at && new Date(c.created_at).toLocaleString()}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
