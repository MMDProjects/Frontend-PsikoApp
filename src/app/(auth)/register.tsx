import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { StepProgress } from '@/core/components/molecules/StepProgress'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { cn } from '@/core/utils/cn'
import { RegisterRequestSchema, useRegisterMutation } from '@/domains/auth'

import type { RegisterRequest } from '@/domains/auth'
import type { UserRole } from '@/domains/auth'

const TOTAL_STEPS = 2
const STEP_LABELS = ['Rol Seçimi', 'Bilgilerin']

// ─── Role selection card — mavi zemin üzerinde flat seçim dili ────────────────

type RoleCardProps = {
  role: UserRole
  selected: boolean
  onPress: () => void
}

function RoleCard({ role, selected, onPress }: RoleCardProps) {
  const isExpert = role === 'expert'
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-1 rounded-xl p-5 items-center gap-3',
        selected
          ? 'bg-white dark:bg-white'
          : 'bg-sky-600 dark:bg-sky-900 active:bg-sky-700 dark:active:bg-sky-800'
      )}
    >
      <View
        className={cn(
          'w-14 h-14 rounded-full items-center justify-center',
          selected ? 'bg-sky-100' : 'bg-sky-700 dark:bg-sky-950'
        )}
      >
        <Icon
          name={isExpert ? 'Stethoscope' : 'User'}
          size={28}
          color={selected ? '#0EA5E9' : '#FFFFFF'}
        />
      </View>
      <View className="items-center gap-1">
        <Text
          variant="label"
          className={selected ? 'text-sky-700 dark:text-sky-700 font-bold' : 'text-white font-semibold'}
        >
          {isExpert ? 'Psikolog' : 'Danışan'}
        </Text>
        <Text
          variant="caption"
          align="center"
          className={selected ? 'text-neutral-500 dark:text-neutral-500' : 'text-sky-100'}
        >
          {isExpert
            ? 'Danışanlarınızı platforma davet edin'
            : 'Psikolog bulun ve terapi alın'}
        </Text>
      </View>
    </Pressable>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<UserRole | null>(null)

  const { mutate: register, isPending, error } = useRegisterMutation()

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: { email: '', password: '', firstName: '', lastName: '', role: 'client' },
  })

  const onSubmit = (data: RegisterRequest) => {
    if (!role) return
    register(
      { ...data, role },
      {
        onSuccess: () => {
          router.replace(
            role === 'expert' ? '/(auth)/onboarding/expert' : '/(auth)/onboarding/client'
          )
        },
      }
    )
  }

  const apiErrorMessage = error instanceof Error ? error.message : undefined
  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      {/* Dekoratif daireler — adım geçişinde süzülür */}
      <DecorCircles phase={step} />

      {/* Tek geri butonu: adım 2'deyse adım 1'e, değilse sayfadan geri */}
      <BackButton onPress={() => (step === 2 ? setStep(1) : router.back())} />

      <ScreenTitle title="Hesap Oluştur" topInset titleClassName="text-white" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Aşama barı */}
        <View className="px-5 pt-2 pb-4">
          <StepProgress current={step} total={TOTAL_STEPS} label={STEP_LABELS[step - 1]} />
        </View>

        <ScrollView
          contentContainerClassName="px-5 gap-5"
          contentContainerStyle={{ paddingBottom: bottomBarHeight + 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            <View className="gap-5">
              <View className="gap-1">
                <Text variant="heading" className="text-white">Aramıza Katıl</Text>
                <Text variant="body" className="text-sky-100">
                  Platforma nasıl katılmak istiyorsunuz?
                </Text>
              </View>

              <View className="flex-row gap-3">
                <RoleCard role="expert" selected={role === 'expert'} onPress={() => setRole('expert')} />
                <RoleCard role="client" selected={role === 'client'} onPress={() => setRole('client')} />
              </View>
            </View>
          ) : (
            <View className="gap-4">
              <View className="gap-1">
                <Text variant="heading" className="text-white">Bilgilerini Gir</Text>
                <Text variant="body" className="text-sky-100">
                  Hesabını oluşturmak için son bir adım kaldı.
                </Text>
              </View>

              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    tone="onBrand"
                    label="Ad"
                    placeholder="Adınız"
                    autoCapitalize="words"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.firstName?.message}
                    isRequired
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    tone="onBrand"
                    label="Soyad"
                    placeholder="Soyadınız"
                    autoCapitalize="words"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.lastName?.message}
                    isRequired
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    tone="onBrand"
                    label="E-posta"
                    placeholder="ornek@mail.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.email?.message}
                    isRequired
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    tone="onBrand"
                    label="Şifre"
                    placeholder="En az 8 karakter"
                    isSecure
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.password?.message}
                    hint="En az 8 karakter olmalıdır"
                    isRequired
                  />
                )}
              />

              {apiErrorMessage && (
                <View className="bg-red-50 dark:bg-red-950 rounded-xl px-4 py-3">
                  <Text variant="caption" className="text-red-600 dark:text-red-300">
                    {apiErrorMessage}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Footer */}
          <View className="flex-row items-center justify-center mt-3 gap-1">
            <Text variant="body" className="text-sky-100">Zaten hesabın var mı?</Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text variant="body" className="text-white font-semibold">Giriş Yap</Text>
            </Pressable>
          </View>
        </ScrollView>

        <BottomActionBar
          actions={
            step === 1
              ? [{ label: 'Devam Et', onPress: () => setStep(2), variant: 'inverse', isDisabled: !role }]
              : [{ label: 'Kayıt Ol', onPress: handleSubmit(onSubmit), variant: 'inverse', isLoading: isPending, loadingLabel: 'Kayıt yapılıyor...' }]
          }
        />
      </KeyboardAvoidingView>
    </View>
  )
}
