import { renderHook } from '@testing-library/react-native'

import { useMount } from './useMount'
import { useUnmount } from './useUnmount'

describe('useMount', () => {
  it('calls fn once on mount', () => {
    const fn = jest.fn()
    const { rerender } = renderHook(() => useMount(fn))
    rerender({})
    rerender({})
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('does not call fn after rerender with different fn reference', () => {
    const fn1 = jest.fn()
    const fn2 = jest.fn()
    let current = fn1
    const { rerender } = renderHook(() => useMount(current))
    current = fn2
    rerender({})
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(0)
  })
})

describe('useUnmount', () => {
  it('calls fn on unmount', () => {
    const fn = jest.fn()
    const { unmount } = renderHook(() => useUnmount(fn))
    expect(fn).not.toHaveBeenCalled()
    unmount()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('does not call fn on rerender', () => {
    const fn = jest.fn()
    const { rerender } = renderHook(() => useUnmount(fn))
    rerender({})
    rerender({})
    expect(fn).not.toHaveBeenCalled()
  })

  it('calls the latest fn reference on unmount', () => {
    const fn1 = jest.fn()
    const fn2 = jest.fn()
    let current = fn1
    const { rerender, unmount } = renderHook(() => useUnmount(current))
    current = fn2
    rerender({})
    unmount()
    expect(fn1).not.toHaveBeenCalled()
    expect(fn2).toHaveBeenCalledTimes(1)
  })
})
