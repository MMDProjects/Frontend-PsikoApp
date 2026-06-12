import { View } from 'react-native'

import { cn } from '@/core/utils/cn'
import { Text } from '@/core/components/atoms/Text'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerColor = 'default' | 'muted' | 'strong' | 'brand'
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg'

export type DividerProps = {
  orientation?: DividerOrientation
  color?: DividerColor
  spacing?: DividerSpacing
  label?: string
}

const colorStyles: Record<DividerColor, string> = {
  default: 'bg-border',
  muted: 'bg-border-muted',
  strong: 'bg-border-strong',
  brand: 'bg-brand-border',
}

const spacingStyles: Record<DividerSpacing, string> = {
  none: '',
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-6',
}

const spacingVerticalStyles: Record<DividerSpacing, string> = {
  none: '',
  sm: 'mx-2',
  md: 'mx-4',
  lg: 'mx-6',
}

export function Divider({
  orientation = 'horizontal',
  color = 'default',
  spacing = 'md',
  label,
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <View
        className={cn('w-px self-stretch', colorStyles[color], spacingVerticalStyles[spacing])}
        accessibilityRole="none"
      />
    )
  }

  if (label) {
    return (
      <View className={cn('flex-row items-center gap-3', spacingStyles[spacing])}>
        <View className={cn('flex-1 h-px', colorStyles[color])} />
        <Text variant="caption" color="tertiary">
          {label}
        </Text>
        <View className={cn('flex-1 h-px', colorStyles[color])} />
      </View>
    )
  }

  return (
    <View
      className={cn('w-full h-px', colorStyles[color], spacingStyles[spacing])}
      accessibilityRole="none"
    />
  )
}
