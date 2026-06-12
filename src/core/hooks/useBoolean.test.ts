import { act, renderHook } from '@testing-library/react-native'

import { useBoolean } from './useBoolean'

describe('useBoolean', () => {
  it('defaults to false when no initial value given', () => {
    const { result } = renderHook(() => useBoolean())
    expect(result.current.value).toBe(false)
  })

  it('uses provided initial value', () => {
    const { result } = renderHook(() => useBoolean(true))
    expect(result.current.value).toBe(true)
  })

  it('toggle flips true → false', () => {
    const { result } = renderHook(() => useBoolean(true))
    act(() => result.current.toggle())
    expect(result.current.value).toBe(false)
  })

  it('toggle flips false → true', () => {
    const { result } = renderHook(() => useBoolean(false))
    act(() => result.current.toggle())
    expect(result.current.value).toBe(true)
  })

  it('setTrue sets value to true regardless of current state', () => {
    const { result } = renderHook(() => useBoolean(false))
    act(() => result.current.setTrue())
    expect(result.current.value).toBe(true)
    act(() => result.current.setTrue())
    expect(result.current.value).toBe(true)
  })

  it('setFalse sets value to false regardless of current state', () => {
    const { result } = renderHook(() => useBoolean(true))
    act(() => result.current.setFalse())
    expect(result.current.value).toBe(false)
    act(() => result.current.setFalse())
    expect(result.current.value).toBe(false)
  })

  it('helpers are stable between renders', () => {
    const { result, rerender } = renderHook(() => useBoolean())
    const { toggle, setTrue, setFalse } = result.current
    rerender({})
    expect(result.current.toggle).toBe(toggle)
    expect(result.current.setTrue).toBe(setTrue)
    expect(result.current.setFalse).toBe(setFalse)
  })
})
