import type { Client } from '../types/client.types'

type ClientOrigin = 'invited' | 'self'

type UseClientOriginReturn = {
  origin: ClientOrigin
  isInvited: boolean
  isSelfRegistered: boolean
}

export function useClientOrigin(client: Pick<Client, 'registrationType'>): UseClientOriginReturn {
  const origin = client.registrationType
  return {
    origin,
    isInvited: origin === 'invited',
    isSelfRegistered: origin === 'self',
  }
}
