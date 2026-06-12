import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { get } from '@/lib/api'

import { offerKeys, OFFER_STALE_TIME } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'

import type { OfferStatus } from '../types/offer.types'

type OfferListFilters = {
  status?: OfferStatus
  role?: 'expert' | 'client'
}

const OfferListResponseSchema = z.array(OfferSchema)

export function useOfferListQuery(filters: OfferListFilters = {}) {
  return useQuery({
    queryKey: offerKeys.list(filters),
    queryFn: async () => {
      const raw = await get('/offers', { params: filters })
      const result = OfferListResponseSchema.safeParse(raw)
      if (!result.success) {
        console.error('[offers] Zod parse FAILED:', JSON.stringify(result.error.issues))
        console.error('[offers] raw response:', JSON.stringify(raw).slice(0, 500))
        throw result.error
      }
      return result.data
    },
    staleTime: OFFER_STALE_TIME,
  })
}
