import { createMMKV } from 'react-native-mmkv'

import type { MMKV } from 'react-native-mmkv'
import type { StateStorage } from 'zustand/middleware'

export const storage: MMKV = createMMKV()

// ─── Zustand persist adapter ────────────────────────────────────────────────
export const zustandStorage: StateStorage = {
  getItem:    (key) => storage.getString(key) ?? null,
  setItem:    (key, value) => storage.set(key, value),
  removeItem: (key) => storage.remove(key),
}

// ─── Token helpers ───────────────────────────────────────────────────────────
const TOKEN_KEY         = 'auth.accessToken'
const REFRESH_TOKEN_KEY = 'auth.refreshToken'

export const tokenStorage = {
  getAccessToken:  (): string | null => storage.getString(TOKEN_KEY) ?? null,
  setAccessToken:  (token: string)   => storage.set(TOKEN_KEY, token),
  getRefreshToken: (): string | null => storage.getString(REFRESH_TOKEN_KEY) ?? null,
  setRefreshToken: (token: string)   => storage.set(REFRESH_TOKEN_KEY, token),
  clearTokens:     ()                => { storage.remove(TOKEN_KEY); storage.remove(REFRESH_TOKEN_KEY) },
}

// ─── Generic typed helpers ──────────────────────────────────────────────────
export function storageGet<T>(key: string): T | null {
  const raw = storage.getString(key)
  if (raw == null) return null
  try { return JSON.parse(raw) as T } catch { return null }
}

export function storageSet<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value))
}

export function storageRemove(key: string): void {
  storage.remove(key)
}
