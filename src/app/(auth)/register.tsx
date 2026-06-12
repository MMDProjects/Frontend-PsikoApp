import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'
import { RegisterRequestSchema, useRegisterMutation } from '@/domains/auth'

import type { RegisterRequest } from '@/domains/auth'
import type { UserRole } from '@/domains/auth'

// ─── Role selection card ──────────────────────────────────────────────────────

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
      className={[
        'flex-1 rounded-xl p-5 border-2 items-center gap-3',
        selected
          ? 'border-sky-500 bg-sky-50'
          : 'border-neutral-200 bg-surface-raised',
      ].join(' ')}
    >
      <View className={[
        'w-14 h-14 rounded-full items-center justify-center',
        selected ? 'bg-sky-100' : 'bg-neutral-100',
      ].join(' ')}>
        <Icon
          name={isExpert ? 'Stethoscope' : 'User'}
          size={28}
          color={selected ? '#0EA5E9' : '#737373'}
        />
      </View>
      <View className="items-center gap-1">
        <Text
          variant="label"
          className={selected ? 'text-sky-700 font-bold' : 'font-semibold'}
          color={selected ? undefined : 'primary'}
        >
          {isExpert ? 'Psikolog' : 'Danışan'}
        </Text>
        <Text variant="caption" color="secondary" align="center">
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
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<UserRole | null>(null)

  const { mutate: register, isPending, error } = useRegisterMutation()

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: { email: '', password: '', fullName: '', role: 'client' },
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

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface-base"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerClassName="flex-grow px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <Pressable
            onPress={() => (step === 2 ? setStep(1) : router.back())}
            className="p-2 -ml-2 rounded-full active:bg-neutral-100"
          >
            <Icon name="ArrowLeft" size={22} color="#171717" />
          </Pressable>
          <Text variant="heading" className="ml-2">
            {step === 1 ? 'Hesap Oluştur' : 'Bilgilerini Gir'}
          </Text>
        </View>

        {/* Step progress bar */}
        <View className="flex-row gap-2 mb-8">
          {([1, 2] as const).map((s) => (
            <View
              key={s}
              className={[
                'h-1.5 flex-1 rounded-full',
                s <= step ? 'bg-sky-500' : 'bg-neutral-200',
              ].join(' ')}
            />
          ))}
        </View>

        {step === 1 ? (
          <View className="gap-6">
            <Text variant="body" color="secondary">
              Platforma nasıl katılmak istiyorsunuz?
            </Text>

            <View className="flex-row gap-3">
              <RoleCard role="expert" selected={role === 'expert'} onPress={() => setRole('expert')} />
              <RoleCard role="client" selected={role === 'client'} onPress={() => setRole('client')} />
            </View>

            <Button
              label="Devam Et"
              onPress={() => setStep(2)}
              isDisabled={!role}
              className="mt-4"
            />
          </View>
        ) : (
          <View className="gap-4">
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Ad Soyad"
                  placeholder="Adınız Soyadınız"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.fullName?.message}
                  isRequired
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
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
              <View className="bg-semantic-error-light border border-red-200 rounded-xl px-4 py-3">
                <Text variant="caption" className="text-semantic-error">
                  {apiErrorMessage}
                </Text>
              </View>
            )}

            <Button
              label="Kayıt Ol"
              onPress={handleSubmit(onSubmit)}
              isLoading={isPending}
              className="mt-2"
            />
          </View>
        )}

        {/* Footer */}
        <View className="flex-row items-center justify-center mt-8 gap-1">
          <Text variant="body" color="secondary">Zaten hesabın var mı?</Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text variant="body" color="brand" className="font-semibold">Giriş Yap</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
