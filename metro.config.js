const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)
const nativeWindConfig = withNativeWind(config, { input: './global.css' })

// MOCK — remove this block when connecting real API (delete psikoAL/mock-db/ folder too)
nativeWindConfig.watchFolders = [
  ...(nativeWindConfig.watchFolders ?? []),
  path.resolve(__dirname, '../mock-db'),
]
// END MOCK

module.exports = nativeWindConfig
