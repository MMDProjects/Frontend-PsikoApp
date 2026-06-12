import { act, renderHook } from '@testing-library/react-native'
import { AppState } from 'react-native'

import { useAppState } from './useAppState'

describe('useAppState', () => {
  let stateChangeListener: ((state: string) => void) | null = null
  const removeMock = jest.fn()

  beforeEach(() => {
    stateChangeListener = null
    removeMock.mockClear()
    jest.spyOn(AppState, 'addEventListener').mockImplementation(
      // REASON: test stub captures the change listener without full NativeEventSubscription type
      ((event: string, handler: (state: unknown) => void) => {
        if (event === 'change') stateChangeListener = handler as typeof stateChangeListener
        return { remove: removeMock }
      }) as unknown as typeof AppState.addEventListener
    )
  })

  afterEach(() => jest.restoreAllMocks())

  it('initializes with a defined appState', () => {
    const { result } = renderHook(() => useAppState())
    // AppState.currentState in the test env may be undefined or 'active'
    // Just verify the hook captures it without throwing
    expect(result.current).toHaveProperty('appState')
    expect(result.current).toHaveProperty('isActive')
    expect(result.current).toHaveProperty('isBackground')
  })

  it('isActive is true when appState is active', () => {
    const { result } = renderHook(() => useAppState())
    act(() => {
      stateChangeListener?.('active')
    })
    expect(result.current.isActive).toBe(true)
    expect(result.current.isBackground).toBe(false)
  })

  it('isBackground is true when appState is background', () => {
    const { result } = renderHook(() => useAppState())
    act(() => {
      stateChangeListener?.('background')
    })
    expect(result.current.isBackground).toBe(true)
    expect(result.current.isActive).toBe(false)
  })

  it('reflects inactive state', () => {
    const { result } = renderHook(() => useAppState())
    act(() => {
      stateChangeListener?.('inactive')
    })
    expect(result.current.appState).toBe('inactive')
    expect(result.current.isActive).toBe(false)
    expect(result.current.isBackground).toBe(false)
  })

  it('removes listener on unmount', () => {
    const { unmount } = renderHook(() => useAppState())
    unmount()
    expect(removeMock).toHaveBeenCalledTimes(1)
  })
})
