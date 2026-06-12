import { z } from 'zod'

export const OfferStatusSchema = z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'])

export const OfferTierSchema = z.object({
  tierNumber:    z.number().int().min(1).max(3),
  price:         z.number().positive(),
  durationHours: z.number().positive(),
  activatedAt:   z.string().datetime().nullable(),
})

export const OfferSchema = z.object({
  id:          z.string().uuid(),
  expertId:    z.string().uuid(),
  clientId:    z.string().uuid(),
  status:      OfferStatusSchema,
  tiers:       z.array(OfferTierSchema).min(1).max(3),
  currentTier: z.number().int().min(0),
  sessionType: z.enum(['online', 'in_person']),
  notes:       z.string().max(1000).nullish(),
  createdAt:   z.string().datetime(),
  expiresAt:   z.string().datetime().nullable(),
  sentAt:      z.string().datetime().nullable(),
  respondedAt: z.string().datetime().nullable(),
  client: z.object({
    id:       z.string().uuid(),
    fullName: z.string(),
  }).optional(),
  expert: z.object({
    id:       z.string().uuid(),
    name:     z.string(),
    title:    z.string(),
    avatarUrl: z.string().url().nullable().optional(),
  }).optional(),
})

export const CreateOfferSchema = z.object({
  clientId:    z.string().uuid({ message: 'Danışan seçiniz' }),
  sessionType: z.enum(['online', 'in_person']),
  notes:       z.string().max(1000).optional(),
  tiers: z
    .array(
      z.object({
        price:         z.number({ required_error: 'Fiyat giriniz' }).positive({ message: 'Fiyat 0\'dan büyük olmalıdır' }),
        durationHours: z.number({ required_error: 'Süre giriniz' }).positive({ message: 'Süre 0\'dan büyük olmalıdır' }),
      })
    )
    .min(1, 'En az 1 kademe gerekli')
    .max(3, 'En fazla 3 kademe olabilir')
    .refine(
      (tiers) => tiers.every((t, i) => i === 0 || t.price < tiers[i - 1].price),
      'Her kademenin fiyatı bir öncekinden düşük olmalıdır'
    ),
})
