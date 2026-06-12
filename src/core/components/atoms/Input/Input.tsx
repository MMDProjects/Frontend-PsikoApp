import { forwardRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { Eye, EyeOff, X } from 'lucide-react-native'

import { cn } from '@/core/utils/cn'

import type { ComponentType } from 'react'
import type { TextInputProps } from 'react-native'
import type { SvgProps } from 'react-native-svg'

// lucide-react-native exports RefAttributes<SVGSVGElement> which clashes with RN SVG props.
// We cast to the actual runtime shape: SvgProps + size.
type IconProps = Pick<SvgProps, 'stroke'> & { size?: number }
const EyeIcon = Eye as ComponentType<IconProps>
const EyeOffIcon = EyeOff as ComponentType<IconProps>
const XIcon = X as ComponentType<IconProps>

export type InputState = 'default' | 'focused' | 'error' | 'success' | 'disabled'
export type InputSize = 'sm' | 'md' | 'lg'

export type InputProps = {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  state?: InputState
  size?: InputSize
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  isSecure?: boolean
  multiline?: boolean
  maxLength?: number
  autoCapitalize?: TextInputProps['autoCapitalize']
  keyboardType?: TextInputProps['keyboardType']
  returnKeyType?: TextInputProps['returnKeyType']
  autoFocus?: boolean
  onFocus?: TextInputProps['onFocus']
  onBlur?: TextInputProps['onBlur']
  onSubmitEditing?: TextInputProps['onSubmitEditing']
  className?: string
}

const MULTILINE_MAX_HEIGHT = 120

const containerStateStyles: Record<InputState, string> = {
  default:  'border border-border bg-surface-raised',
  focused:  'border-2 border-sky-400 bg-surface-raised',
  error:    'border-2 border-semantic-error bg-semantic-error-light',
  success:  'border-2 border-semantic-success bg-surface-raised',
  disabled: 'border border-border bg-surface-sunken opacity-40',
}

const containerSizeStyles: Record<InputSize, string> = {
  sm: 'min-h-9 px-3 rounded-md',
  md: 'min-h-11 px-3.5 rounded-lg',
  lg: 'min-h-13 px-4 rounded-xl',
}

const textSizeStyles: Record<InputSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-base',
}

const ICON_SIZE: Record<InputSize, number> = { sm: 16, md: 18, lg: 20 }
const ICON_COLOR = { default: '#737373', error: '#DC2626', success: '#16A34A' }

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    value,
    onChangeText,
    placeholder,
    state = 'default',
    size = 'md',
    leftElement,
    rightElement,
    isSecure = false,
    multiline = false,
    maxLength,
    autoCapitalize,
    keyboardType,
    onFocus,
    onBlur,
    className,
    autoFocus,
    returnKeyType,
    onSubmitEditing,
  }: InputProps,
  ref
) {
  const [isFocused, setIsFocused] = useState(false)
  const [isSecureVisible, setIsSecureVisible] = useState(false)

  const effectiveState: InputState = (() => {
    if (state === 'error' || state === 'success' || state === 'disabled') return state
    return isFocused ? 'focused' : 'default'
  })()

  const isDisabled = state === 'disabled'
  const iconColor =
    state === 'error'
      ? ICON_COLOR.error
      : state === 'success'
        ? ICON_COLOR.success
        : ICON_COLOR.default
  const iconSize = ICON_SIZE[size]

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const toggleSecure = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined)
    setIsSecureVisible((v) => !v)
  }

  const showClearButton =
    !rightElement && !isSecure && value.length > 0 && !isDisabled && !multiline
  const showSecureToggle = isSecure && !rightElement

  const resolvedRightElement = (() => {
    if (rightElement) return rightElement
    if (showSecureToggle) {
      return (
        <Pressable
          onPress={toggleSecure}
          accessibilityLabel={isSecureVisible ? 'Hide password' : 'Show password'}
          className="p-1"
        >
          {isSecureVisible ? (
            <EyeOffIcon size={iconSize} stroke={iconColor} />
          ) : (
            <EyeIcon size={iconSize} stroke={iconColor} />
          )}
        </Pressable>
      )
    }
    if (showClearButton) {
      return (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityLabel="Clear input"
          className="p-1"
        >
          <XIcon size={iconSize} stroke={iconColor} />
        </Pressable>
      )
    }
    return null
  })()

  return (
    <View
      className={cn(
        'flex-row items-center',
        containerStateStyles[effectiveState],
        containerSizeStyles[size],
        multiline && 'items-start py-2.5',
        className
      )}
    >
      {leftElement && <View className="mr-2">{leftElement}</View>}

      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A3A3A3"
        editable={!isDisabled}
        secureTextEntry={isSecure && !isSecureVisible}
        multiline={multiline}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={handleFocus}
        onBlur={handleBlur}
        // maxHeight is a Reanimated/multiline behavior constraint — cannot be a static Tailwind class
        style={multiline ? { maxHeight: MULTILINE_MAX_HEIGHT } : undefined}
        className={cn(
          'flex-1 text-content-primary p-0',
          textSizeStyles[size],
          multiline && 'align-top'
        )}
      />

      {resolvedRightElement && <View className="ml-2">{resolvedRightElement}</View>}
    </View>
  )
})
