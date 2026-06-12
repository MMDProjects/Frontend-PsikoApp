export function formatPrice(amount: number, currency = 'TRY', locale = 'tr-TR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPriceCompact(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''

  if (abs >= 1_000_000) {
    const v = (abs / 1_000_000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })
    return `${sign}${v}M`
  }
  if (abs >= 1_000) {
    const v = (abs / 1_000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })
    return `${sign}${v}B`
  }
  return `${sign}${abs.toLocaleString('tr-TR')}`
}
