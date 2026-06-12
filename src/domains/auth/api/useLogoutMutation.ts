import { useMutation } from '@tanstack/react-query'

import { post } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import { tokenStorage } from '@/lib/storage'

import { useAuthStore } from '../store/authStore'

export function useLogoutMutation() {
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      // Best-effort server-side invalidation — ignore errors (local state always cleared)
      try {
        await post('/auth/logout')
      } catch {
        // ignore
      }
    },
    onSettled: async () => {
      await tokenStorage.clearTokens()
      clearAuth()
      queryClient.clear()
    },
  })
}
