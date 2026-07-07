import { useState } from 'react'
import { FlatList, Pressable, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useAuthStore } from '@/domains/auth'
import { useMyListingsQuery, ListingCard, formatClientName } from '@/domains/listing'
import { useExpertOffersQuery, OFFER_STATUS_CONFIG } from '@/domains/offer'

import type { OfferStatus } from '@/domains/offer'

const TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]}`
}

const EXPERT_FILTERS: Array<{ label: string; value: OfferStatus }> = [
  { label: 'Beklemede',    value: 'PENDING'   },
  { label: 'Kabul',        value: 'ACCEPTED'  },
  { label: 'Reddedildi',   value: 'REJECTED'  },
  { label: 'Geri Çekildi', value: 'WITHDRAWN' },
]

type ListingFilter = 'OPEN' | 'MATCHED' | 'CLOSED' | 'EXPIRED'

const CLIENT_LISTING_FILTERS: Array<{ label: string; value: ListingFilter }> = [
  { label: 'Açık',         value: 'OPEN'    },
  { label: 'Eşleşildi',    value: 'MATCHED' },
  { label: 'Kapalı',       value: 'CLOSED'  },
  { label: 'Süresi Doldu', value: 'EXPIRED' },
]

// ─── Expert — Tekliflerim ─────────────────────────────────────────────────────

function ExpertOffersScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [filter, setFilter] = useState<OfferStatus | 'ALL'>('ALL')
  const { data: offersResponse, isLoading, isError, refetch } = useExpertOffersQuery()

  const offers = offersResponse?.data ?? []
  const filtered = filter === 'ALL' ? offers : offers.filter((o) => o.status === filter)

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <FlatList
        data={(!isLoading && !isError) ? filtered : []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        )}
        ListHeaderComponent={
          <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
            <View className="flex-row items-center justify-between mb-3">
              <Text variant="heading">Tekliflerim</Text>
              <Text variant="caption" color="secondary">{offers.length} teklif</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
              {EXPERT_FILTERS.map((item) => (
                <Chip
                  key={item.value}
                  label={item.label}
                  variant="filter"
                  size="md"
                  isSelected={filter === item.value}
                  onPress={() => setFilter(item.value)}
                  onRemove={filter === item.value ? () => setFilter('ALL') : undefined}
                />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[1, 2, 3].map((i) => (
                <View key={i}>
                  <View className="px-4 py-4 gap-3">
                    <Skeleton variant="line" width="65%" height={14} />
                    <Skeleton variant="line" width="40%" height={12} />
                  </View>
                  {i < 3 && <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />}
                </View>
              ))}
            </View>
          ) : isError ? (
            <EmptyState icon="WifiOff" title="Yüklenemedi" ctaLabel="Tekrar Dene" onCta={refetch} />
          ) : (
            <EmptyState
              icon="SendHorizonal"
              title="Teklif bulunamadı"
              description={filter !== 'ALL' ? 'Bu filtreye uygun teklif yok.' : "Fırsatlar sekmesinden bir ilana teklif gönderin."}
              ctaLabel="İlan Feed'ine Git"
              onCta={() => router.push('/' as never)}
            />
          )
        }
        renderItem={({ item }) => {
          const cfg = OFFER_STATUS_CONFIG[item.status]
          return (
            <Pressable
              onPress={() => router.push(`/offer/${item.id}` as never)}
              className="px-4 py-4 gap-3 active:opacity-90"
            >
              {/* Başlık + durum */}
              <View className="flex-row items-start justify-between gap-2">
                <Text variant="label" className="flex-1 font-semibold text-neutral-900 dark:text-[#F5F5F7] leading-snug">
                  {item.listing?.title ?? 'İlan'}
                </Text>
                <View className="flex-row items-center gap-1 shrink-0">
                  <Icon name={cfg.icon} size={13} color={cfg.iconColor} />
                  <Text variant="caption" className="font-medium" style={{ color: cfg.iconColor }}>
                    {cfg.label}
                  </Text>
                </View>
              </View>

              {/* Teklif açıklaması */}
              {item.description ? (
                <Text variant="caption" color="secondary" numberOfLines={2} className="-mt-1">
                  {item.description}
                </Text>
              ) : null}

              {/* Fiyat + seans tipi */}
              <View className="flex-row flex-wrap gap-1.5">
                <Chip label={`₺${item.price.toLocaleString('tr-TR')}`} variant="price" isSelected />
                <Chip label={item.sessionType === 'online' ? 'Online' : 'Yüz yüze'} variant="session" isSelected />
              </View>

              {/* Alt satır: danışan (sol) + tarih (sağ) */}
              <View className="flex-row items-center justify-between pt-1">
                {item.listing?.client ? (
                  <View className="flex-row items-center gap-2">
                    <Avatar
                      size="xs"
                      initials={item.listing.client.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                      src={item.listing.client.avatarUrl ?? undefined}
                    />
                    <Text variant="caption" color="secondary">
                      {formatClientName(item.listing.client.fullName)}
                    </Text>
                  </View>
                ) : <View />}
                <Text variant="caption" color="tertiary">{formatShortDate(item.createdAt)}</Text>
              </View>
            </Pressable>
          )
        }}
      />
    </View>
  )
}

// ─── Client — İlanlarım ───────────────────────────────────────────────────────

function ClientListingsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [filter, setFilter] = useState<ListingFilter | 'ALL'>('ALL')

  const { data: myListingsResponse, isLoading } = useMyListingsQuery()

  const all = myListingsResponse?.data ?? []
  const filtered = filter === 'ALL' ? all : all.filter((l) => l.status === filter)

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
          className="active:opacity-40"
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="Bell" size={22} color="#0EA5E9" />
        </Pressable>
        <Pressable
          onPress={() => router.push('/listing/new' as never)}
          accessibilityRole="button"
          accessibilityLabel="Yeni İlan Oluştur"
          className="active:opacity-40"
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="Plus" size={24} color="#0EA5E9" />
        </Pressable>
      </View>

      <FlatList
        data={!isLoading ? filtered : []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        )}
        ListHeaderComponent={
          <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
            <Text variant="heading" className="mb-3" style={{ paddingRight: 100 }}>İlanlarım</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
              {CLIENT_LISTING_FILTERS.map((item) => (
                <Chip
                  key={item.value}
                  label={item.label}
                  variant="filter"
                  size="md"
                  isSelected={filter === item.value}
                  onPress={() => setFilter(item.value)}
                  onRemove={filter === item.value ? () => setFilter('ALL') : undefined}
                />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[1, 2].map((i) => (
                <View key={i}>
                  <View className="px-4 py-4 gap-3">
                    <Skeleton variant="line" width="70%" height={14} />
                    <Skeleton variant="line" width="50%" height={12} />
                  </View>
                  {i < 2 && <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />}
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon="FileText"
              title={filter !== 'ALL' ? 'İlan bulunamadı' : 'Henüz ilan yok'}
              description={filter !== 'ALL' ? 'Bu filtreye uygun ilan yok.' : 'İlan oluşturun, uzmanlar size teklif göndersin.'}
              ctaLabel={filter === 'ALL' ? 'İlan Oluştur' : undefined}
              onCta={filter === 'ALL' ? () => router.push('/listing/new' as never) : undefined}
            />
          )
        }
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            viewerRole="client"
            onPress={() => router.push(`/listing/${item.id}` as never)}
          />
        )}
      />
    </View>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function OffersScreen() {
  const role = useAuthStore((s) => s.role)
  return role === 'expert' ? <ExpertOffersScreen /> : <ClientListingsScreen />
}
