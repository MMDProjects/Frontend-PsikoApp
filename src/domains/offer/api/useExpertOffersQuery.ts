import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { get } from '@/lib/api'

import { offerKeys, OFFER_STALE_TIME } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'

const ExpertOffersResponseSchema = z.object({
  data: z.array(OfferSchema),
  meta: z.object({ page: z.number(), total: z.number(), perPage: z.number() }),
})

export function useExpertOffersQuery() {
  return useQuery({
    queryKey: offerKeys.my(),
    queryFn: async () => {
      const raw = await get('/offers/my')
      const result = ExpertOffersResponseSchema.safeParse(raw)
      if (!result.success) {
        console.error('[offers/my] Zod parse FAILED:', JSON.stringify(result.error.issues))
        throw result.error
      }
      return result.data
    },
    staleTime: OFFER_STALE_TIME,
  })
}
