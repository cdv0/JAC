const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const baseConfig = getDefaultConfig(__dirname)

module.exports = withNativeWind(
  {
    ...baseConfig,
    transformer: {
      ...baseConfig.transformer,
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      ...baseConfig.resolver,
      assetExts: baseConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...baseConfig.resolver.sourceExts, 'svg'],
    },
  },
  { input: './global.css' } // or "./global.css" — whichever you’re using
)
