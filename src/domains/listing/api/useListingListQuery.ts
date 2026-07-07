import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { get } from '@/lib/api'

import { listingKeys, LISTING_STALE_TIME } from '../listing.constants'
import { ListingSchema } from '../schemas/listing.schema'

import type { ListingListFilters } from '../types/listing.types'

const ListingListResponseSchema = z.object({
  data: z.array(ListingSchema),
  meta: z.object({ page: z.number(), total: z.number(), perPage: z.number() }),
})

export function useListingListQuery(filters: ListingListFilters = {}) {
  return useQuery({
    queryKey: listingKeys.lists(),
    queryFn: async () => {
      const raw = await get('/listings', { params: filters })
      const result = ListingListResponseSchema.safeParse(raw)
      if (!result.success) {
        console.error('[listings] Zod parse FAILED:', JSON.stringify(result.error.issues))
        throw result.error
      }
      return result.data
    },
    staleTime: LISTING_STALE_TIME,
  })
}
