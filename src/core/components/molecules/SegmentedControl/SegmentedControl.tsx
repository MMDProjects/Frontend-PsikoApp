import { Pressable, View } from 'react-native'

import { cn } from '@/core/utils/cn'
import { Text } from '@/core/components/atoms/Text'

export type SegmentedControlOption<T extends string> = {
  key: T
  label: string
  /** 0'dan büyükse sky rozet içinde gösterilir */
  count?: number
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
    <View className={cn('flex-row gap-1 bg-neutral-200 dark:bg-neutral-800 rounded-xl p-1', className)}>
      {options.map(({ key, label, count }) => {
        const isActive = value === key
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={cn(
              'flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg',
              isActive
                ? 'bg-white dark:bg-neutral-700'
                : 'active:bg-neutral-300 dark:active:bg-neutral-700'
            )}
          >
            <Text
              variant="label"
              className={isActive ? 'font-semibold text-neutral-900 dark:text-white' : 'font-medium'}
              color={isActive ? undefined : 'secondary'}
            >
              {label}
            </Text>
            {(count ?? 0) > 0 && (
              <View className="w-5 h-5 rounded-full bg-sky-500 items-center justify-center">
                <Text variant="caption" className="text-white text-[10px] font-semibold">{count}</Text>
              </View>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}
