import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { zustandStorage } from '@/lib/storage'

export type ThemePreference = 'light' | 'dark' | 'system'

type ThemeState = {
  preference: ThemePreference
  setPreference: (p: ThemePreference) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'dark',
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
