import { useEffect } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { Icon, Input } from '@/core/components/atoms'
import { cn } from '@/core/utils/cn'

export type SearchBarProps = {
  value: string
  onChangeText: (text: string) => void
  onSearch?: (text: string) => void
  onClear?: () => void
  placeholder?: string
  isLoading?: boolean
  autoFocus?: boolean
  className?: string
}

const FADE_DURATION = 150

export function SearchBar({
  value,
  onChangeText,
  onSearch,
  onClear,
  placeholder = 'Search…',
  isLoading = false,
  autoFocus = false,
  className,
}: SearchBarProps) {
  const clearOpacity = useSharedValue(value.length > 0 ? 1 : 0)

  useEffect(() => {
    clearOpacity.value = withTiming(value.length > 0 ? 1 : 0, { duration: FADE_DURATION })
  }, [value, clearOpacity])

  // Animated style for clear button fade — style prop required for Reanimated
  const animatedClearStyle = useAnimatedStyle(() => ({
    opacity: clearOpacity.value,
  }))

  const handleClear = () => {
    onChangeText('')
    onClear?.()
  }

  const rightElement = (() => {
    if (isLoading) {
      return <ActivityIndicator size="small" color="#737373" />
    }
    if (value.length > 0) {
      return (
        <Animated.View style={animatedClearStyle}>
          <Pressable
            onPress={handleClear}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            className="p-1"
          >
            <Icon name="X" size={16} color="#737373" />
          </Pressable>
        </Animated.View>
      )
    }
    return null
  })()

  return (
    <View className={cn('w-full', className)}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoFocus={autoFocus}
        keyboardType="web-search"
        autoCapitalize="none"
        returnKeyType="search"
        onSubmitEditing={() => onSearch?.(value)}
        leftElement={<Icon name="Search" size={18} color="#737373" />}
        rightElement={rightElement ?? undefined}
      />
    </View>
  )
}
