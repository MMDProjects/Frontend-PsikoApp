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
      return OfferListResponseSchema.parse(raw)
    },
    staleTime: OFFER_STALE_TIME,
  })
}
