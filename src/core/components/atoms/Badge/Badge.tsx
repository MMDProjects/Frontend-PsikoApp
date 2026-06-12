import { View } from 'react-native'

import { cn } from '@/core/utils/cn'
import { Text } from '@/core/components/atoms/Text'

import type { ReactNode } from 'react'

// PsikoAl variant spec: sky | sage | warning | error | neutral
// + success/info semantic aliases kept for programmatic use
export type BadgeVariant = 'sky' | 'sage' | 'warning' | 'error' | 'neutral' | 'success' | 'info'
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
  sky:     'bg-sky-50 border border-sky-200',
  sage:    'bg-green-50 border border-green-200',
  warning: 'bg-semantic-warning-light',
  error:   'bg-semantic-error-light',
  neutral: 'bg-neutral-100',
  success: 'bg-semantic-success-light',
  info:    'bg-sky-50 border border-sky-200',
}

const textVariantStyles: Record<BadgeVariant, string> = {
  sky:     'text-sky-700',
  sage:    'text-green-700',
  warning: 'text-semantic-warning-dark',
  error:   'text-semantic-error-dark',
  neutral: 'text-neutral-700',
  success: 'text-semantic-success-dark',
  info:    'text-sky-700',
}

const dotVariantStyles: Record<BadgeVariant, string> = {
  sky:     'bg-sky-500',
  sage:    'bg-green-500',
  warning: 'bg-semantic-warning',
  error:   'bg-semantic-error',
  neutral: 'bg-neutral-500',
  success: 'bg-semantic-success',
  info:    'bg-sky-400',
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
