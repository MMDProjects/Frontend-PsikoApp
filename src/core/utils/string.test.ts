import { capitalize, initials, maskEmail, slugify, truncate } from './string'

describe('capitalize', () => {
  it('uppercases the first character', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('does not change the rest of the string', () => {
    expect(capitalize('hello world')).toBe('Hello world')
  })

  it('returns empty string unchanged', () => {
    expect(capitalize('')).toBe('')
  })

  it('handles already-capitalized string', () => {
    expect(capitalize('Hello')).toBe('Hello')
  })

  it('handles single character', () => {
    expect(capitalize('a')).toBe('A')
  })
})

describe('truncate', () => {
  it('returns string unchanged when under maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('returns string unchanged when exactly maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })

  it('truncates and appends default ellipsis', () => {
    expect(truncate('hello world', 8)).toBe('hello...')
  })

  it('uses custom ellipsis', () => {
    expect(truncate('hello world', 8, '…')).toBe('hello w…')
  })

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('')
  })

  it('handles very short maxLength', () => {
    expect(truncate('hello', 3)).toBe('...')
  })
})

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('converts Turkish characters', () => {
    expect(slugify('Şule Çığır')).toBe('sule-cigir')
    expect(slugify('Güneş Öğretmen')).toBe('gunes-ogretmen')
    expect(slugify('ığüşçö')).toBe('igusco')
  })

  it('handles capital İ', () => {
    expect(slugify('İstanbul')).toBe('istanbul')
  })

  it('removes special characters', () => {
    expect(slugify('hello! world?')).toBe('hello-world')
  })

  it('collapses multiple spaces/hyphens', () => {
    expect(slugify('hello   world')).toBe('hello-world')
    expect(slugify('hello--world')).toBe('hello-world')
  })

  it('trims leading/trailing whitespace', () => {
    expect(slugify('  hello  ')).toBe('hello')
  })

  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('')
  })
})

describe('initials', () => {
  it('returns initials of two-word name', () => {
    expect(initials('Ayşe Kaya')).toBe('AK')
  })

  it('returns single initial for one-word name', () => {
    expect(initials('Ayşe')).toBe('A')
  })

  it('respects maxChars param', () => {
    expect(initials('Ali Veli Çelik', 2)).toBe('AV')
    expect(initials('Ali Veli Çelik', 3)).toBe('AVÇ')
  })

  it('defaults to 2 chars', () => {
    expect(initials('Ali Veli Çelik')).toBe('AV')
  })

  it('uppercases initials', () => {
    expect(initials('ali kaya')).toBe('AK')
  })

  it('handles extra whitespace', () => {
    expect(initials('  Ali  Veli  ')).toBe('AV')
  })
})

describe('maskEmail', () => {
  it('masks middle of username', () => {
    expect(maskEmail('ayse@gmail.com')).toBe('a***@gmail.com')
  })

  it('works with short username', () => {
    expect(maskEmail('a@b.com')).toBe('a***@b.com')
  })

  it('returns original string when no @ present', () => {
    expect(maskEmail('notanemail')).toBe('notanemail')
  })

  it('preserves domain as-is', () => {
    expect(maskEmail('test@example.org')).toBe('t***@example.org')
  })
})
