import { Alert, Pressable, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { useAuthStore, useLogoutMutation } from '@/domains/auth'
import { useThemeStore } from '@/store/themeStore'

import type { IconName } from '@/core/components/atoms/Icon'

type MenuItem = {
  icon: IconName
  label: string
  onPress: () => void
  value?: string
}

type MenuSection = {
  title: string
  items: MenuItem[]
}

function SectionCard({ items, isDark }: { items: MenuItem[]; isDark: boolean }) {
  const iconColor = isDark ? '#A3A3A3' : '#404040'
  return (
    <View>
      {items.map((item, i) => (
        <Pressable
          key={i}
          onPress={item.onPress}
          className="px-4 py-4 flex-row items-center gap-3 active:opacity-90"
        >
          <Icon name={item.icon} size={18} color={iconColor} />
          <Text variant="body" className="flex-1 dark:text-[#F5F5F7]">{item.label}</Text>
          {item.value ? (
            <Text variant="caption" color="tertiary">{item.value}</Text>
          ) : null}
          <Icon name="ChevronRight" size={16} color={isDark ? '#525252' : '#A3A3A3'} />
        </Pressable>
      ))}
    </View>
  )
}

const THEME_LABELS: Record<string, string> = {
  light: 'Açık', dark: 'Koyu', system: 'Sistem',
}

export default function SettingsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const { user } = useAuthStore()
  const { mutate: logout, isPending } = useLogoutMutation()
  const isExpert = user?.role === 'expert'
  const { preference, setPreference } = useThemeStore()

  const handleThemePress = () => {
    Alert.alert('Görünüm', 'Tema tercihini seç', [
      { text: 'Açık Tema',    onPress: () => setPreference('light')  },
      { text: 'Koyu Tema',    onPress: () => setPreference('dark')   },
      { text: 'Sistem Ayarı', onPress: () => setPreference('system') },
      { text: 'Vazgeç', style: 'cancel' },
    ])
  }

  const initials = (user?.fullName ?? 'K')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

  const expertSections: MenuSection[] = [
    {
      title: 'HESAP',
      items: [
        { icon: 'User',        label: 'Uzman Profilim',       onPress: () => user && router.push(`/expert/${user.id}` as never) },
        { icon: 'Stethoscope', label: 'Uzmanlık Alanlarım',   onPress: () => user && router.push(`/expert/${user.id}` as never) },
        { icon: 'Star',        label: 'Danışan Yorumlarım',   onPress: () => {} },
      ],
    },
    {
      title: 'FİNANS',
      items: [
        { icon: 'CreditCard', label: 'Cüzdanım', onPress: () => router.push('/payment/packages' as never) },
      ],
    },
    {
      title: 'UYGULAMA',
      items: [
        { icon: 'Sun',        label: 'Görünüm',          value: THEME_LABELS[preference], onPress: handleThemePress },
        { icon: 'Bell',       label: 'Bildirim Ayarları', onPress: () => {} },
        { icon: 'HelpCircle', label: 'Yardım & Destek',   onPress: () => {} },
      ],
    },
  ]

  const clientSections: MenuSection[] = [
    {
      title: 'HESAP',
      items: [
        { icon: 'User',  label: 'Profilim',        onPress: () => {} },
        { icon: 'Brain', label: 'Psikolojik Test', onPress: () => router.push('/assessment/list' as never) },
      ],
    },
    {
      title: 'FİNANS',
      items: [
        { icon: 'CreditCard', label: 'Seans Paketleri', onPress: () => router.push('/payment/packages' as never) },
      ],
    },
    {
      title: 'UYGULAMA',
      items: [
        { icon: 'Sun',        label: 'Görünüm',          value: THEME_LABELS[preference], onPress: handleThemePress },
        { icon: 'Bell',       label: 'Bildirim Ayarları', onPress: () => {} },
        { icon: 'HelpCircle', label: 'Yardım & Destek',   onPress: () => {} },
      ],
    },
  ]

  const sections = isExpert ? expertSections : clientSections

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">

        {/* ── Header — Tab 2 & 3 ile aynı yapı ── */}
        <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
          <Text variant="heading">Ayarlar</Text>
        </View>

        {/* ── Profil Kartı ── */}
        <View className="px-4 py-4 flex-row items-center gap-4">
          <Avatar size="xl" initials={initials} isVerified={isExpert} />
          <View className="flex-1 gap-1">
            <Text variant="subheading" className="font-semibold dark:text-[#F5F5F7]">
              {user?.fullName ?? 'Kullanıcı'}
            </Text>
            <Text variant="caption" color="secondary">{user?.email ?? ''}</Text>
          </View>
        </View>

        {/* ── Sections ── */}
        {sections.map((section, i) => (
          <View key={section.title}>
            <View className="mx-4 mt-4 h-px bg-neutral-200 dark:bg-neutral-800" />
            <View className="px-4 pt-4 pb-2">
              <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                {section.title}
              </Text>
            </View>
            <SectionCard items={section.items} isDark={isDark} />
          </View>
        ))}

        {/* ── Çıkış Yap ── */}
        <View className="mx-4 mt-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        <Pressable
          onPress={() => logout()}
          disabled={isPending}
          className="px-4 py-4 flex-row items-center gap-3 active:opacity-90"
        >
          <Icon name="LogOut" size={18} color={isDark ? '#F87171' : '#DC2626'} />
          <Text variant="body" className="flex-1 text-red-600 dark:text-red-400">
            {isPending ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}
          </Text>
        </Pressable>

        {/* ── Versiyon ── */}
        <View className="px-5 pt-6">
          <Text variant="caption" color="secondary" align="center">PsikoAl v1.0.0</Text>
        </View>

      </ScrollView>
    </View>
  )
}
