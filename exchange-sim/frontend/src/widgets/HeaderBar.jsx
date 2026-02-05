import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/providers'
export default function HeaderBar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <header className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
      <Link to="/markets" className="font-semibold text-lg">Exchange Sim</Link>
      <nav className="flex items-center gap-4">
        <Link to="/markets" className="text-muted hover:text-white">Markets</Link>
        <Link to="/wallet" className="text-muted hover:text-white">Wallet</Link>
        <button onClick={() => { logout(); navigate('/auth') }} className="text-muted hover:text-white text-sm">Logout</button>
      </nav>
    </header>
  )
}
