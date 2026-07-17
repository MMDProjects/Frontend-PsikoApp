import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Chip } from '@/core/components/atoms/Chip'
import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { StepProgress } from '@/core/components/molecules/StepProgress'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useUpdateProfileMutation } from '@/domains/auth'
import { ExpertSpecializations, useCreateExpertProfileMutation } from '@/domains/expert'

import type { ExpertOnboarding } from '@/domains/expert'

const TOTAL_STEPS = 7

const STEP_LABELS = ['Ünvan', 'Uzmanlık', 'Deneyim', 'İletişim', 'Biyografi', 'Belgeler', 'Fotoğraf']

export default function ExpertOnboardingScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [step, setStep] = useState(1)
  const { mutate: createProfile, isPending: isCreatingProfile, error } = useCreateExpertProfileMutation()
  const { mutate: updateAuthProfile, isPending: isUpdatingAuthProfile } = useUpdateProfileMutation()

  // Form state
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState<string | undefined>()
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])
  const [specsError, setSpecsError] = useState<string | undefined>()
  const [experienceYears, setExperienceYears] = useState(0)
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [bioError, setBioError] = useState<string | undefined>()
  const [education, setEducation] = useState('')
  const [personalWebsite, setPersonalWebsite] = useState('')

  const isPending = isCreatingProfile || isUpdatingAuthProfile

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

  const showComingSoon = (title: string) => {
    Alert.alert(title, 'Bu özellik yakında aktif olacak.')
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
    if (step === 5) {
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
    updateAuthProfile(
      { phone: phone.trim() || null, city: city.trim() || null },
      {
        onSuccess: () => {
          const data: ExpertOnboarding = {
            title: title.trim(),
            specializations: selectedSpecs,
            experienceYears,
            bio: bio.trim(),
            education: education.trim() || null,
            personalWebsite: personalWebsite.trim() || null,
          }
          createProfile(data, {
            onSuccess: () => router.replace('/(tabs)/'),
          })
        },
      }
    )
  }

  const apiErrorMessage = error instanceof Error ? error.message : undefined
  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      {/* Dekoratif daireler — her adımda süzülerek yer değiştirir */}
      <DecorCircles phase={step} />

      {/* Tek geri butonu: adım geri, ilk adımdaysa sayfadan çık */}
      <BackButton onPress={goBack} />

      <ScreenTitle title="Profilini Tamamla" topInset titleClassName="text-white" />

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
          {/* Başlık + alt açıklama */}
          <View className="gap-1">
            <Text variant="heading" className="text-white">{stepTitle(step)}</Text>
            {stepSubtitle(step) && (
              <Text variant="body" className="text-sky-100">{stepSubtitle(step)}</Text>
            )}
          </View>

          {/* Step 1 — Ünvan */}
          {step === 1 && (
            <InputField
              tone="onBrand"
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
                    variant="onBrand"
                  />
                ))}
              </View>
              {specsError && (
                <Text variant="caption" className="text-red-100">{specsError}</Text>
              )}
            </View>
          )}

          {/* Step 3 — Deneyim yılı */}
          {step === 3 && (
            <View className="flex-row items-center justify-between rounded-xl px-5 py-4 bg-sky-600 dark:bg-sky-900">
              <Pressable
                onPress={() => setExperienceYears((y) => Math.max(0, y - 1))}
                accessibilityRole="button"
                accessibilityLabel="Deneyim yılını azalt"
                className="w-10 h-10 rounded-full bg-sky-700 dark:bg-sky-950 items-center justify-center active:bg-sky-800"
              >
                <Icon name="Minus" size={20} color="#FFFFFF" />
              </Pressable>

              <View className="items-center">
                <Text variant="display" className="text-white">{experienceYears}</Text>
                <Text variant="caption" className="text-sky-100">yıl deneyim</Text>
              </View>

              <Pressable
                onPress={() => setExperienceYears((y) => Math.min(50, y + 1))}
                accessibilityRole="button"
                accessibilityLabel="Deneyim yılını artır"
                className="w-10 h-10 rounded-full bg-white items-center justify-center active:bg-sky-50"
              >
                <Icon name="Plus" size={20} color="#0EA5E9" />
              </Pressable>
            </View>
          )}

          {/* Step 4 — İletişim */}
          {step === 4 && (
            <View className="gap-4">
              <InputField
                tone="onBrand"
                label="Telefon (opsiyonel)"
                placeholder="05XX XXX XX XX"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <InputField
                tone="onBrand"
                label="Konum (opsiyonel)"
                placeholder="örn. İstanbul"
                value={city}
                onChangeText={setCity}
              />
            </View>
          )}

          {/* Step 5 — Biyografi & Eğitim */}
          {step === 5 && (
            <View className="gap-4">
              <InputField
                tone="onBrand"
                label="Biyografi"
                placeholder="Kendinizi danışanlara tanıtın. Eğitiminiz, yaklaşımınız ve çalışma tarzınız hakkında bilgi verin."
                value={bio}
                onChangeText={(t) => { setBio(t); setBioError(undefined) }}
                errorMessage={bioError}
                multiline
                hint={`${bio.length}/1000 karakter (minimum 50)`}
                isRequired
              />
              <InputField
                tone="onBrand"
                label="Eğitim Bilgisi (opsiyonel)"
                placeholder="örn. İstanbul Üniversitesi, Klinik Psikoloji (Yüksek Lisans)"
                value={education}
                onChangeText={setEducation}
                multiline
              />
            </View>
          )}

          {/* Step 6 — Belgeler & Bağlantılar */}
          {step === 6 && (
            <View className="gap-3">
              <Pressable
                onPress={() => showComingSoon('CV Yükle')}
                className="flex-row items-center gap-3 rounded-xl px-4 py-4 bg-sky-600 dark:bg-sky-900 active:bg-sky-700 dark:active:bg-sky-800"
              >
                <Icon name="FileUp" size={20} color="#FFFFFF" />
                <Text variant="label" className="text-white flex-1">CV Yükle</Text>
                <Icon name="ChevronRight" size={16} color="#E0F2FE" />
              </Pressable>
              <Pressable
                onPress={() => showComingSoon('Sertifika Ekle')}
                className="flex-row items-center gap-3 rounded-xl px-4 py-4 bg-sky-600 dark:bg-sky-900 active:bg-sky-700 dark:active:bg-sky-800"
              >
                <Icon name="Award" size={20} color="#FFFFFF" />
                <Text variant="label" className="text-white flex-1">Sertifika Ekle</Text>
                <Icon name="ChevronRight" size={16} color="#E0F2FE" />
              </Pressable>
              <InputField
                tone="onBrand"
                label="Kişisel Site (opsiyonel)"
                placeholder="https://ornek.com"
                keyboardType="url"
                autoCapitalize="none"
                value={personalWebsite}
                onChangeText={setPersonalWebsite}
              />
            </View>
          )}

          {/* Step 7 — Fotoğraf */}
          {step === 7 && (
            <View className="items-center gap-4">
              <View className="w-28 h-28 rounded-full bg-sky-600 dark:bg-sky-900 items-center justify-center border-2 border-dashed border-sky-300 dark:border-sky-700">
                <Icon name="Camera" size={32} color="#FFFFFF" />
              </View>
              <Text variant="body" className="text-sky-100" align="center">
                Profil fotoğrafı danışanların sizi tanımasına yardımcı olur.
              </Text>
              {/* expo-image-picker entegrasyonu Faz 3'te eklenir */}
              <View className="bg-sky-600 dark:bg-sky-900 rounded-xl px-4 py-3 w-full">
                <Text variant="caption" className="text-white" align="center">
                  Fotoğraf yükleme özelliği yakında aktif olacak.
                </Text>
              </View>
            </View>
          )}

          {apiErrorMessage && (
            <View className="bg-red-50 dark:bg-red-950 rounded-xl px-4 py-3">
              <Text variant="caption" className="text-red-600 dark:text-red-300">
                {apiErrorMessage}
              </Text>
            </View>
          )}
        </ScrollView>

        <BottomActionBar
          actions={
            step === TOTAL_STEPS
              ? [
                  { label: 'Şimdilik Atla', onPress: () => router.replace('/(tabs)/'), variant: 'inverseGhost' },
                  { label: 'Profili Tamamla', onPress: validateAndNext, variant: 'inverse', isLoading: isPending, loadingLabel: 'Kaydediliyor...' },
                ]
              : [{ label: 'Devam Et', onPress: validateAndNext, variant: 'inverse' }]
          }
        />
      </KeyboardAvoidingView>
    </View>
  )
}

function stepTitle(step: number): string {
  switch (step) {
    case 1: return 'Ünvanınız nedir?'
    case 2: return 'Uzmanlık Alanları'
    case 3: return 'Deneyim Süreniz'
    case 4: return 'İletişim Bilgileriniz'
    case 5: return 'Biyografi & Eğitim'
    case 6: return 'Belgeler & Bağlantılar'
    case 7: return 'Profil Fotoğrafı'
    default: return ''
  }
}

function stepSubtitle(step: number): string | undefined {
  switch (step) {
    case 1: return 'Danışanlar sizi bu ünvanla görecek'
    case 2: return 'Birden fazla alan seçebilirsiniz'
    case 4: return 'Eşleşme sonrası danışanla paylaşılabilir'
    case 5: return 'Danışanlara kendinizi tanıtın'
    case 6: return 'Profilinizin güvenilirliğini artırır'
    default: return undefined
  }
}
