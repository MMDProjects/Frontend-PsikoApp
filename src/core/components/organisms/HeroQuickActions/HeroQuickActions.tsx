import { Pressable, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

import type { IconName } from '@/core/components/atoms/Icon'

export type HeroQuickAction = {
  icon: IconName
  label: string
  /** 0'dan büyükse tile köşesinde beyaz rozet içinde gösterilir */
  badge?: number
  onPress?: () => void
}

export type HeroQuickActionsProps = {
  /** Hero (sky) zemin üzerinde eşit genişlikte kısayol tile'ları */
  actions: HeroQuickAction[]
}

export function HeroQuickActions({ actions }: HeroQuickActionsProps) {
  return (
    <View className="flex-row gap-2.5">
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={action.onPress}
          disabled={!action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          className="flex-1 bg-white/20 dark:bg-white/10 border border-white/25 dark:border-white/10 rounded-2xl items-center gap-2 py-3 px-1 active:opacity-80"
        >
          {/* İkon çapası + rozet */}
          <View>
            <View className="w-11 h-11 rounded-full bg-white/25 dark:bg-white/15 items-center justify-center">
              <Icon name={action.icon} size={20} color="#FFFFFF" />
            </View>
            {(action.badge ?? 0) > 0 && (
              <View
                className="absolute bg-white rounded-full min-w-5 h-5 items-center justify-center px-1"
                style={{ top: -4, right: -6 }}
              >
                <Text variant="caption" className="text-sky-600 text-[10px] font-bold">
                  {action.badge}
                </Text>
              </View>
            )}
          </View>

          <Text
            variant="caption"
            className="text-white font-semibold text-center"
            numberOfLines={1}
          >
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
