import base from './app.json'
require('dotenv').config()

export default {
  expo: {
    ...base.expo,
    android: {
      package: 'com.anonymous.JAC',
      config: { googleMaps: { apiKey: process.env.MAPS_ANDROID_API_KEY } },
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.JAC',
      config: { googleMapsApiKey: process.env.MAPS_IOS_API_KEY },
    },
  },
}
