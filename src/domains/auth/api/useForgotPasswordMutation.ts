import { useMutation } from '@tanstack/react-query'

import { post } from '@/lib/api'

import type { ForgotPasswordRequest } from '../types/auth.types'

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      return post<{ success: boolean }>('/auth/forgot-password', data)
    },
  })
}
