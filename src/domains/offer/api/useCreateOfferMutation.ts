import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post } from '@/lib/api'

import { offerKeys } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'

import type { CreateOfferRequest } from '../types/offer.types'

export function useCreateOfferMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateOfferRequest) => {
      const raw = await post('/offers', data)
      return OfferSchema.parse(raw)
    },
    onSuccess: (offer) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.lists() })
      queryClient.setQueryData(offerKeys.detail(offer.id), offer)
    },
  })
}
