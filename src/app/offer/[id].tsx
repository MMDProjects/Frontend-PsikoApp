import { Pressable, ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Badge } from '@/core/components/atoms/Badge'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useAuthStore } from '@/domains/auth'
import {
  useOfferDetailQuery,
  useRespondOfferMutation,
  useOfferCountdown,
  OFFER_STATUS_CONFIG,
} from '@/domains/offer'

function formatSeconds(total: number) {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}s ${m}d`
  if (m > 0) return `${m}d ${s}sn`
  return `${s}sn`
}

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const isClient = user?.role === 'client'

  const { data: offer, isLoading, isError } = useOfferDetailQuery(id ?? '')
  const { mutate: respond, isPending: isResponding } = useRespondOfferMutation()

  const activeTier = offer?.tiers?.[offer.currentTier]

  const { remainingSeconds, isExpired } = useOfferCountdown({
    tierCount: offer?.tiers?.length ?? 1,
    tierDurationHours: activeTier?.durationHours ?? 24,
    sentAt: offer?.sentAt ?? null,
  })

  const handleRespond = (action: 'ACCEPT' | 'REJECT') => {
    if (!id) return
    respond({ offerId: id, action }, {
      onSuccess: () => {
        if (action === 'ACCEPT') router.replace('/(tabs)/')
      },
    })
  }

  return (
    <View className="flex-1 bg-surface-base">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-3 border-b border-neutral-100 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-neutral-100">
          <Icon name="ArrowLeft" size={22} color="#171717" />
        </Pressable>
        <Text variant="label" className="ml-2 font-semibold">Teklif Detayı</Text>
      </View>

      {isLoading && (
        <ScrollView contentContainerClassName="px-4 py-5 gap-4">
          <Skeleton variant="rect" height={100} borderRadius="xl" />
          <Skeleton variant="rect" height={80} borderRadius="xl" />
          <Skeleton variant="rect" height={60} borderRadius="xl" />
        </ScrollView>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Teklif bulunamadı"
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {offer && (
        <ScrollView contentContainerClassName="px-4 py-5 gap-4 pb-10" showsVerticalScrollIndicator={false}>
          {/* Durum + karşı taraf */}
          <View className="bg-white border border-neutral-100 rounded-2xl p-5 gap-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Avatar
                  size="md"
                  initials={
                    isClient
                      ? (offer.expert?.name ?? 'U').split(' ').map((w) => w[0]).join('').slice(0, 2)
                      : (offer.client?.fullName ?? 'D').split(' ').map((w) => w[0]).join('').slice(0, 2)
                  }
                />
                <View>
                  <Text variant="label" className="font-semibold">
                    {isClient ? offer.expert?.name : offer.client?.fullName}
                  </Text>
                  {isClient && offer.expert?.title && (
                    <Text variant="caption" color="secondary">{offer.expert.title}</Text>
                  )}
                </View>
              </View>
              <Badge
                label={OFFER_STATUS_CONFIG[offer.status].label}
                variant={OFFER_STATUS_CONFIG[offer.status].badgeVariant as 'sky' | 'neutral' | 'warning' | 'error' | 'sage'}
              />
            </View>
          </View>

          {/* Aktif kademe fiyatı + sayaç */}
          {offer.status === 'SENT' && activeTier && (
            <View className="bg-sky-50 border border-sky-200 rounded-2xl p-5 items-center gap-3">
              <Text variant="heading" className="text-sky-700 text-3xl font-bold">
                ₺{activeTier.price.toLocaleString('tr-TR')}
              </Text>
              <Text variant="caption" color="secondary">
                {offer.currentTier + 1}. Kademe — {activeTier.durationHours} saatlik geçerlilik
              </Text>
              {!isExpired ? (
                <View className="flex-row items-center gap-1.5">
                  <Icon name="Clock" size={14} color="#0369A1" />
                  <Text variant="caption" className="text-sky-700 font-semibold">
                    Kalan: {formatSeconds(remainingSeconds)}
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-1.5">
                  <Icon name="AlertCircle" size={14} color="#D97706" />
                  <Text variant="caption" className="text-amber-700">Bu kademenin süresi doldu</Text>
                </View>
              )}
            </View>
          )}

          {/* Tüm kademeler */}
          <View className="bg-white border border-neutral-100 rounded-2xl p-5 gap-3">
            <Text variant="label" className="font-semibold">Fiyat Kademeleri</Text>
            {offer.tiers.map((tier, i) => (
              <View
                key={i}
                className={`flex-row items-center justify-between py-2 ${
                  i < offer.tiers.length - 1 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <View className="flex-row items-center gap-2">
                  <View className={`w-6 h-6 rounded-full items-center justify-center ${
                    i === offer.currentTier && offer.status === 'SENT'
                      ? 'bg-sky-500' : 'bg-neutral-100'
                  }`}>
                    <Text variant="caption" className={i === offer.currentTier && offer.status === 'SENT' ? 'text-white' : 'text-neutral-500'}>
                      {i + 1}
                    </Text>
                  </View>
                  <Text variant="body">{tier.durationHours} saat geçerli</Text>
                </View>
                <Text variant="label" className="font-semibold">₺{tier.price.toLocaleString('tr-TR')}</Text>
              </View>
            ))}
          </View>

          {/* Notlar */}
          {offer.notes && (
            <View className="bg-white border border-neutral-100 rounded-2xl p-5 gap-2">
              <Text variant="label" className="font-semibold">Not</Text>
              <Text variant="body" color="secondary">{offer.notes}</Text>
            </View>
          )}

          {/* Danışan aksiyon butonları */}
          {isClient && offer.status === 'SENT' && (
            <View className="gap-3">
              <Button
                label={isResponding ? 'İşleniyor...' : 'Kabul Et'}
                onPress={() => handleRespond('ACCEPT')}
                isLoading={isResponding}
              />
              <Button
                label="Reddet"
                onPress={() => handleRespond('REJECT')}
                variant="ghost"
                isDisabled={isResponding}
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}
