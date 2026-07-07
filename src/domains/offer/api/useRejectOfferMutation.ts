import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post } from '@/lib/api'

import { offerKeys } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'

export function useRejectOfferMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (offerId: string) => {
      const raw = await post(`/offers/${offerId}/reject`, {})
      return OfferSchema.parse(raw)
    },
    onSuccess: (_offer, offerId) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(offerId) })
      queryClient.invalidateQueries({ queryKey: offerKeys.forListing })
    },
  })
}
