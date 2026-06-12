import { Pressable } from 'react-native'

import { cn } from '@/core/utils/cn'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

import type { IconName } from '@/core/components/atoms/Icon'

export type IconButtonVariant = 'circle' | 'square'

export type IconButtonProps = {
  icon: IconName
  onPress: () => void
  size?: number
  color?: string
  strokeWidth?: number
  isDisabled?: boolean
  accessibilityLabel: string
  label?: string
  variant?: IconButtonVariant
  className?: string
}

const variantStyles: Record<IconButtonVariant, string> = {
  circle: 'rounded-full',
  square: 'rounded-xl',
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
  label,
  variant = 'circle',
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
      className={cn(
        'items-center justify-center p-2 active:bg-sky-50',
        variantStyles[variant],
        isDisabled && 'opacity-40',
        className
      )}
    >
      <Icon name={icon} size={size} color={color} strokeWidth={strokeWidth} />
      {label && (
        <Text variant="caption" color="secondary" className="mt-1">
          {label}
        </Text>
      )}
    </Pressable>
  )
}
