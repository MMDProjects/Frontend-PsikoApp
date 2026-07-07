import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { get } from '@/lib/api'

import { assessmentKeys } from '../assessment.constants'
import { MyAssessmentResultSchema } from '../schemas/assessment.schema'

export function useMyAssessmentResultsQuery() {
  return useQuery({
    queryKey: assessmentKeys.myResults(),
    queryFn: async () => {
      const raw = await get('/assessment/results/my')
      return z.array(MyAssessmentResultSchema).parse((raw as any).data)
    },
    staleTime: 5 * 60 * 1000,
  })
}
