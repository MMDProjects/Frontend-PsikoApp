const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isEmail(str: string): boolean {
  return EMAIL_RE.test(str.trim())
}

export function isPhone(str: string, locale = 'TR'): boolean {
  const digits = str.replace(/\s/g, '')
  if (locale === 'TR') {
    // Accepts: 05XXXXXXXXX (11 digits) or +905XXXXXXXXX (13 chars)
    return /^(\+90|0)5\d{9}$/.test(digits)
  }
  // Generic: optional + prefix, 7-15 digits
  return /^\+?\d{7,15}$/.test(digits)
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value as object).length === 0
  return false
}
