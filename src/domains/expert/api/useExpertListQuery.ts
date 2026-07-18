import { useQuery } from '@tanstack/react-query'

import { get } from '@/lib/api'

import { expertKeys, EXPERT_STALE_TIME } from '../expert.constants'
import { ExpertSchema } from '../schemas/expert.schema'
import { z } from 'zod'

import type { ExpertListFilters } from '../types/expert.types'

const ExpertListResponseSchema = z.object({
  data: z.array(ExpertSchema),
  meta: z.object({
    page:    z.number(),
    total:   z.number(),
    perPage: z.number(),
  }),
})

export function useExpertListQuery(filters: ExpertListFilters = {}) {
  return useQuery({
    queryKey: expertKeys.list(filters),
    queryFn: async () => {
      const raw = await get('/experts', { params: filters })
      const result = ExpertListResponseSchema.safeParse(raw)
      if (!result.success) {
        throw result.error
      }
      return result.data
    },
    staleTime: EXPERT_STALE_TIME,
  })
}
