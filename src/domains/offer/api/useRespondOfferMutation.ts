import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post } from '@/lib/api'

import { offerKeys } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'

type RespondOfferBody = {
  offerId: string
  action: 'ACCEPT' | 'REJECT'
}

export function useRespondOfferMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ offerId, action }: RespondOfferBody) => {
      const raw = await post(`/offers/${offerId}/respond`, { action })
      return OfferSchema.parse(raw)
    },
    onSuccess: (offer) => {
      queryClient.setQueryData(offerKeys.detail(offer.id), offer)
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() })
    },
  })
}
