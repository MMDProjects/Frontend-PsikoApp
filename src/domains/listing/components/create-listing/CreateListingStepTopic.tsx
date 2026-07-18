import { View } from 'react-native'

import { Chip } from '@/core/components/atoms/Chip'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'

import { SPECIALIZATION_OPTIONS } from '../../listing.constants'

export type CreateListingStepTopicProps = {
  title: string
  onTitleChange: (value: string) => void
  titleError?: string
  description: string
  onDescriptionChange: (value: string) => void
  selectedSpecs: string[]
  onToggleSpec: (spec: string) => void
  specsError?: string
}

export function CreateListingStepTopic({
  title,
  onTitleChange,
  titleError,
  description,
  onDescriptionChange,
  selectedSpecs,
  onToggleSpec,
  specsError,
}: CreateListingStepTopicProps) {
  return (
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
        onChangeText={onTitleChange}
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
        onChangeText={onDescriptionChange}
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
              onPress={() => onToggleSpec(spec)}
            />
          ))}
        </View>
        {specsError && (
          <Text variant="caption" className="text-red-100">{specsError}</Text>
        )}
      </View>
    </View>
  )
}
