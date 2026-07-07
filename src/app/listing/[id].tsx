import { Alert, Pressable, ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useAuthStore } from '@/domains/auth'
import {
  useListingDetailQuery,
  useCloseListingMutation,
  ListingDetail,
} from '@/domains/listing'
import { useListingOffersQuery, OFFER_STATUS_CONFIG } from '@/domains/offer'

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const role = useAuthStore((s) => s.role)
  const { user } = useAuthStore()
  const isClient = role === 'client'
  const { colorScheme } = useColorScheme()
  const arrowColor = colorScheme === 'dark' ? '#F5F5F7' : '#171717'
  const insets = useSafeAreaInsets()

  const { data: listing, isLoading, isError } = useListingDetailQuery(id ?? '')

  // Client: tüm teklifler (section 4 için)
  const { data: offersResponse, isLoading: offersLoading } = useListingOffersQuery(
    isClient && !!id ? id : ''
  )
  const offers = offersResponse?.data ?? []

  // Expert: kendi teklifi (bottom bar için)
  const { data: myOffersResponse } = useListingOffersQuery(!isClient && !!id ? id : '')
  const hasAlreadySentOffer =
    !isClient &&
    (myOffersResponse?.data ?? []).some((o) => o.expertId === user?.id)
  const myOffer = !isClient
    ? (myOffersResponse?.data ?? []).find((o) => o.expertId === user?.id)
    : undefined

  const { mutate: closeListing, isPending: isClosing } = useCloseListingMutation()

  const handleClose = () => {
    if (!id) return
    Alert.alert(
      'İlanı Kapat',
      'İlanınız kapatılacak ve yeni teklif gelmeyecek. Devam etmek istiyor musunuz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Kapat', style: 'destructive', onPress: () => closeListing(id, { onSuccess: () => router.back() }) },
      ]
    )
  }

  const handleSendOffer = () => {
    router.push(`/offer/new?listingId=${id}` as never)
  }

  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      {/* Floating back button — scroll etkilemez */}
      <Pressable
        onPress={() => router.back()}
        style={{ position: 'absolute', top: insets.top + 8, left: 16, zIndex: 10 }}
        className="w-10 h-10 rounded-full bg-white dark:bg-dark-card items-center justify-center active:bg-neutral-100 dark:active:bg-dark-elevated"
      >
        <Icon name="ArrowLeft" size={20} color={arrowColor} />
      </Pressable>

      {isLoading && (
        <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 48 }}>
          <View className="px-4 gap-4">
            <View className="flex-row items-center gap-3">
              <Skeleton variant="circle" width={56} height={56} />
              <View className="flex-1 gap-2">
                <Skeleton variant="line" width="40%" height={16} />
                <Skeleton variant="line" width="25%" height={11} />
              </View>
            </View>
            <Skeleton variant="line" width="85%" height={18} />
            <Skeleton variant="line" width="60%" height={11} />
          </View>
          <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800 my-5" />
          <View className="px-4 gap-3">
            <Skeleton variant="line" width="35%" height={11} />
            <View className="flex-row gap-2">
              <Skeleton variant="rect" width={80} height={28} borderRadius="full" />
              <Skeleton variant="rect" width={100} height={28} borderRadius="full" />
            </View>
          </View>
        </ScrollView>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="İlan bulunamadı"
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {listing && (
        <>
          <ScrollView
            contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: bottomBarHeight + 16 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Sayfa başlığı — scroll içinde */}
            <View className="pt-2 pb-3 items-center">
              <Text variant="label" className="font-semibold">İlan Detayı</Text>
            </View>

            {/* Sections 1, 2, 3 */}
            <ListingDetail
              listing={listing}
              viewerRole={isClient ? 'client' : 'expert'}
            />

            {/* ── Section 4: Teklifler ─────────────────── */}
            <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
            <View className="px-4 py-5">
              {/* Başlık */}
              <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest mb-4">
                Teklifler
              </Text>

              {/* Client: uzman listesi */}
              {isClient && (
                <>
                  {offersLoading && (
                    <View className="gap-4">
                      {[1, 2, 3].map((i) => (
                        <View key={i} className="flex-row items-center gap-3">
                          <Skeleton variant="circle" width={36} height={36} />
                          <View className="flex-1 gap-2">
                            <Skeleton variant="line" width="45%" height={13} />
                            <Skeleton variant="line" width="60%" height={11} />
                          </View>
                          <Skeleton variant="line" width={30} height={13} />
                        </View>
                      ))}
                    </View>
                  )}

                  {!offersLoading && offers.length === 0 && (
                    <View className="items-center gap-2 py-4">
                      <Icon name="Inbox" size={28} color="#A3A3A3" />
                      <Text variant="caption" color="secondary" align="center">
                        Henüz teklif gelmedi. Uzmanlar ilanınızı incelediğinde burada görünecek.
                      </Text>
                    </View>
                  )}

                  {!offersLoading && offers.length > 0 && (
                    <View>
                      {offers.map((offer, idx) => {
                        const expertInitials = offer.expert?.name
                          ? offer.expert.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
                          : '?'
                        return (
                          <View key={offer.id}>
                            <Pressable
                              onPress={() => router.push(`/offer/${offer.id}` as never)}
                              className="flex-row items-center gap-3 py-3 active:opacity-70"
                            >
                              <Avatar
                                size="sm"
                                initials={expertInitials}
                                src={offer.expert?.avatarUrl ?? undefined}
                              />
                              <View className="flex-1">
                                <Text variant="label" className="font-medium" numberOfLines={1}>
                                  {offer.expert?.name ?? 'Uzman'}
                                </Text>
                                {offer.expert?.title ? (
                                  <Text variant="caption" color="secondary" numberOfLines={1}>
                                    {offer.expert.title}
                                  </Text>
                                ) : null}
                              </View>
                              {offer.expert?.rating != null && (
                                <View className="flex-row items-center gap-1">
                                  <Icon name="Star" size={13} color="#F59E0B" />
                                  <Text variant="caption" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                    {offer.expert.rating.toFixed(1)}
                                  </Text>
                                </View>
                              )}
                              <Icon name="ChevronRight" size={16} color="#A3A3A3" />
                            </Pressable>
                            {idx < offers.length - 1 && (
                              <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
                            )}
                          </View>
                        )
                      })}
                    </View>
                  )}
                </>
              )}

              {/* Expert: sadece bilgi */}
              {!isClient && (
                <Text variant="body" color="secondary">
                  {listing.offerCount === 0
                    ? 'Henüz teklif gönderilmemiş. İlk teklife sen de katıl.'
                    : `Bu ilana ${listing.offerCount} uzman teklif gönderdi.`}
                </Text>
              )}
            </View>

            {/* ── Section 5: Teklif Özeti (expert, gönderilmişse) ── */}
            {myOffer && (() => {
              const expertName = myOffer.expert?.name ?? user?.fullName ?? 'Uzman'
              const expertInitials = expertName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
              const statusCfg = OFFER_STATUS_CONFIG[myOffer.status]
              return (
                <>
                  <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
                  <View className="px-4 py-5 gap-4">
                    <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                      Teklif Özeti
                    </Text>

                    <View className="flex-row items-center gap-3">
                      <Avatar size="sm" initials={expertInitials} />
                      <Text variant="label" className="font-semibold">{expertName}</Text>
                    </View>

                    {myOffer.title ? (
                      <Text variant="label" className="font-medium leading-snug">{myOffer.title}</Text>
                    ) : null}

                    <View className="gap-2">
                      {myOffer.description ? (
                        <Text variant="caption" color="secondary">{myOffer.description}</Text>
                      ) : null}
                      <View className="flex-row items-center gap-1">
                        <Icon name={statusCfg.icon} size={13} color={statusCfg.iconColor} />
                        <Text variant="caption" className="font-medium" style={{ color: statusCfg.iconColor }}>
                          {statusCfg.label}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row">
                      <Chip label={`₺${myOffer.price.toLocaleString('tr-TR')}`} variant="price" isSelected />
                    </View>
                  </View>
                </>
              )
            })()}
          </ScrollView>

          {/* ── Pill Bottom Bar ──────────────────────── */}
          <View
            style={{
              position: 'absolute',
              bottom: insets.bottom,
              left: 16,
              right: 16,
            }}
          >
            {/* Expert: teklif gönder */}
            {!isClient && listing.status === 'OPEN' && (
              hasAlreadySentOffer ? (
                <View className="flex-row items-center justify-center gap-2 bg-price-subtle border border-price-muted dark:bg-green-950 dark:border-green-900 rounded-full h-14">
                  <Icon name="CheckCircle2" size={16} color="#15803D" />
                  <Text variant="label" className="text-price-text dark:text-price-border font-semibold">
                    Teklif Gönderildi
                  </Text>
                </View>
              ) : (
                <Pressable
                  onPress={handleSendOffer}
                  className="bg-brand rounded-full h-14 items-center justify-center active:bg-brand-hover"
                >
                  <Text variant="label" className="text-white font-semibold">
                    Teklif Gönder
                  </Text>
                </Pressable>
              )
            )}

            {/* Client: ilanı kapat */}
            {isClient && listing.status === 'OPEN' && (
              <Pressable
                onPress={isClosing ? undefined : handleClose}
                disabled={isClosing}
                className="bg-neutral-100 border border-neutral-300 dark:bg-neutral-800 dark:border-dark-border2 rounded-full h-14 items-center justify-center active:bg-neutral-200 dark:active:bg-neutral-700"
              >
                <Text variant="label" className="text-neutral-600 dark:text-neutral-400 font-medium">
                  {isClosing ? 'Kapatılıyor...' : 'İlanı Kapat'}
                </Text>
              </Pressable>
            )}
          </View>
        </>
      )}
    </View>
  )
}
