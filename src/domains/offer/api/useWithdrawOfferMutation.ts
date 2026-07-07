import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post } from '@/lib/api'

import { offerKeys } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'

export function useWithdrawOfferMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (offerId: string) => {
      const raw = await post(`/offers/${offerId}/withdraw`, {})
      return OfferSchema.parse(raw)
    },
    onSuccess: (_offer, offerId) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(offerId) })
      queryClient.invalidateQueries({ queryKey: offerKeys.my() })
    },
  })
}
