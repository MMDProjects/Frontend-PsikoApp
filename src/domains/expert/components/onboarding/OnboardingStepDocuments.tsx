import { Pressable, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'

const ICON_ON_BRAND = '#FFFFFF'
const CHEVRON_ON_BRAND = '#E0F2FE'

export type OnboardingStepDocumentsProps = {
  personalWebsite: string
  onPersonalWebsiteChange: (value: string) => void
  onUploadCv: () => void
  onAddCertificate: () => void
}

export function OnboardingStepDocuments({
  personalWebsite,
  onPersonalWebsiteChange,
  onUploadCv,
  onAddCertificate,
}: OnboardingStepDocumentsProps) {
  return (
    <View className="gap-3">
      <Pressable
        onPress={onUploadCv}
        className="flex-row items-center gap-3 rounded-xl px-4 py-4 bg-sky-600 dark:bg-sky-900 active:bg-sky-700 dark:active:bg-sky-800"
      >
        <Icon name="FileUp" size={20} color={ICON_ON_BRAND} />
        <Text variant="label" className="text-white flex-1">CV Yükle</Text>
        <Icon name="ChevronRight" size={16} color={CHEVRON_ON_BRAND} />
      </Pressable>
      <Pressable
        onPress={onAddCertificate}
        className="flex-row items-center gap-3 rounded-xl px-4 py-4 bg-sky-600 dark:bg-sky-900 active:bg-sky-700 dark:active:bg-sky-800"
      >
        <Icon name="Award" size={20} color={ICON_ON_BRAND} />
        <Text variant="label" className="text-white flex-1">Sertifika Ekle</Text>
        <Icon name="ChevronRight" size={16} color={CHEVRON_ON_BRAND} />
      </Pressable>
      <InputField
        tone="onBrand"
        label="Kişisel Site (opsiyonel)"
        placeholder="https://ornek.com"
        keyboardType="url"
        autoCapitalize="none"
        value={personalWebsite}
        onChangeText={onPersonalWebsiteChange}
      />
    </View>
  )
}
