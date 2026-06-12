import type { z } from 'zod'
import type {
  OfferStatusSchema,
  OfferTierSchema,
  OfferSchema,
  CreateOfferSchema,
} from '../schemas/offer.schema'

export type OfferStatus = z.infer<typeof OfferStatusSchema>
export type OfferTier = z.infer<typeof OfferTierSchema>
export type Offer = z.infer<typeof OfferSchema>
export type CreateOfferRequest = z.infer<typeof CreateOfferSchema>
