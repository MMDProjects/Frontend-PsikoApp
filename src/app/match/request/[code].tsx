import { View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { RatingRow } from '@/core/components/molecules/RatingRow'
import { useAcceptMatchMutation, useMatchRequestDetailQuery } from '@/domains/match'

export default function MatchRequestScreen() {
  const { code } = useLocalSearchParams<{ code: string }>()
  const router = useRouter()

  const { data: matchRequest, isLoading, isError } = useMatchRequestDetailQuery(code ?? '')
  const { mutate: acceptMatch, isPending: isAccepting, isSuccess } = useAcceptMatchMutation()

  const handleAccept = () => {
    if (!code) return
    acceptMatch({ code }, {
      onSuccess: () => {
        router.replace('/(tabs)/')
      },
    })
  }

  if (!code) {
    return (
      <EmptyState
        icon="AlertCircle"
        title="Geçersiz Davet Bağlantısı"
        description="Bu bağlantı geçerli bir eşleşme daveti içermiyor."
        ctaLabel="Ana Sayfaya Dön"
        onCta={() => router.replace('/(tabs)/')}
      />
    )
  }

  return (
    <View className="flex-1 bg-surface-base px-5 pt-safe">
      {isLoading && (
        <View className="flex-1 items-center justify-center gap-6">
          <Skeleton variant="circle" width={80} height={80} />
          <View className="gap-3 items-center w-full">
            <Skeleton variant="line" width="50%" height={20} />
            <Skeleton variant="line" width="60%" height={14} />
            <Skeleton variant="line" width="40%" height={14} />
          </View>
          <Skeleton variant="rect" height={50} borderRadius="xl" />
        </View>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Davet Bulunamadı"
          description="Bu davet linki geçersiz veya süresi dolmuş olabilir."
          ctaLabel="Ana Sayfaya Dön"
          onCta={() => router.replace('/(tabs)/')}
        />
      )}

      {isSuccess && (
        <View className="flex-1 items-center justify-center gap-5 px-4">
          <View className="w-16 h-16 rounded-full bg-sky-50 items-center justify-center">
            <Icon name="CheckCircle2" size={36} color="#0EA5E9" />
          </View>
          <View className="items-center gap-2">
            <Text variant="heading" className="text-center">Eşleşme Tamamlandı!</Text>
            <Text variant="body" color="secondary" className="text-center">
              Psikologunuzla başarıyla eşleştiniz. Teklif geldiğinde bildirim alacaksınız.
            </Text>
          </View>
        </View>
      )}

      {matchRequest && !isSuccess && (
        <View className="flex-1 justify-center gap-6">
          {/* Expert card */}
          <View className="bg-white border border-neutral-100 rounded-2xl p-6 items-center gap-4">
            <Avatar
              size="2xl"
              initials={matchRequest.expert.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              isVerified
            />
            <View className="items-center gap-1">
              <Text variant="subheading" className="text-center">{matchRequest.expert.name}</Text>
              <Text variant="body" color="secondary" className="text-center">
                {matchRequest.expert.title}
              </Text>
              <RatingRow rating={matchRequest.expert.rating} size="sm" />
            </View>
          </View>

          {/* Info */}
          <View className="gap-3">
            <View className="flex-row items-start gap-3 bg-sky-50 border border-sky-100 rounded-xl px-4 py-3">
              <Icon name="Info" size={16} color="#0369A1" />
              <Text variant="caption" className="text-sky-700 flex-1">
                Bu psikolog sizinle münhasır olarak eşleşmek istiyor. Kabul ettiğinizde başka
                psikologlardan teklif alamazsınız. İstediğiniz zaman eşleşmeyi sonlandırabilirsiniz.
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="gap-3">
            <Button
              label={isAccepting ? 'Kabul Ediliyor...' : 'Eşleşmeyi Kabul Et'}
              onPress={handleAccept}
              isLoading={isAccepting}
            />
            <Button
              label="Reddet"
              onPress={() => router.back()}
              variant="ghost"
            />
          </View>
        </View>
      )}
    </View>
  )
}
