import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { get } from '@/lib/api'

import { matchKeys } from '../match.constants'
import { MatchRequestSchema } from '../schemas/match.schema'

const MatchListResponseSchema = z.array(MatchRequestSchema)

export function useMatchListQuery(expertId: string) {
  return useQuery({
    queryKey: matchKeys.list(expertId),
    queryFn: async () => {
      const raw = await get('/match')
      return MatchListResponseSchema.parse(raw)
    },
    enabled: Boolean(expertId),
    staleTime: 60 * 1000,
  })
}
