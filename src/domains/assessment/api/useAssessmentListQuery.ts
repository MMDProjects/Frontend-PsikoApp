import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { get } from '@/lib/api'

import { assessmentKeys } from '../assessment.constants'
import { AssessmentListItemSchema } from '../schemas/assessment.schema'

export function useAssessmentListQuery() {
  return useQuery({
    queryKey: assessmentKeys.list(),
    queryFn: async () => {
      const raw = await get('/assessment')
      return z.array(AssessmentListItemSchema).parse((raw as any).data)
    },
    staleTime: 10 * 60 * 1000,
  })
}
