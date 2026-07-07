import type { z } from 'zod'
import type { MatchStatusSchema, MatchSchema, MatchDetailSchema, ReleaseMatchBodySchema } from '../schemas/match.schema'

export type MatchStatus = z.infer<typeof MatchStatusSchema>
export type Match = z.infer<typeof MatchSchema>
export type MatchDetail = z.infer<typeof MatchDetailSchema>
export type ReleaseMatchBody = z.infer<typeof ReleaseMatchBodySchema>
