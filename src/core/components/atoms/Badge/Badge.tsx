import { View } from 'react-native'

import { cn } from '@/core/utils/cn'
import { Text } from '@/core/components/atoms/Text'

import type { ReactNode } from 'react'

export type BadgeVariant = 'brand' | 'accent' | 'success' | 'warning' | 'error' | 'neutral'
export type BadgeSize = 'sm' | 'md'

export type BadgeProps = {
  label: string
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  icon?: ReactNode
  className?: string
}

const containerVariantStyles: Record<BadgeVariant, string> = {
  brand: 'bg-brand-subtle border border-brand-border',
  accent: 'bg-accent-subtle border border-accent-border',
  success: 'bg-semantic-success-light',
  warning: 'bg-semantic-warning-light',
  error: 'bg-semantic-error-light',
  neutral: 'bg-neutral-100',
}

const textVariantStyles: Record<BadgeVariant, string> = {
  brand: 'text-brand-text',
  accent: 'text-accent-text',
  success: 'text-semantic-success-dark',
  warning: 'text-semantic-warning-dark',
  error: 'text-semantic-error-dark',
  neutral: 'text-neutral-700',
}

const dotVariantStyles: Record<BadgeVariant, string> = {
  brand: 'bg-brand',
  accent: 'bg-accent',
  success: 'bg-semantic-success',
  warning: 'bg-semantic-warning',
  error: 'bg-semantic-error',
  neutral: 'bg-neutral-500',
}

const containerSizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 gap-1',
  md: 'px-2.5 py-1 gap-1.5',
}

export function Badge({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  className,
}: BadgeProps) {
  return (
    <View
      className={cn(
        'flex-row items-center self-start rounded-full',
        containerVariantStyles[variant],
        containerSizeStyles[size],
        className
      )}
      accessibilityRole="text"
    >
      {dot && (
        <View
          className={cn(
            'rounded-full',
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            dotVariantStyles[variant]
          )}
        />
      )}
      {icon}
      <Text variant={size === 'sm' ? 'caption' : 'label'} className={textVariantStyles[variant]}>
        {label}
      </Text>
    </View>
  )
}
