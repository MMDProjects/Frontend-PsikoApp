import { Pressable, View } from 'react-native'

import { cn } from '@/core/utils/cn'
import { Text } from '@/core/components/atoms/Text'

export type SectionHeaderProps = {
  title: string
  /** Sağdaki aksiyon linki (örn. "Tümünü Gör") */
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function SectionHeader({ title, actionLabel, onAction, className }: SectionHeaderProps) {
  return (
    <View className={cn('px-4 pt-4 pb-2 flex-row items-center justify-between', className)}>
      <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
        {title}
      </Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} className="active:opacity-60">
          <Text variant="caption" className="text-sky-500 font-semibold">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  )
}
