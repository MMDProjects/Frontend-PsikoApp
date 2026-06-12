import { create } from 'zustand'

import { mmkvStorage } from '@/store/middleware'
import { persist } from '@/store/middleware'

type AuthState = {
  userId: string | null
  role: 'expert' | 'client' | null
  isAuthenticated: boolean
}

type AuthActions = {
  setAuth: (userId: string, role: AuthState['role']) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      userId: null,
      role: null,
      isAuthenticated: false,
      setAuth: (userId, role) => set({ userId, role, isAuthenticated: true }),
      clearAuth: () => set({ userId: null, role: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: mmkvStorage,
    },
  ),
)
