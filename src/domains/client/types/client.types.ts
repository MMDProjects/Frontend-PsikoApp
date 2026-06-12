import type { z } from 'zod'
import type { ClientSchema, AddClientSchema, MatchStatusSchema } from '../schemas/client.schema'

export type Client = z.infer<typeof ClientSchema>
export type MatchStatus = z.infer<typeof MatchStatusSchema>
export type AddClientRequest = z.infer<typeof AddClientSchema>
