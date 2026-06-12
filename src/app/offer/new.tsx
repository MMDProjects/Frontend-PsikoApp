import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'
import { useCreateOfferMutation, CreateOfferSchema } from '@/domains/offer'

import type { CreateOfferRequest } from '@/domains/offer'

export default function NewOfferScreen() {
  const router = useRouter()
  const { clientId } = useLocalSearchParams<{ clientId?: string }>()

  const { mutate: createOffer, isPending, error } = useCreateOfferMutation()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateOfferRequest>({
    resolver: zodResolver(CreateOfferSchema),
    defaultValues: {
      clientId: clientId ?? '',
      sessionType: 'online',
      notes: '',
      tiers: [{ price: 0, durationHours: 24 }],
    },
  })

  const { fields: tierFields, append, remove } = useFieldArray({ control, name: 'tiers' })

  const sessionType = watch('sessionType')

  const onSubmit = (data: CreateOfferRequest) => {
    createOffer(data, {
      onSuccess: (offer) => {
        router.replace(`/offer/${offer.id}`)
      },
    })
  }

  const apiError = error instanceof Error ? error.message : undefined

  return (
    <View className="flex-1 bg-surface-base">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-3 border-b border-neutral-100 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-neutral-100">
          <Icon name="ArrowLeft" size={22} color="#171717" />
        </Pressable>
        <Text variant="label" className="ml-2 font-semibold">Yeni Teklif Oluştur</Text>
      </View>

      <ScrollView contentContainerClassName="px-4 py-5 gap-5 pb-10" showsVerticalScrollIndicator={false}>

        {/* Danışan ID (prefilled) */}
        <Controller
          control={control}
          name="clientId"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Danışan ID"
              placeholder="Danışan UUID"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.clientId?.message}
              isRequired
            />
          )}
        />

        {/* Seans tipi */}
        <View className="gap-2">
          <Text variant="label" className="font-semibold">Seans Tipi</Text>
          <View className="flex-row gap-3">
            {(['online', 'in_person'] as const).map((type) => (
              <Controller
                key={type}
                control={control}
                name="sessionType"
                render={({ field: { onChange } }) => (
                  <Pressable
                    onPress={() => onChange(type)}
                    className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 border ${
                      sessionType === type
                        ? 'bg-sky-50 border-sky-300'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <Icon
                      name={type === 'online' ? 'Video' : 'MapPin'}
                      size={16}
                      color={sessionType === type ? '#0369A1' : '#737373'}
                    />
                    <Text
                      variant="label"
                      className={sessionType === type ? 'text-sky-700' : 'text-neutral-500'}
                    >
                      {type === 'online' ? 'Online' : 'Yüz Yüze'}
                    </Text>
                  </Pressable>
                )}
              />
            ))}
          </View>
        </View>

        {/* Kademeler */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text variant="label" className="font-semibold">Fiyat Kademeleri</Text>
            <Text variant="caption" color="secondary">Her kademe bir öncekinden ucuz olmalı</Text>
          </View>

          {tierFields.map((field, index) => (
            <View key={field.id} className="bg-white border border-neutral-100 rounded-xl p-4 gap-3">
              <View className="flex-row items-center justify-between">
                <Text variant="label" className="text-sky-700 font-semibold">
                  {index + 1}. Kademe
                </Text>
                {index > 0 && (
                  <Pressable onPress={() => remove(index)} className="p-1">
                    <Icon name="Trash2" size={16} color="#DC2626" />
                  </Pressable>
                )}
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name={`tiers.${index}.price`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputField
                        label="Fiyat (₺)"
                        placeholder="0"
                        keyboardType="numeric"
                        value={value ? String(value) : ''}
                        onChangeText={(v) => onChange(Number(v) || 0)}
                        onBlur={onBlur}
                        errorMessage={errors.tiers?.[index]?.price?.message}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name={`tiers.${index}.durationHours`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputField
                        label="Süre (saat)"
                        placeholder="24"
                        keyboardType="numeric"
                        value={value ? String(value) : ''}
                        onChangeText={(v) => onChange(Number(v) || 0)}
                        onBlur={onBlur}
                        errorMessage={errors.tiers?.[index]?.durationHours?.message}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          ))}

          {errors.tiers?.root?.message && (
            <Text variant="caption" className="text-semantic-error">
              {errors.tiers.root.message}
            </Text>
          )}

          {tierFields.length < 3 && (
            <Pressable
              onPress={() => append({ price: 0, durationHours: 24 })}
              className="flex-row items-center justify-center gap-2 border border-dashed border-sky-300 rounded-xl py-3 active:bg-sky-50"
            >
              <Icon name="Plus" size={16} color="#0EA5E9" />
              <Text variant="label" className="text-sky-600">Kademe Ekle</Text>
            </Pressable>
          )}
        </View>

        {/* Notlar */}
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Not (opsiyonel)"
              placeholder="Danışana iletilecek kısa not..."
              multiline
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.notes?.message}
            />
          )}
        />

        {apiError && (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <Text variant="caption" className="text-semantic-error">{apiError}</Text>
          </View>
        )}

        <Button
          label="Teklif Gönder"
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
        />
      </ScrollView>
    </View>
  )
}
