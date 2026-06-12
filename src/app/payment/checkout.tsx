import { useEffect, useRef } from 'react'
import { Pressable, View } from 'react-native'
import WebView from 'react-native-webview'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useInitiateCheckoutMutation } from '@/domains/payment'

export default function CheckoutScreen() {
  const { packageId } = useLocalSearchParams<{ packageId: string }>()
  const router = useRouter()

  const { mutate: initiateCheckout, data: session, isPending, isError } = useInitiateCheckoutMutation()
  const hasInitiated = useRef(false)

  useEffect(() => {
    if (packageId && !hasInitiated.current) {
      hasInitiated.current = true
      initiateCheckout({ packageId })
    }
  }, [packageId, initiateCheckout])

  const handleNavigationChange = (navState: { url: string }) => {
    if (navState.url.includes('/payment/success')) {
      router.replace('/(tabs)/profile')
    } else if (navState.url.includes('/payment/failure')) {
      router.back()
    }
  }

  return (
    <View className="flex-1 bg-surface-base">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-3 border-b border-neutral-100 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-neutral-100">
          <Icon name="ArrowLeft" size={22} color="#171717" />
        </Pressable>
        <Text variant="label" className="ml-2 font-semibold">Güvenli Ödeme</Text>
        <View className="ml-auto flex-row items-center gap-1">
          <Icon name="Lock" size={12} color="#737373" />
          <Text variant="caption" color="secondary">Iyzico ile güvenli</Text>
        </View>
      </View>

      {isPending && (
        <View className="flex-1 p-4 gap-4">
          <Skeleton variant="rect" height={50} borderRadius="xl" />
          <Skeleton variant="rect" height={200} borderRadius="xl" />
          <Skeleton variant="rect" height={60} borderRadius="xl" />
        </View>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Ödeme başlatılamadı"
          description="Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın."
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {session && (
        <WebView
          source={{ uri: session.paymentPageUrl }}
          onNavigationStateChange={handleNavigationChange}
          startInLoadingState
          renderLoading={() => (
            <View className="absolute inset-0 items-center justify-center bg-surface-base">
              <Skeleton variant="rect" height={300} borderRadius="xl" />
            </View>
          )}
        />
      )}
    </View>
  )
}
