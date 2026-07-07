import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, useColorScheme, View } from 'react-native'
import { useRouter } from 'expo-router'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { Chip } from '@/core/components/atoms/Chip'
import { InputField } from '@/core/components/molecules/InputField'
import { ExpertSpecializations, useCreateExpertProfileMutation } from '@/domains/expert'

import type { ExpertOnboarding } from '@/domains/expert'

const TOTAL_STEPS = 5

// ─── Step header ─────────────────────────────────────────────────────────────

type StepHeaderProps = {
  step: number
  total: number
  title: string
  subtitle?: string
  onBack: () => void
}

function StepHeader({ step, total, title, subtitle, onBack }: StepHeaderProps) {
  const isDark = useColorScheme() === 'dark'
  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-6">
        <Pressable onPress={onBack} className="p-2 -ml-2 rounded-full active:bg-neutral-100 dark:active:bg-dark-control">
          <Icon name="ArrowLeft" size={22} color={isDark ? '#F5F5F7' : '#171717'} />
        </Pressable>
        <Text variant="caption" color="secondary" className="ml-2">
          {step}/{total}
        </Text>
      </View>

      {/* Progress */}
      <View className="flex-row gap-1.5 mb-6">
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            className={[
              'h-1.5 flex-1 rounded-full',
              i < step ? 'bg-sky-500' : 'bg-neutral-200 dark:bg-dark-control',
            ].join(' ')}
          />
        ))}
      </View>

      <Text variant="heading">{title}</Text>
      {subtitle && (
        <Text variant="body" color="secondary" className="mt-1">
          {subtitle}
        </Text>
      )}
    </View>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ExpertOnboardingScreen() {
  const router = useRouter()
  const isDark = useColorScheme() === 'dark'
  const [step, setStep] = useState(1)
  const { mutate: createProfile, isPending, error } = useCreateExpertProfileMutation()

  // Form state
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState<string | undefined>()
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])
  const [specsError, setSpecsError] = useState<string | undefined>()
  const [experienceYears, setExperienceYears] = useState(0)
  const [bio, setBio] = useState('')
  const [bioError, setBioError] = useState<string | undefined>()

  const goBack = () => {
    if (step > 1) setStep((s) => (s - 1) as typeof step)
    else router.back()
  }

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    )
    setSpecsError(undefined)
  }

  const validateAndNext = () => {
    if (step === 1) {
      if (title.trim().length < 2) {
        setTitleError('Ünvan en az 2 karakter olmalı')
        return
      }
      setTitleError(undefined)
    }
    if (step === 2) {
      if (selectedSpecs.length === 0) {
        setSpecsError('En az bir uzmanlık alanı seçiniz')
        return
      }
      setSpecsError(undefined)
    }
    if (step === 4) {
      if (bio.trim().length < 50) {
        setBioError('Biyografi en az 50 karakter olmalı')
        return
      }
      setBioError(undefined)
    }
    if (step < TOTAL_STEPS) {
      setStep((s) => (s + 1) as typeof step)
    } else {
      submitProfile()
    }
  }

  const submitProfile = () => {
    const data: ExpertOnboarding = {
      title: title.trim(),
      specializations: selectedSpecs,
      experienceYears,
      bio: bio.trim(),
    }
    createProfile(data, {
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
        contentContainerClassName="flex-grow px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <StepHeader
          step={step}
          total={TOTAL_STEPS}
          title={stepTitle(step)}
          subtitle={stepSubtitle(step)}
          onBack={goBack}
        />

        {/* Step 1 — Ünvan */}
        {step === 1 && (
          <InputField
            label="Ünvan"
            placeholder="Örn: Klinik Psikolog, Psikoterapist"
            value={title}
            onChangeText={(t) => { setTitle(t); setTitleError(undefined) }}
            errorMessage={titleError}
            isRequired
          />
        )}

        {/* Step 2 — Uzmanlık alanları */}
        {step === 2 && (
          <View className="gap-3">
            <View className="flex-row flex-wrap gap-2">
              {ExpertSpecializations.map((spec) => (
                <Chip
                  key={spec}
                  label={spec}
                  isSelected={selectedSpecs.includes(spec)}
                  onPress={() => toggleSpec(spec)}
                  variant="filter"
                />
              ))}
            </View>
            {specsError && (
              <Text variant="caption" className="text-semantic-error">
                {specsError}
              </Text>
            )}
          </View>
        )}

        {/* Step 3 — Deneyim yılı */}
        {step === 3 && (
          <View className="gap-4">
            <View className="flex-row items-center justify-between border border-neutral-200 dark:border-dark-border rounded-xl px-5 py-4 bg-surface-raised dark:bg-dark-card">
              <Pressable
                onPress={() => setExperienceYears((y) => Math.max(0, y - 1))}
                className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-dark-control items-center justify-center active:bg-neutral-200 dark:active:bg-dark-elevated"
              >
                <Icon name="Minus" size={20} color={isDark ? '#F5F5F7' : '#171717'} />
              </Pressable>

              <View className="items-center">
                <Text variant="display">{experienceYears}</Text>
                <Text variant="caption" color="secondary">yıl deneyim</Text>
              </View>

              <Pressable
                onPress={() => setExperienceYears((y) => Math.min(50, y + 1))}
                className="w-10 h-10 rounded-full bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 items-center justify-center active:bg-sky-100 dark:active:bg-sky-900"
              >
                <Icon name="Plus" size={20} color="#0EA5E9" />
              </Pressable>
            </View>
          </View>
        )}

        {/* Step 4 — Biyografi */}
        {step === 4 && (
          <View className="gap-2">
            <InputField
              label="Biyografi"
              placeholder="Kendinizi danışanlara tanıtın. Eğitiminiz, yaklaşımınız ve çalışma tarzınız hakkında bilgi verin."
              value={bio}
              onChangeText={(t) => { setBio(t); setBioError(undefined) }}
              errorMessage={bioError}
              multiline
              hint={`${bio.length}/1000 karakter (minimum 50)`}
              isRequired
            />
          </View>
        )}

        {/* Step 5 — Fotoğraf */}
        {step === 5 && (
          <View className="gap-4">
            <View className="items-center gap-4">
              <View className="w-28 h-28 rounded-full bg-neutral-100 dark:bg-dark-control items-center justify-center border-2 border-dashed border-neutral-300 dark:border-dark-border2">
                <Icon name="Camera" size={32} color="#A3A3A3" />
              </View>
              <Text variant="body" color="secondary" align="center">
                Profil fotoğrafı danışanların sizi tanımasına yardımcı olur.
              </Text>
              {/* expo-image-picker entegrasyonu Faza 3'te eklenir */}
              <View className="bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 rounded-xl px-4 py-3 w-full">
                <Text variant="caption" color="brand" align="center">
                  Fotoğraf yükleme özelliği yakında aktif olacak.
                </Text>
              </View>
            </View>
          </View>
        )}

        {apiErrorMessage && (
          <View className="mt-4 bg-semantic-error-light dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
            <Text variant="caption" className="text-semantic-error">
              {apiErrorMessage}
            </Text>
          </View>
        )}

        <Button
          label={step === TOTAL_STEPS ? 'Profili Tamamla' : 'Devam Et'}
          onPress={validateAndNext}
          isLoading={isPending}
          className="mt-8"
        />

        {step === TOTAL_STEPS && (
          <Pressable onPress={() => router.replace('/(tabs)/')} className="mt-4 items-center">
            <Text variant="label" color="secondary">Şimdilik atla</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function stepTitle(step: number): string {
  switch (step) {
    case 1: return 'Ünvanınız nedir?'
    case 2: return 'Uzmanlık Alanları'
    case 3: return 'Deneyim Süreniz'
    case 4: return 'Biyografi'
    case 5: return 'Profil Fotoğrafı'
    default: return ''
  }
}

function stepSubtitle(step: number): string | undefined {
  switch (step) {
    case 2: return 'Birden fazla alan seçebilirsiniz'
    case 4: return 'Danışanlara kendinizi tanıtın'
    default: return undefined
  }
}
