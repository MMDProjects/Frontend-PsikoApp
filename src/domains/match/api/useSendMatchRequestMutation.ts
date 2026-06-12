import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post } from '@/lib/api'

import { matchKeys } from '../match.constants'
import { MatchRequestSchema } from '../schemas/match.schema'

import type { SendMatchRequestBody } from '../types/match.types'

export function useSendMatchRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: SendMatchRequestBody) => {
      const raw = await post('/match/request', body)
      return MatchRequestSchema.parse(raw)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.lists() })
    },
  })
}
