import { ScrollView, View } from 'react-native'
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
import { RESULT_LEVEL_CONFIG } from '@/domains/assessment'
import { SESSION_TYPE_LABELS } from '@/domains/listing'
import { useMatchDetailQuery, MATCH_STATUS_CONFIG } from '@/domains/match'
import { OFFER_STATUS_CONFIG } from '@/domains/offer'

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const { data: match, isLoading, isError } = useMatchDetailQuery(id ?? '')
  const insets = useSafeAreaInsets()

  const statusCfg      = match ? MATCH_STATUS_CONFIG[match.status] : null
  const clientInitials = match
    ? match.client.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : ''
  const expertInitials = match?.expert
    ? match.expert.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : ''
  const matchDate = match
    ? new Date(match.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      {isLoading && (
        <View style={{ paddingTop: insets.top + 8 }}>
          <View className="pt-2 pb-3 items-center">
            <Skeleton variant="line" width="35%" height={14} />
          </View>
          <View className="px-4 py-5 gap-4">
            <View className="flex-row items-center gap-3">
              <Skeleton variant="circle" width={56} height={56} />
              <View className="flex-1 gap-2">
                <Skeleton variant="line" width="45%" height={18} />
              </View>
            </View>
            <Skeleton variant="line" width="80%" height={18} />
            <Skeleton variant="line" width="50%" height={11} />
          </View>
          <Divider spacing="none" className="mx-4" />
          <View className="px-4 py-5 gap-4">
            <Skeleton variant="line" width="30%" height={11} />
            <Skeleton variant="line" width="75%" height={16} />
            <View className="flex-row gap-2">
              <Skeleton variant="rect" width={80} height={28} borderRadius="full" />
              <Skeleton variant="rect" width={100} height={28} borderRadius="full" />
            </View>
          </View>
        </View>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Eşleşme bulunamadı"
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {!isLoading && !isError && match && (
        <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
          {/* Sayfa başlığı */}
          <ScreenTitle title="Eşleşme Detayı" />

          {/* ── Section 1: Danışan + İlan başlığı + Meta + İletişim ── */}
          <View className="px-4 py-5 gap-4">
            <View className="flex-row items-center gap-3">
              <Avatar size="lg" initials={clientInitials} />
              <View className="flex-1">
                <Text variant="subheading" className="font-semibold leading-tight">
                  {match.client.fullName}
                </Text>
              </View>
            </View>

            {match.listing?.title ? (
              <Text variant="subheading" className="leading-snug">{match.listing.title}</Text>
            ) : null}

            {/* Meta: status + konum + email + telefon — yan yana, satır sonu flex-wrap */}
            <View className="flex-row flex-wrap items-center gap-3">
              {statusCfg && (
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Icon name={statusCfg.icon} size={13} color={statusCfg.iconColor} />
                  <Text variant="caption" style={{ color: statusCfg.iconColor }}>{statusCfg.label}</Text>
                </View>
              )}
              {match.listing?.city ? (
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Icon name="MapPin" size={13} color="#A3A3A3" />
                  <Text variant="caption" color="tertiary">{match.listing.city}</Text>
                </View>
              ) : null}
              {match.client.email ? (
                <View className="flex-row items-center gap-1.5 shrink">
                  <Icon name="Mail" size={13} color="#A3A3A3" />
                  <Text variant="caption" color="tertiary" numberOfLines={1} className="shrink">{match.client.email}</Text>
                </View>
              ) : null}
              {match.client.phone ? (
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Icon name="Phone" size={13} color="#A3A3A3" />
                  <Text variant="caption" color="tertiary">{match.client.phone}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* ── Section 2: İlan detayı (listing detail Section 2 birebir) ─── */}
          {match.listing && (
            <>
              <Divider spacing="none" className="mx-4" />
              <View className="px-4 py-5 gap-5">
                {match.listing.description ? (
                  <View className="gap-2">
                    <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                      İlan Detayı
                    </Text>
                    <Text variant="body" color="secondary" className="leading-relaxed">
                      {match.listing.description}
                    </Text>
                  </View>
                ) : null}

                {match.listing.specialization.length > 0 && (
                  <View className="gap-2.5">
                    <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                      Aranan Uzmanlık
                    </Text>
                    <View className="flex-row flex-wrap gap-1.5">
                      {match.listing.specialization.map((spec) => (
                        <Chip key={spec} label={spec} variant="filter" isSelected />
                      ))}
                    </View>
                  </View>
                )}

                <View className="gap-2">
                  <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                    Seans Tipi
                  </Text>
                  <View className="flex-row">
                    <Chip
                      label={SESSION_TYPE_LABELS[match.listing.preferredSessionType] ?? match.listing.preferredSessionType}
                      variant="session"
                      isSelected
                    />
                  </View>
                </View>

                <View className="gap-2">
                  <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                    Fiyat Aralığı
                  </Text>
                  <View className="flex-row">
                    <Chip
                      label={`₺${match.listing.budgetMin.toLocaleString('tr-TR')} – ₺${match.listing.budgetMax.toLocaleString('tr-TR')}`}
                      variant="tag"
                      isSelected
                    />
                  </View>
                </View>
              </View>
            </>
          )}

          {/* ── Section 2b: Test Sonucu (varsa) ─────────────────────── */}
          {match.listing?.assessmentResult ? (() => {
            const r = match.listing!.assessmentResult!
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

          {/* ── Section 3: Danışan Hakkında ────────────────────────── */}
          <Divider spacing="none" className="mx-4" />
          <View className="px-4 py-5 gap-3">
            <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
              Danışan Hakkında
            </Text>
            <View className="flex-row items-center gap-3">
              <Avatar size="sm" initials={clientInitials} />
              <Text variant="label" className="font-medium">{match.client.fullName}</Text>
            </View>
            <View className="gap-1">
              {match.client.createdAt ? (
                <Text variant="caption" color="secondary">
                  {new Date(match.client.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} tarihinde kayıt oldu.
                </Text>
              ) : null}
              <Text variant="caption" color="secondary">
                {matchDate} tarihinde eşleşildi.
              </Text>
            </View>
          </View>

          {/* ── Section 4: Teklif Özeti (conditional) ──────────────────── */}
          {match.offer && (
            <>
              <Divider spacing="none" className="mx-4" />
              <View className="px-4 py-5 gap-4">
                <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                  Teklif Özeti
                </Text>

                {/* Avatar + isim yan yana */}
                <View className="flex-row items-center gap-3">
                  <Avatar size="sm" initials={expertInitials} />
                  <Text variant="label" className="font-semibold">{match.expert?.name ?? 'Uzman'}</Text>
                </View>

                {match.offer.title ? (
                  <Text variant="label" className="font-medium leading-snug">{match.offer.title}</Text>
                ) : null}

                {/* Açıklama + status — sola yaslanmış, avatar hizası yok */}
                <View className="gap-2">
                  {match.offer.description ? (
                    <Text variant="caption" color="secondary">{match.offer.description}</Text>
                  ) : null}
                  <View className="flex-row items-center gap-1">
                    <Icon
                      name={OFFER_STATUS_CONFIG['ACCEPTED'].icon}
                      size={13}
                      color={OFFER_STATUS_CONFIG['ACCEPTED'].iconColor}
                    />
                    <Text variant="caption" className="font-medium" style={{ color: OFFER_STATUS_CONFIG['ACCEPTED'].iconColor }}>
                      {OFFER_STATUS_CONFIG['ACCEPTED'].label}
                    </Text>
                  </View>
                </View>

                {/* Fiyat */}
                <View className="flex-row">
                  <Chip
                    label={`₺${match.offer.price.toLocaleString('tr-TR')}`}
                    variant="price"
                    isSelected
                  />
                </View>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  )
}
