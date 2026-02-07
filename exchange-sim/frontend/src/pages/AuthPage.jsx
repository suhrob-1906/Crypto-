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
      console.error(err)
      setError(err.response?.data?.detail || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setUsername('')
    setPassword('')
    setEmail('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-0 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-[128px] animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-buy opacity-10 rounded-full blur-[128px] animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-sell opacity-5 rounded-full blur-[128px] animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,170,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,170,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Brand */}
        <div className="text-center mb-8 animate-slide-in-down">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow-primary animate-glow">
              <svg className="w-10 h-10 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">CryptoEx</h1>
          <p className="text-text-2 text-sm">Professional Trading Platform</p>
        </div>

        {/* Card */}
        <div className="glass-dark border border-border-0 rounded-2xl p-8 shadow-xl backdrop-blur-xl animate-slide-in-up">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-text-0 mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-text-2 text-sm">
              {mode === 'login' ? 'Login to continue trading' : 'Start your journey with zero fees'}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-4">
              <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-bg-2 border-border-0 focus:border-primary transition-all duration-300 focus:shadow-glow-primary"
                />
              </div>

              {mode === 'register' && (
                <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-bg-2 border-border-0 focus:border-primary transition-all duration-300 focus:shadow-glow-primary"
                  />
                </div>
              )}

              <div className="animate-slide-in-left" style={{ animationDelay: mode === 'register' ? '0.3s' : '0.2s' }}>
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-bg-2 border-border-0 focus:border-primary transition-all duration-300 focus:shadow-glow-primary"
                />
              </div>
            </div>

            {error && (
              <div className="bg-sell-soft border border-sell rounded-lg p-3 animate-bounce-in">
                <p className="text-sell text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary hover:shadow-glow-primary text-bg-0 font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover-lift"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="spinner"></div>
                  <span>Processing...</span>
                </span>
              ) : (
                mode === 'login' ? 'Login' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border-0 text-center">
            <p className="text-text-2 text-sm">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:text-primary-hover font-semibold transition-all duration-300 ml-1 hover:underline"
              >
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-primary text-2xl font-bold">0%</div>
              <div className="text-text-3 text-xs mt-1">Trading Fees</div>
            </div>
            <div className="animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-buy text-2xl font-bold">24/7</div>
              <div className="text-text-3 text-xs mt-1">Support</div>
            </div>
            <div className="animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-primary text-2xl font-bold">100+</div>
              <div className="text-text-3 text-xs mt-1">Markets</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-text-3 text-xs animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}
