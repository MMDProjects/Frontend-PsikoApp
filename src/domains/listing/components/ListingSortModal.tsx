import { useEffect, useState } from 'react'
import { Modal, Pressable, useColorScheme, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

export const LISTING_SORT_OPTIONS = [
  { label: 'En Yeni',       value: 'newest'      },
  { label: 'Yüksek Bütçe',  value: 'budget_desc' },
  { label: 'Düşük Bütçe',   value: 'budget_asc'  },
  { label: 'Az Teklif',     value: 'offer_asc'   },
] as const

export type ListingSortValue = typeof LISTING_SORT_OPTIONS[number]['value']

export type ListingSortModalProps = {
  visible: boolean
  current: ListingSortValue | undefined
  onApply: (value: ListingSortValue | undefined) => void
  onClear: () => void
  onClose: () => void
}

export function ListingSortModal({ visible, current, onApply, onClear, onClose }: ListingSortModalProps) {
  const isDark = useColorScheme() === 'dark'
  const [selected, setSelected] = useState<ListingSortValue | undefined>(undefined)

  // Modal her açıldığında mevcut seçimi yükle
  useEffect(() => {
    if (visible) setSelected(current)
  }, [visible])

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      <View className="bg-white dark:bg-dark-card rounded-t-3xl px-5 pt-5 pb-10 gap-5">
        <View className="flex-row items-center justify-between">
          <Text variant="subheading">Sırala</Text>
          <Pressable onPress={onClose}>
            <Icon name="X" size={20} color={isDark ? '#F5F5F7' : '#171717'} />
          </Pressable>
        </View>
        <View className="gap-2">
          {LISTING_SORT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setSelected((prev) => prev === opt.value ? undefined : opt.value)}
              className={`items-center py-3.5 rounded-xl ${
                selected === opt.value
                  ? 'bg-sky-800 dark:bg-sky-800'
                  : 'bg-neutral-800 dark:bg-neutral-800'
              }`}
            >
              <Text variant="label" className="text-white dark:text-white font-medium">
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <View className="flex-row gap-3">
          <Pressable onPress={onClear} className="flex-1 items-center border border-neutral-200 dark:border-dark-border2 rounded-xl py-3 active:bg-neutral-50 dark:active:bg-dark-elevated">
            <Text variant="label" color="secondary">Temizle</Text>
          </Pressable>
          <Pressable onPress={() => onApply(selected)} className="flex-1 items-center bg-sky-500 rounded-xl py-3 active:bg-sky-600">
            <Text variant="label" className="text-white font-semibold">Uygula</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
