import { View } from 'react-native'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react-native'

import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

import type { ComponentType, ReactNode } from 'react'
import type { SvgProps } from 'react-native-svg'

type IconProps = Pick<SvgProps, 'stroke'> & { size?: number }
const TrendUpIcon = TrendingUp as ComponentType<IconProps>
const TrendDownIcon = TrendingDown as ComponentType<IconProps>
const NeutralIcon = Minus as ComponentType<IconProps>

type Trend = {
  value: number
  direction: 'up' | 'down' | 'neutral'
}

export type StatCardProps = {
  value: string | number
  label: string
  subLabel?: string
  trend?: Trend
  accentColor?: string
  icon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const valueSizeClass = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
} as const

const labelVariant = {
  sm: 'caption' as const,
  md: 'label' as const,
  lg: 'body' as const,
}

// Semantic colors — cannot be expressed as static Tailwind classes because they're keyed by direction
const TREND_COLOR = {
  up: '#16A34A',
  down: '#DC2626',
  neutral: '#737373',
}

const TREND_ICON = {
  up: TrendUpIcon,
  down: TrendDownIcon,
  neutral: NeutralIcon,
} as const

export function StatCard({
  value,
  label,
  subLabel,
  trend,
  accentColor,
  icon,
  size = 'md',
  className,
}: StatCardProps) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null
  const trendColor = trend ? TREND_COLOR[trend.direction] : undefined
  const trendLabel = trend ? `${trend.value > 0 ? '+' : ''}${trend.value}%` : undefined

  return (
    <View
      className={cn('bg-surface-raised rounded-xl p-4 border border-neutral-100', className)}
      // accentColor cannot be expressed as a static Tailwind class
      style={accentColor ? { borderLeftWidth: 3, borderLeftColor: accentColor } : undefined}
    >
      {icon && <View className="mb-2">{icon}</View>}

      <Text
        variant="body"
        className={cn(
          'font-display font-bold text-content-primary leading-tight',
          valueSizeClass[size]
        )}
      >
        {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
      </Text>

      {trend && TrendIcon && trendColor && (
        <View className="flex-row items-center gap-1 mt-1">
          <TrendIcon size={14} stroke={trendColor} />
          {/* trendColor is runtime-determined — cannot use a static Tailwind class */}
          <Text variant="caption" style={{ color: trendColor }}>
            {trendLabel}
          </Text>
        </View>
      )}

      <Text variant={labelVariant[size]} color="secondary" className="mt-1">
        {label}
      </Text>

      {subLabel && (
        <Text variant="caption" color="tertiary" className="mt-0.5">
          {subLabel}
        </Text>
      )}
    </View>
  )
}
