import type { MatchState } from './types/match.types'

export const matchKeys = {
  all:     ['matches'] as const,
  lists:   () => [...matchKeys.all, 'list'] as const,
  list:    (expertId: string) => [...matchKeys.lists(), expertId] as const,
  details: () => [...matchKeys.all, 'detail'] as const,
  detail:  (code: string) => [...matchKeys.details(), code] as const,
} as const

export const MATCH_PENDING_EXPIRY_HOURS = 48

export const MATCH_STATE_CONFIG: Record<MatchState, { label: string; badgeVariant: string; color: string }> = {
  FREE:     { label: 'Serbest',           badgeVariant: 'neutral', color: '#737373' },
  PENDING:  { label: 'Onay Bekliyor',     badgeVariant: 'warning', color: '#D97706' },
  MATCHED:  { label: 'Eşleşildi',         badgeVariant: 'sky',     color: '#0EA5E9' },
  RELEASED: { label: 'Serbest Bırakıldı', badgeVariant: 'neutral', color: '#737373' },
}
