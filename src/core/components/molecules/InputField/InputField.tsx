import { forwardRef } from 'react'
import { TextInput, View } from 'react-native'

import { Input, Text } from '@/core/components/atoms'
import { cn } from '@/core/utils/cn'

import type { InputProps, InputState } from '@/core/components/atoms'

export type InputFieldProps = Omit<InputProps, 'state' | 'className'> & {
  label?: string
  hint?: string
  errorMessage?: string
  successMessage?: string
  isRequired?: boolean
  isDisabled?: boolean
  className?: string // applied to the outer container
  inputClassName?: string // forwarded to Input
}

export const InputField = forwardRef<TextInput, InputFieldProps>(function InputField(
  {
    label,
    hint,
    errorMessage,
    successMessage,
    isRequired = false,
    isDisabled = false,
    className,
    inputClassName,
    ...inputProps
  },
  ref
) {
  const derivedState: InputState = (() => {
    if (isDisabled) return 'disabled'
    if (errorMessage) return 'error'
    if (successMessage) return 'success'
    return 'default'
  })()

  const subText = errorMessage ?? successMessage ?? hint

  const subTextColor = (() => {
    if (errorMessage) return 'error' as const
    if (successMessage) return 'success' as const
    return 'tertiary' as const
  })()

  return (
    <View className={cn('gap-1.5', className)}>
      {label && (
        <View className="flex-row items-center gap-0.5">
          <Text variant="label" color="secondary">
            {label}
          </Text>
          {isRequired && (
            <Text variant="label" color="error" className="leading-none">
              *
            </Text>
          )}
        </View>
      )}

      <Input ref={ref} state={derivedState} className={inputClassName} {...inputProps} />

      {subText && (
        <Text variant="caption" color={subTextColor}>
          {subText}
        </Text>
      )}
    </View>
  )
})
