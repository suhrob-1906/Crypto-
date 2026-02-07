import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/providers'
import { useTranslation } from 'react-i18next'

export default function HeaderBar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <header className="bg-panel border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/markets" className="text-xl font-bold text-primary tracking-tight">CryptoEx</Link>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link to="/markets" className="text-muted hover:text-text transition-colors">{t('nav.markets')}</Link>
          <Link to="/wallet" className="text-muted hover:text-text transition-colors">{t('nav.wallet')}</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <button
          onClick={toggleLang}
          className="text-xs font-mono uppercase text-muted hover:text-primary transition-colors border border-border rounded px-2 py-1"
        >
          {i18n.language}
        </button>

        <button
          onClick={() => { logout(); navigate('/auth') }}
          className="text-muted hover:text-red transition-colors text-sm"
        >
          {t('nav.logout')}
        </button>
      </div>
    </header>
  )
}
