import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'

type KeyboardState = {
  isVisible: boolean
  height: number
  dismiss: () => void
}

export function useKeyboard(): KeyboardState {
  const [isVisible, setIsVisible] = useState(false)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setIsVisible(true)
      setHeight(e.endCoordinates.height)
    })
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setIsVisible(false)
      setHeight(0)
    })
    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  return { isVisible, height, dismiss: Keyboard.dismiss }
}
