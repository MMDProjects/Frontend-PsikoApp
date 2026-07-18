import { useAuthStore } from '@/domains/auth'
import { ClientListingsScreen, ExpertOffersScreen } from '@/screens/offers'

export default function OffersScreen() {
  const role = useAuthStore((s) => s.role)
  return role === 'expert' ? <ExpertOffersScreen /> : <ClientListingsScreen />
}
