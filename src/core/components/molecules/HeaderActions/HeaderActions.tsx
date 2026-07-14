import { Pressable, View } from 'react-native'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@/core/components/atoms/Icon'

import type { IconName } from '@/core/components/atoms/Icon'

export type HeaderActionItem = {
  icon: IconName
  onPress: () => void
  accessibilityLabel: string
}

export type HeaderActionsProps = {
  /** Sağ üstte sabit duran aksiyon butonları (bildirim, yeni ilan vb.) */
  actions: HeaderActionItem[]
}

const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 }

/** BackButton ile birebir aynı görsel dil: w-10 daire, aynı zemin ve tema bazlı ikon rengi */
export function HeaderActions({ actions }: HeaderActionsProps) {
  const insets = useSafeAreaInsets()
  const { colorScheme } = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#F5F5F7' : '#171717'

  return (
    <View
      style={{
        position: 'absolute',
        top: insets.top + 8,
        right: 16,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {actions.map((action) => (
        <Pressable
          key={action.accessibilityLabel}
          onPress={action.onPress}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={action.accessibilityLabel}
          className="w-10 h-10 rounded-full items-center justify-center bg-white dark:bg-dark-elevated active:bg-neutral-100 dark:active:bg-dark-control"
        >
          <Icon name={action.icon} size={20} color={iconColor} />
        </Pressable>
      ))}
    </View>
  )
}
