import { apiFetch } from './http'

export async function getWallet() {
  return apiFetch('/api/wallet/')
}

export async function deposit(amount) {
  return apiFetch('/api/wallet/deposit/', { method: 'POST', body: JSON.stringify({ amount: String(amount) }) })
}

export async function withdraw(amount) {
  return apiFetch('/api/wallet/withdraw/', { method: 'POST', body: JSON.stringify({ amount: String(amount) }) })
}

export async function getLedger(limit = 100) {
  return apiFetch(`/api/wallet/ledger/?limit=${limit}`)
}

export async function getCashflows(limit = 100) {
  return apiFetch(`/api/wallet/cashflows/?limit=${limit}`)
}
