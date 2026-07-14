import { Alert, ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Chip } from '@/core/components/atoms/Chip'
import { Divider } from '@/core/components/atoms/Divider'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useAuthStore } from '@/domains/auth'
import { RESULT_LEVEL_CONFIG } from '@/domains/assessment'
import { SESSION_TYPE_LABELS } from '@/domains/listing'
import {
  useOfferDetailQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useWithdrawOfferMutation,
  OFFER_STATUS_CONFIG,
} from '@/domains/offer'

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const role = useAuthStore((s) => s.role)
  const isClient = role === 'client'

  const { data: offer, isLoading, isError } = useOfferDetailQuery(id ?? '')
  const { mutate: acceptOffer, isPending: isAccepting } = useAcceptOfferMutation()
  const { mutate: rejectOffer, isPending: isRejecting } = useRejectOfferMutation()
  const { mutate: withdrawOffer, isPending: isWithdrawing } = useWithdrawOfferMutation()

  const isActing = isAccepting || isRejecting || isWithdrawing
  const insets = useSafeAreaInsets()
  const bottomBarHeight = 56 + insets.bottom

  const expertInitials = offer?.expert?.name
    ? offer.expert.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const statusCfg = offer ? OFFER_STATUS_CONFIG[offer.status] : null

  const handleAccept = () => {
    if (!id) return
    Alert.alert(
      'Teklifi Kabul Et',
      'İletişim bilgileriniz uzman ile paylaşılacaktır. Devam etmek istiyor musunuz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Kabul Et', onPress: () => acceptOffer(id, { onSuccess: () => router.replace('/(tabs)/' as never) }) },
      ]
    )
  }

  const handleReject = () => {
    if (!id) return
    rejectOffer(id)
  }

  const handleWithdraw = () => {
    if (!id) return
    withdrawOffer(id, { onSuccess: () => router.back() })
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      {isLoading && (
        <View style={{ paddingTop: insets.top + 8 }}>
          <View className="pt-2 pb-3 items-center">
            <Skeleton variant="line" width="30%" height={14} />
          </View>
          <View className="px-4 py-5 gap-4">
            <View className="flex-row items-center gap-3">
              <Skeleton variant="circle" width={56} height={56} />
              <View className="flex-1 gap-2">
                <Skeleton variant="line" width="45%" height={18} />
                <Skeleton variant="line" width="30%" height={12} />
              </View>
            </View>
            <Skeleton variant="line" width="70%" height={16} />
            <Skeleton variant="line" width="35%" height={11} />
          </View>
          <Divider spacing="none" className="mx-4" />
          <View className="px-4 py-5 gap-4">
            <Skeleton variant="line" width="25%" height={11} />
            <Skeleton variant="rect" width={100} height={28} borderRadius="full" />
            <Skeleton variant="line" width="20%" height={11} />
            <Skeleton variant="rect" width={80} height={28} borderRadius="full" />
          </View>
        </View>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Teklif bulunamadı"
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {!isLoading && !isError && offer && (
        <>
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: offer.status === 'PENDING' ? bottomBarHeight + 16 : 48 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Sayfa başlığı */}
          <ScreenTitle title="Teklif Detayı" />

          {/* ── Section 1: Uzman + İlan başlığı + Meta ── */}
          <View className="px-4 py-5 gap-4">
            <View className="flex-row items-center gap-3">
              <Avatar
                size="lg"
                initials={isClient ? expertInitials : 'D'}
                src={isClient ? (offer.expert?.avatarUrl ?? undefined) : undefined}
              />
              <View className="flex-1">
                <Text variant="subheading" className="font-semibold leading-tight">
                  {isClient ? (offer.expert?.name ?? 'Uzman') : 'Danışan'}
                </Text>
                {isClient && offer.expert?.title ? (
                  <Text variant="caption" color="secondary" numberOfLines={1}>
                    {offer.expert.title}
                  </Text>
                ) : null}
              </View>
            </View>

            {(offer.title || offer.listing?.title) ? (
              <Text variant="subheading" className="leading-snug">
                {offer.title || offer.listing?.title}
              </Text>
            ) : null}

            {/* Meta: status + konum */}
            <View className="flex-row flex-wrap items-center gap-3">
              {statusCfg && (
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Icon name={statusCfg.icon} size={13} color={statusCfg.iconColor} />
                  <Text variant="caption" style={{ color: statusCfg.iconColor }}>{statusCfg.label}</Text>
                </View>
              )}
              {offer.listing?.city ? (
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Icon name="MapPin" size={13} color="#A3A3A3" />
                  <Text variant="caption" color="tertiary">{offer.listing.city}</Text>
                </View>
              ) : null}
              {isClient && offer.expert?.rating != null && (
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Icon name="Star" size={13} color="#F59E0B" />
                  <Text variant="caption" color="tertiary">{offer.expert.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
          </View>

          {/* ── Section 2: Teklif Detayları ── */}
          <Divider spacing="none" className="mx-4" />
          <View className="px-4 py-5 gap-5">
            {offer.description ? (
              <View className="gap-2">
                <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                  Uzman Notu
                </Text>
                <Text variant="body" color="secondary" className="leading-relaxed">
                  {offer.description}
                </Text>
              </View>
            ) : null}

            <View className="gap-2">
              <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                Seans Tipi
              </Text>
              <View className="flex-row">
                <Chip
                  label={SESSION_TYPE_LABELS[offer.sessionType] ?? offer.sessionType}
                  variant="session"
                  isSelected
                />
              </View>
            </View>

            <View className="gap-2">
              <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                Fiyat
              </Text>
              <View className="flex-row">
                <Chip label={`₺${offer.price.toLocaleString('tr-TR')}`} variant="price" isSelected />
              </View>
            </View>
          </View>

          {/* ── Section 2b: Test Sonucu (varsa) ── */}
          {offer.listing?.assessmentResult ? (() => {
            const r = offer.listing!.assessmentResult!
            const cfg = RESULT_LEVEL_CONFIG[r.level]
            const headerBg = r.level === 'low' ? '#F0FDF4' : r.level === 'moderate' ? '#FFFBEB' : '#FEF2F2'
            return (
              <>
                <Divider spacing="none" className="mx-4" />
                <View className="px-4 py-5 gap-3">
                  <View className="flex-row items-center gap-1.5">
                    <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                      Test Sonucu
                    </Text>
                    <Icon name="Paperclip" size={12} color="#A3A3A3" />
                  </View>
                  <View className="rounded-xl overflow-hidden border border-neutral-200">
                    <View className="px-4 py-3 flex-row items-center justify-between" style={{ backgroundColor: headerBg }}>
                      <View className="flex-row items-center gap-2">
                        <Icon name="ClipboardList" size={14} color={cfg.color} />
                        <Text variant="label" className="font-semibold" style={{ color: cfg.color }}>
                          {r.assessmentTitle}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.color + '20' }}>
                          <Text variant="caption" className="font-semibold" style={{ color: cfg.color }}>
                            {cfg.label}
                          </Text>
                        </View>
                        <Text variant="caption" color="tertiary">Puan: {r.score}</Text>
                      </View>
                    </View>
                    <View className="px-4 pt-3 pb-3 bg-white">
                      <Text variant="caption" color="secondary" className="leading-relaxed">{r.summary}</Text>
                    </View>
                  </View>
                </View>
              </>
            )
          })() : null}

        </ScrollView>

        {/* ── Fixed Bottom Bar ── */}
        {offer.status === 'PENDING' && (
          <BottomActionBar
            actions={
              isClient
                ? [
                    {
                      label: 'Teklifi Kabul Et',
                      loadingLabel: 'Kabul Ediliyor...',
                      onPress: handleAccept,
                      isLoading: isAccepting,
                      isDisabled: isActing,
                    },
                    {
                      label: 'Reddet',
                      loadingLabel: 'Reddediliyor...',
                      onPress: handleReject,
                      variant: 'ghost',
                      isLoading: isRejecting,
                      isDisabled: isActing,
                    },
                  ]
                : [
                    {
                      label: 'Teklifi Geri Çek',
                      loadingLabel: 'Geri Çekiliyor...',
                      onPress: handleWithdraw,
                      variant: 'ghost',
                      isLoading: isWithdrawing,
                    },
                  ]
            }
          />
        )}
        </>
      )}
    </View>
  )
}
