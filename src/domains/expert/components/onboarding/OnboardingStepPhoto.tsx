import { View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

const ICON_ON_BRAND = '#FFFFFF'

export function OnboardingStepPhoto() {
  return (
    <View className="items-center gap-4">
      <View className="w-28 h-28 rounded-full bg-sky-600 dark:bg-sky-900 items-center justify-center border-2 border-dashed border-sky-300 dark:border-sky-700">
        <Icon name="Camera" size={32} color={ICON_ON_BRAND} />
      </View>
      <Text variant="body" className="text-sky-100" align="center">
        Profil fotoğrafı danışanların sizi tanımasına yardımcı olur.
      </Text>
      <View className="bg-sky-600 dark:bg-sky-900 rounded-xl px-4 py-3 w-full">
        <Text variant="caption" className="text-white" align="center">
          Fotoğraf yükleme özelliği yakında aktif olacak.
        </Text>
      </View>
    </View>
  )
}
