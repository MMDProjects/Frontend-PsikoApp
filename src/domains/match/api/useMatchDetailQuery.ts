import { useQuery } from '@tanstack/react-query'

import { get } from '@/lib/api'

import { matchKeys } from '../match.constants'
import { MatchDetailSchema } from '../schemas/match.schema'

import type { MatchDetail } from '../types/match.types'

export function useMatchDetailQuery(matchId: string) {
  return useQuery({
    queryKey: matchKeys.detail(matchId),
    queryFn: async () => {
      const raw = await get(`/matches/${matchId}`)
      const result = MatchDetailSchema.safeParse(raw)
      if (!result.success) {
        console.error('[match/detail] Zod parse FAILED:', JSON.stringify(result.error.issues))
        throw result.error
      }
      return result.data as MatchDetail
    },
    staleTime: 30 * 1000,
    enabled: Boolean(matchId),
  })
}
