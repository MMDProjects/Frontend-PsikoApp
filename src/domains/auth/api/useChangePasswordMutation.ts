import { useMutation } from '@tanstack/react-query'

import { post } from '@/lib/api'

import type { ChangePasswordRequest } from '../types/auth.types'

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      return post<{ success: boolean }>('/auth/change-password', data)
    },
  })
}
