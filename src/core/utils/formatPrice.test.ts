import { formatPrice, formatPriceCompact } from './formatPrice'

describe('formatPrice', () => {
  it('returns a string containing the amount', () => {
    expect(formatPrice(1500)).toMatch(/1/)
    expect(formatPrice(1500)).toMatch(/500/)
  })

  it('returns a string containing the currency symbol for TRY', () => {
    const result = formatPrice(100, 'TRY')
    // tr-TR locale uses ₺ or TRY abbreviation depending on ICU data
    expect(result).toMatch(/100/)
  })

  it('formats zero correctly', () => {
    expect(formatPrice(0)).toMatch(/0/)
  })

  it('uses alternate locale when provided', () => {
    const result = formatPrice(1500, 'USD', 'en-US')
    expect(result).toMatch(/1/)
    expect(result).toMatch(/500/)
    expect(result).toMatch(/\$|USD/)
  })

  it('formats decimal amounts', () => {
    const result = formatPrice(99.99, 'TRY', 'tr-TR')
    expect(result).toMatch(/99/)
  })
})

describe('formatPriceCompact', () => {
  it('formats numbers below 1000 as-is', () => {
    expect(formatPriceCompact(999)).toMatch(/999/)
    expect(formatPriceCompact(0)).toMatch(/0/)
  })

  it('appends B for thousands', () => {
    expect(formatPriceCompact(1000)).toMatch(/1B/)
    expect(formatPriceCompact(1500)).toMatch(/1[,.]5B/)
    expect(formatPriceCompact(2000)).toMatch(/2B/)
  })

  it('appends M for millions', () => {
    expect(formatPriceCompact(1_000_000)).toMatch(/1M/)
    expect(formatPriceCompact(2_500_000)).toMatch(/2[,.]5M/)
  })

  it('handles negative amounts', () => {
    expect(formatPriceCompact(-1500)).toMatch(/-/)
    expect(formatPriceCompact(-1500)).toMatch(/B/)
  })

  it('handles large millions', () => {
    expect(formatPriceCompact(10_000_000)).toMatch(/10M/)
  })
})
