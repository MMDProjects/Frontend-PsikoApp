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

  const apiErrorMessage = error instanceof Error ? error.message : undefined

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface-base"
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
            <View className="bg-semantic-error-light border border-red-200 rounded-xl px-4 py-3">
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
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
