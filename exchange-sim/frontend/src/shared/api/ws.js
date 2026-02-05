const WS_BASE = (() => {
  const u = import.meta.env.VITE_WS_BASE_URL
  if (u) return u.replace(/^http/, 'ws')
  const { protocol, host } = window.location
  return protocol === 'https:' ? `wss://${host}` : `ws://${host}`
})()

function getToken() {
  return localStorage.getItem('exchange_token')
}

export function createMarketWS(symbol, channel, onMessage) {
  const url = `${WS_BASE}/ws/market/${symbol}/${channel}/`
  const ws = new WebSocket(url)
  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data)
      onMessage(msg.event, msg.data)
    } catch (_) {}
  }
  return ws
}

export function createUserWS(onMessage) {
  const token = getToken()
  if (!token) return null
  const url = `${WS_BASE}/ws/user/me/?token=${encodeURIComponent(token)}`
  const ws = new WebSocket(url)
  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data)
      onMessage(msg.event, msg.data)
    } catch (_) {}
  }
  return ws
}
