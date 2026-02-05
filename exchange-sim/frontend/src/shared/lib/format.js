export function formatPrice(n) {
  if (n == null || n === '') return '—'
  const x = Number(n)
  if (Number.isNaN(x)) return String(n)
  if (x >= 1e6) return x.toLocaleString(undefined, { maximumFractionDigits: 0 })
  if (x >= 1) return x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
  return x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })
}

export function formatAmount(n) {
  if (n == null || n === '') return '—'
  const x = Number(n)
  if (Number.isNaN(x)) return String(n)
  return x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })
}

export function formatPercent(n) {
  if (n == null || n === '') return '—'
  const x = Number(n)
  if (Number.isNaN(x)) return String(n)
  return `${x >= 0 ? '+' : ''}${x.toFixed(2)}%`
}
