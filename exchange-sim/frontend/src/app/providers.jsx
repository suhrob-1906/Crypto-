import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'exchange_token'
const REFRESH_KEY = 'exchange_refresh'

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [refresh, setRefreshState] = useState(() => localStorage.getItem(REFRESH_KEY))

  const setToken = useCallback((access, ref) => {
    if (access) localStorage.setItem(TOKEN_KEY, access)
    else localStorage.removeItem(TOKEN_KEY)
    if (ref) localStorage.setItem(REFRESH_KEY, ref)
    else localStorage.removeItem(REFRESH_KEY)
    setTokenState(access || null)
    setRefreshState(ref || null)
  }, [])

  const logout = useCallback(() => {
    setToken(null, null)
  }, [setToken])

  return (
    <AuthContext.Provider value={{ token, refresh, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
