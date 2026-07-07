import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { useColorScheme } from 'nativewind'

import { queryClient } from '@/lib/queryClient'

import type { ReactNode } from 'react'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  // useColorScheme from nativewind — reads the scheme NativeWind actually uses for dark: variants
  const { colorScheme } = useColorScheme()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <View className="flex-1" style={{ colorScheme }}>
            {children}
          </View>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
