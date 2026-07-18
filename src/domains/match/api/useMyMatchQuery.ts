import { useQuery } from '@tanstack/react-query'

import { get } from '@/lib/api'

import { matchKeys } from '../match.constants'
import { MatchSchema } from '../schemas/match.schema'

export function useMyMatchQuery() {
  return useQuery({
    queryKey: matchKeys.active(),
    queryFn: async () => {
      const raw = await get('/match/active')
      if (raw === null || raw === undefined) return null
      const result = MatchSchema.safeParse(raw)
      if (!result.success) {
        throw result.error
      }
      return result.data
    },
    staleTime: 30 * 1000,
  })
}
