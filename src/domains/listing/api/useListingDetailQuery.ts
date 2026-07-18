import { useQuery } from '@tanstack/react-query'

import { get } from '@/lib/api'

import { listingKeys, LISTING_STALE_TIME } from '../listing.constants'
import { ListingSchema } from '../schemas/listing.schema'

export function useListingDetailQuery(id: string) {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: async () => {
      const raw = await get(`/listings/${id}`)
      const result = ListingSchema.safeParse(raw)
      if (!result.success) {
        throw result.error
      }
      return result.data
    },
    staleTime: LISTING_STALE_TIME,
    enabled: Boolean(id),
  })
}
