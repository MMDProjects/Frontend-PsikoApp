import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { get } from '@/lib/api'

import { listingKeys, LISTING_STALE_TIME } from '../listing.constants'
import { ListingSchema } from '../schemas/listing.schema'

const MyListingsResponseSchema = z.object({
  data: z.array(ListingSchema),
  meta: z.object({ page: z.number(), total: z.number(), perPage: z.number() }),
})

export function useMyListingsQuery() {
  return useQuery({
    queryKey: listingKeys.my(),
    queryFn: async () => {
      const raw = await get('/listings/my')
      const result = MyListingsResponseSchema.safeParse(raw)
      if (!result.success) {
        console.error('[listings/my] Zod parse FAILED:', JSON.stringify(result.error.issues))
        throw result.error
      }
      return result.data
    },
    staleTime: LISTING_STALE_TIME,
  })
}
