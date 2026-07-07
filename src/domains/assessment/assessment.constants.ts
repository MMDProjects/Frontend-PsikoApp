export const assessmentKeys = {
  all:       ['assessments'] as const,
  list:      () => [...assessmentKeys.all, 'list'] as const,
  active:    () => [...assessmentKeys.all, 'active'] as const,
  results:   () => [...assessmentKeys.all, 'results'] as const,
  result:    (id: string) => [...assessmentKeys.results(), id] as const,
  myResults: () => [...assessmentKeys.results(), 'my'] as const,
} as const

export const RESULT_LEVEL_CONFIG = {
  low:      { label: 'Düşük',  color: '#16A34A', badgeVariant: 'sage'    },
  moderate: { label: 'Orta',   color: '#D97706', badgeVariant: 'warning' },
  high:     { label: 'Yüksek', color: '#DC2626', badgeVariant: 'error'   },
} as const
