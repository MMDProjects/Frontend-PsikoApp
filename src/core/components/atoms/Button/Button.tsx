import { ActivityIndicator, Pressable } from 'react-native'
import * as Haptics from 'expo-haptics'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { cn } from '@/core/utils/cn'
import { Text } from '@/core/components/atoms/Text'

import type { ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'link'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export type ButtonProps = {
  label: string
  onPress: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  isDisabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  className?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand active:bg-brand-hover shadow-sm',
  secondary: 'bg-brand-subtle border border-brand-border active:bg-brand-muted',
  ghost: 'border border-border active:bg-surface-sunken',
  danger: 'bg-semantic-error-light border border-semantic-error',
  accent: 'bg-accent active:bg-accent-hover shadow-sm',
  link: 'px-0',
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-8  px-3   rounded-md',
  sm: 'h-9  px-3.5 rounded-md',
  md: 'h-11 px-5   rounded-xl',
  lg: 'h-13 px-6   rounded-xl',
}

const labelVariantStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-brand-text',
  ghost: 'text-content-primary',
  danger: 'text-semantic-error-dark',
  accent: 'text-content-inverse',
  link: 'text-content-link underline',
}

const labelSizeStyles: Record<ButtonSize, 'xs' | 'sm' | 'base' | 'base'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'base',
  lg: 'base',
}

// ActivityIndicator requires a string color value, CSS variables are not supported
const indicatorColor: Record<ButtonVariant, string> = {
  primary: '#FFFFFF',
  secondary: '#404040',
  ghost: '#171717',
  danger: '#7F1D1D',
  accent: '#FFFFFF',
  link: '#404040',
}

const SPRING_CONFIG = { mass: 0.5, stiffness: 400, damping: 20 }

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
}: ButtonProps) {
  const scale = useSharedValue(1)

  // Animated style for press scale — style prop required for Reanimated transform
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.96, SPRING_CONFIG)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG)
  }

  const handlePress = () => {
    const hapticStyle =
      variant === 'ghost' || variant === 'link'
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    Haptics.impactAsync(hapticStyle).catch(() => undefined)
    onPress()
  }

  const disabled = isDisabled || isLoading

  return (
    <Animated.View
      // style prop required: Reanimated animated transform + dynamic fullWidth layout
      style={[animatedStyle, fullWidth ? { width: '100%' } : { alignSelf: 'flex-start' as const }]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled, busy: isLoading }}
        className={cn(
          'flex-row items-center justify-center gap-2',
          variantStyles[variant],
          sizeStyles[size],
          disabled && 'opacity-40',
          fullWidth && 'w-full',
          className
        )}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={indicatorColor[variant]}
            accessibilityLabel="Loading"
          />
        ) : (
          <>
            {leftIcon}
            <Text
              variant="label"
              className={cn(labelVariantStyles[variant], `text-${labelSizeStyles[size]}`)}
            >
              {label}
            </Text>
            {rightIcon}
          </>
        )}
      </Pressable>
    </Animated.View>
  )
}
