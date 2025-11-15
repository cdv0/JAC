import { useRef } from 'react'
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

  return (
    <View className="flex-1 m-5 bg-white">
      {/* <Text className="text-black">map</Text> */}

      <View className="flex-1 overflow-hidden bg-white rounded-2xl">
        <MapView
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
          <TouchableOpacity onPress={() => zoomBy(+1)}>
            <Text>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => zoomBy(-1)}>
            <Text>-</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default map
