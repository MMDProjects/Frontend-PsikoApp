import { LISTING_STATUS_CONFIG } from '../listing.constants'

import type { ListingStatus } from '../types/listing.types'

type ListingStatusInfo = {
  label: string
  badgeVariant: 'sky' | 'sage' | 'neutral' | 'warning' | 'error'
  isActive: boolean
  isTerminal: boolean
}

export function useListingStatus(status: ListingStatus): ListingStatusInfo {
  const config = LISTING_STATUS_CONFIG[status]
  return {
    ...config,
    isActive: status === 'OPEN',
    isTerminal: status === 'MATCHED' || status === 'EXPIRED',
  }
}
