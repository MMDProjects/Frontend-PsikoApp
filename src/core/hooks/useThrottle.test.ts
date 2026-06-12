import { act, renderHook } from '@testing-library/react-native'

import { useThrottle } from './useThrottle'

beforeEach(() => {
  jest.useFakeTimers()
  jest.setSystemTime(0)
})
afterEach(() => {
  jest.useRealTimers()
  jest.restoreAllMocks()
})

describe('useThrottle', () => {
  it('calls the function immediately on first invocation', () => {
    const fn = jest.fn()
    const { result } = renderHook(() => useThrottle(fn, 300))
    act(() => {
      jest.setSystemTime(1000)
      result.current('arg')
    })
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('arg')
  })

  it('suppresses calls within the delay window', () => {
    const fn = jest.fn()
    const { result } = renderHook(() => useThrottle(fn, 300))
    act(() => {
      jest.setSystemTime(1000)
      result.current()
      jest.setSystemTime(1100)
      result.current()
      jest.setSystemTime(1200)
      result.current()
    })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('allows a second call after the delay window', () => {
    const fn = jest.fn()
    const { result } = renderHook(() => useThrottle(fn, 300))
    act(() => {
      jest.setSystemTime(1000)
      result.current()
      jest.setSystemTime(1400)
      result.current()
    })
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('always uses the latest fn reference', () => {
    const fn1 = jest.fn()
    const fn2 = jest.fn()
    const { result, rerender } = renderHook(({ fn }: { fn: jest.Mock }) => useThrottle(fn, 300), {
      initialProps: { fn: fn1 },
    })
    act(() => {
      jest.setSystemTime(1000)
      result.current()
    })
    rerender({ fn: fn2 })
    act(() => {
      jest.setSystemTime(2000)
      result.current()
    })
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
  })

  it('returns a stable function reference when delay unchanged', () => {
    const fn = jest.fn()
    const { result, rerender } = renderHook(({ fn: f }: { fn: jest.Mock }) => useThrottle(f, 300), {
      initialProps: { fn },
    })
    const first = result.current
    rerender({ fn })
    expect(result.current).toBe(first)
  })
})
