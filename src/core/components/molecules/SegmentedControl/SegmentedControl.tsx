import { Pressable, View } from 'react-native'

import { cn } from '@/core/utils/cn'
import { Text } from '@/core/components/atoms/Text'

export type SegmentedControlOption<T extends string> = {
  key: T
  label: string
}

export type SegmentedControlProps<T extends string> = {
  options: Array<SegmentedControlOption<T>>
  value: T
  onChange: (key: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    // p-1 (dış) + py-1 (segment) = filtre chip'lerindeki (size="md") py-2 ile aynı dikey yükseklik
    // iOS Health pattern: seçili segment = zeminden ayrışan düz beyaz/koyu kart (gölgesiz), metin nötr — mavi vurgu yok
    <View className={cn('flex-row gap-1 bg-neutral-200 dark:bg-neutral-800 rounded-xl p-1', className)}>
      {options.map(({ key, label }) => {
        const isActive = value === key
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={cn(
              'flex-1 items-center justify-center py-1 rounded-lg',
              isActive && 'bg-white dark:bg-dark-control'
            )}
          >
            <Text
              variant="label"
              className={cn(
                'font-medium',
                isActive ? 'text-neutral-900 dark:text-[#F5F5F7]' : 'text-neutral-500 dark:text-neutral-400'
              )}
            >
              {label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
