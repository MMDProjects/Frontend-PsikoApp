import { chunk, groupBy, uniqueBy } from './array'

describe('groupBy', () => {
  it('groups items by string key', () => {
    const data = [
      { id: 1, type: 'a' },
      { id: 2, type: 'b' },
      { id: 3, type: 'a' },
    ]
    const result = groupBy(data, 'type')
    expect(result['a']).toHaveLength(2)
    expect(result['b']).toHaveLength(1)
    expect(result['a']![0]!.id).toBe(1)
  })

  it('groups by numeric key', () => {
    const data = [
      { score: 1, name: 'x' },
      { score: 2, name: 'y' },
      { score: 1, name: 'z' },
    ]
    const result = groupBy(data, 'score')
    expect(result['1']).toHaveLength(2)
    expect(result['2']).toHaveLength(1)
  })

  it('returns empty object for empty array', () => {
    expect(groupBy([], 'id' as never)).toEqual({})
  })

  it('handles all items in same group', () => {
    const data = [{ k: 'x' }, { k: 'x' }, { k: 'x' }]
    expect(groupBy(data, 'k')['x']).toHaveLength(3)
  })
})

describe('uniqueBy', () => {
  it('deduplicates by key', () => {
    const data = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' },
    ]
    const result = uniqueBy(data, 'id')
    expect(result).toHaveLength(2)
    expect(result[0]!.id).toBe(1)
    expect(result[1]!.id).toBe(2)
  })

  it('keeps the first occurrence', () => {
    const data = [
      { id: 1, name: 'first' },
      { id: 1, name: 'second' },
    ]
    expect(uniqueBy(data, 'id')[0]!.name).toBe('first')
  })

  it('returns empty array for empty input', () => {
    expect(uniqueBy([], 'id' as never)).toEqual([])
  })

  it('returns all when all keys are unique', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(uniqueBy(data, 'id')).toHaveLength(3)
  })
})

describe('chunk', () => {
  it('splits array into chunks of given size', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('handles exact multiple', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ])
  })

  it('returns empty array for empty input', () => {
    expect(chunk([], 2)).toEqual([])
  })

  it('returns one chunk when size >= array length', () => {
    expect(chunk([1, 2, 3], 10)).toEqual([[1, 2, 3]])
  })

  it('returns empty array for size 0', () => {
    expect(chunk([1, 2, 3], 0)).toEqual([])
  })

  it('handles size 1', () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]])
  })

  it('handles single element', () => {
    expect(chunk([42], 2)).toEqual([[42]])
  })
})
