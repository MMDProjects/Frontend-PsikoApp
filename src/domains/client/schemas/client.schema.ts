import { z } from 'zod'

export const MatchStatusSchema = z.enum(['FREE', 'PENDING', 'MATCHED', 'RELEASED'])

export const ClientSchema = z.object({
  id:               z.string().uuid(),
  fullName:         z.string(),
  initials:         z.string().optional(),
  email:            z.string().email(),
  phone:            z.string().nullable(),
  matchCode:        z.string().nullable(),
  matchStatus:      MatchStatusSchema,
  registrationType: z.enum(['invited', 'self']),
  notes:            z.string().nullable(),
  createdAt:        z.string().datetime(),
})

export const AddClientSchema = z.object({
  fullName: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email:    z.string().email('Geçerli bir e-posta giriniz').optional().or(z.literal('')),
  phone:    z.string().min(10, 'Geçerli bir telefon numarası giriniz').optional().or(z.literal('')),
  notes:    z.string().max(500).optional(),
}).refine(
  (data) => Boolean(data.email) || Boolean(data.phone),
  { message: 'E-posta veya telefon numarası gerekli', path: ['email'] }
)

export type Client = z.infer<typeof ClientSchema>
export type MatchStatus = z.infer<typeof MatchStatusSchema>
export type AddClientRequest = z.infer<typeof AddClientSchema>
