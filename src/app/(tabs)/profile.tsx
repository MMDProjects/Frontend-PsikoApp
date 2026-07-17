import { Alert, Pressable, ScrollView, Share, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { useThemeColors } from '@/core/theme'
import { getFullName, getInitials } from '@/core/utils/personName'
import { useAuthStore, useLogoutMutation } from '@/domains/auth'
import { useThemeStore } from '@/store/themeStore'

import type { IconName } from '@/core/components/atoms/Icon'

type MenuItem = {
  icon: IconName
  label: string
  onPress: () => void
  value?: string
  /** false ise satır bir sayfaya değil, doğrudan bir aksiyona (Alert, Share, vb.) bağlıdır — ok gösterilmez */
  hasArrow?: boolean
}

type MenuSection = {
  title: string
  items: MenuItem[]
}

function SectionCard({ items }: { items: MenuItem[] }) {
  const colors = useThemeColors()
  return (
    <View>
      {items.map((item, i) => (
        <Pressable
          key={i}
          onPress={item.onPress}
          className="px-4 py-4 flex-row items-center gap-3 active:opacity-90"
        >
          <Icon name={item.icon} size={18} color={colors.contentSecondary} />
          <Text variant="body" className="flex-1 dark:text-[#F5F5F7]">{item.label}</Text>
          {item.value ? (
            <Text variant="caption" color="tertiary">{item.value}</Text>
          ) : null}
          {item.hasArrow !== false && (
            <Icon name="ChevronRight" size={16} color={colors.contentDisabled} />
          )}
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
  const colors = useThemeColors()
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

  const handleInviteFriend = () => {
    Share.share({
      message: 'PsikoAl\'ı senin için önerdim! Ücretsiz psikolojik test çöz, sana uygun bir psikologla eşleş.',
    }).catch(() => undefined)
  }

  const handleRateUs = () => {
    Alert.alert('Bizi Değerlendir', 'Uygulamamızı beğendin mi?', [
      {
        text: 'Hayır',
        onPress: () => Alert.alert('Önerin Bizim İçin Değerli', 'Öneri formu yakında web sitemizde aktif olacak.'),
      },
      {
        text: 'Evet',
        onPress: () => Alert.alert('Teşekkürler!', 'Değerlendirme sayfası yakında aktif olacak.'),
      },
    ])
  }

  const handleComingSoon = (title: string) => {
    Alert.alert(title, 'Bu özellik yakında aktif olacak.')
  }

  const initials = getInitials(user) || 'K'

  const communitySection: MenuSection = {
    title: 'TOPLULUK',
    items: [
      { icon: 'UserPlus', label: 'Arkadaşlarını Davet Et', hasArrow: false, onPress: handleInviteFriend },
      { icon: 'Heart',    label: 'Bizi Değerlendir',       hasArrow: false, onPress: handleRateUs },
    ],
  }

  const appSection: MenuSection = {
    title: 'UYGULAMA',
    items: [
      { icon: 'Sun',        label: 'Görünüm',                 value: THEME_LABELS[preference], hasArrow: false, onPress: handleThemePress },
      { icon: 'Bell',       label: 'Bildirim Ayarları',       hasArrow: false, onPress: () => handleComingSoon('Bildirim Ayarları') },
      { icon: 'LifeBuoy',   label: 'Destek, Talep ve Öneri',  hasArrow: false, onPress: () => handleComingSoon('Destek, Talep ve Öneri') },
    ],
  }

  const privacySection: MenuSection = {
    title: 'VERİ VE GİZLİLİK',
    items: [
      { icon: 'ShieldCheck', label: 'Veri ve Gizlilik', onPress: () => router.push('/profile/privacy' as never) },
    ],
  }

  const expertSections: MenuSection[] = [
    {
      title: 'HESAP',
      items: [
        { icon: 'User',        label: 'Kişisel Bilgiler',           onPress: () => router.push('/profile/personal' as never) },
        { icon: 'Stethoscope', label: 'Mesleki Bilgiler',           onPress: () => router.push('/profile/professional' as never) },
        { icon: 'FileText',    label: 'Belgeler ve Bağlantılar',    onPress: () => router.push('/profile/documents' as never) },
        { icon: 'Star',        label: 'Danışan Yorumları',          onPress: () => user && router.push(`/expert/${user.id}` as never) },
        { icon: 'Lock',        label: 'Şifre Yönetimi',             onPress: () => router.push('/profile/password' as never) },
      ],
    },
    {
      title: 'FİNANS',
      items: [
        { icon: 'CreditCard', label: 'Cüzdanım', onPress: () => router.push('/payment/packages' as never) },
      ],
    },
    communitySection,
    appSection,
    privacySection,
  ]

  const clientSections: MenuSection[] = [
    {
      title: 'HESAP',
      items: [
        { icon: 'User',  label: 'Kişisel Bilgiler',        onPress: () => router.push('/profile/personal' as never) },
        { icon: 'Brain', label: 'Testler',         onPress: () => router.push('/assessment/list' as never) },
        { icon: 'Lock',  label: 'Şifre Yönetimi',  onPress: () => router.push('/profile/password' as never) },
      ],
    },
    communitySection,
    appSection,
    privacySection,
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
              {getFullName(user) || 'Kullanıcı'}
            </Text>
            <Text variant="caption" color="secondary">{user?.email ?? ''}</Text>
          </View>
        </View>

        {/* ── Sections ── */}
        {sections.map((section) => (
          <View key={section.title}>
            <View className="mx-4 mt-4 h-px bg-neutral-200 dark:bg-neutral-800" />
            <View className="px-4 pt-4 pb-2">
              <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                {section.title}
              </Text>
            </View>
            <SectionCard items={section.items} />
          </View>
        ))}

        {/* ── Çıkış Yap ── */}
        <View className="mx-4 mt-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        <Pressable
          onPress={() => logout()}
          disabled={isPending}
          className="px-4 py-4 flex-row items-center gap-3 active:opacity-90"
        >
          <Icon name="LogOut" size={18} color={colors.error} />
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
