import type { z } from 'zod'
import type { ExpertSchema, ExpertOnboardingSchema } from '../schemas/expert.schema'

export type Expert = z.infer<typeof ExpertSchema>
export type ExpertOnboarding = z.infer<typeof ExpertOnboardingSchema>

export type ExpertListFilters = {
  specialization?: string
  minRating?: number
  maxPrice?: number
  search?: string
  page?: number
}

export type ExpertListResponse = {
  data: Expert[]
  meta: {
    page: number
    total: number
    perPage: number
  }
}
