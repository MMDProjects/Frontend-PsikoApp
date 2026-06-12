import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post } from '@/lib/api'

import { matchKeys } from '../match.constants'
import { MatchRequestSchema } from '../schemas/match.schema'

import type { AcceptMatchBody } from '../types/match.types'

export function useAcceptMatchMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: AcceptMatchBody) => {
      const raw = await post('/match/accept', body)
      return MatchRequestSchema.parse(raw)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: matchKeys.lists() })
      queryClient.setQueryData(matchKeys.detail(data.code), data)
    },
  })
}
