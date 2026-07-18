import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { useMutation } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { cn } from '@/core/utils/cn'
import { post } from '@/lib/api'
import { tokenStorage } from '@/lib/storage'
import { useAuthStore } from '@/domains/auth'
import { LoginResponseSchema } from '@/domains/auth'

type AcceptInviteData = {
  inviteToken: string
  password: string
  kvkkConsent: boolean
}

function useAcceptInviteMutation() {
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: async (data: AcceptInviteData) => {
      const raw = await post('/auth/accept-invite', data)
      return LoginResponseSchema.parse(raw)
    },
    onSuccess: async ({ user, tokens }) => {
      await tokenStorage.setAccessToken(tokens.accessToken)
      await tokenStorage.setRefreshToken(tokens.refreshToken)
      setAuth(user, tokens.accessToken, tokens.refreshToken)
    },
  })
}

export default function ClientOnboardingScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { token: inviteToken } = useLocalSearchParams<{ token?: string }>()
  const { mutate: acceptInvite, isPending, error } = useAcceptInviteMutation()

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [kvkkError, setKvkkError] = useState<string | undefined>()

  const validate = (): boolean => {
    let valid = true
    if (password.length < 8) {
      setPasswordError('Şifre en az 8 karakter olmalı')
      valid = false
    } else if (password !== passwordConfirm) {
      setPasswordError('Şifreler eşleşmiyor')
      valid = false
    } else {
      setPasswordError(undefined)
    }
    if (!kvkkAccepted) {
      setKvkkError('Devam etmek için KVKK metnini onaylamalısınız')
      valid = false
    } else {
      setKvkkError(undefined)
    }
    return valid
  }

  const onSubmit = () => {
    if (!validate()) return
    if (!inviteToken) return

    acceptInvite(
      { inviteToken, password, kvkkConsent: true },
      { onSuccess: () => router.replace('/(tabs)') }
    )
  }

  const apiErrorMessage = error instanceof Error ? error.message : undefined
  const bottomBarHeight = 56 + insets.bottom

  if (!inviteToken) {
    return (
      <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
        <DecorCircles />
        <BackButton />
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <View className="w-20 h-20 rounded-full bg-white items-center justify-center">
            <Icon name="AlertCircle" size={36} color="#DC2626" />
          </View>
          <Text variant="heading" align="center" className="text-white">Geçersiz Davet Bağlantısı</Text>
          <Text variant="body" align="center" className="text-sky-100">
            Bu bağlantı geçersiz veya süresi dolmuş. Psikologunuzdan yeni bir davet bağlantısı isteyin.
          </Text>
        </View>
        <BottomActionBar
          actions={[{ label: 'Girişe Dön', onPress: () => router.replace('/(auth)/login'), variant: 'inverse' }]}
        />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      <DecorCircles />
      <BackButton />

      <ScreenTitle title="Daveti Kabul Et" topInset titleClassName="text-white" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerClassName="px-5 gap-5 pt-2"
          contentContainerStyle={{ paddingBottom: bottomBarHeight + 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center gap-3">
            <View className="w-16 h-16 rounded-full bg-white items-center justify-center">
              <Icon name="CheckCircle" size={32} color="#0EA5E9" />
            </View>
            <Text variant="heading" align="center" className="text-white">Hoş Geldiniz!</Text>
            <Text variant="body" align="center" className="text-sky-100">
              Psikologunuz sizi PsikoAl&apos;a davet etti. Şifrenizi belirleyerek hesabınızı aktive edin.
            </Text>
          </View>

          <View className="gap-4 mt-2">
            <InputField
              tone="onBrand"
              label="Şifre"
              placeholder="En az 8 karakter"
              isSecure
              value={password}
              onChangeText={(v) => { setPassword(v); setPasswordError(undefined) }}
              errorMessage={password !== passwordConfirm && passwordConfirm ? 'Şifreler eşleşmiyor' : undefined}
              isRequired
            />

            <InputField
              tone="onBrand"
              label="Şifre Tekrar"
              placeholder="Şifrenizi tekrar girin"
              isSecure
              value={passwordConfirm}
              onChangeText={(v) => { setPasswordConfirm(v); setPasswordError(undefined) }}
              errorMessage={passwordError}
              isRequired
            />

            <Pressable
              onPress={() => { setKvkkAccepted((v) => !v); setKvkkError(undefined) }}
              className={cn(
                'flex-row items-start gap-3 p-4 rounded-xl',
                kvkkAccepted ? 'bg-white dark:bg-white' : 'bg-sky-600 dark:bg-sky-900 active:bg-sky-700 dark:active:bg-sky-800'
              )}
            >
              <View
                className={cn(
                  'w-5 h-5 rounded border-2 items-center justify-center mt-0.5',
                  kvkkAccepted ? 'bg-sky-500 border-sky-500' : 'border-sky-300 dark:border-sky-700'
                )}
              >
                {kvkkAccepted && <Icon name="Check" size={12} color="#FFFFFF" />}
              </View>
              <Text
                variant="caption"
                className={cn('flex-1', kvkkAccepted ? 'text-neutral-600 dark:text-neutral-600' : 'text-sky-100')}
              >
                <Text
                  variant="caption"
                  className={kvkkAccepted ? 'text-sky-600 dark:text-sky-600 font-semibold' : 'text-white font-semibold'}
                >
                  KVKK Aydınlatma Metni
                </Text>
                {"'ni okudum ve kişisel verilerimin işlenmesini kabul ediyorum."}
              </Text>
            </Pressable>

            {kvkkError && (
              <Text variant="caption" className="text-red-100">{kvkkError}</Text>
            )}

            {apiErrorMessage && (
              <View className="bg-red-50 dark:bg-red-950 rounded-xl px-4 py-3">
                <Text variant="caption" className="text-red-600 dark:text-red-300">
                  {apiErrorMessage}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <BottomActionBar
          actions={[{
            label: 'Hesabımı Aktive Et',
            onPress: onSubmit,
            variant: 'inverse',
            isLoading: isPending,
            loadingLabel: 'Aktive ediliyor...',
          }]}
        />
      </KeyboardAvoidingView>
    </View>
  )
}
