import { useAuthStore } from '@/domains/auth'
import { ClientHomeScreen, ExpertHomeScreen } from '@/screens/home'

export default function HomeScreen() {
  const role = useAuthStore((s) => s.role)
  return role === 'expert' ? <ExpertHomeScreen /> : <ClientHomeScreen />
}
