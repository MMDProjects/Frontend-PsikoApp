import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post } from '@/lib/api'

import { clientKeys } from '../client.constants'
import { ClientSchema } from '../schemas/client.schema'

import type { AddClientRequest } from '../types/client.types'

export function useAddClientMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddClientRequest) => {
      const raw = await post('/clients', data)
      return ClientSchema.parse(raw)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}
