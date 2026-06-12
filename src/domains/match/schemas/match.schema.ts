import { z } from 'zod'

export const MatchStateSchema = z.enum(['FREE', 'PENDING', 'MATCHED', 'RELEASED'])

export const MatchRequestSchema = z.object({
  id:        z.string().uuid(),
  code:      z.string().uuid(),
  clientId:  z.string().uuid(),
  expertId:  z.string().uuid(),
  state:     MatchStateSchema,
  expiresAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const MatchRequestDetailSchema = MatchRequestSchema.extend({
  client: z.object({
    id:       z.string().uuid(),
    fullName: z.string(),
    email:    z.string().email().optional(),
  }),
  expert: z.object({
    id:     z.string().uuid(),
    name:   z.string(),
    title:  z.string(),
    rating: z.number(),
  }),
})

export const SendMatchRequestBodySchema = z.object({
  clientId: z.string().uuid(),
})

export const AcceptMatchBodySchema = z.object({
  code: z.string().uuid(),
})

export const ReleaseMatchBodySchema = z.object({
  matchId: z.string().uuid(),
  reason:  z.string().min(1).max(500).optional(),
})
