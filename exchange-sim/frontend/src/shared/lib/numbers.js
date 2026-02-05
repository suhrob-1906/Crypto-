export function toNum(s) { if (s == null || s === '') return NaN; const n = Number(s); return Number.isNaN(n) ? NaN : n }
