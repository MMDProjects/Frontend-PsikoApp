import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Divider } from '@/core/components/atoms/Divider'
import { Icon } from '@/core/components/atoms/Icon'
import { Switch } from '@/core/components/atoms/Switch'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { themeColors } from '@/core/theme'
import { getFullName, getInitials } from '@/core/utils/personName'
import { useAuthStore, useUpdateProfileMutation, UpdateProfileSchema } from '@/domains/auth'

import type { UpdateProfileRequest } from '@/domains/auth'

type ShareRowProps = { label: string; description: string; value: boolean; onValueChange: (v: boolean) => void }

function ShareRow({ label, description, value, onValueChange }: ShareRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <View className="flex-1 gap-0.5">
        <Text variant="label" className="font-medium">{label}</Text>
        <Text variant="caption" color="tertiary">{description}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  )
}

export default function PersonalInfoScreen() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isClient = user?.role === 'client'
  const insets = useSafeAreaInsets()
  const bottomBarHeight = 56 + insets.bottom

  const { mutate: updateProfile, isPending } = useUpdateProfileMutation()

  const { control, handleSubmit, formState: { errors } } = useForm<UpdateProfileRequest>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
      city: user?.city ?? '',
      shareEmail: user?.shareEmail ?? true,
      sharePhone: user?.sharePhone ?? true,
      shareLocation: user?.shareLocation ?? true,
    },
  })

  const initials = getInitials(user) || 'K'

  const onSubmit = (data: UpdateProfileRequest) => {
    updateProfile(data, { onSuccess: () => router.back() })
  }

  const handleChangePhoto = () => {
    Alert.alert('Profil Fotoğrafı', 'Bu özellik yakında aktif olacak.')
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: bottomBarHeight + 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenTitle title="Kişisel Bilgiler" />

          {/* ── Section 1: Kimlik ── */}
          <View className="px-4 py-5 gap-4">
            <View className="flex-row items-center gap-4">
              <Pressable onPress={handleChangePhoto} className="relative active:opacity-80">
                <Avatar size="xl" src={user?.avatarUrl ?? undefined} initials={initials} isVerified={user?.isVerified} />
                <View className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-sky-500 items-center justify-center border-2 border-surface-base dark:border-dark-bg">
                  {/* Sky-500 rozet zemininde her iki temada da beyaz kalmalı */}
                  <Icon name="Pencil" size={13} color={themeColors.light.contentInverse} />
                </View>
              </Pressable>
              <View className="flex-1 gap-0.5">
                <Text variant="subheading" className="leading-tight">{getFullName(user) || 'Kullanıcı'}</Text>
                <Text variant="caption" color="secondary">{user?.role === 'expert' ? 'Uzman' : 'Danışan'}</Text>
              </View>
            </View>

            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Ad"
                  placeholder="Adınız"
                  autoCapitalize="words"
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.firstName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Soyad"
                  placeholder="Soyadınız"
                  autoCapitalize="words"
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.lastName?.message}
                />
              )}
            />

            <View className="gap-1">
              <Text variant="label" color="secondary">E-posta</Text>
              <Text variant="body">{user?.email}</Text>
              <Text variant="caption" color="tertiary">E-posta adresiniz giriş kimliğiniz olduğu için değiştirilemez.</Text>
            </View>
          </View>

          {/* ── Section 2: İletişim ── */}
          <Divider spacing="none" className="mx-4" />
          <View className="px-4 py-5 gap-4">
            <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
              İletişim
            </Text>

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Telefon"
                  placeholder="05XX XXX XX XX"
                  keyboardType="phone-pad"
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Konum"
                  placeholder="örn. İstanbul"
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>

          {/* ── Section 3: İletişim Paylaşımı (yalnızca danışan) ── */}
          {isClient && (
            <>
              <Divider spacing="none" className="mx-4" />
              <View className="px-4 py-5 gap-4">
                <View className="gap-1">
                  <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                    İletişim Paylaşımı
                  </Text>
                  <Text variant="caption" color="tertiary">
                    Eşleşme sağlandığında seçtiğiniz bilgiler uzmanla paylaşılır.
                  </Text>
                </View>

                <Controller
                  control={control}
                  name="shareEmail"
                  render={({ field: { onChange, value } }) => (
                    <ShareRow label="E-posta" description="Uzman e-posta adresinizi görebilir" value={value ?? true} onValueChange={onChange} />
                  )}
                />
                <Controller
                  control={control}
                  name="sharePhone"
                  render={({ field: { onChange, value } }) => (
                    <ShareRow label="Telefon" description="Uzman telefon numaranızı görebilir" value={value ?? true} onValueChange={onChange} />
                  )}
                />
                <Controller
                  control={control}
                  name="shareLocation"
                  render={({ field: { onChange, value } }) => (
                    <ShareRow label="Konum" description="Uzman konum tercihinizi görebilir" value={value ?? true} onValueChange={onChange} />
                  )}
                />
              </View>
            </>
          )}
        </ScrollView>

        <BottomActionBar
          actions={[{
            label: 'Kaydet',
            loadingLabel: 'Kaydediliyor...',
            onPress: handleSubmit(onSubmit),
            isLoading: isPending,
          }]}
        />
      </KeyboardAvoidingView>
    </View>
  )
}
