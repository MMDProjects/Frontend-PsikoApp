import { Pressable, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { useAuthStore, useLogoutMutation } from '@/domains/auth'

import type { IconName } from '@/core/components/atoms/Icon'

type MenuItem = {
  icon: IconName
  label: string
  onPress: () => void
  destructive?: boolean
}

export default function ProfileScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { mutate: logout, isPending } = useLogoutMutation()
  const isExpert = user?.role === 'expert'

  const menuItems: MenuItem[] = [
    ...(isExpert ? [
      {
        icon: 'User' as IconName,
        label: 'Uzman Profilim',
        onPress: () => user && router.push(`/expert/${user.id}`),
      },
    ] : []),
    {
      icon: 'CreditCard' as IconName,
      label: 'Seans Paketleri',
      onPress: () => router.push('/payment/packages'),
    },
    {
      icon: 'Brain' as IconName,
      label: 'Psikolojik Test',
      onPress: () => router.push('/assessment'),
    },
    {
      icon: 'Bell' as IconName,
      label: 'Bildirim Ayarları',
      onPress: () => {},
    },
    {
      icon: 'HelpCircle' as IconName,
      label: 'Yardım & Destek',
      onPress: () => {},
    },
    {
      icon: 'LogOut' as IconName,
      label: isPending ? 'Çıkış Yapılıyor...' : 'Çıkış Yap',
      onPress: () => logout(),
      destructive: true,
    },
  ]

  return (
    <ScrollView className="flex-1 bg-surface-base" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-white border-b border-neutral-100 px-5 pt-14 pb-6">
        <View className="flex-row items-center gap-4">
          <Avatar
            size="xl"
            initials={(user?.fullName ?? 'K').split(' ').map((w) => w[0]).join('').slice(0, 2)}
            isVerified={isExpert}
          />
          <View className="flex-1 gap-1">
            <Text variant="subheading" className="font-semibold">
              {user?.fullName ?? 'Kullanıcı'}
            </Text>
            <Text variant="caption" color="secondary">{user?.email ?? ''}</Text>
            <View className="flex-row items-center gap-1.5 mt-1">
              <View className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-100">
                <Text variant="caption" className="text-sky-700 font-semibold">
                  {isExpert ? 'Uzman' : 'Danışan'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Menu items */}
      <View className="px-4 py-4 gap-2">
        {menuItems.map((item, i) => (
          <Pressable
            key={i}
            onPress={item.onPress}
            disabled={isPending && item.destructive}
            className="bg-white border border-neutral-100 rounded-xl px-4 py-4 flex-row items-center gap-3 active:bg-neutral-50"
          >
            <View className={`w-9 h-9 rounded-full items-center justify-center ${
              item.destructive ? 'bg-red-50' : 'bg-neutral-100'
            }`}>
              <Icon
                name={item.icon}
                size={18}
                color={item.destructive ? '#DC2626' : '#404040'}
              />
            </View>
            <Text
              variant="body"
              className={item.destructive ? 'text-semantic-error flex-1' : 'flex-1'}
            >
              {item.label}
            </Text>
            {!item.destructive && (
              <Icon name="ChevronRight" size={16} color="#A3A3A3" />
            )}
          </Pressable>
        ))}
      </View>

      <View className="px-5 pb-10">
        <Text variant="caption" color="secondary" className="text-center">
          PsikoAl v1.0.0
        </Text>
      </View>
    </ScrollView>
  )
}
