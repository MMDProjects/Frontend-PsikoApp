import { ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton, SkeletonGroup } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useClientProfileQuery } from '@/domains/client'

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const { data: client, isLoading, isError } = useClientProfileQuery(id ?? '')
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

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
          <ScreenTitle title="Danışan Profili" />
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
