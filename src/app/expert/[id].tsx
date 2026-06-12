import { Pressable, ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton, SkeletonGroup } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { StatCard } from '@/core/components/molecules/StatCard'
import { useAuthStore } from '@/domains/auth'
import { useExpertProfileQuery } from '@/domains/expert'
import { ExpertProfileHero } from '@/domains/expert/components/ExpertProfileHero'

export default function ExpertProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const role = useAuthStore((s) => s.role)

  const { data: expert, isLoading, isError } = useExpertProfileQuery(id ?? '')

  return (
    <View className="flex-1 bg-surface-base">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-3 border-b border-neutral-100 bg-white">
        <Pressable
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-full active:bg-neutral-100"
        >
          <Icon name="ArrowLeft" size={22} color="#171717" />
        </Pressable>
        <Text variant="label" className="ml-2 font-semibold">Uzman Profili</Text>
      </View>

      <ScrollView
        contentContainerClassName="px-4 py-5 gap-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {isLoading && <ExpertProfileSkeleton />}

        {isError && (
          <View className="flex-1 items-center justify-center py-20 gap-3">
            <Icon name="AlertCircle" size={40} color="#A3A3A3" />
            <Text variant="body" color="secondary" align="center">
              Uzman profili yüklenemedi.
            </Text>
            <Button
              label="Tekrar Dene"
              onPress={() => router.back()}
              variant="secondary"
            />
          </View>
        )}

        {expert && (
          <>
            <ExpertProfileHero expert={expert} />

            {/* İstatistikler */}
            <View className="flex-row gap-3">
              <StatCard
                value={`${expert.experienceYears} yıl`}
                label="Deneyim"
                accentColor="#0EA5E9"
                className="flex-1"
              />
              <StatCard
                value={expert.rating.toFixed(1)}
                label="Ortalama Puan"
                accentColor="#0EA5E9"
                className="flex-1"
              />
              <StatCard
                value={expert.reviewCount.toString()}
                label="Değerlendirme"
                accentColor="#0EA5E9"
                className="flex-1"
              />
            </View>

            {/* Biyografi */}
            {expert.bio ? (
              <View className="bg-white border border-neutral-100 rounded-2xl p-5 gap-2">
                <Text variant="label" className="font-semibold">Hakkında</Text>
                <Text variant="body" color="secondary">{expert.bio}</Text>
              </View>
            ) : null}

            {/* Onay bekliyor uyarısı */}
            {expert.status === 'pending' && (
              <View className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex-row items-center gap-3">
                <Icon name="Clock" size={18} color="#CA8A04" />
                <Text variant="caption" className="text-yellow-700 flex-1">
                  Bu profil henüz admin onayı bekliyor.
                </Text>
              </View>
            )}

            {/* CTA — sadece danışanlar görebilir */}
            {role === 'client' && expert.status === 'approved' && (
              <View className="mt-2">
                <Button
                  label="Teklif İste"
                  onPress={() => router.push(`/offer/new?expertId=${id}`)}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  )
}

function ExpertProfileSkeleton() {
  return (
    <View className="gap-4">
      {/* Hero skeleton */}
      <View className="bg-white border border-neutral-100 rounded-2xl p-5 gap-4">
        <View className="flex-row items-center gap-4">
          <Skeleton variant="circle" height={80} width={80} />
          <SkeletonGroup className="flex-1" gap="sm">
            <Skeleton variant="line" width="60%" height={18} />
            <Skeleton variant="line" width="40%" height={14} />
            <Skeleton variant="line" width="50%" height={14} />
          </SkeletonGroup>
        </View>
        <View className="flex-row gap-2">
          <Skeleton variant="rect" width={80} height={28} borderRadius="full" />
          <Skeleton variant="rect" width={100} height={28} borderRadius="full" />
          <Skeleton variant="rect" width={70} height={28} borderRadius="full" />
        </View>
      </View>

      {/* Stats skeleton */}
      <View className="flex-row gap-3">
        {[1, 2, 3].map((i) => (
          <View key={i} className="flex-1">
            <Skeleton variant="rect" height={72} borderRadius="xl" />
          </View>
        ))}
      </View>

      {/* Bio skeleton */}
      <View className="bg-white border border-neutral-100 rounded-2xl p-5 gap-2">
        <Skeleton variant="line" width="30%" height={16} />
        <SkeletonGroup gap="sm">
          <Skeleton variant="line" />
          <Skeleton variant="line" />
          <Skeleton variant="line" width="70%" />
        </SkeletonGroup>
      </View>
    </View>
  )
}
