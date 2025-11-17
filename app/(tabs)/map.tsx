import * as Location from 'expo-location'
import { useEffect, useRef } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

const map = () => {
  const mapRef = useRef<MapView>(null)
  const zoomBy = async (delta: number) => {
    if (!mapRef.current) return

    const cam = await mapRef.current.getCamera()
    mapRef.current.animateCamera(
      { zoom: (cam.zoom ?? 14) + delta },
      { duration: 200 }
    )
  }

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return

      const location = await Location.getCurrentPositionAsync({})
    }

    const data = async () => {
      try {
        const file = await fetch('/local/dummy/data.json')
        const mechanicsData = await file.json()

        console.log(mechanicsData)
      } catch (error) {
        console.error('Error loading mechanics data:', error)
      } finally {
      }
    }
    data()

    requestLocation()
  }, [])

  return (
    <View className="flex-1 bg-white">
      {/* <Text className="text-black">map</Text> */}

      <View className="flex-1 overflow-hidden bg-white rounded-2xl">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 33.783,
            longitude: -118.1129,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
          zoomEnabled
          zoomTapEnabled={Platform.OS === 'ios'}
          scrollEnabled
          rotateEnabled
          pitchEnabled
          showsCompass={Platform.OS === 'ios'}
          showsScale={Platform.OS === 'ios'}
        ></MapView>
        <View className="absolute gap-2 bottom-6 right-6">
          <TouchableOpacity
            onPress={() => zoomBy(+1)}
            className="flex justify-center p-1 bg-white border border-black"
          >
            <Text className="size-auto">+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => zoomBy(-1)}
            className="flex justify-center p-1 bg-white border border-black"
          >
            <Text className="size-auto">-</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default map
