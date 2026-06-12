import { Pressable, View } from 'react-native'
import { X } from 'lucide-react-native'

import { cn } from '@/core/utils/cn'
import { Text } from '@/core/components/atoms/Text'

import type { ComponentType } from 'react'
import type { SvgProps } from 'react-native-svg'

// lucide-react-native has web SVG ref types — cast to the actual runtime shape
type IconProps = Pick<SvgProps, 'stroke'> & { size?: number }
const XIcon = X as ComponentType<IconProps>

export type ChipVariant = 'filter' | 'input'

export type ChipProps = {
  label: string
  isSelected?: boolean
  onPress?: () => void
  onRemove?: () => void
  isDisabled?: boolean
  variant?: ChipVariant
  className?: string
}

const filterUnselected = 'border border-neutral-200 bg-surface-raised'
const filterSelected   = 'border border-sky-200 bg-sky-50'
const inputStyle       = 'border border-sky-200 bg-sky-50'

export function Chip({
  label,
  isSelected = false,
  onPress,
  onRemove,
  isDisabled = false,
  variant = 'filter',
  className,
}: ChipProps) {
  const isFilter = variant === 'filter'
  const isInput = variant === 'input'

  const containerStyle = cn(
    'flex-row items-center self-start rounded-full px-3 py-1.5 gap-1.5',
    isFilter && (isSelected ? filterSelected : filterUnselected),
    isInput && inputStyle,
    isDisabled && 'opacity-40',
    className
  )

  const labelColor = 'secondary' as const

  const content = (
    <>
      <Text variant="label" color={labelColor}>
        {label}
      </Text>
      {isInput && onRemove && (
        <Pressable
          onPress={isDisabled ? undefined : onRemove}
          accessibilityLabel={`Remove ${label}`}
          accessibilityRole="button"
          disabled={isDisabled}
          className="ml-0.5"
        >
          <XIcon size={14} stroke="#525252" />
        </Pressable>
      )}
    </>
  )

  if (isFilter && onPress) {
    return (
      <Pressable
        onPress={isDisabled ? undefined : onPress}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled: isDisabled }}
        disabled={isDisabled}
        className={containerStyle}
      >
        {content}
      </Pressable>
    )
  }

  return (
    <View className={containerStyle} accessibilityRole="none">
      {content}
    </View>
  )
}
