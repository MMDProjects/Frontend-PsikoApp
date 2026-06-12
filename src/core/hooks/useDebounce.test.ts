import { act, renderHook } from '@testing-library/react-native'

import { useDebounce } from './useDebounce'

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('does not update before delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    )
    rerender({ value: 'world', delay: 300 })
    expect(result.current).toBe('hello')
  })

  it('updates after delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    )
    rerender({ value: 'world', delay: 300 })
    act(() => jest.advanceTimersByTime(300))
    expect(result.current).toBe('world')
  })

  it('resets timer on each value change', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    )
    rerender({ value: 'b' })
    act(() => jest.advanceTimersByTime(200))
    rerender({ value: 'c' })
    act(() => jest.advanceTimersByTime(200))
    expect(result.current).toBe('a') // not yet updated
    act(() => jest.advanceTimersByTime(100))
    expect(result.current).toBe('c')
  })

  it('works with numbers', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useDebounce(value, 100),
      { initialProps: { value: 0 } }
    )
    rerender({ value: 42 })
    act(() => jest.advanceTimersByTime(100))
    expect(result.current).toBe(42)
  })
})
