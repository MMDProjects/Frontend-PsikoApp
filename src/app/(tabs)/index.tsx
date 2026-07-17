import { useState } from 'react'
import { FlatList, Image, Pressable, ScrollView, useColorScheme, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Chip } from '@/core/components/atoms/Chip'
import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Divider } from '@/core/components/atoms/Divider'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { DiscoverMore } from '@/core/components/molecules/DiscoverMore'
import { HeaderActions } from '@/core/components/molecules/HeaderActions'
import { HeroPager } from '@/core/components/organisms/HeroPager'
import { HeroQuickActions } from '@/core/components/organisms/HeroQuickActions'
import { useSuggestionsQuery, SuggestionSlide } from '@/domains/suggestion'
import { useAssessmentListQuery, useMyAssessmentResultsQuery } from '@/domains/assessment'
import { useAuthStore } from '@/domains/auth'
import { useCategoriesQuery } from '@/domains/category'
import { useMatchesQuery } from '@/domains/match'
import { useExpertOffersQuery } from '@/domains/offer'
import {
  useListingListQuery,
  useMyListingsQuery,
  ListingCard,
  ListingFilterModal,
  ListingSortModal,
} from '@/domains/listing'
import { useBlogListQuery, BlogCarousel } from '@/domains/blog'

import type { IconName } from '@/core/components/atoms/Icon'
import type { ListingListFilters, ListingSortValue } from '@/domains/listing'

// TODO: gerçek marka logosu gelince değiştirilecek
const LOGO_PLACEHOLDER = require('../../../assets/images/brand/logo-placeholder.png')

// ─── Expert Home — Fırsatlar ──────────────────────────────────────────────────

function ExpertHomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user } = useAuthStore()

  const { data: suggestions } = useSuggestionsQuery('expert')

  const { data: expertOffersResponse } = useExpertOffersQuery()
  const pendingOffers = expertOffersResponse?.data?.filter((o) => o.status === 'PENDING') ?? []

  const { data: matchesResponse } = useMatchesQuery()
  const activeMatches = matchesResponse?.filter((m) => m.status === 'ACTIVE') ?? []

  const [filters, setFilters] = useState<ListingListFilters>({})
  const [filterPriceLabels, setFilterPriceLabels] = useState<string[]>([])
  const [filterVisible, setFilterVisible] = useState(false)
  const [sort, setSort] = useState<ListingSortValue | undefined>(undefined)
  const [sortVisible, setSortVisible] = useState(false)

  const { data: listingsResponse, isLoading, isError, refetch } = useListingListQuery(filters)
  const listings = listingsResponse?.data ?? []

  const activeFilterCount = [
    (filters.specialization?.length ?? 0) > 0,
    (filters.sessionType?.length ?? 0) > 0,
    filterPriceLabels.length > 0,
  ].filter(Boolean).length

  const clearFilters = () => {
    setFilters({})
    setFilterPriceLabels([])
    setFilterVisible(false)
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <HeaderActions
        actions={[
          { icon: 'Bell', accessibilityLabel: 'Bildirimler', onPress: () => router.push('/notifications' as never) },
        ]}
      />

      <FlatList
        data={(!isLoading && !isError) ? listings : []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Hero Section */}
            <View
              className="bg-sky-500 dark:bg-sky-950 px-5"
              style={{
                paddingTop: insets.top + 8,
                paddingBottom: 24,
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
                overflow: 'hidden',
              }}
            >
              {/* Dekoratif zemin daireleri — her iki temada beyaz ton */}
              <DecorCircles />

              <View style={{ paddingRight: 64 }}>
                {/* Mavi zemin üzerinde okunurluk için beyaz pill — gerçek logo gelince kaldırılabilir */}
                <View className="bg-white rounded-xl self-start px-3 py-1.5">
                  <Image
                    source={LOGO_PLACEHOLDER}
                    style={{ width: 146, height: 34 }}
                    resizeMode="contain"
                    accessibilityLabel="PsikoAl"
                  />
                </View>
                <Text variant="subheading" className="text-white font-bold mt-3">
                  Merhaba{user?.firstName ? `, ${user.firstName}` : ''}!
                </Text>
                <Text variant="caption" className="text-sky-100 mt-0.5">
                  Bugün hangi fırsatı değerlendireceksiniz?
                </Text>
              </View>

              <HeroPager
                pages={[
                  ...(suggestions ?? []).map((s) => <SuggestionSlide key={s.id} suggestion={s} />),
                  <HeroQuickActions
                    key="quick-actions"
                    actions={[
                      {
                        icon: 'Briefcase',
                        label: 'Fırsatlar',
                        badge: listings.length,
                      },
                      {
                        icon: 'SendHorizonal',
                        label: 'Tekliflerim',
                        badge: pendingOffers.length,
                        onPress: () => router.push('/(tabs)/offers' as never),
                      },
                      {
                        icon: 'Users',
                        label: 'Eşleşmelerim',
                        badge: activeMatches.length,
                        onPress: () => router.push('/(tabs)/matches' as never),
                      },
                    ]}
                  />,
                ]}
              />
            </View>

            {/* Filtre / Sırala chip'leri */}
            <View className="px-4 pb-3" style={{ paddingTop: 16 }}>
              <View className="flex-row gap-2">
                <Chip
                  label="Filtrele"
                  variant="filter"
                  size="md"
                  isSelected={activeFilterCount > 0}
                  onPress={() => setFilterVisible(true)}
                  onRemove={activeFilterCount > 0 ? clearFilters : undefined}
                />
                <Chip
                  label="Sırala"
                  variant="filter"
                  size="md"
                  isSelected={sort !== undefined}
                  onPress={() => setSortVisible(true)}
                  onRemove={sort !== undefined ? () => setSort(undefined) : undefined}
                />
              </View>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <Divider spacing="none" className="mx-4" />}
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[1, 2, 3].map((i) => (
                <View key={i}>
                  <View className="px-4 py-4 gap-3">
                    <Skeleton variant="line" width="70%" height={14} />
                    <Skeleton variant="line" width="55%" height={12} />
                    <Skeleton variant="line" width="40%" height={12} />
                  </View>
                  {i < 3 && <Divider spacing="none" className="mx-4" />}
                </View>
              ))}
            </View>
          ) : isError ? (
            <EmptyState
              icon="WifiOff"
              title="Yüklenemedi"
              description="İlanlar alınamadı. Bağlantınızı kontrol edin."
              ctaLabel="Tekrar Dene"
              onCta={refetch}
            />
          ) : (
            <EmptyState
              icon="FileText"
              title="İlan bulunamadı"
              description={
                activeFilterCount > 0
                  ? 'Bu filtreye uyan ilan yok. Filtreyi kaldırın.'
                  : 'Henüz açık ilan yok.'
              }
              ctaLabel={activeFilterCount > 0 ? 'Filtreleri Temizle' : undefined}
              onCta={activeFilterCount > 0 ? clearFilters : undefined}
            />
          )
        }
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            viewerRole="expert"
            hideStatus
            onPress={() => router.push(`/listing/${item.id}` as never)}
          />
        )}
      />

      <ListingFilterModal
        visible={filterVisible}
        current={filters}
        currentPriceLabels={filterPriceLabels}
        onApply={({ filters: next, priceLabels }) => {
          setFilters(next)
          setFilterPriceLabels(priceLabels)
          setFilterVisible(false)
        }}
        onClear={clearFilters}
        onClose={() => setFilterVisible(false)}
      />

      <ListingSortModal
        visible={sortVisible}
        current={sort}
        onApply={(value) => {
          setSort(value)
          setSortVisible(false)
        }}
        onClear={() => {
          setSort(undefined)
          setSortVisible(false)
        }}
        onClose={() => setSortVisible(false)}
      />
    </View>
  )
}

// ─── Client Home — Keşfet ─────────────────────────────────────────────────────

function ClientHomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user } = useAuthStore()
  const isDark = useColorScheme() === 'dark'
  const iconColor = isDark ? '#A3A3A3' : '#404040'

  const { data: categories } = useCategoriesQuery()

  const goToNewListing = (spec?: string) => {
    const url = spec ? `/listing/new?spec=${encodeURIComponent(spec)}` : '/listing/new'
    router.push(url as never)
  }

  const { data: suggestions } = useSuggestionsQuery('client')

  const { data: assessmentList } = useAssessmentListQuery()
  const { data: myResults } = useMyAssessmentResultsQuery()
  const myResultCount = myResults?.length ?? 0
  const lastResult = myResults?.[0]

  const { data: myListingsResponse } = useMyListingsQuery()
  const activeListings = myListingsResponse?.data?.filter((l) => l.status === 'OPEN') ?? []

  const { data: blogData, isLoading: blogsLoading } = useBlogListQuery()
  const blogs = (blogData?.data ?? []).slice(0, 3)

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <HeaderActions
        actions={[
          { icon: 'Bell', accessibilityLabel: 'Bildirimler', onPress: () => router.push('/notifications' as never) },
          { icon: 'Plus', accessibilityLabel: 'Yeni İlan Oluştur', onPress: () => goToNewListing() },
        ]}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-24">
        {/* Hero Section */}
        <View
          className="bg-sky-500 dark:bg-sky-950 px-5"
          style={{
            paddingTop: insets.top + 8,
            paddingBottom: 24,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            overflow: 'hidden',
          }}
        >
          {/* Dekoratif zemin daireleri — her iki temada beyaz ton */}
          <DecorCircles />

          <View style={{ paddingRight: 108 }}>
            {/* Mavi zemin üzerinde okunurluk için beyaz pill — gerçek logo gelince kaldırılabilir */}
            <View className="bg-white rounded-xl self-start px-3 py-1.5">
              <Image
                source={LOGO_PLACEHOLDER}
                style={{ width: 146, height: 34 }}
                resizeMode="contain"
                accessibilityLabel="PsikoAl"
              />
            </View>
            <Text variant="subheading" className="text-white font-bold mt-3">
              Merhaba{user?.firstName ? `, ${user.firstName}` : ''}!
            </Text>
            <Text variant="caption" className="text-sky-100 mt-0.5">
              Bugün nasıl hissediyorsunuz?
            </Text>
          </View>

          <HeroPager
            pages={[
              ...(suggestions ?? []).map((s) => <SuggestionSlide key={s.id} suggestion={s} />),
              <HeroQuickActions
                key="quick-actions"
                actions={[
                  {
                    icon: 'Brain',
                    label: 'Testlerim',
                    badge: myResultCount,
                    onPress: () => router.push((lastResult ? '/assessment/list' : '/assessment') as never),
                  },
                  {
                    icon: 'FileText',
                    label: 'İlanlarım',
                    badge: activeListings.length,
                    onPress: () => router.push('/(tabs)/offers' as never),
                  },
                  {
                    icon: 'PlusCircle',
                    label: 'Yeni İlan',
                    onPress: () => goToNewListing(),
                  },
                  {
                    icon: 'ClipboardList',
                    label: 'Test Çöz',
                    onPress: () => router.push('/assessment' as never),
                  },
                ]}
              />,
            ]}
          />
        </View>

        {/* Psikolojik Değerlendirme — başlıksız, ikonsuz liste + hero dilinde Tümünü Gör */}
        <View className="pt-2">
          {assessmentList?.map((t, i) => (
            <View key={t.id}>
              {i > 0 && <Divider spacing="none" className="mx-4" />}
              <Pressable
                onPress={() => router.push('/assessment' as never)}
                className="px-4 py-4 flex-row items-center justify-between gap-3 active:opacity-80"
              >
                <View className="flex-1 gap-0.5">
                  <Text variant="body" className="font-medium dark:text-[#F5F5F7]">{t.title}</Text>
                  <Text variant="caption" color="tertiary">
                    Ücretsiz · {t.questionCount} soru · ~{t.estimatedMinutes} dk · Kayıt gerekmez
                  </Text>
                </View>
                <Icon name="ChevronRight" size={16} color={isDark ? '#525252' : '#A3A3A3'} />
              </Pressable>
            </View>
          ))}

          <Divider spacing="none" className="mx-4" />
          <DiscoverMore
            onPress={() => router.push('/assessment/list' as never)}
            hint="Tüm testler ve geçmiş sonuçlarınız"
          />
        </View>

        {/* Psikoloji Blogu — başlıksız akış; "Keşfet" kartı carousel sonunda */}
        <View className="mt-4">
          <BlogCarousel
            blogs={blogs}
            isLoading={blogsLoading}
            onPressBlog={(slug) => router.push(`/blog/${slug}` as never)}
            onPressAll={() => router.push('/blog' as never)}
          />
        </View>

        {/* Psikolog Bul — başlık yerine "neden destek almalıyım" satırı + ikonlu liste */}
        <View className="mt-2">
          <DiscoverMore
            icon="HeartHandshake"
            label="Desteğe mi ihtiyacınız var?"
            onPress={() => goToNewListing()}
          />
          {categories?.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => router.push(`/category/${category.slug}` as never)}
              className="px-4 py-4 flex-row items-center gap-3 active:opacity-90"
            >
              {/* REASON: icon adı backend'den düz string olarak gelir, IconName union'ına eşlenir */}
              <Icon name={(category.icon as IconName) ?? 'Circle'} size={18} color={iconColor} />
              <Text variant="body" className="flex-1 dark:text-[#F5F5F7]">{category.name}</Text>
              <Icon name="ChevronRight" size={16} color={isDark ? '#525252' : '#A3A3A3'} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const role = useAuthStore((s) => s.role)
  return role === 'expert' ? <ExpertHomeScreen /> : <ClientHomeScreen />
}
