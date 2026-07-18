import { useMutation } from '@tanstack/react-query'

import { post } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import { tokenStorage } from '@/lib/storage'

import { useAuthStore } from '../store/authStore'

export function useLogoutMutation() {
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      try {
        await post('/auth/logout')
      } catch {
      }
    },
    onSettled: async () => {
      await tokenStorage.clearTokens()
      clearAuth()
      queryClient.clear()
    },
  })
}
