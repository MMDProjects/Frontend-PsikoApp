import type { OfferStatus } from './types/offer.types'

export const offerKeys = {
  all:     ['offers'] as const,
  lists:   () => [...offerKeys.all, 'list'] as const,
  list:    (filters: Record<string, unknown>) => [...offerKeys.lists(), filters] as const,
  details: () => [...offerKeys.all, 'detail'] as const,
  detail:  (id: string) => [...offerKeys.details(), id] as const,
} as const

export const OFFER_STALE_TIME = 60 * 1000

export const OFFER_TIER_DURATION_MS = 48 * 60 * 60 * 1000

export const OFFER_STATUS_CONFIG: Record<OfferStatus, { label: string; badgeVariant: string }> = {
  DRAFT:    { label: 'Taslak',       badgeVariant: 'neutral' },
  SENT:     { label: 'Gönderildi',   badgeVariant: 'sky'     },
  ACCEPTED: { label: 'Kabul Edildi', badgeVariant: 'sage'    },
  REJECTED: { label: 'Reddedildi',   badgeVariant: 'error'   },
  EXPIRED:  { label: 'Süresi Doldu', badgeVariant: 'warning' },
}
