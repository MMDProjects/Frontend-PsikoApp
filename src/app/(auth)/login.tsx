import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/core/components/atoms/Button'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'
import { LoginRequestSchema, useLoginMutation } from '@/domains/auth'

import type { LoginRequest } from '@/domains/auth'

export default function LoginScreen() {
  const router = useRouter()
  const { mutate: login, isPending, error } = useLoginMutation()

  const { control, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginRequest) => {
    login(data, {
      onSuccess: () => router.replace('/(tabs)/'),
    })
  }

  const quickLogin = (email: string) => {
    login({ email, password: 'password123' }, {
      onSuccess: () => router.replace('/(tabs)/'),
    })
  }

  const apiErrorMessage = error instanceof Error ? error.message : undefined

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface-base dark:bg-dark-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand */}
        <View className="items-center mb-10">
          <Text variant="display" className="text-sky-500">
            PsikoAl
          </Text>
          <Text variant="body" color="secondary" className="mt-2" align="center">
            Psikoloğunuza ulaşmanın en kolay yolu
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
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
                placeholder="••••••••"
                isSecure
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={errors.password?.message}
                isRequired
              />
            )}
          />

          {apiErrorMessage && (
            <View className="bg-semantic-error-light dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <Text variant="caption" className="text-semantic-error">
                {apiErrorMessage}
              </Text>
            </View>
          )}

          <Button
            label="Giriş Yap"
            onPress={handleSubmit(onSubmit)}
            isLoading={isPending}
            className="mt-2"
          />
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-center mt-8 gap-1">
          <Text variant="body" color="secondary">Hesabın yok mu?</Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text variant="body" color="brand" className="font-semibold">Kayıt Ol</Text>
          </Pressable>
        </View>

        {/* DEV: Hızlı giriş */}
        {process.env.EXPO_PUBLIC_APP_ENV !== 'production' && (
          <View className="mt-8 gap-2">
            <View className="flex-row items-center gap-3">
              <View className="flex-1 h-px bg-neutral-200 dark:bg-dark-control" />
              <Text variant="caption" color="tertiary">Test Girişi</Text>
              <View className="flex-1 h-px bg-neutral-200 dark:bg-dark-control" />
            </View>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => quickLogin('uzman@psikoal.com')}
                disabled={isPending}
                className="flex-1 border border-neutral-200 dark:border-dark-border2 rounded-xl py-3 items-center active:bg-neutral-50 dark:active:bg-dark-elevated"
              >
                <Text variant="caption" className="font-semibold text-neutral-600">Uzman Girişi</Text>
                <Text variant="caption" color="tertiary">Dr. Ayşe Kaya</Text>
              </Pressable>
              <Pressable
                onPress={() => quickLogin('danisan@psikoal.com')}
                disabled={isPending}
                className="flex-1 border border-neutral-200 dark:border-dark-border2 rounded-xl py-3 items-center active:bg-neutral-50 dark:active:bg-dark-elevated"
              >
                <Text variant="caption" className="font-semibold text-neutral-600">Danışan Girişi</Text>
                <Text variant="caption" color="tertiary">Zeynep Yılmaz</Text>
              </Pressable>
            </View>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  )
}
