import type { z } from 'zod'
import type {
  PackageSchema,
  PurchasedPackageSchema,
  CheckoutSessionSchema,
  InitiateCheckoutSchema,
} from '../schemas/payment.schema'

export type Package = z.infer<typeof PackageSchema>
export type PurchasedPackage = z.infer<typeof PurchasedPackageSchema>
export type CheckoutSession = z.infer<typeof CheckoutSessionSchema>
export type InitiateCheckoutRequest = z.infer<typeof InitiateCheckoutSchema>
