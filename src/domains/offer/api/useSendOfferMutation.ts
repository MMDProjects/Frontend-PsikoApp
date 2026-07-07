import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post } from '@/lib/api'

import { offerKeys } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'
import { listingKeys } from '@/domains/listing'

import type { SendOfferRequest } from '../types/offer.types'

export function useSendOfferMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SendOfferRequest) => {
      const raw = await post('/offers', data)
      return OfferSchema.parse(raw)
    },
    onSuccess: (offer) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.my() })
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(offer.listingId) })
    },
  })
}
