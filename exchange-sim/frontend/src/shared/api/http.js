const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

function getToken() {
  return localStorage.getItem('exchange_token')
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url, { ...options, headers })
  if (res.status === 401) {
    localStorage.removeItem('exchange_token')
    localStorage.removeItem('exchange_refresh')
    window.location.href = '/auth'
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || err.detail || res.statusText)
  }
  if (res.status === 204) return null
  return res.json()
}
