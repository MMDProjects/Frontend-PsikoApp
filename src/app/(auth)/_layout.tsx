import { useEffect } from 'react'
import { Redirect, Stack, useSegments } from 'expo-router'

import { useAuthStore } from '@/domains/auth'
import { useOnboardingStore } from '@/store/onboardingStore'

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasSeenWelcome = useOnboardingStore((s) => s.hasSeenWelcome)
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated)
  const onboardIntent = useOnboardingStore((s) => s.onboardIntent)
  const clearOnboardIntent = useOnboardingStore((s) => s.clearOnboardIntent)
  const segments = useSegments()

  // segments örn: ['(auth)', 'login'] | ['(auth)', 'onboarding', 'expert']
  const current = segments[1]

  // Onboarding'e varınca tek kullanımlık intent tüketilir
  useEffect(() => {
    if (current === 'onboarding' && onboardIntent) clearOnboardIntent()
  }, [current, onboardIntent, clearOnboardIntent])

  // Kayıt sonrası kullanıcı authenticated olur ama rol onboarding'ini tamamlaması gerekir —
  // onboarding rotaları authenticated kullanıcıya açık kalır.
  if (isAuthenticated && current !== 'onboarding') {
    // Dev "Onboard" butonları: giriş auth'u tamamlanmadan tabs'a kaçmayı önler
    if (onboardIntent) {
      return <Redirect href={onboardIntent as never} />
    }
    return <Redirect href="/(tabs)/" />
  }

  // İlk açılış: karşılama turu görülmediyse önce welcome gösterilir.
  if (!isAuthenticated && hasHydrated && !hasSeenWelcome && current !== 'welcome') {
    return <Redirect href="/(auth)/welcome" />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
