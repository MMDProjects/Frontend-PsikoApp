import { formatDate, formatDateRelative } from './formatDate'

const FIXED_NOW = new Date('2024-06-15T12:00:00.000Z').getTime()

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)
})
afterEach(() => {
  jest.restoreAllMocks()
})

describe('formatDate', () => {
  const date = new Date('2024-06-15T00:00:00.000Z')

  it('short format contains year', () => {
    expect(formatDate(date, 'short')).toMatch(/2024/)
  })

  it('long format contains year', () => {
    expect(formatDate(date, 'long')).toMatch(/2024/)
  })

  it('time format contains colon-separated hours and minutes', () => {
    const d = new Date('2024-06-15T14:30:00.000Z')
    expect(formatDate(d, 'time')).toMatch(/\d{1,2}:\d{2}/)
  })

  it('relative format delegates to formatDateRelative', () => {
    const d = new Date(FIXED_NOW - 30_000)
    expect(formatDate(d, 'relative')).toBe('şimdi')
  })

  it('accepts a string date', () => {
    expect(formatDate('2024-06-15', 'short')).toMatch(/2024/)
  })

  it('accepts a custom locale', () => {
    const result = formatDate(date, 'short', 'en-US')
    expect(result).toMatch(/2024/)
  })
})

describe('formatDateRelative', () => {
  it('returns "şimdi" for less than 60 seconds ago', () => {
    expect(formatDateRelative(new Date(FIXED_NOW - 30_000))).toBe('şimdi')
    expect(formatDateRelative(new Date(FIXED_NOW - 59_000))).toBe('şimdi')
  })

  it('returns "N dakika önce" for minutes', () => {
    expect(formatDateRelative(new Date(FIXED_NOW - 5 * 60_000))).toBe('5 dakika önce')
    expect(formatDateRelative(new Date(FIXED_NOW - 59 * 60_000))).toBe('59 dakika önce')
  })

  it('returns "N saat önce" for hours', () => {
    expect(formatDateRelative(new Date(FIXED_NOW - 3 * 3_600_000))).toBe('3 saat önce')
  })

  it('returns "dün" for exactly 1 day ago', () => {
    expect(formatDateRelative(new Date(FIXED_NOW - 25 * 3_600_000))).toBe('dün')
  })

  it('returns "N gün önce" for 2-6 days', () => {
    expect(formatDateRelative(new Date(FIXED_NOW - 3 * 86_400_000))).toBe('3 gün önce')
  })

  it('returns "N hafta önce" for weeks', () => {
    expect(formatDateRelative(new Date(FIXED_NOW - 14 * 86_400_000))).toBe('2 hafta önce')
  })

  it('returns "N ay önce" for months', () => {
    expect(formatDateRelative(new Date(FIXED_NOW - 60 * 86_400_000))).toBe('2 ay önce')
  })

  it('returns "N yıl önce" for years', () => {
    expect(formatDateRelative(new Date(FIXED_NOW - 400 * 86_400_000))).toBe('1 yıl önce')
  })

  it('accepts a string date', () => {
    const str = new Date(FIXED_NOW - 30_000).toISOString()
    expect(formatDateRelative(str)).toBe('şimdi')
  })
})
