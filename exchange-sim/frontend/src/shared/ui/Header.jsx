import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers'

export default function Header() {
    const location = useLocation()
    const navigate = useNavigate()
    const { token, clearToken } = useAuth()

    const isActive = (path) => location.pathname === path

    const handleLogout = () => {
        clearToken()
        navigate('/auth')
    }

    return (
        <header className="bg-panel border-b border-border">
            <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/markets" className="flex items-center gap-3 group">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">CryptoEx</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-6">
                        <Link
                            to="/markets"
                            className={`text-sm font-medium transition-colors ${isActive('/markets') ? 'text-primary' : 'text-muted hover:text-text'
                                }`}
                        >
                            Markets
                        </Link>
                        <Link
                            to="/wallet"
                            className={`text-sm font-medium transition-colors ${isActive('/wallet') ? 'text-primary' : 'text-muted hover:text-text'
                                }`}
                        >
                            Wallet
                        </Link>
                        {token && (
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-muted hover:text-red transition-colors"
                            >
                                Logout
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
