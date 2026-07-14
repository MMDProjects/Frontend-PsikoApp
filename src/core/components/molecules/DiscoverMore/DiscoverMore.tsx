import { Pressable, useColorScheme, View } from 'react-native'

import { cn } from '@/core/utils/cn'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

import type { IconName } from '@/core/components/atoms/Icon'

export type DiscoverMoreVariant = 'row' | 'tile'

export type DiscoverMoreProps = {
  onPress: () => void
  /** Varsayılan: "Daha Fazlasını Keşfet" */
  label?: string
  /** Başlığın altındaki açıklama satırı (kardeş ögelerin meta satırıyla aynı stil) */
  hint?: string
  /** tile varyantında görsel alanının üstündeki kategori etiketi (kardeş kartlardaki #kategori gibi) */
  tag?: string
  /** row varyantında başa eklenen ikon (kardeş satırların ikonlarıyla aynı düzen) */
  icon?: IconName
  /** row: liste satırı anatomisinde · tile: carousel kartı anatomisinde */
  variant?: DiscoverMoreVariant
  /** tile varyantında görsel alanı boyutu (carousel'deki kartlarla eşleşmesi için) */
  tileWidth?: number
  tileHeight?: number
  className?: string
}

/**
 * Listenin/akışın son ögesi gibi görünen keşif bağlantısı.
 * Kardeş ögelerle birebir aynı anatomi ve nötr renkler — ayrı bir buton gibi durmaz.
 */
export function DiscoverMore({
  onPress,
  label = 'Daha Fazlasını Keşfet',
  hint,
  tag = '#keşfet',
  icon,
  variant = 'row',
  tileWidth = 200,
  tileHeight = 113,
  className,
}: DiscoverMoreProps) {
  const isDark = useColorScheme() === 'dark'
  if (variant === 'tile') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={{ width: tileWidth }}
        className={cn('active:opacity-70 gap-2', className)}
      >
        {/* Görsel alanı — kardeş kartların görseliyle aynı boyutta nötr yüzey */}
        <View
          className="rounded-xl bg-neutral-200/70 dark:bg-white/5"
          style={{ height: tileHeight }}
        />

        {/* Metin bloğu — kardeş kartların kategori/başlık/meta anatomisi */}
        <View className="gap-1">
          <Text variant="caption" className="text-sky-500 font-semibold" numberOfLines={1}>
            {tag}
          </Text>
          <Text
            variant="body"
            numberOfLines={2}
            className="font-semibold text-neutral-900 dark:text-[#F5F5F7] leading-snug"
            style={{ fontSize: 13 }}
          >
            {label}
          </Text>
          {hint && (
            <Text variant="caption" color="tertiary" className="mt-0.5" numberOfLines={1}>
              {hint}
            </Text>
          )}
        </View>
      </Pressable>
    )
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={cn('px-4 py-4 flex-row items-center gap-3 active:opacity-80', className)}
    >
      {icon && (
        <Icon name={icon} size={18} color={isDark ? '#38BDF8' : '#0EA5E9'} />
      )}
      <View className="flex-1 gap-0.5">
        <Text variant="body" className="font-medium dark:text-[#F5F5F7]">{label}</Text>
        {hint && (
          <Text variant="caption" color="tertiary">{hint}</Text>
        )}
      </View>
    </Pressable>
  )
}
