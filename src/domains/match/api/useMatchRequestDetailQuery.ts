import { useQuery } from '@tanstack/react-query'

import { get } from '@/lib/api'

import { matchKeys } from '../match.constants'
import { MatchRequestDetailSchema } from '../schemas/match.schema'

export function useMatchRequestDetailQuery(code: string) {
  return useQuery({
    queryKey: matchKeys.detail(code),
    queryFn: async () => {
      const raw = await get(`/match/request/${code}`)
      return MatchRequestDetailSchema.parse(raw)
    },
    enabled: Boolean(code),
    staleTime: 30 * 1000,
  })
}
