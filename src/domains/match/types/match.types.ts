import type { z } from 'zod'
import type {
  MatchStateSchema,
  MatchRequestSchema,
  MatchRequestDetailSchema,
  SendMatchRequestBodySchema,
  AcceptMatchBodySchema,
  ReleaseMatchBodySchema,
} from '../schemas/match.schema'

export type MatchState = z.infer<typeof MatchStateSchema>
export type MatchRequest = z.infer<typeof MatchRequestSchema>
export type MatchRequestDetail = z.infer<typeof MatchRequestDetailSchema>
export type SendMatchRequestBody = z.infer<typeof SendMatchRequestBodySchema>
export type AcceptMatchBody = z.infer<typeof AcceptMatchBodySchema>
export type ReleaseMatchBody = z.infer<typeof ReleaseMatchBodySchema>
