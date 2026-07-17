import { Alert, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Divider } from '@/core/components/atoms/Divider'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { useThemeColors } from '@/core/theme'

import type { IconName } from '@/core/components/atoms/Icon'

type PrivacyRowProps = {
  icon: IconName
  label: string
  danger?: boolean
  onPress: () => void
}

function PrivacyRow({ icon, label, danger = false, onPress }: PrivacyRowProps) {
  const colors = useThemeColors()
  const iconColor = danger ? colors.error : colors.contentSecondary

  return (
    <Pressable onPress={onPress} className="px-4 py-4 flex-row items-center gap-3 active:opacity-90">
      <Icon name={icon} size={18} color={iconColor} />
      <Text variant="body" className={danger ? 'flex-1 text-red-600 dark:text-red-400' : 'flex-1 dark:text-[#F5F5F7]'}>
        {label}
      </Text>
      <Icon name="ChevronRight" size={16} color={colors.contentDisabled} />
    </Pressable>
  )
}

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets()

  const handleFreeze = () => {
    Alert.alert(
      'Hesabımı Dondur',
      'Hesabın geçici olarak devre dışı bırakılacak, istediğin zaman tekrar giriş yaparak aktifleştirebilirsin. Devam etmek istiyor musun?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Dondur', style: 'destructive', onPress: () => {} },
      ]
    )
  }

  const handleDelete = () => {
    Alert.alert(
      'Hesabımı Sil',
      'Bu işlem geri alınamaz. Hesabın ve tüm verilerin kalıcı olarak silinir.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Devam Et',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Son Onay',
              'Hesabını silmek istediğinden emin misin? Bu işlem geri alınamaz.',
              [
                { text: 'Vazgeç', style: 'cancel' },
                { text: 'Hesabımı Sil', style: 'destructive', onPress: () => {} },
              ]
            )
          },
        },
      ]
    )
  }

  const handlePrivacyPolicy = () => {
    Alert.alert('Gizlilik Politikası', 'Bu özellik yakında aktif olacak.')
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenTitle title="Veri ve Gizlilik" />

        <View className="px-4 pt-4 pb-2">
          <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
            Hesap Yönetimi
          </Text>
        </View>
        <PrivacyRow icon="PauseCircle" label="Hesabımı Dondur" onPress={handleFreeze} />
        <PrivacyRow icon="Trash2" label="Hesabımı Sil" danger onPress={handleDelete} />

        <Divider spacing="none" className="mx-4 mt-4" />

        <View className="px-4 pt-4 pb-2">
          <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
            Gizlilik
          </Text>
        </View>
        <PrivacyRow icon="ShieldCheck" label="Gizlilik Politikası" onPress={handlePrivacyPolicy} />
      </ScrollView>
    </View>
  )
}
