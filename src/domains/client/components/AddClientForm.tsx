import { View } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/core/components/atoms/Button'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'

import { useAddClientMutation } from '../api/useAddClientMutation'
import { AddClientSchema } from '../schemas/client.schema'

import type { Client, AddClientRequest } from '../types/client.types'

export type AddClientFormProps = {
  onSuccess?: (client: Client) => void
  onCancel?: () => void
}

export function AddClientForm({ onSuccess, onCancel }: AddClientFormProps) {
  const { mutate: addClient, isPending, error } = useAddClientMutation()

  const { control, handleSubmit, formState: { errors } } = useForm<AddClientRequest>({
    resolver: zodResolver(AddClientSchema),
    defaultValues: { fullName: '', email: '', phone: '', notes: '' },
  })

  const onSubmit = (data: AddClientRequest) => {
    addClient(data, { onSuccess })
  }

  const apiErrorMessage = error instanceof Error ? error.message : undefined

  return (
    <View className="gap-5">
      <View className="gap-1">
        <Text variant="subheading">Danışan Ekle</Text>
        <Text variant="body" color="secondary">
          Danışanınıza platforma katılım daveti gönderilecek.
        </Text>
      </View>

      <View className="gap-4">
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Ad Soyad"
              placeholder="Danışanınızın adı soyadı"
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
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.email?.message}
              hint="E-posta veya telefon en az birini doldurun"
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Telefon"
              placeholder="05XX XXX XX XX"
              keyboardType="phone-pad"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.phone?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Not (opsiyonel)"
              placeholder="Dahili not — danışana gösterilmez"
              multiline
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.notes?.message}
            />
          )}
        />
      </View>

      {apiErrorMessage && (
        <View className="bg-semantic-error-light border border-red-200 rounded-xl px-4 py-3">
          <Text variant="caption" className="text-semantic-error">
            {apiErrorMessage}
          </Text>
        </View>
      )}

      <View className="flex-row gap-3">
        {onCancel && (
          <Button
            label="İptal"
            onPress={onCancel}
            variant="ghost"
            className="flex-1"
          />
        )}
        <Button
          label="Davet Gönder"
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
          className="flex-1"
        />
      </View>
    </View>
  )
}
