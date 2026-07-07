import type { z } from 'zod'
import type { OfferStatusSchema, OfferSchema, SendOfferSchema } from '../schemas/offer.schema'

export type OfferStatus = z.infer<typeof OfferStatusSchema>
export type Offer = z.infer<typeof OfferSchema>
export type SendOfferRequest = z.infer<typeof SendOfferSchema>
