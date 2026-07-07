import type { IconName } from '@/core/components/atoms/Icon'
import type { OfferStatus } from './types/offer.types'

export const offerKeys = {
  all:     ['offers'] as const,
  lists:   () => [...offerKeys.all, 'list'] as const,
  my:      () => [...offerKeys.all, 'my'] as const,
  details: () => [...offerKeys.all, 'detail'] as const,
  detail:  (id: string) => [...offerKeys.details(), id] as const,
  forListing: (listingId: string) => [...offerKeys.all, 'listing', listingId] as const,
} as const

export const OFFER_STALE_TIME = 60 * 1000

export const OFFER_STATUS_CONFIG: Record<OfferStatus, { label: string; icon: IconName; iconColor: string }> = {
  PENDING:   { label: 'Beklemede',    icon: 'Clock',        iconColor: '#D97706' },
  ACCEPTED:  { label: 'Kabul Edildi', icon: 'CheckCircle2', iconColor: '#16A34A' },
  REJECTED:  { label: 'Reddedildi',   icon: 'XCircle',      iconColor: '#DC2626' },
  WITHDRAWN: { label: 'Geri Çekildi', icon: 'MinusCircle',  iconColor: '#737373' },
}
