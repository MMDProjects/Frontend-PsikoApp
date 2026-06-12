import { useState } from 'react'
import { Image, View } from 'react-native'
import { Check, User } from 'lucide-react-native'

import { cn } from '@/core/utils/cn'
import { Text } from '@/core/components/atoms/Text'

import type { ComponentType, ReactNode } from 'react'
import type { SvgProps } from 'react-native-svg'

type IconProps = Pick<SvgProps, 'stroke'> & { size?: number; strokeWidth?: number }
const UserIcon = User as ComponentType<IconProps>
const CheckIcon = Check as ComponentType<IconProps>

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type AvatarProps = {
  size?: AvatarSize
  src?: string
  initials?: string
  fallbackColor?: string
  isVerified?: boolean
  badge?: ReactNode
  borderWidth?: number
  borderColor?: string
  className?: string
}

export type AvatarGroupProps = {
  avatars: Array<Pick<AvatarProps, 'src' | 'initials' | 'fallbackColor'>>
  max?: number
  size?: AvatarSize
  className?: string
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  '2xl': 120,
}

const fontSizeMap: Record<AvatarSize, number> = {
  xs: 8,
  sm: 11,
  md: 14,
  lg: 20,
  xl: 28,
  '2xl': 42,
}

const iconSizeMap: Record<AvatarSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 28,
  xl: 40,
  '2xl': 60,
}

const verifiedSizeMap: Record<AvatarSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 26,
  '2xl': 36,
}

export function Avatar({
  size = 'md',
  src,
  initials,
  fallbackColor,
  isVerified = false,
  badge,
  borderWidth,
  borderColor,
  className,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  const px = sizeMap[size]
  const showImg = Boolean(src) && !hasError
  const verifiedPx = verifiedSizeMap[size]

  return (
    // Outer wrapper has no overflow:hidden so the verified badge can bleed outside bounds
    <View
      className={cn('relative self-start', className)}
      style={{ width: px, height: px }}
    >
      {/* Inner circle — overflow:hidden clips image/fallback to circular shape */}
      <View
        style={{
          width: px,
          height: px,
          borderRadius: px / 2,
          borderWidth,
          borderColor,
          overflow: 'hidden',
        }}
        accessibilityRole="image"
      >
        {showImg ? (
          <Image
            source={{ uri: src }}
            style={{ width: px, height: px }}
            onError={() => setHasError(true)}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View
            // Dynamic fallbackColor cannot be a static Tailwind class
            style={{ backgroundColor: fallbackColor ?? undefined }}
            className={cn('flex-1 items-center justify-center', !fallbackColor && 'bg-brand-subtle')}
          >
            {initials ? (
              <Text
                style={{ fontSize: fontSizeMap[size], lineHeight: fontSizeMap[size] * 1.2 }}
                className="text-brand-text font-semibold"
              >
                {initials.slice(0, 2).toUpperCase()}
              </Text>
            ) : (
              <UserIcon size={iconSizeMap[size]} stroke="#737373" />
            )}
          </View>
        )}
      </View>

      {/* Verified badge — outside overflow:hidden so it bleeds past the circle edge */}
      {isVerified && (
        <View
          className="absolute bg-sky-500 items-center justify-center rounded-full border-2 border-white"
          style={{
            width: verifiedPx,
            height: verifiedPx,
            bottom: -(verifiedPx * 0.15),
            right: -(verifiedPx * 0.15),
          }}
        >
          <CheckIcon size={verifiedPx * 0.6} stroke="#FFFFFF" strokeWidth={3} />
        </View>
      )}

      {/* Generic badge slot — only rendered when isVerified is not set */}
      {badge && !isVerified && (
        <View className="absolute bottom-0 right-0">{badge}</View>
      )}
    </View>
  )
}

export function AvatarGroup({ avatars, max = 5, size = 'md', className }: AvatarGroupProps) {
  const px = sizeMap[size]
  const visibleCount = Math.min(avatars.length, avatars.length > max ? max - 1 : max)
  const overflowCount = avatars.length - visibleCount
  const overlap = Math.floor(px * 0.3)

  return (
    <View className={cn('flex-row items-center', className)}>
      {avatars.slice(0, visibleCount).map((avatar, i) => (
        <View
          key={i}
          // Negative margin for overlap + white border ring to separate avatars
          style={{ marginLeft: i === 0 ? 0 : -overlap, zIndex: visibleCount - i }}
        >
          <Avatar {...avatar} size={size} borderWidth={2} borderColor="#FFFFFF" />
        </View>
      ))}

      {overflowCount > 0 && (
        <View
          className="items-center justify-center bg-neutral-200"
          style={{
            width: px,
            height: px,
            borderRadius: px / 2,
            marginLeft: -overlap,
            borderWidth: 2,
            borderColor: '#FFFFFF',
          }}
        >
          <Text style={{ fontSize: fontSizeMap[size] }} className="text-neutral-700 font-semibold">
            +{overflowCount}
          </Text>
        </View>
      )}
    </View>
  )
}
