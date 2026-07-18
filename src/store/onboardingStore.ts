import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { zustandStorage } from '@/lib/storage'

type OnboardingState = {
  hasSeenWelcome: boolean
  hasHydrated: boolean
  onboardIntent: string | null
  setSeenWelcome: () => void
  resetWelcome: () => void
  setHydrated: () => void
  setOnboardIntent: (route: string) => void
  clearOnboardIntent: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenWelcome: false,
      hasHydrated: false,
      onboardIntent: null,
      setSeenWelcome: () => set({ hasSeenWelcome: true }),
      resetWelcome: () => set({ hasSeenWelcome: false }),
      setHydrated: () => set({ hasHydrated: true }),
      setOnboardIntent: (route) => set({ onboardIntent: route }),
      clearOnboardIntent: () => set({ onboardIntent: null }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ hasSeenWelcome: state.hasSeenWelcome }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
