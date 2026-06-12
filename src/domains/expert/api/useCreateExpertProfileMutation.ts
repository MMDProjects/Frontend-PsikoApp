import { useMutation } from '@tanstack/react-query'

import { post } from '@/lib/api'

import type { ExpertOnboarding } from '../schemas/expert.schema'

export function useCreateExpertProfileMutation() {
  return useMutation({
    mutationFn: (data: ExpertOnboarding) => post('/experts/profile', data),
  })
}
