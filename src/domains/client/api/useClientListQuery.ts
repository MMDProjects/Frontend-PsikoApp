import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { get } from '@/lib/api'

import { clientKeys } from '../client.constants'
import { ClientSchema } from '../schemas/client.schema'

const ClientListResponseSchema = z.object({
  data: z.array(ClientSchema),
  meta: z.object({ page: z.number(), total: z.number(), perPage: z.number() }),
})

export function useClientListQuery() {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: async () => {
      const raw = await get('/clients')
      return ClientListResponseSchema.parse(raw)
    },
    staleTime: 2 * 60 * 1000,
  })
}
