import { useState } from 'react'
import { FlatList, Modal, Pressable, ScrollView, useColorScheme, useWindowDimensions, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useAssessmentQuery, useSubmitAssessmentMutation, useAssessmentEngine, useAssessmentListQuery, useMyAssessmentResultsQuery } from '@/domains/assessment'
import { useAuthStore } from '@/domains/auth'
import { useMatchesQuery } from '@/domains/match'
import { useExpertOffersQuery } from '@/domains/offer'
import { useListingListQuery, useMyListingsQuery, ListingCard, SPECIALIZATION_OPTIONS } from '@/domains/listing'

import type { ListingListFilters } from '@/domains/listing'

// ─── Sabitler ─────────────────────────────────────────────────────────────────

const ASSESSMENT_CATEGORY_ICON: Record<string, string> = {
  anxiety:    'HeartPulse',
  depression: 'CloudRain',
  stress:     'Wind',
}


const SPEC_ICON_MAP: Record<string, string> = {
  'Kaygı Bozukluğu':   'HeartPulse',
  'Depresyon':         'CloudRain',
  'Panik Atak':        'Zap',
  'Stres Yönetimi':    'Wind',
  'Aile Terapisi':     'Users',
  'Çift Terapisi':     'Heart',
  'İlişki Sorunları':  'Heart',
  'Travma':            'Shield',
  'EMDR':              'Eye',
  'TSSB':              'Activity',
  'OKB':               'RefreshCw',
  'Anksiyete':         'HeartPulse',
  'Sosyal Fobi':       'UserX',
  'Özgüven':           'Star',
  'Uyku Bozukluğu':    'Moon',
  'Motivasyon':        'TrendingUp',
  'Ergen Terapisi':    'User',
  'Boşanma Süreci':    'Scissors',
  'Yas ve Kayıp':      'Umbrella',
  'İş Stresi':         'Briefcase',
}

const SESSION_FILTER_OPTIONS = [
  { label: 'Online',            value: 'online'      as const },
  { label: 'Yüz Yüze',         value: 'yüz_yüze'    as const },
  { label: 'Yüz Yüze / Online', value: 'yüz_yüze_online' as const },
]

const PRICE_FILTER_OPTIONS: Array<{ label: string; budgetMin: number; budgetMax: number | undefined }> = [
  { label: '₺0 – ₺500',      budgetMin: 0,    budgetMax: 500  },
  { label: '₺500 – ₺1500',   budgetMin: 500,  budgetMax: 1500 },
  { label: '₺1500 – ₺3000',  budgetMin: 1500, budgetMax: 3000 },
  { label: '₺3000+',          budgetMin: 3000, budgetMax: undefined },
]

const SORT_OPTIONS = [
  { label: 'En Yeni',       value: 'newest'      },
  { label: 'Yüksek Bütçe',  value: 'budget_desc' },
  { label: 'Düşük Bütçe',   value: 'budget_asc'  },
  { label: 'Az Teklif',     value: 'offer_asc'   },
] as const

type SortValue = typeof SORT_OPTIONS[number]['value']

// ─── Expert Home — Fırsatlar ──────────────────────────────────────────────────

function ExpertHomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { width: SCREEN_W } = useWindowDimensions()
  const { user } = useAuthStore()
  const [expertHeroPage, setExpertHeroPage] = useState(0)

  const { data: expertOffersResponse } = useExpertOffersQuery()
  const pendingOffers = expertOffersResponse?.data?.filter((o) => o.status === 'PENDING') ?? []

  const { data: matchesResponse } = useMatchesQuery()
  const activeMatches = matchesResponse?.filter((m) => m.status === 'ACTIVE') ?? []

  const [filters, setFilters] = useState<ListingListFilters>({})
  const [filterPriceLabels, setFilterPriceLabels] = useState<string[]>([])
  const [filterVisible, setFilterVisible] = useState(false)
  const [tempSpec, setTempSpec] = useState<string[]>([])
  const [tempSession, setTempSession] = useState<string[]>([])
  const [tempPrice, setTempPrice] = useState<string[]>([])
  const [sort, setSort] = useState<SortValue | undefined>(undefined)
  const [sortVisible, setSortVisible] = useState(false)
  const [tempSort, setTempSort] = useState<SortValue | undefined>(undefined)

  const { data: listingsResponse, isLoading, isError, refetch } = useListingListQuery(filters)
  const listings = listingsResponse?.data ?? []

  const activeFilterCount = [
    (filters.specialization?.length ?? 0) > 0,
    (filters.sessionType?.length ?? 0) > 0,
    filterPriceLabels.length > 0,
  ].filter(Boolean).length

  const toggleArr = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]

  const openFilter = () => {
    setTempSpec(filters.specialization ?? [])
    setTempSession(filters.sessionType ?? [])
    setTempPrice(filterPriceLabels)
    setFilterVisible(true)
  }

  const applyFilters = () => {
    const selectedRanges = PRICE_FILTER_OPTIONS.filter((o) => tempPrice.includes(o.label))
    const budgetMin = selectedRanges.length > 0 ? Math.min(...selectedRanges.map((r) => r.budgetMin)) : undefined
    const hasUnbounded = selectedRanges.some((r) => r.budgetMax === undefined)
    const budgetMax = selectedRanges.length > 0 && !hasUnbounded
      ? Math.max(...selectedRanges.map((r) => r.budgetMax as number))
      : undefined
    setFilters({
      specialization: tempSpec.length > 0 ? tempSpec : undefined,
      sessionType: tempSession.length > 0 ? tempSession : undefined,
      budgetMin,
      budgetMax,
    })
    setFilterPriceLabels(tempPrice)
    setFilterVisible(false)
  }

  const clearFilters = () => {
    setFilters({})
    setTempSpec([])
    setTempSession([])
    setTempPrice([])
    setFilterPriceLabels([])
    setFilterVisible(false)
  }

  const openSort = () => {
    setTempSort(sort)
    setSortVisible(true)
  }

  const applySort = () => {
    setSort(tempSort)
    setSortVisible(false)
  }

  const clearSort = () => {
    setSort(undefined)
    setTempSort(undefined)
    setSortVisible(false)
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <FlatList
        data={(!isLoading && !isError) ? listings : []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Hero Section */}
            <View
              className="bg-sky-500 dark:bg-sky-800 px-5"
              style={{
                paddingTop: insets.top + 16,
                paddingBottom: 28,
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
              }}
            >
              <View style={{ paddingRight: 16 }}>
                <Text variant="heading" className="text-white">
                  Merhaba{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
                </Text>
                <Text variant="body" className="text-sky-100 mt-1">
                  Bugün hangi fırsatı değerlendireceksiniz?
                </Text>
              </View>

              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 16, marginHorizontal: -20 }}
                onMomentumScrollEnd={(e) =>
                  setExpertHeroPage(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W))
                }
              >
                {/* 1. Fırsatlar */}
                <View style={{ width: SCREEN_W, paddingHorizontal: 20 }}>
                  <View className="bg-white/15 rounded-xl px-4 py-3 gap-1">
                    <View className="flex-row items-center gap-1.5 mb-0.5">
                      <Icon name="Briefcase" size={13} color="rgba(255,255,255,0.7)" />
                      <Text variant="caption" className="text-white/70 font-semibold">Fırsatlar</Text>
                    </View>
                    <Text variant="label" className="text-white font-semibold">
                      {listings.length > 0 ? `${listings.length} açık ilan` : 'Şu an ilan yok'}
                    </Text>
                    <Text variant="caption" className="text-sky-100">Teklif göndermek için aşağı kaydır</Text>
                  </View>
                </View>

                {/* 2. Tekliflerim */}
                <Pressable
                  onPress={() => router.push('/(tabs)/offers' as never)}
                  style={{ width: SCREEN_W, paddingHorizontal: 20 }}
                  className="active:opacity-85"
                >
                  <View className="bg-white/15 rounded-xl px-4 py-3 gap-1">
                    <View className="flex-row items-center gap-1.5 mb-0.5">
                      <Icon name="SendHorizonal" size={13} color="rgba(255,255,255,0.7)" />
                      <Text variant="caption" className="text-white/70 font-semibold">Tekliflerim</Text>
                    </View>
                    <Text variant="label" className="text-white font-semibold">
                      {pendingOffers.length > 0 ? `${pendingOffers.length} bekleyen teklif` : 'Bekleyen teklif yok'}
                    </Text>
                    <Text variant="caption" className="text-sky-100">Tüm teklifler için dokun</Text>
                  </View>
                </Pressable>

                {/* 3. Eşleşmelerim */}
                <Pressable
                  onPress={() => router.push('/(tabs)/matches' as never)}
                  style={{ width: SCREEN_W, paddingHorizontal: 20 }}
                  className="active:opacity-85"
                >
                  <View className="bg-white/15 rounded-xl px-4 py-3 gap-1">
                    <View className="flex-row items-center gap-1.5 mb-0.5">
                      <Icon name="Users" size={13} color="rgba(255,255,255,0.7)" />
                      <Text variant="caption" className="text-white/70 font-semibold">Eşleşmelerim</Text>
                    </View>
                    <Text variant="label" className="text-white font-semibold">
                      {activeMatches.length > 0 ? `${activeMatches.length} aktif eşleşme` : 'Aktif eşleşme yok'}
                    </Text>
                    <Text variant="caption" className="text-sky-100">Danışanlarınızı görüntüleyin</Text>
                  </View>
                </Pressable>
              </ScrollView>

              {/* Sayfa noktaları */}
              <View className="flex-row justify-center gap-1.5 mt-3">
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={{
                      width: expertHeroPage === i ? 16 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: expertHeroPage === i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.35)',
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Mevcut header içeriği — dokunulmadı */}
            <View className="px-4 pb-3" style={{ paddingTop: 16 }}>
              <View className="flex-row gap-2">
                <Chip
                  label="Filtrele"
                  variant="filter"
                  size="md"
                  isSelected={activeFilterCount > 0}
                  onPress={openFilter}
                  onRemove={activeFilterCount > 0 ? clearFilters : undefined}
                />
                <Chip
                  label="Sırala"
                  variant="filter"
                  size="md"
                  isSelected={sort !== undefined}
                  onPress={openSort}
                  onRemove={sort !== undefined ? () => { setSort(undefined); setTempSort(undefined) } : undefined}
                />
              </View>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        )}
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
                  {i < 3 && <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />}
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

      {/* Filter Modal */}
      <Modal visible={filterVisible} transparent animationType="slide" onRequestClose={() => setFilterVisible(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setFilterVisible(false)} />
        <View className="bg-white dark:bg-dark-card rounded-t-3xl px-5 pt-5 pb-10" style={{ maxHeight: '85%' }}>
          <View className="flex-row items-center justify-between mb-5">
            <Text variant="subheading">Filtrele</Text>
            <Pressable onPress={() => setFilterVisible(false)}>
              <Icon name="X" size={20} color="#171717" />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-5 pb-5">
            <View className="gap-2">
              <Text variant="label" className="font-semibold">Uzmanlık Alanı</Text>
              <View className="flex-row flex-wrap gap-2">
                {(SPECIALIZATION_OPTIONS as unknown as string[]).map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    variant="filter"
                    isSelected={tempSpec.includes(item)}
                    onPress={() => setTempSpec((prev) => toggleArr(prev, item))}
                  />
                ))}
              </View>
            </View>
            <View className="gap-2">
              <Text variant="label" className="font-semibold">Seans Tipi</Text>
              <View className="flex-row flex-wrap gap-2">
                {SESSION_FILTER_OPTIONS.map((opt) => (
                  <Chip
                    key={opt.label}
                    label={opt.label}
                    variant="session"
                    isSelected={tempSession.includes(opt.value)}
                    onPress={() => setTempSession((prev) => toggleArr(prev, opt.value))}
                  />
                ))}
              </View>
            </View>
            <View className="gap-2">
              <Text variant="label" className="font-semibold">Fiyat Aralığı</Text>
              <View className="flex-row flex-wrap gap-2">
                {PRICE_FILTER_OPTIONS.map((opt) => (
                  <Chip
                    key={opt.label}
                    label={opt.label}
                    variant="tag"
                    isSelected={tempPrice.includes(opt.label)}
                    onPress={() => setTempPrice((prev) => toggleArr(prev, opt.label))}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
          <View className="flex-row gap-3 mt-4">
            <Pressable onPress={clearFilters} className="flex-1 items-center border border-neutral-200 dark:border-dark-border2 rounded-xl py-3 active:bg-neutral-50 dark:active:bg-dark-elevated">
              <Text variant="label" color="secondary">Temizle</Text>
            </Pressable>
            <Pressable onPress={applyFilters} className="flex-1 items-center bg-sky-500 rounded-xl py-3 active:bg-sky-600">
              <Text variant="label" className="text-white font-semibold">Uygula</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={sortVisible} transparent animationType="slide" onRequestClose={() => setSortVisible(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setSortVisible(false)} />
        <View className="bg-white dark:bg-dark-card rounded-t-3xl px-5 pt-5 pb-10 gap-5">
          <View className="flex-row items-center justify-between">
            <Text variant="subheading">Sırala</Text>
            <Pressable onPress={() => setSortVisible(false)}>
              <Icon name="X" size={20} color="#171717" />
            </Pressable>
          </View>
          <View className="gap-2">
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => setTempSort((prev) => prev === opt.value ? undefined : opt.value)}
                className={`items-center py-3.5 rounded-xl ${
                  tempSort === opt.value
                    ? 'bg-sky-800 dark:bg-sky-800'
                    : 'bg-neutral-800 dark:bg-neutral-800'
                }`}
              >
                <Text
                  variant="label"
                  className="text-white dark:text-white font-medium"
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <View className="flex-row gap-3">
            <Pressable onPress={clearSort} className="flex-1 items-center border border-neutral-200 dark:border-dark-border2 rounded-xl py-3 active:bg-neutral-50 dark:active:bg-dark-elevated">
              <Text variant="label" color="secondary">Temizle</Text>
            </Pressable>
            <Pressable onPress={applySort} className="flex-1 items-center bg-sky-500 rounded-xl py-3 active:bg-sky-600">
              <Text variant="label" className="text-white font-semibold">Uygula</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

// ─── Client Home — Keşfet ─────────────────────────────────────────────────────

function ClientHomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { width: SCREEN_W } = useWindowDimensions()
  const isDark = useColorScheme() === 'dark'
  const iconColor = isDark ? '#A3A3A3' : '#404040'
  const { user } = useAuthStore()

  const goToNewListing = (spec?: string) => {
    const url = spec ? `/listing/new?spec=${encodeURIComponent(spec)}` : '/listing/new'
    router.push(url as never)
  }

  const allSpecs = SPECIALIZATION_OPTIONS as unknown as string[]

  const { data: assessmentList } = useAssessmentListQuery()
  const { data: myResults } = useMyAssessmentResultsQuery()
  const myResultCount = myResults?.length ?? 0
  const lastResult = myResults?.[0]

  const { data: myListingsResponse } = useMyListingsQuery()
  const activeListings = myListingsResponse?.data?.filter((l) => l.status === 'OPEN') ?? []

  const [quickActionPage, setQuickActionPage] = useState(0)

  // Assessment modal
  const [assessmentVisible, setAssessmentVisible] = useState(false)
  const [assessmentStarted, setAssessmentStarted] = useState(false)

  const { data: assessment, isLoading: assessmentLoading, isError: assessmentError } = useAssessmentQuery()
  const { mutate: submitAssessment, isPending: submitPending } = useSubmitAssessmentMutation()

  const {
    currentQuestion,
    currentAnswer,
    answers,
    progress,
    isFirst,
    isLast,
    canProceed,
    selectOption,
    goNext,
    goPrev,
    currentIndex,
  } = useAssessmentEngine(assessment)

  const handleAssessmentNext = () => {
    if (isLast) {
      if (!assessment) return
      submitAssessment(
        { assessmentId: assessment.id, answers },
        {
          onSuccess: (result) => {
            setAssessmentVisible(false)
            setAssessmentStarted(false)
            router.push(`/assessment/result?resultId=${result.id}` as never)
          },
        }
      )
    } else {
      goNext()
    }
  }

  const handleCloseAssessment = () => {
    setAssessmentVisible(false)
    setAssessmentStarted(false)
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      {/* Absolute header ikonları — scroll etkilemez */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 8,
          right: 20,
          zIndex: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Pressable
          onPress={() => router.push('/(tabs)/notifications' as never)}
          accessibilityRole="button"
          accessibilityLabel="Bildirimler"
          className="w-11 h-11 rounded-full bg-white dark:bg-dark-elevated items-center justify-center active:opacity-70"
        >
          <Icon name="Bell" size={22} color="#0EA5E9" />
        </Pressable>
        <Pressable
          onPress={() => goToNewListing()}
          accessibilityRole="button"
          accessibilityLabel="Yeni İlan Oluştur"
          className="w-11 h-11 rounded-full bg-white dark:bg-dark-elevated items-center justify-center active:opacity-70"
        >
          <Icon name="Plus" size={24} color="#0EA5E9" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-24">
        {/* Hero Section */}
        <View
          className="bg-sky-500 dark:bg-sky-800 px-5"
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: 28,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View style={{ paddingRight: 108 }}>
            <Text variant="heading" className="text-white">
              Merhaba{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
            </Text>
            <Text variant="body" className="text-sky-100 mt-1">
              Bugün nasıl hissediyorsunuz?
            </Text>
          </View>

          {/* Hızlı İşlemler — sayfa gibi kayan yatay carousel */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 16, marginHorizontal: -20 }}
            onMomentumScrollEnd={(e) =>
              setQuickActionPage(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W))
            }
          >
            {/* 1. Son Test Sonucu */}
            <Pressable
              onPress={() => lastResult ? router.push('/assessment/list' as never) : setAssessmentVisible(true)}
              style={{ width: SCREEN_W, paddingHorizontal: 20 }}
              className="active:opacity-85"
            >
              <View className="bg-white/15 rounded-xl px-4 py-3 gap-1">
                <View className="flex-row items-center gap-1.5 mb-0.5">
                  <Icon name="Brain" size={13} color="rgba(255,255,255,0.7)" />
                  <Text variant="caption" className="text-white/70 font-semibold">Son Testim</Text>
                </View>
                {lastResult ? (
                  <>
                    <Text variant="label" className="text-white font-semibold" numberOfLines={1}>{lastResult.assessmentTitle}</Text>
                    <Text variant="caption" className="text-sky-100">{lastResult.level === 'low' ? 'Düşük seviye' : lastResult.level === 'moderate' ? 'Orta seviye' : 'Yüksek seviye'} · {lastResult.score} puan</Text>
                  </>
                ) : (
                  <>
                    <Text variant="label" className="text-white font-semibold">Henüz test yok</Text>
                    <Text variant="caption" className="text-sky-100">Teste başlamak için dokun</Text>
                  </>
                )}
              </View>
            </Pressable>

            {/* 2. İlanlarım */}
            <Pressable
              onPress={() => router.push('/(tabs)/offers' as never)}
              style={{ width: SCREEN_W, paddingHorizontal: 20 }}
              className="active:opacity-85"
            >
              <View className="bg-white/15 rounded-xl px-4 py-3 gap-1">
                <View className="flex-row items-center gap-1.5 mb-0.5">
                  <Icon name="FileText" size={13} color="rgba(255,255,255,0.7)" />
                  <Text variant="caption" className="text-white/70 font-semibold">İlanlarım</Text>
                </View>
                <Text variant="label" className="text-white font-semibold">
                  {activeListings.length > 0 ? `${activeListings.length} aktif ilan` : 'Henüz ilan yok'}
                </Text>
                <Text variant="caption" className="text-sky-100">
                  {activeListings.length > 0 ? 'Teklifleri görüntüle →' : 'İlan oluşturmak için dokun'}
                </Text>
              </View>
            </Pressable>

            {/* 3. Yeni İlan Oluştur */}
            <Pressable
              onPress={() => goToNewListing()}
              style={{ width: SCREEN_W, paddingHorizontal: 20 }}
              className="active:opacity-85"
            >
              <View className="bg-white/15 rounded-xl px-4 py-3 gap-1">
                <View className="flex-row items-center gap-1.5 mb-0.5">
                  <Icon name="PlusCircle" size={13} color="rgba(255,255,255,0.7)" />
                  <Text variant="caption" className="text-white/70 font-semibold">Hızlı İlan</Text>
                </View>
                <Text variant="label" className="text-white font-semibold">Yeni İlan Oluştur</Text>
                <Text variant="caption" className="text-sky-100">Uzmanlardan teklif alın</Text>
              </View>
            </Pressable>

            {/* 4. Psikoloji Testi */}
            <Pressable
              onPress={() => setAssessmentVisible(true)}
              style={{ width: SCREEN_W, paddingHorizontal: 20 }}
              className="active:opacity-85"
            >
              <View className="bg-white/15 rounded-xl px-4 py-3 gap-1">
                <View className="flex-row items-center gap-1.5 mb-0.5">
                  <Icon name="ClipboardList" size={13} color="rgba(255,255,255,0.7)" />
                  <Text variant="caption" className="text-white/70 font-semibold">Değerlendirme</Text>
                </View>
                <Text variant="label" className="text-white font-semibold">Psikoloji Testi</Text>
                <Text variant="caption" className="text-sky-100">Ücretsiz · ~10 dakika</Text>
              </View>
            </Pressable>
          </ScrollView>

          {/* Sayfa noktaları */}
          <View className="flex-row justify-center gap-1.5 mt-3">
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={{
                  width: quickActionPage === i ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: quickActionPage === i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </View>
        </View>

        {/* Psikolojik Değerlendirme */}
        <View>
          <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
            <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
              Kendinizi Tanıyın
            </Text>
            <Pressable onPress={() => router.push('/assessment/list' as never)} className="active:opacity-60">
              <Text variant="caption" className="text-sky-500 font-semibold">Tümünü Gör</Text>
            </Pressable>
          </View>

          {assessmentList?.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setAssessmentVisible(true)}
              className="px-4 py-4 flex-row items-center gap-3 active:opacity-90"
            >
              <Icon
                name={(ASSESSMENT_CATEGORY_ICON[t.category] ?? 'Brain') as any}
                size={18}
                color={isDark ? '#38BDF8' : '#0EA5E9'}
              />
              <Text variant="body" className="flex-1 dark:text-[#F5F5F7]">{t.title}</Text>
              <Text variant="caption" color="tertiary">~{t.estimatedMinutes} dk</Text>
              <Icon name="ChevronRight" size={16} color={isDark ? '#525252' : '#A3A3A3'} />
            </Pressable>
          ))}

          {myResultCount > 0 && (
            <Pressable
              onPress={() => router.push('/assessment/list' as never)}
              className="px-4 py-4 flex-row items-center gap-3 active:opacity-90"
            >
              <Icon name="ClipboardList" size={18} color={isDark ? '#4ADE80' : '#16A34A'} />
              <Text variant="body" className="flex-1 text-emerald-700 dark:text-emerald-400">Sonuçlarım</Text>
              <Text variant="caption" color="tertiary">{myResultCount} tamamlandı</Text>
              <Icon name="ChevronRight" size={16} color={isDark ? '#525252' : '#A3A3A3'} />
            </Pressable>
          )}
        </View>

        <View>
          <View className="mx-4 mt-4 h-px bg-neutral-200 dark:bg-neutral-800" />
          <View className="px-4 pt-4 pb-2">
            <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
              Psikolog Bul
            </Text>
          </View>
          {allSpecs.map((spec) => (
            <Pressable
              key={spec}
              onPress={() => goToNewListing(spec)}
              className="px-4 py-4 flex-row items-center gap-3 active:opacity-90"
            >
              <Icon name={(SPEC_ICON_MAP[spec] ?? 'Circle') as any} size={18} color={iconColor} />
              <Text variant="body" className="flex-1 dark:text-[#F5F5F7]">{spec}</Text>
              <Icon name="ChevronRight" size={16} color={isDark ? '#525252' : '#A3A3A3'} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Assessment Modal */}
      <Modal visible={assessmentVisible} transparent animationType="slide" onRequestClose={handleCloseAssessment}>
        <Pressable className="flex-1 bg-black/40" onPress={handleCloseAssessment} />
        <View className="bg-white dark:bg-dark-card rounded-t-3xl px-5 pt-5 pb-10" style={{ maxHeight: '90%' }}>
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <Text variant="subheading">
              {assessmentStarted
                ? `Soru ${currentIndex + 1} / ${assessment?.questions.length}`
                : 'Değerlendirme Testi'}
            </Text>
            <Pressable onPress={handleCloseAssessment}>
              <Icon name="X" size={20} color="#171717" />
            </Pressable>
          </View>

          {/* Progress bar */}
          {assessmentStarted && (
            <View className="h-1 bg-neutral-100 dark:bg-dark-control rounded-full overflow-hidden mb-5">
              <View className="h-full bg-sky-500 rounded-full" style={{ width: `${progress * 100}%` }} />
            </View>
          )}

          {/* Content */}
          {assessmentLoading ? (
            <View className="gap-4 py-4">
              <View className="items-center py-4">
                <Skeleton variant="circle" width={64} height={64} />
              </View>
              <Skeleton variant="line" width="60%" height={20} />
              <Skeleton variant="line" width="85%" height={14} />
              <Skeleton variant="line" width="70%" height={14} />
            </View>
          ) : assessmentError || !assessment ? (
            <EmptyState
              icon="AlertCircle"
              title="Test yüklenemedi"
              description="Lütfen daha sonra tekrar deneyin."
            />
          ) : !assessmentStarted ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-5 pb-4">
              <View className="items-center gap-4 py-2">
                <View className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950 items-center justify-center">
                  <Icon name="Brain" size={32} color="#0EA5E9" />
                </View>
                <View className="items-center gap-2">
                  <Text variant="label" className="font-bold text-center">{assessment.title}</Text>
                  <Text variant="body" color="secondary" className="text-center">{assessment.description}</Text>
                </View>
                <View className="flex-row items-center gap-5">
                  <View className="flex-row items-center gap-1.5">
                    <Icon name="HelpCircle" size={14} color="#737373" />
                    <Text variant="caption" color="secondary">{assessment.questions.length} soru</Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <Icon name="Clock" size={14} color="#737373" />
                    <Text variant="caption" color="secondary">~{assessment.estimatedMinutes} dakika</Text>
                  </View>
                </View>
              </View>
              <View className="bg-sky-50 dark:bg-sky-950 border border-sky-100 dark:border-sky-800 rounded-xl px-4 py-3 flex-row items-start gap-3">
                <Icon name="Info" size={16} color="#0369A1" />
                <Text variant="caption" className="text-sky-700 dark:text-sky-400 flex-1">
                  Bu test tanı koymaz. Sonuçlar bilgilendirme amaçlıdır. Ücretsiz, kayıt gerektirmez.
                </Text>
              </View>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-5 pb-4">
              {currentQuestion && (
                <>
                  <Text variant="subheading" className="leading-relaxed">{currentQuestion.text}</Text>
                  <View className="gap-3">
                    {currentQuestion.options.map((option) => {
                      const isSelected = currentAnswer?.values.includes(option.value) ?? false
                      return (
                        <Pressable
                          key={option.id}
                          onPress={() => selectOption(option.value)}
                          className={`rounded-xl px-4 py-4 border ${
                            isSelected
                              ? 'bg-sky-50 dark:bg-sky-950 border-sky-300 dark:border-sky-700'
                              : 'bg-white dark:bg-dark-card border-neutral-200 dark:border-dark-border active:bg-neutral-50 dark:active:bg-dark-elevated'
                          }`}
                        >
                          <View className="flex-row items-center gap-3">
                            <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                              isSelected ? 'border-sky-500 bg-sky-500' : 'border-neutral-300 dark:border-neutral-600'
                            }`}>
                              {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
                            </View>
                            <Text variant="body" className={isSelected ? 'text-sky-700 dark:text-sky-400' : ''}>
                              {option.text}
                            </Text>
                          </View>
                        </Pressable>
                      )
                    })}
                  </View>
                </>
              )}
            </ScrollView>
          )}

          {/* Bottom buttons */}
          {!assessmentLoading && !assessmentError && assessment && (
            <View className="flex-row gap-3 mt-4">
              {!assessmentStarted ? (
                <Pressable
                  onPress={() => setAssessmentStarted(true)}
                  className="flex-1 items-center bg-sky-500 rounded-xl py-3 active:bg-sky-600"
                >
                  <Text variant="label" className="text-white font-semibold">Testi Başlat</Text>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    onPress={goPrev}
                    disabled={isFirst}
                    className={`items-center justify-center border border-neutral-200 dark:border-dark-border2 rounded-xl py-3 px-4 ${
                      isFirst ? 'opacity-30' : 'active:bg-neutral-50 dark:active:bg-dark-elevated'
                    }`}
                  >
                    <Icon name="ArrowLeft" size={18} color="#171717" />
                  </Pressable>
                  <Pressable
                    onPress={handleAssessmentNext}
                    disabled={!canProceed || submitPending}
                    className={`flex-1 items-center rounded-xl py-3 ${
                      canProceed && !submitPending
                        ? 'bg-sky-500 active:bg-sky-600'
                        : 'bg-sky-200 dark:bg-sky-900'
                    }`}
                  >
                    <Text variant="label" className="text-white font-semibold">
                      {isLast ? (submitPending ? 'Hesaplanıyor...' : 'Sonuçları Gör') : 'Sonraki'}
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </View>
      </Modal>
    </View>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const role = useAuthStore((s) => s.role)
  return role === 'expert' ? <ExpertHomeScreen /> : <ClientHomeScreen />
}
