export const paymentKeys = {
  all:      ['payments'] as const,
  packages: () => [...paymentKeys.all, 'packages'] as const,
  purchased: () => [...paymentKeys.all, 'purchased'] as const,
} as const

export const PACKAGE_VALID_DAYS = 180
