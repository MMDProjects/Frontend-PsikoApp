import { useCallback, useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Badge } from '@/core/components/atoms/Badge'
import { Chip } from '@/core/components/atoms/Chip'
import { Skeleton, SkeletonGroup } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { RatingRow } from '@/core/components/molecules/RatingRow'
import { SearchBar } from '@/core/components/molecules/SearchBar'
import { useExpertListQuery } from '@/domains/expert'
import { ExpertSpecializations } from '@/domains/expert'

import type { Expert } from '@/domains/expert'

// ─── Expert list card (mini) ──────────────────────────────────────────────────

type ExpertCardProps = {
  expert: Expert
  onPress: () => void
}

function ExpertCard({ expert, onPress }: ExpertCardProps) {
  const initials = expert.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 px-4 py-4 bg-white border-b border-neutral-100 active:bg-neutral-50"
    >
      <Avatar
        size="md"
        src={expert.avatarUrl ?? undefined}
        initials={initials}
        isVerified={expert.isVerified}
      />

      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-2">
          <Text variant="label" className="font-semibold flex-1">{expert.name}</Text>
          {expert.status === 'pending' && (
            <Badge label="Onay Bekliyor" variant="warning" size="sm" />
          )}
        </View>
        <Text variant="caption" color="secondary">{expert.title}</Text>
        <RatingRow rating={expert.rating} reviewCount={expert.reviewCount} size="sm" />
      </View>

      <View className="items-end gap-1">
        <Text variant="caption" color="tertiary">{expert.experienceYears} yıl</Text>
      </View>
    </Pressable>
  )
}

function ExpertCardSkeleton() {
  return (
    <View className="flex-row items-center gap-4 px-4 py-4 bg-white border-b border-neutral-100">
      <Skeleton variant="circle" height={40} width={40} />
      <SkeletonGroup className="flex-1" gap="sm">
        <Skeleton variant="line" width="50%" height={14} />
        <Skeleton variant="line" width="35%" height={12} />
        <Skeleton variant="line" width="45%" height={12} />
      </SkeletonGroup>
    </View>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selectedSpec, setSelectedSpec] = useState<string | undefined>()

  const { data, isLoading, isError, refetch } = useExpertListQuery({
    search: search || undefined,
    specialization: selectedSpec,
  })

  const experts = data?.data ?? []

  const handleExpertPress = useCallback(
    (id: string) => router.push(`/expert/${id}`),
    [router]
  )

  const toggleSpec = (spec: string) =>
    setSelectedSpec((prev) => (prev === spec ? undefined : spec))

  return (
    <View className="flex-1 bg-surface-base">
      {/* Header */}
      <View className="bg-white border-b border-neutral-100 px-4 pt-14 pb-3 gap-3">
        <Text variant="heading">Uzman Bul</Text>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSearch={setSearch}
          placeholder="Ad, ünvan veya uzmanlık ara..."
        />
      </View>

      {/* Specialization filters */}
      <View className="bg-white border-b border-neutral-100">
        <FlatList
          horizontal
          data={ExpertSpecializations as unknown as string[]}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 py-3 gap-2"
          renderItem={({ item }) => (
            <Chip
              label={item}
              isSelected={selectedSpec === item}
              onPress={() => toggleSpec(item)}
              variant="filter"
            />
          )}
        />
      </View>

      {/* List */}
      {isLoading ? (
        <View>
          {Array.from({ length: 6 }).map((_, i) => (
            <ExpertCardSkeleton key={i} />
          ))}
        </View>
      ) : isError ? (
        <EmptyState
          icon="WifiOff"
          title="Yüklenemedi"
          description="Uzmanlar listesi alınamadı. İnternet bağlantınızı kontrol edin."
          ctaLabel="Tekrar Dene"
          onCta={refetch}
        />
      ) : experts.length === 0 ? (
        <EmptyState
          icon="Search"
          title="Sonuç bulunamadı"
          description={
            search
              ? `"${search}" için sonuç yok. Farklı bir arama deneyin.`
              : 'Bu kriterlere uyan uzman bulunamadı.'
          }
          ctaLabel={selectedSpec ? 'Filtreyi Kaldır' : undefined}
          onCta={selectedSpec ? () => setSelectedSpec(undefined) : undefined}
        />
      ) : (
        <FlatList
          data={experts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpertCard expert={item} onPress={() => handleExpertPress(item.id)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-10"
          ListFooterComponent={
            data?.meta
              ? () => (
                  <Text variant="caption" color="tertiary" align="center" className="py-4">
                    {data.meta!.total} uzman listelendi
                  </Text>
                )
              : null
          }
        />
      )}
    </View>
  )
}
