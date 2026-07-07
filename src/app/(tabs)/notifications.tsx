import { ScrollView, useColorScheme, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { useAuthStore } from '@/domains/auth'

type MockNotification = {
  id: string
  icon: 'SendHorizonal' | 'CheckCircle' | 'FileText' | 'Bell'
  title: string
  body: string
  time: string
  read: boolean
}

const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: '1',
    icon: 'SendHorizonal',
    title: 'Yeni teklif aldınız',
    body: 'Kaygı ve panik atak ilanınıza yeni bir teklif geldi.',
    time: '5 dk önce',
    read: false,
  },
  {
    id: '2',
    icon: 'CheckCircle',
    title: 'Teklif kabul edildi',
    body: 'Gönderdiğiniz teklif danışan tarafından kabul edildi.',
    time: '2 saat önce',
    read: false,
  },
  {
    id: '3',
    icon: 'FileText',
    title: 'İlanınız sona eriyor',
    body: '"Depresyon için destek arıyorum" ilanınız 3 gün içinde sona erecek.',
    time: 'Dün',
    read: true,
  },
]

const ICON_BG_LIGHT: Record<MockNotification['icon'], string> = {
  SendHorizonal: 'bg-sky-100',
  CheckCircle: 'bg-green-100',
  FileText: 'bg-amber-100',
  Bell: 'bg-neutral-100',
}

const ICON_BG_DARK: Record<MockNotification['icon'], string> = {
  SendHorizonal: 'bg-sky-900',
  CheckCircle: 'bg-green-900',
  FileText: 'bg-amber-900',
  Bell: 'bg-neutral-800',
}

const ICON_COLOR_LIGHT: Record<MockNotification['icon'], string> = {
  SendHorizonal: '#0EA5E9',
  CheckCircle: '#16A34A',
  FileText: '#D97706',
  Bell: '#737373',
}

const ICON_COLOR_DARK: Record<MockNotification['icon'], string> = {
  SendHorizonal: '#38BDF8',
  CheckCircle: '#4ADE80',
  FileText: '#FCD34D',
  Bell: '#A3A3A3',
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'
  const ICON_BG = isDark ? ICON_BG_DARK : ICON_BG_LIGHT
  const ICON_COLOR = isDark ? ICON_COLOR_DARK : ICON_COLOR_LIGHT
  const role = useAuthStore((s) => s.role)

  if (role !== 'client') return null

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
        {/* Başlık — scroll ile birlikte kayar */}
        <View className="px-5 pb-4" style={{ paddingTop: insets.top + 8 }}>
          <Text variant="heading">Bildirimler</Text>
        </View>
        {MOCK_NOTIFICATIONS.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20 gap-3">
            <View className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center">
              <Icon name="Bell" size={26} color="#A3A3A3" />
            </View>
            <Text variant="body" color="secondary" align="center">
              Henüz bildiriminiz yok.
            </Text>
          </View>
        ) : (
          MOCK_NOTIFICATIONS.map((notif) => (
            <View
              key={notif.id}
              className={`flex-row items-start gap-3 px-4 py-4 border-b border-neutral-100 dark:border-dark-border ${
                !notif.read ? 'bg-white dark:bg-dark-card' : 'bg-neutral-50 dark:bg-dark-bg'
              }`}
            >
              {!notif.read && (
                <View className="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-sky-500" />
              )}
              <View className={`w-10 h-10 rounded-full items-center justify-center flex-shrink-0 ${ICON_BG[notif.icon]}`}>
                <Icon name={notif.icon} size={18} color={ICON_COLOR[notif.icon]} />
              </View>
              <View className="flex-1 gap-0.5">
                <Text variant="label" className={!notif.read ? 'font-semibold' : ''}>
                  {notif.title}
                </Text>
                <Text variant="caption" color="secondary" numberOfLines={2}>
                  {notif.body}
                </Text>
                <Text variant="caption" color="tertiary" className="mt-1">
                  {notif.time}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

