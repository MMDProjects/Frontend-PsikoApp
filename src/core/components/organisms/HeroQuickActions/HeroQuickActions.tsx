import { Pressable, View } from 'react-native'
import { useColorScheme } from 'nativewind'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

import type { IconName } from '@/core/components/atoms/Icon'

export type HeroQuickAction = {
  icon: IconName
  label: string
  badge?: number
  onPress?: () => void
}

export type HeroQuickActionsProps = {
  actions: HeroQuickAction[]
}

export function HeroQuickActions({ actions }: HeroQuickActionsProps) {
  const { colorScheme } = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#7DD3FC' : '#0EA5E9'

  return (
    <View className="flex-row gap-2.5">
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={action.onPress}
          disabled={!action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          className="flex-1 bg-sky-100 dark:bg-sky-900 rounded-2xl items-center gap-2 py-3 px-1 active:opacity-80"
        >
          <View>
            <View className="w-11 h-11 rounded-full bg-white dark:bg-sky-950 items-center justify-center">
              <Icon name={action.icon} size={20} color={iconColor} />
            </View>
            {(action.badge ?? 0) > 0 && (
              <View
                className="absolute bg-sky-500 rounded-full min-w-5 h-5 items-center justify-center px-1"
                style={{ top: -4, right: -6 }}
              >
                <Text variant="caption" className="text-white text-[10px] font-bold">
                  {action.badge}
                </Text>
              </View>
            )}
          </View>

          <Text
            variant="caption"
            className="text-sky-800 dark:text-sky-100 font-semibold text-center"
            numberOfLines={1}
          >
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
