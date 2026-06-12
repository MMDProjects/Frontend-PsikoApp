const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)
const nativeWindConfig = withNativeWind(config, { input: './global.css' })

nativeWindConfig.resolver.unstable_enablePackageExports = true
nativeWindConfig.resolver.unstable_conditionNames = ['require', 'default']

console.log('METRO_CONFIG_V3_FRESH')

module.exports = nativeWindConfig
