import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post } from '@/lib/api'

import { matchKeys } from '../match.constants'
import { MatchRequestSchema } from '../schemas/match.schema'

import type { ReleaseMatchBody } from '../types/match.types'

export function useReleaseMatchMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: ReleaseMatchBody) => {
      const raw = await post('/match/release', body)
      return MatchRequestSchema.parse(raw)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.lists() })
    },
  })
}
