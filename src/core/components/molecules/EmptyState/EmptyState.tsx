import { View } from 'react-native'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

import type { IconName } from '@/core/components/atoms/Icon'

export type EmptyStateProps = {
  icon?: IconName
  title: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
  className?: string
}

export function EmptyState({
  icon = 'Inbox',
  title,
  description,
  ctaLabel,
  onCta,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn('flex-1 items-center justify-center px-8 py-12', className)}>
      <View className="w-20 h-20 rounded-full bg-neutral-100 items-center justify-center mb-4">
        <Icon name={icon} size={36} color="#A3A3A3" strokeWidth={1.5} />
      </View>

      <View className="items-center gap-2 mb-6">
        <Text variant="subheading" align="center">
          {title}
        </Text>
        {description && (
          <Text variant="body" color="secondary" align="center">
            {description}
          </Text>
        )}
      </View>

      {ctaLabel && onCta && (
        <Button label={ctaLabel} onPress={onCta} variant="secondary" />
      )}
    </View>
  )
}
