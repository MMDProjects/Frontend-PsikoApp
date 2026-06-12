// Expo inlines EXPO_PUBLIC_* variables at build time via process.env.
// This declaration makes them available to TypeScript without @types/node.
declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?:     string
    EXPO_PUBLIC_APP_ENV?:     string
    EXPO_PUBLIC_APP_VERSION?: string
    [key: string]: string | undefined
  }
}
