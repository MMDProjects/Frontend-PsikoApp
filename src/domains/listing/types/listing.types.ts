import { z } from 'zod'
import { ListingSchema, ListingStatusSchema, CreateListingSchema } from '../schemas/listing.schema'

export type Listing = z.infer<typeof ListingSchema>
export type ListingStatus = z.infer<typeof ListingStatusSchema>
export type CreateListingRequest = z.infer<typeof CreateListingSchema>

export type ListingListFilters = {
  specialization?: string[]
  budgetMin?: number
  budgetMax?: number
  sessionType?: string[]
}
