import { View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

import { useWalletQuery } from '../api/useWalletQuery'

export type WalletBalanceProps = {
  compact?: boolean
  className?: string
}

export function WalletBalance({ compact = false, className }: WalletBalanceProps) {
  const { data: wallet, isLoading } = useWalletQuery()

  if (isLoading) {
    return <Skeleton variant="line" width={80} height={16} className={className} />
  }

  if (!wallet) return null

  if (compact) {
    return (
      <View className={cn('flex-row items-center gap-1.5', className)}>
        <Icon name="Wallet" size={14} color="#0369A1" />
        <Text variant="caption" className="text-sky-700 font-semibold">
          ₺{wallet.balance.toLocaleString('tr-TR')}
        </Text>
      </View>
    )
  }

  return (
    <View className={cn('bg-sky-50 border border-sky-200 rounded-2xl px-4 py-4 gap-1', className)}>
      <View className="flex-row items-center gap-2 mb-1">
        <Icon name="Wallet" size={16} color="#0369A1" />
        <Text variant="caption" color="secondary">Bakiye</Text>
      </View>
      <Text variant="heading" className="text-sky-700 font-bold text-2xl">
        ₺{wallet.balance.toLocaleString('tr-TR')}
      </Text>
      <Text variant="caption" color="secondary">{wallet.currency}</Text>
    </View>
  )
}
