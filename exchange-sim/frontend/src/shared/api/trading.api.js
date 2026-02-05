import { apiFetch } from './http'

export async function createOrder(symbol, side, price, amount) {
  return apiFetch('/api/orders/', {
    method: 'POST',
    body: JSON.stringify({ market_symbol: symbol, side, price: String(price), amount: String(amount) }),
  })
}

export async function cancelOrder(id) {
  return apiFetch(`/api/orders/${id}/cancel/`, { method: 'POST' })
}

export async function getOpenOrders() {
  return apiFetch('/api/orders/open/')
}

export async function getOrderHistory(limit = 100) {
  return apiFetch(`/api/orders/history/?limit=${limit}`)
}

export async function getTrades(symbol, limit = 100) {
  const q = symbol ? `?symbol=${symbol}&limit=${limit}` : `?limit=${limit}`
  return apiFetch(`/api/trades/${q}`)
}

export async function getOrderbook(symbol, limit = 50) {
  return apiFetch(`/api/orderbook/?symbol=${symbol}&limit=${limit}`)
}
