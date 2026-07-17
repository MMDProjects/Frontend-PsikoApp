import { useQuery } from '@tanstack/react-query'

import { get } from '@/lib/api'

import { expertKeys, EXPERT_STALE_TIME } from '../expert.constants'
import { ReviewSchema } from '../schemas/review.schema'

export function useExpertReviewsQuery(expertId: string) {
  return useQuery({
    queryKey: expertKeys.reviews(expertId),
    queryFn: async () => {
      const raw = await get(`/experts/${expertId}/reviews`)
      return ReviewSchema.array().parse(raw)
    },
    staleTime: EXPERT_STALE_TIME,
    enabled: Boolean(expertId),
  })
}
