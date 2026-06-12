// Type-safe token name references — use these instead of magic strings in className props.

export const colors = {
  brand: {
    DEFAULT: 'brand',
    hover: 'brand-hover',
    subtle: 'brand-subtle',
    muted: 'brand-muted',
    border: 'brand-border',
    text: 'brand-text',
  },
  accent: {
    DEFAULT: 'accent',
    hover: 'accent-hover',
    subtle: 'accent-subtle',
    muted: 'accent-muted',
    border: 'accent-border',
    text: 'accent-text',
  },
  neutral: {
    50: 'neutral-50',
    100: 'neutral-100',
    150: 'neutral-150',
    200: 'neutral-200',
    300: 'neutral-300',
    400: 'neutral-400',
    500: 'neutral-500',
    600: 'neutral-600',
    700: 'neutral-700',
    800: 'neutral-800',
    900: 'neutral-900',
    950: 'neutral-950',
  },
  surface: {
    base: 'surface-base',
    raised: 'surface-raised',
    sunken: 'surface-sunken',
  },
  content: {
    primary: 'content-primary',
    secondary: 'content-secondary',
    tertiary: 'content-tertiary',
    disabled: 'content-disabled',
    inverse: 'content-inverse',
    link: 'content-link',
  },
  border: {
    DEFAULT: 'border',
    muted: 'border-muted',
    strong: 'border-strong',
  },
  semantic: {
    success: {
      light: 'semantic-success-light',
      DEFAULT: 'semantic-success',
      dark: 'semantic-success-dark',
    },
    warning: {
      light: 'semantic-warning-light',
      DEFAULT: 'semantic-warning',
      dark: 'semantic-warning-dark',
    },
    error: {
      light: 'semantic-error-light',
      DEFAULT: 'semantic-error',
      dark: 'semantic-error-dark',
    },
    info: { light: 'semantic-info-light', DEFAULT: 'semantic-info', dark: 'semantic-info-dark' },
  },
} as const

export const fontFamily = {
  display: 'font-display',
  body: 'font-body',
  mono: 'font-mono',
} as const

export const fontSize = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
} as const

export const fontWeight = {
  light: 'font-light',
  regular: 'font-regular',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
} as const

export const radius = {
  none: 'rounded-none',
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
} as const

export const shadow = {
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
} as const

export const transition = {
  duration: {
    instant: 'duration-instant',
    fast: 'duration-fast',
    normal: 'duration-normal',
    slow: 'duration-slow',
    slower: 'duration-slower',
  },
  ease: {
    out: 'ease-out',
    spring: 'ease-spring',
    inOut: 'ease-in-out',
  },
} as const

export const zIndex = {
  base: 'z-base',
  raised: 'z-raised',
  dropdown: 'z-dropdown',
  sticky: 'z-sticky',
  fixed: 'z-fixed',
  overlay: 'z-overlay',
  modal: 'z-modal',
  popover: 'z-popover',
  tooltip: 'z-tooltip',
  toast: 'z-toast',
  top: 'z-top',
} as const

export const tokens = {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  radius,
  shadow,
  transition,
  zIndex,
} as const

export type ColorToken = typeof colors
export type RadiusToken = typeof radius
export type ShadowToken = typeof shadow
export type ZIndexToken = typeof zIndex
