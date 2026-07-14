import { Pressable, ScrollView, View } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { InputField } from '@/core/components/molecules/InputField'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useSendOfferMutation, SendOfferSchema } from '@/domains/offer'

import type { SendOfferRequest } from '@/domains/offer'

export default function NewOfferScreen() {
  const router = useRouter()
  const { listingId } = useLocalSearchParams<{ listingId?: string }>()

  const { mutate: sendOffer, isPending, error } = useSendOfferMutation()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SendOfferRequest>({
    resolver: zodResolver(SendOfferSchema),
    defaultValues: {
      listingId: listingId ?? '',
      title: '',
      sessionType: 'online',
      description: '',
      price: 0,
    },
  })

  const sessionType = watch('sessionType')
  const insets = useSafeAreaInsets()
  const bottomBarHeight = 56 + insets.bottom

  const onSubmit = (data: SendOfferRequest) => {
    sendOffer(data, {
      onSuccess: () => {
        router.back()
      },
    })
  }

  const apiError = error instanceof Error ? error.message : undefined

  if (!listingId) {
    return (
      <View className="flex-1 bg-surface-base dark:bg-dark-bg items-center justify-center px-6 gap-4">
        <Icon name="AlertCircle" size={36} color="#D97706" />
        <Text variant="label" align="center" color="secondary">
          İlan belirtilmedi. Lütfen bir ilanın sayfasından teklif gönderin.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-green-600 border border-green-200 rounded-xl px-5 py-3 active:bg-green-700"
        >
          <Text variant="label" className="text-white font-semibold">Geri Dön</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: bottomBarHeight + 16, gap: 20 }} showsVerticalScrollIndicator={false}>
        <ScreenTitle title="Teklif Gönder" />

        {/* Teklif Başlığı */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Teklif Başlığı (opsiyonel)"
              placeholder="örn. BDT ile Kaygı Yönetimi"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.title?.message}
            />
          )}
        />

        {/* Fiyat */}
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Seans Ücreti (₺)"
              placeholder="örn. 750"
              keyboardType="numeric"
              value={value ? String(value) : ''}
              onChangeText={(v) => onChange(Number(v.replace(/[^0-9]/g, '')) || 0)}
              onBlur={onBlur}
              errorMessage={errors.price?.message}
              isRequired
            />
          )}
        />

        {/* Seans tipi */}
        <View className="gap-2">
          <Text variant="label" className="font-semibold">
            Seans Tipi <Text variant="caption" color="error">*</Text>
          </Text>
          <Controller
            control={control}
            name="sessionType"
            render={({ field: { onChange } }) => (
              <View className="flex-row flex-wrap gap-2">
                {([
                  { value: 'online',      label: 'Online'           },
                  { value: 'yüz_yüze',   label: 'Yüz Yüze'        },
                  { value: 'yüz_yüze_online', label: 'Yüz Yüze / Online' },
                ] as const).map(({ value, label }) => (
                  <Chip
                    key={value}
                    label={label}
                    variant="session"
                    size="md"
                    isSelected={sessionType === value}
                    onPress={() => onChange(value)}
                  />
                ))}
              </View>
            )}
          />
          {errors.sessionType && (
            <Text variant="caption" color="error">{errors.sessionType.message}</Text>
          )}
        </View>

        {/* Açıklama */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Açıklama (opsiyonel)"
              placeholder="Danışana iletilecek kısa açıklama, en fazla 300 karakter..."
              multiline
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.description?.message}
            />
          )}
        />

        {apiError && (
          <View className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
            <Text variant="caption" color="error">{apiError}</Text>
          </View>
        )}
      </ScrollView>

      {/* Fixed bottom bar */}
      <BottomActionBar
        actions={[{
          label: 'Teklif Gönder',
          loadingLabel: 'Gönderiliyor...',
          onPress: handleSubmit(onSubmit),
          isLoading: isPending,
        }]}
      />
    </View>
  )
}
