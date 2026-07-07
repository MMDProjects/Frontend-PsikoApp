import { useQuery } from '@tanstack/react-query'

import { get } from '@/lib/api'

import { matchKeys } from '../match.constants'
import { MatchSchema } from '../schemas/match.schema'

import type { Match } from '../types/match.types'

export function useMatchesQuery() {
  return useQuery({
    queryKey: matchKeys.all,
    queryFn: async () => {
      const raw = await get('/matches')
      const items: unknown[] = raw?.data ?? []
      const parsed = items
        .map((item) => {
          const result = MatchSchema.safeParse(item)
          if (!result.success) console.error('[useMatchesQuery] parse error', result.error)
          return result.success ? result.data : null
        })
        .filter((m): m is Match => m !== null)
      return parsed
    },
    staleTime: 30 * 1000,
  })
}
