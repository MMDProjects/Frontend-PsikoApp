import { Text as RNText } from 'react-native'

import { cn } from '@/core/utils/cn'

import type { TextProps as RNTextProps } from 'react-native'

export type TextVariant =
  | 'display'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'label'
  | 'caption'
  | 'overline'
export type TextWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold'
export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'inverse'
  | 'brand'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
export type TextAlign = 'left' | 'center' | 'right'

export type TextProps = RNTextProps & {
  variant?: TextVariant
  weight?: TextWeight
  color?: TextColor
  align?: TextAlign
  className?: string
}

const variantStyles: Record<TextVariant, string> = {
  display: 'font-display text-5xl font-extrabold tracking-tight',
  heading: 'font-display text-3xl font-bold tracking-tight',
  subheading: 'font-body text-xl font-semibold',
  body: 'font-body text-base font-regular',
  label: 'font-body text-sm font-medium',
  caption: 'font-body text-xs font-regular',
  overline: 'font-body text-xs font-medium uppercase tracking-widest',
}

const colorStyles: Record<TextColor, string> = {
  primary: 'text-content-primary',
  secondary: 'text-content-secondary',
  tertiary: 'text-content-tertiary',
  disabled: 'text-content-disabled',
  inverse: 'text-content-inverse',
  brand: 'text-brand-text',
  accent: 'text-accent-text',
  success: 'text-semantic-success',
  warning: 'text-semantic-warning',
  error: 'text-semantic-error',
}

const alignStyles: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const weightStyles: Record<TextWeight, string> = {
  light: 'font-light',
  regular: 'font-regular',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
}

export function Text({
  variant = 'body',
  weight,
  color = 'primary',
  align,
  className,
  ...props
}: TextProps) {
  return (
    <RNText
      {...props}
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        align && alignStyles[align],
        weight && weightStyles[weight],
        className
      )}
    />
  )
}
