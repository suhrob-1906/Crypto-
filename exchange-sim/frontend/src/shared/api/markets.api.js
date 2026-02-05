import { apiFetch } from './http'

export async function getMarkets() {
  return apiFetch('/api/markets/')
}

export async function getTicker(symbol) {
  return apiFetch(`/api/markets/${symbol}/ticker/`)
}

export async function getCandles(symbol, interval = '1d', limit = 365) {
  return apiFetch(`/api/markets/${symbol}/candles/?interval=${interval}&limit=${limit}`)
}
