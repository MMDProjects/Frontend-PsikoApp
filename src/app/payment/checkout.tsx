import { useEffect, useRef } from 'react'
import { Pressable, View } from 'react-native'
import WebView from 'react-native-webview'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useInitiateCheckoutMutation } from '@/domains/payment'

export default function CheckoutScreen() {
  const { packageId } = useLocalSearchParams<{ packageId: string }>()
  const router = useRouter()
  const { colorScheme } = useColorScheme()
  const arrowColor = colorScheme === 'dark' ? '#F5F5F7' : '#171717'

  const { mutate: initiateCheckout, data: session, isPending, isError } = useInitiateCheckoutMutation()
  const hasInitiated = useRef(false)
  const insets = useSafeAreaInsets()

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
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      {/* Floating back button */}
      <Pressable
        onPress={() => router.back()}
        style={{ position: 'absolute', top: insets.top + 8, left: 16, zIndex: 10 }}
        className="w-10 h-10 rounded-full bg-white dark:bg-dark-card items-center justify-center active:bg-neutral-100 dark:active:bg-dark-elevated"
      >
        <Icon name="ArrowLeft" size={20} color={arrowColor} />
      </Pressable>

      {/* Başlık + güvenlik etiketi — WebView üstünde sabit */}
      <View style={{ paddingTop: insets.top + 8 }} className="pb-3 items-center border-b border-neutral-100 dark:border-dark-border">
        <Text variant="label" className="font-semibold">Güvenli Ödeme</Text>
        <View className="flex-row items-center gap-1">
          <Icon name="Lock" size={10} color={colorScheme === 'dark' ? '#A3A3A3' : '#737373'} />
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
            <View className="absolute inset-0 items-center justify-center bg-surface-base dark:bg-dark-bg">
              <Skeleton variant="rect" height={300} borderRadius="xl" />
            </View>
          )}
        />
      )}
    </View>
  )
}
