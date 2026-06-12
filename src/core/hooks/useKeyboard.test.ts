import { act, renderHook } from '@testing-library/react-native'
import { Keyboard } from 'react-native'

import type { EmitterSubscription } from 'react-native'

import { useKeyboard } from './useKeyboard'

describe('useKeyboard', () => {
  let showCallback: ((e: { endCoordinates: { height: number } }) => void) | null = null
  let hideCallback: (() => void) | null = null

  beforeEach(() => {
    showCallback = null
    hideCallback = null
    jest.spyOn(Keyboard, 'addListener').mockImplementation(
      // REASON: test stub captures callbacks without satisfying full EmitterSubscription type
      ((event: string, handler: (e: unknown) => void) => {
        if (event === 'keyboardDidShow') showCallback = handler as typeof showCallback
        if (event === 'keyboardDidHide') hideCallback = handler as typeof hideCallback
        return { remove: jest.fn() }
      }) as unknown as typeof Keyboard.addListener
    )
  })

  afterEach(() => jest.restoreAllMocks())

  it('starts with keyboard hidden', () => {
    const { result } = renderHook(() => useKeyboard())
    expect(result.current.isVisible).toBe(false)
    expect(result.current.height).toBe(0)
  })

  it('exposes a dismiss function', () => {
    const { result } = renderHook(() => useKeyboard())
    expect(typeof result.current.dismiss).toBe('function')
  })

  it('updates isVisible and height on keyboardDidShow', () => {
    const { result } = renderHook(() => useKeyboard())
    act(() => {
      showCallback?.({ endCoordinates: { height: 336 } })
    })
    expect(result.current.isVisible).toBe(true)
    expect(result.current.height).toBe(336)
  })

  it('resets state on keyboardDidHide', () => {
    const { result } = renderHook(() => useKeyboard())
    act(() => {
      showCallback?.({ endCoordinates: { height: 336 } })
    })
    act(() => {
      hideCallback?.()
    })
    expect(result.current.isVisible).toBe(false)
    expect(result.current.height).toBe(0)
  })

  it('removes listeners on unmount', () => {
    const removeMock = jest.fn()
    jest
      .spyOn(Keyboard, 'addListener')
      .mockReturnValue({ remove: removeMock } as unknown as EmitterSubscription)
    const { unmount } = renderHook(() => useKeyboard())
    unmount()
    expect(removeMock).toHaveBeenCalledTimes(2)
  })
})
