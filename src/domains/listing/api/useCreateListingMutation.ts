import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post } from '@/lib/api'

import { listingKeys } from '../listing.constants'
import { ListingSchema } from '../schemas/listing.schema'

import type { CreateListingRequest } from '../types/listing.types'

export function useCreateListingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateListingRequest) => {
      const raw = await post('/listings', data)
      return ListingSchema.parse(raw)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.my() })
    },
  })
}
