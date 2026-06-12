import { createContext, useContext } from 'react'
import { useColorScheme, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/queryClient'

import type { ReactNode } from 'react'

type ColorScheme = 'light' | 'dark'

type ThemeContextValue = {
  colorScheme: ColorScheme
}

const ThemeContext = createContext<ThemeContextValue>({ colorScheme: 'light' })

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const system = useColorScheme()
  const colorScheme: ColorScheme = system === 'dark' ? 'dark' : 'light'

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeContext.Provider value={{ colorScheme }}>
            {/* NativeWind v4 reads system preference via useColorScheme automatically.
                This View exists as the semantic root for future data-theme overrides. */}
            <View className="flex-1">{children}</View>
          </ThemeContext.Provider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
