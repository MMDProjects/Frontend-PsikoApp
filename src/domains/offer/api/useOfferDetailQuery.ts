import { useQuery } from '@tanstack/react-query'

import { get } from '@/lib/api'

import { offerKeys, OFFER_STALE_TIME } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'

export function useOfferDetailQuery(offerId: string) {
  return useQuery({
    queryKey: offerKeys.detail(offerId),
    queryFn: async () => {
      const raw = await get(`/offers/${offerId}`)
      return OfferSchema.parse(raw)
    },
    staleTime: OFFER_STALE_TIME,
    enabled: Boolean(offerId),
  })
}
