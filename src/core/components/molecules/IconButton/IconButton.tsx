import { Pressable } from 'react-native'

import { cn } from '@/core/utils/cn'
import { Icon } from '@/core/components/atoms/Icon'

import type { IconName } from '@/core/components/atoms/Icon'

export type IconButtonProps = {
  icon: IconName
  onPress: () => void
  size?: number
  color?: string
  strokeWidth?: number
  isDisabled?: boolean
  accessibilityLabel: string
  className?: string
}

const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 }

export function IconButton({
  icon,
  onPress,
  size = 20,
  color = '#171717',
  strokeWidth = 1.75,
  isDisabled = false,
  accessibilityLabel,
  className,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled }}
      className={cn('items-center justify-center', isDisabled && 'opacity-40', className)}
    >
      <Icon name={icon} size={size} color={color} strokeWidth={strokeWidth} />
    </Pressable>
  )
}
