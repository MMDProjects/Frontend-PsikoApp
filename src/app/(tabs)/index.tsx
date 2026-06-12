import { FlatList, Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useAuthStore } from '@/domains/auth'
import { useClientListQuery, MATCH_STATUS_CONFIG } from '@/domains/client'
import { Badge } from '@/core/components/atoms/Badge'

function ExpertHomeScreen() {
  const router = useRouter()
  const { data: clients, isLoading } = useClientListQuery()

  return (
    <View className="flex-1 bg-surface-base">
      {/* Header */}
      <View className="px-5 pt-14 pb-4 bg-white border-b border-neutral-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text variant="heading">Danışanlarım</Text>
            <Text variant="caption" color="secondary">
              {clients ? `${clients.length} aktif danışan` : 'Yükleniyor...'}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/client/new' as never)}
            className="w-10 h-10 rounded-full bg-sky-50 items-center justify-center active:bg-sky-100"
          >
            <Icon name="UserPlus" size={20} color="#0EA5E9" />
          </Pressable>
        </View>
      </View>

      {isLoading && (
        <View className="px-4 py-4 gap-3">
          {[1, 2, 3].map((i) => (
            <View key={i} className="bg-white border border-neutral-100 rounded-2xl p-4 flex-row items-center gap-3">
              <Skeleton variant="circle" width={44} height={44} />
              <View className="flex-1 gap-2">
                <Skeleton variant="line" width="50%" height={14} />
                <Skeleton variant="line" width="30%" height={12} />
              </View>
            </View>
          ))}
        </View>
      )}

      {clients && clients.length === 0 && (
        <EmptyState
          icon="Users"
          title="Henüz danışanınız yok"
          description="Yeni danışan ekleyerek platforma davet edebilirsiniz."
          ctaLabel="Danışan Ekle"
          onCta={() => router.push('/client/new' as never)}
        />
      )}

      {clients && clients.length > 0 && (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 py-4 gap-3"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const statusConfig = MATCH_STATUS_CONFIG[item.matchStatus]
            return (
              <Pressable
                onPress={() => router.push(`/client/${item.id}`)}
                className="bg-white border border-neutral-100 rounded-2xl px-4 py-4 flex-row items-center gap-3 active:bg-neutral-50"
              >
                <Avatar
                  size="md"
                  initials={item.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                />
                <View className="flex-1 gap-0.5">
                  <Text variant="label" className="font-semibold">{item.fullName}</Text>
                  <Text variant="caption" color="secondary">{item.email ?? item.phone ?? ''}</Text>
                </View>
                <Badge
                  label={statusConfig.label}
                  variant={statusConfig.variant as 'sky' | 'warning' | 'neutral'}
                />
                <Icon name="ChevronRight" size={16} color="#A3A3A3" />
              </Pressable>
            )
          }}
        />
      )}
    </View>
  )
}

function ClientHomeScreen() {
  const router = useRouter()
  const { user } = useAuthStore()

  return (
    <View className="flex-1 bg-surface-base">
      {/* Header */}
      <View className="px-5 pt-14 pb-5 bg-white border-b border-neutral-100">
        <Text variant="heading">Merhaba{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!</Text>
        <Text variant="body" color="secondary">Size uygun psikologu keşfedin.</Text>
      </View>

      <View className="px-4 py-5 gap-4">
        {/* Test CTA */}
        <Pressable
          onPress={() => router.push('/assessment')}
          className="bg-sky-50 border border-sky-200 rounded-2xl px-5 py-4 flex-row items-center gap-4 active:bg-sky-100"
        >
          <View className="w-12 h-12 rounded-full bg-sky-100 items-center justify-center">
            <Icon name="Brain" size={22} color="#0EA5E9" />
          </View>
          <View className="flex-1">
            <Text variant="label" className="text-sky-800 font-semibold">Ücretsiz Psikolojik Test</Text>
            <Text variant="caption" className="text-sky-600">Size uygun uzmanı bulmak için</Text>
          </View>
          <Icon name="ChevronRight" size={16} color="#0369A1" />
        </Pressable>

        {/* Psikolog bul */}
        <Pressable
          onPress={() => router.push('/(tabs)/explore')}
          className="bg-white border border-neutral-100 rounded-2xl px-5 py-4 flex-row items-center gap-4 active:bg-neutral-50"
        >
          <View className="w-12 h-12 rounded-full bg-neutral-100 items-center justify-center">
            <Icon name="Search" size={22} color="#737373" />
          </View>
          <View className="flex-1">
            <Text variant="label" className="font-semibold">Psikolog Bul</Text>
            <Text variant="caption" color="secondary">Uzman listesini keşfet</Text>
          </View>
          <Icon name="ChevronRight" size={16} color="#A3A3A3" />
        </Pressable>

        {/* Tekliflerim */}
        <Pressable
          onPress={() => router.push('/(tabs)/offers')}
          className="bg-white border border-neutral-100 rounded-2xl px-5 py-4 flex-row items-center gap-4 active:bg-neutral-50"
        >
          <View className="w-12 h-12 rounded-full bg-neutral-100 items-center justify-center">
            <Icon name="Bell" size={22} color="#737373" />
          </View>
          <View className="flex-1">
            <Text variant="label" className="font-semibold">Tekliflerim</Text>
            <Text variant="caption" color="secondary">Gelen teklifleri görüntüle</Text>
          </View>
          <Icon name="ChevronRight" size={16} color="#A3A3A3" />
        </Pressable>
      </View>
    </View>
  )
}

export default function HomeScreen() {
  const role = useAuthStore((s) => s.role)
  return role === 'expert' ? <ExpertHomeScreen /> : <ClientHomeScreen />
}
