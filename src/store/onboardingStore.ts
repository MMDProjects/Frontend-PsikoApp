import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { zustandStorage } from '@/lib/storage'

type OnboardingState = {
  /** Karşılama turu (welcome slaytları) daha önce görüldü mü */
  hasSeenWelcome: boolean
  /** Persist rehidrasyonu tamamlandı mı — tamamlanmadan yönlendirme yapılmaz */
  hasHydrated: boolean
  /** Giriş sonrası tabs yerine gidilecek onboarding rotası (tek kullanımlık, persist edilmez) */
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
