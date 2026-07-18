import { RefreshControl } from 'react-native'

import { useThemeColors } from '@/core/theme'

export type AppRefreshControlProps = {
  refreshing: boolean
  onRefresh: () => void
}

export function AppRefreshControl({ refreshing, onRefresh }: AppRefreshControlProps) {
  const colors = useThemeColors()
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.brand}
      colors={[colors.brand]}
    />
  )
}
