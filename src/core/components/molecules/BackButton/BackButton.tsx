import { Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColorScheme } from 'nativewind'

import { cn } from '@/core/utils/cn'
import { Icon } from '@/core/components/atoms/Icon'

export type BackButtonVariant = 'floating' | 'overlay' | 'inline'

export type BackButtonProps = {
  variant?: BackButtonVariant
  onPress?: () => void
  className?: string
}

const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 }

export function BackButton({ variant = 'floating', onPress, className }: BackButtonProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  const isAbsolute = variant === 'floating' || variant === 'overlay'
  const arrowColor = variant === 'overlay' ? '#FFFFFF' : isDark ? '#F5F5F7' : '#171717'

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel="Geri"
      style={isAbsolute ? { position: 'absolute', top: insets.top + 8, left: 16, zIndex: 10 } : undefined}
      className={cn(
        'w-10 h-10 rounded-full items-center justify-center',
        variant === 'overlay'
          ? 'bg-black/35 active:bg-black/50'
          : 'bg-white dark:bg-dark-elevated active:bg-neutral-100 dark:active:bg-dark-control',
        className
      )}
    >
      <Icon name="ArrowLeft" size={20} color={arrowColor} />
    </Pressable>
  )
}
