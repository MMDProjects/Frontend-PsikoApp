import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'
import { StepProgress } from '@/core/components/molecules/StepProgress'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { cn } from '@/core/utils/cn'
import { useMyAssessmentResultsQuery, RESULT_LEVEL_CONFIG } from '@/domains/assessment'

import { SPECIALIZATION_OPTIONS } from '../listing.constants'

import type { CreateListingRequest } from '../types/listing.types'

const TOTAL_STEPS = 3

const STEP_LABELS = ['Konu & Açıklama', 'Tercihler', 'Test Sonucu']

type SessionType = 'online' | 'yüz_yüze' | 'yüz_yüze_online'

type CreateListingFormProps = {
  /** Kontrollü adım — geri butonu ve dekor animasyonu ekran seviyesinde yönetilir */
  step: number
  onStepChange: (step: number) => void
  onSubmit: (data: CreateListingRequest) => void
  isLoading?: boolean
  initialSpecialization?: string
}

export function CreateListingForm({
  step,
  onStepChange,
  onSubmit,
  isLoading = false,
  initialSpecialization,
}: CreateListingFormProps) {
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState<string | undefined>()
  const [description, setDescription] = useState('')
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(
    () => (initialSpecialization ? [initialSpecialization] : [])
  )
  const [specsError, setSpecsError] = useState<string | undefined>()

  const [sessionType, setSessionType] = useState<SessionType>('online')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [budgetMinError, setBudgetMinError] = useState<string | undefined>()
  const [budgetMaxError, setBudgetMaxError] = useState<string | undefined>()

  const [selectedResultId, setSelectedResultId] = useState<string | undefined>()

  const { data: myResults } = useMyAssessmentResultsQuery()
  const insets = useSafeAreaInsets()

  const bottomBarHeight = 56 + insets.bottom

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    )
    setSpecsError(undefined)
  }

  const submitListing = () => {
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      specialization: selectedSpecs,
      budgetMin: parseFloat(budgetMin),
      budgetMax: parseFloat(budgetMax),
      preferredSessionType: sessionType,
      assessmentResultId: selectedResultId,
    })
  }

  const handleNext = () => {
    if (step === 1) {
      let hasError = false
      if (title.trim().length < 10) {
        setTitleError('İlan başlığı en az 10 karakter olmalıdır')
        hasError = true
      } else {
        setTitleError(undefined)
      }
      if (selectedSpecs.length === 0) {
        setSpecsError('En az 1 uzmanlık alanı seçiniz')
        hasError = true
      } else {
        setSpecsError(undefined)
      }
      if (hasError) return
      onStepChange(2)
    } else if (step === 2) {
      const minVal = parseFloat(budgetMin)
      const maxVal = parseFloat(budgetMax)
      let hasError = false
      if (!budgetMin || isNaN(minVal) || minVal <= 0) {
        setBudgetMinError('Geçerli minimum bütçe giriniz')
        hasError = true
      } else {
        setBudgetMinError(undefined)
      }
      if (!budgetMax || isNaN(maxVal) || maxVal <= 0) {
        setBudgetMaxError('Geçerli maksimum bütçe giriniz')
        hasError = true
      } else if (maxVal < minVal) {
        setBudgetMaxError('Maksimum bütçe minimumdan küçük olamaz')
        hasError = true
      } else {
        setBudgetMaxError(undefined)
      }
      if (hasError) return
      onStepChange(3)
    } else {
      submitListing()
    }
  }

  return (
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

        {/* ── Adım 1: Konu, Açıklama + Uzmanlık ── */}
        {step === 1 && (
          <View className="gap-5">
            <View className="gap-1">
              <Text variant="heading" className="text-white">İlanını Oluştur</Text>
              <Text variant="body" className="text-sky-100">
                Neye ihtiyaç duyduğunu anlat, uzmanlara ilanını göster.
              </Text>
            </View>

            <InputField
              tone="onBrand"
              label="İlan Başlığı"
              placeholder="Örn: Kaygı ve panik atak için destek arıyorum"
              value={title}
              onChangeText={setTitle}
              errorMessage={titleError}
              isRequired
              maxLength={100}
              hint={`${title.length}/100`}
            />

            <InputField
              tone="onBrand"
              label="Açıklama (opsiyonel)"
              placeholder="Deneyimini, beklentilerini, mevcut durumunu kısaca anlat..."
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={500}
              hint={`${description.length}/500`}
            />

            <View className="gap-2.5">
              <View className="flex-row items-center justify-between">
                <Text variant="label" className="text-white">
                  Uzmanlık Alanı <Text variant="caption" className="text-red-100">*</Text>
                </Text>
                {selectedSpecs.length > 0 && (
                  <Text variant="caption" className="text-sky-100">{selectedSpecs.length} seçildi</Text>
                )}
              </View>
              <View className="flex-row flex-wrap gap-2">
                {SPECIALIZATION_OPTIONS.map((spec) => (
                  <Chip
                    key={spec}
                    label={spec}
                    variant="onBrand"
                    isSelected={selectedSpecs.includes(spec)}
                    onPress={() => toggleSpec(spec)}
                  />
                ))}
              </View>
              {specsError && (
                <Text variant="caption" className="text-red-100">{specsError}</Text>
              )}
            </View>
          </View>
        )}

        {/* ── Adım 2: Seans Tipi + Bütçe ── */}
        {step === 2 && (
          <View className="gap-5">
            <View className="gap-1">
              <Text variant="heading" className="text-white">Tercihleriniz</Text>
              <Text variant="body" className="text-sky-100">
                Görüşme yönteminizi ve bütçe aralığınızı belirleyin.
              </Text>
            </View>

            <View className="gap-2.5">
              <Text variant="label" className="text-white">Seans Tipi</Text>
              <View className="gap-2">
                {([
                  { value: 'online',      label: 'Online',      subtitle: 'Video veya ses ile görüşme', icon: 'Video'   },
                  { value: 'yüz_yüze',   label: 'Yüz Yüze',   subtitle: 'Fiziksel ofis görüşmesi',    icon: 'MapPin'  },
                  { value: 'yüz_yüze_online', label: 'Yüz Yüze / Online', subtitle: 'Her iki yöntem de uygun', icon: 'Shuffle' },
                ] as { value: SessionType; label: string; subtitle: string; icon: string }[]).map(({ value, label, subtitle, icon }) => {
                  const isActive = sessionType === value
                  return (
                    <Pressable
                      key={value}
                      onPress={() => setSessionType(value)}
                      className={cn(
                        'border rounded-xl p-4 flex-row items-center gap-3',
                        isActive
                          ? 'bg-white border-white'
                          : 'bg-sky-600 border-sky-600 dark:bg-sky-900 dark:border-sky-900 active:bg-sky-700 dark:active:bg-sky-800'
                      )}
                    >
                      <View
                        className={cn(
                          'w-9 h-9 rounded-xl items-center justify-center',
                          isActive ? 'bg-sky-100' : 'bg-sky-700 dark:bg-sky-950'
                        )}
                      >
                        <Icon name={icon as never} size={18} color={isActive ? '#0EA5E9' : '#FFFFFF'} />
                      </View>
                      <View className="flex-1">
                        <Text variant="label" className={isActive ? 'text-neutral-900 dark:text-neutral-900' : 'text-white'}>{label}</Text>
                        <Text variant="caption" className={isActive ? 'text-neutral-500 dark:text-neutral-500' : 'text-sky-100'}>{subtitle}</Text>
                      </View>
                      <View
                        className={cn(
                          'w-5 h-5 rounded-full border-2 items-center justify-center',
                          isActive ? 'border-sky-500' : 'border-sky-300 dark:border-sky-700'
                        )}
                      >
                        {isActive && (
                          <View className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                        )}
                      </View>
                    </Pressable>
                  )
                })}
              </View>
            </View>

            <View className="gap-2.5">
              <Text variant="label" className="text-white">Bütçe Aralığı (₺ / seans)</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <InputField
                    tone="onBrand"
                    label="Minimum"
                    placeholder="500"
                    keyboardType="numeric"
                    value={budgetMin}
                    onChangeText={setBudgetMin}
                    errorMessage={budgetMinError}
                    isRequired
                  />
                </View>
                <View className="flex-1">
                  <InputField
                    tone="onBrand"
                    label="Maksimum"
                    placeholder="1000"
                    keyboardType="numeric"
                    value={budgetMax}
                    onChangeText={setBudgetMax}
                    errorMessage={budgetMaxError}
                    isRequired
                  />
                </View>
              </View>
              {budgetMin && budgetMax && !budgetMinError && !budgetMaxError && (
                <View className="flex-row items-center gap-1.5 bg-sky-600 dark:bg-sky-900 rounded-xl px-3 py-2">
                  <Icon name="Info" size={14} color="#FFFFFF" />
                  <Text variant="caption" className="text-white">
                    ₺{parseFloat(budgetMin).toLocaleString('tr-TR')} – ₺{parseFloat(budgetMax).toLocaleString('tr-TR')} aralığı
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* ── Adım 3: Test Sonucu (opsiyonel) + Yayınla ── */}
        {step === 3 && (
          <View className="gap-5">
            <View className="gap-1">
              <Text variant="heading" className="text-white">Test Sonucu Ekle</Text>
              <Text variant="body" className="text-sky-100">
                Geçmiş test sonuçlarını ilanına ekleyerek uzmanlara daha fazla bilgi verebilirsin.
              </Text>
            </View>

            {/* İlan özeti — flat panel */}
            <View className="bg-sky-600 dark:bg-sky-900 rounded-xl px-4 py-4 gap-3">
              <Text variant="caption" className="text-sky-100 font-semibold uppercase tracking-widest">
                İlan Özeti
              </Text>
              <View className="gap-1.5">
                <View className="flex-row gap-2">
                  <Icon name="FileText" size={14} color="#FFFFFF" />
                  <Text variant="caption" className="text-white flex-1" numberOfLines={2}>{title.trim()}</Text>
                </View>
                <View className="flex-row gap-2">
                  <Icon name="Tag" size={14} color="#FFFFFF" />
                  <Text variant="caption" className="text-white flex-1">
                    {selectedSpecs.slice(0, 3).join(', ')}{selectedSpecs.length > 3 ? ` +${selectedSpecs.length - 3}` : ''}
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <Icon name="Wallet" size={14} color="#FFFFFF" />
                  <Text variant="caption" className="text-white">
                    ₺{parseFloat(budgetMin).toLocaleString('tr-TR')} – ₺{parseFloat(budgetMax).toLocaleString('tr-TR')}
                  </Text>
                </View>
              </View>
            </View>

            {!myResults || myResults.length === 0 ? (
              <View className="bg-sky-600 dark:bg-sky-900 rounded-xl p-4 items-center gap-2">
                <Icon name="ClipboardList" size={32} color="rgba(255,255,255,0.8)" />
                <Text variant="body" className="text-white" align="center">
                  Henüz tamamlanmış test sonucun yok.
                </Text>
                <Text variant="caption" className="text-sky-100" align="center">
                  Testler sayfasından bir test tamamlayabilirsin.
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {myResults.map((result) => {
                  const cfg = RESULT_LEVEL_CONFIG[result.level]
                  const isSelected = selectedResultId === result.id
                  return (
                    <Pressable
                      key={result.id}
                      onPress={() => setSelectedResultId(isSelected ? undefined : result.id)}
                      className={cn(
                        'rounded-xl px-4 py-4 gap-2 active:opacity-90',
                        isSelected ? 'bg-sky-50 dark:bg-sky-100' : 'bg-white dark:bg-white'
                      )}
                    >
                      {/* Başlık + seviye + seçim — güncel test sonuçları satır dili */}
                      <View className="flex-row items-center gap-2.5">
                        <Text
                          variant="label"
                          className="flex-1 font-semibold text-neutral-900 dark:text-neutral-900"
                          numberOfLines={1}
                        >
                          {result.assessmentTitle}
                        </Text>
                        <Text variant="caption" className="font-semibold" style={{ color: cfg.color }}>
                          {cfg.label}
                        </Text>
                        <View
                          className={cn(
                            'w-5 h-5 rounded-full border-2 items-center justify-center',
                            isSelected ? 'border-sky-500 bg-sky-500' : 'border-neutral-300 bg-white'
                          )}
                        >
                          {isSelected && <Icon name="Check" size={11} color="#fff" />}
                        </View>
                      </View>

                      {/* Özet */}
                      <Text
                        variant="caption"
                        className="leading-relaxed text-neutral-500 dark:text-neutral-500"
                        numberOfLines={2}
                      >
                        {result.summary}
                      </Text>

                      {/* Puan */}
                      <Text variant="caption" className="text-neutral-400 dark:text-neutral-400">
                        Puan: {result.score}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            )}
          </View>
        )}

        {/* Seçili test sonucu bilgilendirmesi */}
        {step === TOTAL_STEPS && selectedResultId !== undefined && (
          <View className="flex-row items-center gap-1.5 justify-center">
            <Icon name="Paperclip" size={13} color="#FFFFFF" />
            <Text variant="caption" className="text-white">Test sonucu ilanına eklenecek</Text>
          </View>
        )}
      </ScrollView>

      {/* Alt sabit aksiyon barı — diğer sayfalarla aynı pill dil */}
      <BottomActionBar
        actions={
          step < TOTAL_STEPS
            ? [{ label: 'Devam Et', onPress: handleNext, variant: 'inverse' }]
            : selectedResultId === undefined && myResults && myResults.length > 0
              ? [
                  { label: 'Testsiz Yayınla', onPress: submitListing, variant: 'inverseGhost', isLoading, loadingLabel: 'Yayınlanıyor...' },
                  { label: 'İlanı Yayınla', onPress: submitListing, variant: 'inverse', isLoading, loadingLabel: 'Yayınlanıyor...' },
                ]
              : [{ label: 'İlanı Yayınla', onPress: submitListing, variant: 'inverse', isLoading, loadingLabel: 'Yayınlanıyor...' }]
        }
      />
    </KeyboardAvoidingView>
  )
}
