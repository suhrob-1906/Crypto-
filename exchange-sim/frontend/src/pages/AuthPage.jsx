import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register, login } from '../shared/api/auth.api'
import { useAuth } from '../app/providers'
import Button from '../shared/ui/Button'
import Input from '../shared/ui/Input'

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
      // If it's a 500 or network error, it might not have a message
      console.error(err)
      setError(err.response?.data?.detail || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Toggle mode
  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setUsername('')
    setPassword('')
    setEmail('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background bg-[url('/bg-pattern.svg')] bg-cover relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary opacity-5 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue opacity-5 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">CryptoEx</h1>
          <p className="text-muted">Professional Trading Platform</p>
        </div>

        {/* Card */}
        <div className="bg-panel border border-border rounded-2xl p-8 shadow-panel backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-text mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-muted text-sm">
              {mode === 'login' ? 'Login to continue trading' : 'Start your journey with zero fees'}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-4">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-surface border-border focus:border-primary transition-colors"
              />
              {mode === 'register' && (
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-surface border-border focus:border-primary transition-colors"
                />
              )}
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-surface border-border focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red/10 border border-red/20 rounded-lg p-3 animate-fade-in">
                <p className="text-red text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primaryDark text-background font-bold py-3.5 rounded-xl shadow-glow-primary transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </span>
              ) : (
                mode === 'login' ? 'Login' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-muted text-sm">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:text-primaryDark font-semibold transition-colors ml-1"
              >
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
