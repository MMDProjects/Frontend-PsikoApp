import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { usePackagesQuery, PackagePicker } from '@/domains/payment'

export default function PackagesScreen() {
  const router = useRouter()

  const { data: packages, isLoading, isError } = usePackagesQuery()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const insets = useSafeAreaInsets()

  const selectedPkg = packages?.find((p) => p.id === selectedId)

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      {isLoading && (
        <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 20, gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rect" height={120} borderRadius="xl" />
          ))}
        </ScrollView>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Paketler yüklenemedi"
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {packages && (
        <>
          <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 128 }} showsVerticalScrollIndicator={false}>
            <ScreenTitle title="Seans Paketleri" />
            <Text variant="body" color="secondary" className="mb-4">
              Toplu paket alımında tasarruf edin. Paketler satın alımdan itibaren 6 ay geçerlidir.
            </Text>
            <PackagePicker
              packages={packages}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </ScrollView>

          {/* Sticky bottom */}
          <BottomActionBar
            actions={[{
              label: selectedPkg ? `₺${selectedPkg.price.toLocaleString('tr-TR')} — Devam Et` : 'Paket Seçin',
              onPress: () => {
                if (selectedId) router.push(`/payment/checkout?packageId=${selectedId}`)
              },
              isDisabled: !selectedId,
            }]}
          />
        </>
      )}
    </View>
  )
}
