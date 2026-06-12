import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { useMutation } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'
import { post } from '@/lib/api'
import { tokenStorage } from '@/lib/storage'
import { useAuthStore } from '@/domains/auth'
import { LoginResponseSchema } from '@/domains/auth'

// ─── Accept invite mutation ───────────────────────────────────────────────────

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

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ClientOnboardingScreen() {
  const router = useRouter()
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
      { onSuccess: () => router.replace('/(tabs)/') }
    )
  }

  const apiErrorMessage = error instanceof Error ? error.message : undefined

  // No invite token — show error state
  if (!inviteToken) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base px-6">
        <View className="w-20 h-20 rounded-full bg-red-50 border border-red-200 items-center justify-center mb-4">
          <Icon name="AlertCircle" size={36} color="#DC2626" />
        </View>
        <Text variant="heading" align="center">Geçersiz Davet Bağlantısı</Text>
        <Text variant="body" color="secondary" align="center" className="mt-2">
          Bu bağlantı geçersiz veya süresi dolmuş. Psikologunuzdan yeni bir davet bağlantısı isteyin.
        </Text>
        <Button
          label="Ana Sayfaya Dön"
          onPress={() => router.replace('/(auth)/login')}
          variant="secondary"
          className="mt-6"
        />
      </View>
    )
  }

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
        <View className="items-center mb-10">
          <View className="w-16 h-16 rounded-full bg-sky-50 border border-sky-200 items-center justify-center mb-4">
            <Icon name="CheckCircle" size={32} color="#0EA5E9" />
          </View>
          <Text variant="heading" align="center">Daveti Kabul Et</Text>
          <Text variant="body" color="secondary" align="center" className="mt-2">
            Psikologunuz sizi PsikoAl'a davet etti. Şifrenizi belirleyerek hesabınızı aktive edin.
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <InputField
            label="Şifre"
            placeholder="En az 8 karakter"
            isSecure
            value={password}
            onChangeText={(v) => { setPassword(v); setPasswordError(undefined) }}
            errorMessage={password !== passwordConfirm && passwordConfirm ? 'Şifreler eşleşmiyor' : undefined}
            isRequired
          />

          <InputField
            label="Şifre Tekrar"
            placeholder="Şifrenizi tekrar girin"
            isSecure
            value={passwordConfirm}
            onChangeText={(v) => { setPasswordConfirm(v); setPasswordError(undefined) }}
            errorMessage={passwordError}
            isRequired
          />

          {/* KVKK consent */}
          <Pressable
            onPress={() => { setKvkkAccepted((v) => !v); setKvkkError(undefined) }}
            className="flex-row items-start gap-3 p-4 rounded-xl border border-neutral-200 bg-surface-raised"
          >
            <View className={[
              'w-5 h-5 rounded border-2 items-center justify-center mt-0.5',
              kvkkAccepted ? 'bg-sky-500 border-sky-500' : 'border-neutral-300',
            ].join(' ')}>
              {kvkkAccepted && <Icon name="Check" size={12} color="#FFFFFF" />}
            </View>
            <Text variant="caption" color="secondary" className="flex-1">
              <Text variant="caption" color="brand">KVKK Aydınlatma Metni</Text>
              {"'ni okudum ve kişisel verilerimin işlenmesini kabul ediyorum."}
            </Text>
          </Pressable>

          {kvkkError && (
            <Text variant="caption" className="text-semantic-error">
              {kvkkError}
            </Text>
          )}

          {apiErrorMessage && (
            <View className="bg-semantic-error-light border border-red-200 rounded-xl px-4 py-3">
              <Text variant="caption" className="text-semantic-error">
                {apiErrorMessage}
              </Text>
            </View>
          )}

          <Button
            label="Hesabımı Aktive Et"
            onPress={onSubmit}
            isLoading={isPending}
            className="mt-2"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
