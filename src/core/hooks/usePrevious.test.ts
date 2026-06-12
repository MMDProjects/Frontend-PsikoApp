import { renderHook } from '@testing-library/react-native'

import { usePrevious } from './usePrevious'

describe('usePrevious', () => {
  it('returns undefined on first render', () => {
    const { result } = renderHook(({ value }: { value: string }) => usePrevious(value), {
      initialProps: { value: 'a' },
    })
    expect(result.current).toBeUndefined()
  })

  it('returns the previous value after rerender', () => {
    const { result, rerender } = renderHook(({ value }: { value: string }) => usePrevious(value), {
      initialProps: { value: 'a' },
    })
    rerender({ value: 'b' })
    expect(result.current).toBe('a')
  })

  it('tracks multiple changes', () => {
    const { result, rerender } = renderHook(({ value }: { value: string }) => usePrevious(value), {
      initialProps: { value: 'a' },
    })
    rerender({ value: 'b' })
    rerender({ value: 'c' })
    expect(result.current).toBe('b')
  })

  it('works with numbers', () => {
    const { result, rerender } = renderHook(({ value }: { value: number }) => usePrevious(value), {
      initialProps: { value: 0 },
    })
    rerender({ value: 42 })
    expect(result.current).toBe(0)
  })

  it('works with objects (reference equality)', () => {
    const obj1 = { x: 1 }
    const obj2 = { x: 2 }
    const { result, rerender } = renderHook(({ value }: { value: object }) => usePrevious(value), {
      initialProps: { value: obj1 },
    })
    rerender({ value: obj2 })
    expect(result.current).toBe(obj1)
  })
})
