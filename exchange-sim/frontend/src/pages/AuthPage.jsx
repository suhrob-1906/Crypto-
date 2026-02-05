import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register, login } from '../shared/api/auth.api'
import { useAuth } from '../app/providers'
import Button from '../shared/ui/Button'
import Input from '../shared/ui/Input'
import Card from '../shared/ui/Card'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setToken } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        const res = await register(username, email, password)
        setToken(res.access, res.refresh)
      } else {
        const res = await login(username, password)
        setToken(res.access, res.refresh)
      }
      navigate('/markets')
    } catch (err) {
      setError(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card title={mode === 'login' ? 'Login' : 'Register'} className="w-full max-w-md">
        <form onSubmit={submit} className="space-y-3">
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          {mode === 'register' && <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />}
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-red text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? '...' : mode === 'login' ? 'Login' : 'Register'}</Button>
        </form>
        <p className="mt-3 text-muted text-sm">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} className="text-green hover:underline">{mode === 'login' ? 'Register' : 'Login'}</button>
        </p>
      </Card>
    </div>
  )
}
