import { Pressable, ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton, SkeletonGroup } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useClientProfileQuery } from '@/domains/client'

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { colorScheme } = useColorScheme()
  const arrowColor = colorScheme === 'dark' ? '#F5F5F7' : '#171717'

  const { data: client, isLoading, isError } = useClientProfileQuery(id ?? '')
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      {/* Floating back button */}
      <Pressable
        onPress={() => router.back()}
        style={{ position: 'absolute', top: insets.top + 8, left: 16, zIndex: 10 }}
        className="w-10 h-10 rounded-full bg-white dark:bg-dark-card items-center justify-center active:bg-neutral-100 dark:active:bg-dark-elevated"
      >
        <Icon name="ArrowLeft" size={20} color={arrowColor} />
      </Pressable>

      {isLoading && (
        <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 20, gap: 16 }}>
          <View className="bg-white dark:bg-dark-card border border-neutral-100 dark:border-dark-border rounded-2xl p-5 flex-row items-center gap-4">
            <Skeleton variant="circle" height={56} width={56} />
            <SkeletonGroup className="flex-1" gap="sm">
              <Skeleton variant="line" width="50%" height={16} />
              <Skeleton variant="line" width="65%" height={14} />
              <Skeleton variant="line" width="40%" height={14} />
            </SkeletonGroup>
          </View>
          <Skeleton variant="rect" height={80} borderRadius="xl" />
        </ScrollView>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Yüklenemedi"
          description="Danışan bilgileri alınamadı."
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {client && (
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 40, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-2 pb-3 items-center">
            <Text variant="label" className="font-semibold">Danışan Profili</Text>
          </View>
          <View className="bg-white dark:bg-dark-card border border-neutral-100 dark:border-dark-border rounded-2xl p-5 gap-4">
            <View className="flex-row items-center gap-4">
              <Avatar
                size="lg"
                initials={client.fullName.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
              />
              <View className="flex-1 gap-1">
                <Text variant="subheading">{client.fullName}</Text>
                {client.email && (
                  <Text variant="caption" color="secondary">{client.email}</Text>
                )}
                {client.phone && (
                  <Text variant="caption" color="secondary">{client.phone}</Text>
                )}
              </View>
            </View>
          </View>

          {client.notes && (
            <View className="bg-white dark:bg-dark-card border border-neutral-100 dark:border-dark-border rounded-2xl p-5 gap-2">
              <View className="flex-row items-center gap-2">
                <Icon name="FileText" size={16} color="#737373" />
                <Text variant="label" className="font-semibold">Notlar</Text>
              </View>
              <Text variant="body" color="secondary">{client.notes}</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}
