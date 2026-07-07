import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native'

import { Button } from '@/core/components/atoms/Button'
import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'
import { cn } from '@/core/utils/cn'
import { useMyAssessmentResultsQuery, RESULT_LEVEL_CONFIG } from '@/domains/assessment'

import { SPECIALIZATION_OPTIONS } from '../listing.constants'

import type { CreateListingRequest } from '../types/listing.types'

const TOTAL_STEPS = 3

const STEP_LABELS = ['Konu & Açıklama', 'Tercihler', 'Test Sonucu']

type SessionType = 'online' | 'yüz_yüze' | 'yüz_yüze_online'

type CreateListingFormProps = {
  onSubmit: (data: CreateListingRequest) => void
  onCancel: () => void
  isLoading?: boolean
  initialSpecialization?: string
}

export function CreateListingForm({ onSubmit, onCancel, isLoading = false, initialSpecialization }: CreateListingFormProps) {
  const [step, setStep] = useState(1)

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

  const goBack = () => {
    if (step > 1) setStep((s) => (s - 1) as typeof step)
    else onCancel()
  }

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
      setStep(2)
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
      setStep(3)
    } else {
      submitListing()
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Progress header */}
      <View className="px-5 pt-4 pb-2">
        <View className="flex-row items-center mb-4">
          <Pressable onPress={goBack} className="p-2 -ml-2 rounded-full active:bg-neutral-100">
            <Icon name="ArrowLeft" size={22} color="#171717" />
          </Pressable>
          <View className="flex-1 ml-2">
            <Text variant="caption" color="secondary">{step}/{TOTAL_STEPS} — {STEP_LABELS[step - 1]}</Text>
          </View>
        </View>
        <View className="flex-row gap-1.5 mb-4">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <View
              key={i}
              className={cn('h-1.5 flex-1 rounded-full', i < step ? 'bg-sky-500' : 'bg-neutral-200')}
            />
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerClassName="px-5 pb-8 gap-5"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Adım 1: Konu, Açıklama + Uzmanlık ── */}
        {step === 1 && (
          <View className="gap-5">
            <View className="gap-1">
              <Text variant="heading">İlanını Oluştur</Text>
              <Text variant="body" color="secondary">
                Neye ihtiyaç duyduğunu anlat, uzmanlara ilanını göster.
              </Text>
            </View>

            <InputField
              label="İlan Başlığı"
              placeholder="Örn: Kaygı ve panik atak için destek arıyorum"
              value={title}
              onChangeText={setTitle}
              errorMessage={titleError}
              isRequired
              maxLength={100}
              hintText={`${title.length}/100`}
            />

            <View className="gap-1.5">
              <Text variant="label">
                Açıklama <Text variant="caption" color="tertiary">(opsiyonel)</Text>
              </Text>
              <View className="border border-neutral-200 rounded-xl p-3 bg-neutral-50 min-h-[90px]">
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Deneyimini, beklentilerini, mevcut durumunu kısaca anlat..."
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  className="text-sm text-neutral-900 leading-relaxed"
                  textAlignVertical="top"
                />
              </View>
              <Text variant="caption" color="tertiary" align="right">{description.length}/500</Text>
            </View>

            <View className="gap-2.5">
              <View className="flex-row items-center justify-between">
                <Text variant="label">
                  Uzmanlık Alanı <Text variant="caption" className="text-red-500">*</Text>
                </Text>
                {selectedSpecs.length > 0 && (
                  <Text variant="caption" color="secondary">{selectedSpecs.length} seçildi</Text>
                )}
              </View>
              <View className="flex-row flex-wrap gap-2">
                {SPECIALIZATION_OPTIONS.map((spec) => (
                  <Chip
                    key={spec}
                    label={spec}
                    variant="filter"
                    isSelected={selectedSpecs.includes(spec)}
                    onPress={() => toggleSpec(spec)}
                  />
                ))}
              </View>
              {specsError && (
                <Text variant="caption" className="text-red-500">{specsError}</Text>
              )}
            </View>
          </View>
        )}

        {/* ── Adım 2: Seans Tipi + Bütçe ── */}
        {step === 2 && (
          <View className="gap-5">
            <View className="gap-1">
              <Text variant="heading">Tercihleriniz</Text>
              <Text variant="body" color="secondary">
                Görüşme yönteminizi ve bütçe aralığınızı belirleyin.
              </Text>
            </View>

            <View className="gap-2.5">
              <Text variant="label">Seans Tipi</Text>
              <View className="gap-2">
                {([
                  { value: 'online',      label: 'Online',      subtitle: 'Video veya ses ile görüşme', icon: 'Video'   },
                  { value: 'yüz_yüze',   label: 'Yüz Yüze',   subtitle: 'Fiziksel ofis görüşmesi',    icon: 'MapPin'  },
                  { value: 'yüz_yüze_online', label: 'Yüz Yüze / Online', subtitle: 'Her iki yöntem de uygun', icon: 'Shuffle' },
                ] as { value: SessionType; label: string; subtitle: string; icon: string }[]).map(({ value, label, subtitle, icon }) => (
                  <Pressable
                    key={value}
                    onPress={() => setSessionType(value)}
                    className={cn(
                      'border rounded-xl p-4 flex-row items-center gap-3',
                      sessionType === value
                        ? 'bg-sky-50 border-sky-300'
                        : 'bg-white border-neutral-200 active:bg-neutral-50'
                    )}
                  >
                    <View
                      className={cn(
                        'w-9 h-9 rounded-xl items-center justify-center',
                        sessionType === value ? 'bg-sky-100' : 'bg-neutral-100'
                      )}
                    >
                      <Icon name={icon as never} size={18} color={sessionType === value ? '#0EA5E9' : '#A3A3A3'} />
                    </View>
                    <View className="flex-1">
                      <Text variant="label">{label}</Text>
                      <Text variant="caption" color="secondary">{subtitle}</Text>
                    </View>
                    <View
                      className={cn(
                        'w-5 h-5 rounded-full border-2 items-center justify-center',
                        sessionType === value ? 'border-sky-500' : 'border-neutral-300'
                      )}
                    >
                      {sessionType === value && (
                        <View className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="gap-2.5">
              <Text variant="label">Bütçe Aralığı (₺ / seans)</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <InputField
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
                <View className="flex-row items-center gap-1.5 bg-sky-50 border border-sky-100 rounded-xl px-3 py-2">
                  <Icon name="Info" size={14} color="#0EA5E9" />
                  <Text variant="caption" className="text-sky-700">
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
              <Text variant="heading">Test Sonucu Ekle</Text>
              <Text variant="body" color="secondary">
                Geçmiş test sonuçlarını ilanına ekleyerek uzmanlara daha fazla bilgi verebilirsin.
              </Text>
            </View>

            {/* İlan özeti */}
            <View className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-4 gap-3">
              <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                İlan Özeti
              </Text>
              <View className="gap-1.5">
                <View className="flex-row gap-2">
                  <Icon name="FileText" size={14} color="#0EA5E9" />
                  <Text variant="caption" color="secondary" className="flex-1" numberOfLines={2}>{title.trim()}</Text>
                </View>
                <View className="flex-row gap-2">
                  <Icon name="Tag" size={14} color="#0EA5E9" />
                  <Text variant="caption" color="secondary" className="flex-1">
                    {selectedSpecs.slice(0, 3).join(', ')}{selectedSpecs.length > 3 ? ` +${selectedSpecs.length - 3}` : ''}
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <Icon name="Wallet" size={14} color="#0EA5E9" />
                  <Text variant="caption" color="secondary">
                    ₺{parseFloat(budgetMin).toLocaleString('tr-TR')} – ₺{parseFloat(budgetMax).toLocaleString('tr-TR')}
                  </Text>
                </View>
              </View>
            </View>

            {!myResults || myResults.length === 0 ? (
              <View className="bg-white rounded-xl p-4 border border-neutral-100 items-center gap-2">
                <Icon name="ClipboardList" size={32} color="#A3A3A3" />
                <Text variant="body" color="secondary" align="center">
                  Henüz tamamlanmış test sonucun yok.
                </Text>
                <Text variant="caption" color="tertiary" align="center">
                  Testler sayfasından bir test tamamlayabilirsin.
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {myResults.map((result) => {
                  const cfg = RESULT_LEVEL_CONFIG[result.level]
                  const isSelected = selectedResultId === result.id
                  const headerBg = result.level === 'low' ? '#F0FDF4' : result.level === 'moderate' ? '#FFFBEB' : '#FEF2F2'
                  return (
                    <Pressable
                      key={result.id}
                      onPress={() => setSelectedResultId(isSelected ? undefined : result.id)}
                      className={cn(
                        'rounded-xl overflow-hidden border',
                        isSelected ? 'border-sky-300' : 'border-neutral-200'
                      )}
                    >
                      <View
                        className="px-4 py-3 flex-row items-center justify-between"
                        style={{ backgroundColor: headerBg }}
                      >
                        <View className="flex-row items-center gap-2">
                          <Icon name="ClipboardList" size={14} color={cfg.color} />
                          <Text variant="label" className="font-semibold" style={{ color: cfg.color }}>
                            {result.assessmentTitle}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.color + '20' }}>
                            <Text variant="caption" className="font-semibold" style={{ color: cfg.color }}>
                              {cfg.label}
                            </Text>
                          </View>
                          <View
                            className={cn(
                              'w-5 h-5 rounded-full border-2 items-center justify-center',
                              isSelected ? 'border-sky-500 bg-sky-500' : 'border-neutral-300 bg-white'
                            )}
                          >
                            {isSelected && <Icon name="Check" size={11} color="#fff" />}
                          </View>
                        </View>
                      </View>
                      <View className="px-4 pt-3 pb-3 bg-white gap-1">
                        <Text variant="caption" color="secondary" numberOfLines={2}>{result.summary}</Text>
                        <Text variant="caption" color="tertiary">Puan: {result.score}</Text>
                      </View>
                    </Pressable>
                  )
                })}
              </View>
            )}
          </View>
        )}

        {/* Aksiyon butonları */}
        {step < TOTAL_STEPS ? (
          <Button
            label="Devam Et"
            onPress={handleNext}
            variant="primary"
            size="lg"
            fullWidth
            className="mt-2"
          />
        ) : (
          <View className="gap-3 mt-2">
            <Button
              label="İlanı Yayınla"
              onPress={submitListing}
              isLoading={isLoading}
              variant="primary"
              size="lg"
              fullWidth
            />
            {selectedResultId !== undefined && (
              <View className="flex-row items-center gap-1.5 justify-center">
                <Icon name="Paperclip" size={13} color="#0EA5E9" />
                <Text variant="caption" className="text-sky-600">Test sonucu ilanına eklenecek</Text>
              </View>
            )}
            {selectedResultId === undefined && myResults && myResults.length > 0 && (
              <Button
                label="Test sonucu eklemeden yayınla"
                onPress={submitListing}
                isLoading={isLoading}
                variant="ghost"
                size="md"
                fullWidth
              />
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
