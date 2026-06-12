import { View } from 'react-native'

import { Badge } from '@/core/components/atoms/Badge'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

export type PriceDisplayProps = {
  amount: number
  currency?: string
  originalAmount?: number
  period?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'prominent' | 'compact'
  className?: string
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

function calcDiscount(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100)
}

const amountClass = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl',
} as const

const strikeClass = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-xl',
} as const

export function PriceDisplay({
  amount,
  currency = 'TRY',
  originalAmount,
  period,
  size = 'md',
  variant = 'default',
  className,
}: PriceDisplayProps) {
  const formatted = formatCurrency(amount, currency)
  const discount = originalAmount ? calcDiscount(originalAmount, amount) : undefined

  if (variant === 'compact') {
    return (
      <View className={cn('flex-row items-center gap-1.5', className)}>
        <Text variant="label" className={cn('font-bold text-content-primary', amountClass[size])}>
          {formatted}
        </Text>
        {originalAmount && (
          <Text
            variant="caption"
            color="secondary"
            className={cn('line-through', strikeClass[size])}
          >
            {formatCurrency(originalAmount, currency)}
          </Text>
        )}
        {period && (
          <Text variant="caption" color="secondary">
            /{period}
          </Text>
        )}
        {discount !== undefined && discount > 0 && (
          <Badge label={`%${discount}`} variant="success" size="sm" />
        )}
      </View>
    )
  }

  return (
    <View className={cn('gap-0.5', className)}>
      <View className="flex-row items-end gap-2 flex-wrap">
        <Text
          variant={variant === 'prominent' ? 'display' : 'body'}
          className={cn(
            'font-bold text-content-primary',
            variant !== 'prominent' && amountClass[size]
          )}
        >
          {formatted}
        </Text>

        {period && (
          <Text variant="caption" color="secondary" className="mb-0.5">
            /{period}
          </Text>
        )}

        {discount !== undefined && discount > 0 && (
          <Badge label={`%${discount}`} variant="success" size="sm" className="mb-0.5" />
        )}
      </View>

      {originalAmount && (
        <Text variant="caption" color="secondary" className={cn('line-through', strikeClass[size])}>
          {formatCurrency(originalAmount, currency)}
        </Text>
      )}
    </View>
  )
}
