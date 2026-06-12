import { useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'

import { Badge } from '@/core/components/atoms/Badge'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useAuthStore } from '@/domains/auth'
import { useOfferListQuery, OFFER_STATUS_CONFIG } from '@/domains/offer'

import type { OfferStatus } from '@/domains/offer'

const STATUS_FILTERS: Array<{ label: string; value: OfferStatus | 'ALL' }> = [
  { label: 'Tümü',       value: 'ALL'      },
  { label: 'Gönderildi', value: 'SENT'     },
  { label: 'Kabul',      value: 'ACCEPTED' },
  { label: 'Reddedildi', value: 'REJECTED' },
  { label: 'Süresi Doldu', value: 'EXPIRED' },
]

export default function OffersScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const isExpert = user?.role === 'expert'
  const [filter, setFilter] = useState<OfferStatus | 'ALL'>('ALL')

  const { data: offers, isLoading } = useOfferListQuery(
    filter !== 'ALL' ? { status: filter } : {}
  )

  return (
    <View className="flex-1 bg-surface-base">
      {/* Header */}
      <View className="px-5 pt-14 pb-3 bg-white border-b border-neutral-100">
        <View className="flex-row items-center justify-between mb-3">
          <Text variant="heading">Teklifler</Text>
          {isExpert && (
            <Pressable
              onPress={() => router.push('/offer/new')}
              className="flex-row items-center gap-1.5 bg-sky-500 rounded-xl px-3 py-2 active:bg-sky-600"
            >
              <Icon name="Plus" size={15} color="#fff" />
              <Text variant="caption" className="text-white font-semibold">Yeni Teklif</Text>
            </Pressable>
          )}
        </View>

        {/* Status filters */}
        <FlatList
          horizontal
          data={STATUS_FILTERS}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setFilter(item.value)}
              className={`px-3 py-1.5 rounded-full border ${
                filter === item.value
                  ? 'bg-sky-50 border-sky-300'
                  : 'bg-white border-neutral-200 active:bg-neutral-50'
              }`}
            >
              <Text
                variant="caption"
                className={filter === item.value ? 'text-sky-700 font-semibold' : ''}
                color={filter === item.value ? undefined : 'secondary'}
              >
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {isLoading && (
        <View className="px-4 py-4 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rect" height={90} borderRadius="xl" />
          ))}
        </View>
      )}

      {offers && offers.length === 0 && (
        <EmptyState
          icon="FileText"
          title="Teklif bulunamadı"
          description={filter !== 'ALL' ? 'Bu filtre için teklif yok.' : 'Henüz bir teklif bulunmuyor.'}
          ctaLabel={isExpert ? 'Yeni Teklif Oluştur' : undefined}
          onCta={isExpert ? () => router.push('/offer/new') : undefined}
        />
      )}

      {offers && offers.length > 0 && (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 py-4 gap-3"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const statusConfig = OFFER_STATUS_CONFIG[item.status]
            const activeTier = item.tiers[item.currentTier]
            const otherParty = isExpert ? item.client?.fullName : item.expert?.name

            return (
              <Pressable
                onPress={() => router.push(`/offer/${item.id}`)}
                className="bg-white border border-neutral-100 rounded-2xl px-4 py-4 gap-3 active:bg-neutral-50"
              >
                <View className="flex-row items-start justify-between">
                  <View className="gap-0.5 flex-1 mr-3">
                    <Text variant="label" className="font-semibold">
                      {otherParty ?? 'Danışan'}
                    </Text>
                    <Text variant="caption" color="secondary">
                      {item.sessionType === 'online' ? 'Online seans' : 'Yüz yüze seans'}
                    </Text>
                  </View>
                  <Badge
                    label={statusConfig.label}
                    variant={statusConfig.badgeVariant as 'sky' | 'neutral' | 'warning' | 'error' | 'sage'}
                  />
                </View>

                {activeTier && (
                  <View className="flex-row items-center justify-between border-t border-neutral-100 pt-3">
                    <Text variant="body" className="text-sky-700 font-semibold">
                      ₺{activeTier.price.toLocaleString('tr-TR')}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Icon name="Clock" size={12} color="#737373" />
                      <Text variant="caption" color="secondary">
                        {activeTier.durationHours}s geçerli
                      </Text>
                    </View>
                  </View>
                )}
              </Pressable>
            )
          }}
        />
      )}
    </View>
  )
}
