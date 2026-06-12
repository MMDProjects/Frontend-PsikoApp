import { useEffect, useState } from 'react'
import { AppState } from 'react-native'

import type { AppStateStatus } from 'react-native'

type AppStateReturn = {
  appState: AppStateStatus
  isActive: boolean
  isBackground: boolean
}

export function useAppState(): AppStateReturn {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)

  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState)
    return () => sub.remove()
  }, [])

  return {
    appState,
    isActive: appState === 'active',
    isBackground: appState === 'background',
  }
}
