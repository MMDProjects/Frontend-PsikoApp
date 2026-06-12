import { isEmail, isEmpty, isPhone } from './validation'

describe('isEmail', () => {
  it('accepts valid email addresses', () => {
    expect(isEmail('user@example.com')).toBe(true)
    expect(isEmail('test.name+tag@sub.domain.org')).toBe(true)
    expect(isEmail('a@b.co')).toBe(true)
  })

  it('rejects invalid email addresses', () => {
    expect(isEmail('notanemail')).toBe(false)
    expect(isEmail('@nodomain')).toBe(false)
    expect(isEmail('missing@')).toBe(false)
    expect(isEmail('spaces in@email.com')).toBe(false)
    expect(isEmail('')).toBe(false)
  })

  it('trims whitespace before testing', () => {
    expect(isEmail('  user@example.com  ')).toBe(true)
  })
})

describe('isPhone', () => {
  describe('TR locale (default)', () => {
    it('accepts valid Turkish mobile numbers', () => {
      expect(isPhone('05551234567')).toBe(true)
      expect(isPhone('+905551234567')).toBe(true)
    })

    it('accepts numbers with spaces', () => {
      expect(isPhone('0555 123 45 67')).toBe(true)
    })

    it('rejects invalid formats', () => {
      expect(isPhone('12345')).toBe(false)
      expect(isPhone('05551234')).toBe(false)
      expect(isPhone('+1234567890')).toBe(false)
      expect(isPhone('notaphone')).toBe(false)
      expect(isPhone('')).toBe(false)
    })
  })

  describe('generic locale', () => {
    it('accepts international phone numbers', () => {
      expect(isPhone('+12025551234', 'US')).toBe(true)
      expect(isPhone('00491234567', 'DE')).toBe(true)
    })

    it('rejects too short or too long numbers', () => {
      expect(isPhone('12345', 'US')).toBe(false)
      expect(isPhone('1234567890123456', 'US')).toBe(false)
    })
  })
})

describe('isEmpty', () => {
  it('returns true for null and undefined', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
  })

  it('returns true for empty string', () => {
    expect(isEmpty('')).toBe(true)
  })

  it('returns false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false)
    expect(isEmpty(' ')).toBe(false)
  })

  it('returns true for empty array', () => {
    expect(isEmpty([])).toBe(true)
  })

  it('returns false for non-empty array', () => {
    expect(isEmpty([1])).toBe(false)
  })

  it('returns true for empty object', () => {
    expect(isEmpty({})).toBe(true)
  })

  it('returns false for non-empty object', () => {
    expect(isEmpty({ a: 1 })).toBe(false)
  })

  it('returns false for numbers (not a container type)', () => {
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(42)).toBe(false)
  })

  it('returns false for booleans', () => {
    expect(isEmpty(false)).toBe(false)
    expect(isEmpty(true)).toBe(false)
  })
})
