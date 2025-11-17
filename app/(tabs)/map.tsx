import { useFocusEffect } from '@react-navigation/native'
import * as Loc from 'expo-location'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Button,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import MapView, {
  Callout,
  Camera,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps'

type Mechanic = {
  name?: string
  address?: string
  Location?: []
}

const map = () => {
  const mapRef = useRef<MapView>(null)
  const [mechanics, setMechanics] = useState<any[]>([])
  const lastCameraRef = useRef<Camera | null>(null)
  const [locationPermission, setLocationPermission] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const zoomBy = async (delta: number) => {
    if (!mapRef.current) return

    const cam = await mapRef.current.getCamera()
    mapRef.current.animateCamera(
      { zoom: (cam.zoom ?? 14) + delta },
      { duration: 200 }
    )
  }

  const saveCamera = async () => {
    const cam = await mapRef.current?.getCamera()
    if (cam) lastCameraRef.current = cam
  }

  const centerOnUser = async () => {
    if (!locationPermission) return

    const loc = await Loc.getCurrentPositionAsync({})
    mapRef.current?.animateCamera(
      {
        center: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
        zoom: 15,
      } as Camera,
      { duration: 300 }
    )
  }

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Loc.requestForegroundPermissionsAsync()
      if (status !== 'granted') return

      setLocationPermission(true)
      const location = await Loc.getCurrentPositionAsync({})
      const cam: Partial<Camera> = {
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 15,
        pitch: 0,
        heading: 0,
      }
      mapRef.current?.animateCamera(cam as Camera, { duration: 400 })
    }

    const data = async () => {
      try {
        const mechanics = await fetch(
          process.env.EXPO_PUBLIC_GETMECHANICS_URL as string,
          {
            method: 'GET',
          }
        )
        const mechanicsData = await mechanics.json()
        setMechanics(mechanicsData.data)
      } catch (error) {
        console.error('Error loading mechanics data:', error)
      } finally {
        setLoading(false)
      }
    }
    data()

    requestLocation()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (lastCameraRef.current) {
        mapRef.current?.animateCamera(lastCameraRef.current, { duration: 0 })
      }

      return () => {
        saveCamera()
      }
    }, [])
  )

  if (loading) {
    return (
      <View className="flex flex-col items-center justify-center h-full">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const hasValidLocation = (m: any) => {
    const L = m?.Location
    if (!Array.isArray(L)) return false
    const lat = +L[0]
    const lng = +L[1]
    return Number.isFinite(lat) && Number.isFinite(lng)
  }

  const validMechanics = mechanics.filter(hasValidLocation)

  const mechanicNavigate = (m: any) => {
    console.log('m value: ', m.mechanicID)
    router.push({
      pathname: '/mechanic/[id]',
      params: { id: String(m.mechanicID) },
    })
  }

  return (
    <View className="flex-1 bg-white">
      {/* <Text className="text-black">map</Text> */}

      <View className="flex-1 overflow-hidden bg-white rounded-2xl">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialCamera={{
            center: { latitude: 33.783, longitude: -118.1129 },
            pitch: 0,
            heading: 0,
            altitude: 1,
            zoom: 12,
          }}
          showsUserLocation={!!locationPermission}
          zoomEnabled
          zoomTapEnabled={Platform.OS === 'ios'}
          scrollEnabled
          rotateEnabled
          pitchEnabled
          showsCompass={Platform.OS === 'ios'}
          showsScale={Platform.OS === 'ios'}
        >
          {validMechanics.map((m) => {
            const lat = Number(m?.Location?.[0])
            const long = Number(m?.Location?.[1])
            if (!Number.isFinite(lat) || !Number.isFinite(long)) return

            return (
              <Marker
                key={m.mechanicID}
                identifier={m.mechanicID}
                coordinate={{
                  latitude: lat,
                  longitude: long,
                }}
                onCalloutPress={() => mechanicNavigate(m)}
                title={m.name ?? 'Mechanic'}
                description={m.address ?? ''}
              >
                <Callout onPress={() => mechanicNavigate(m)}>
                  <View>
                    <Text className="text-lg font-bold">
                      {m.name ?? 'Mechanic'}
                    </Text>
                    {!!m.address && (
                      <Text className="mt-2" numberOfLines={2}>
                        {m.address}
                      </Text>
                    )}
                  </View>
                </Callout>
              </Marker>
            )
          })}
        </MapView>
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
          <View className="absolute bottom-6 right-4">
            <Button title="Current Location" onPress={centerOnUser} />
          </View>
        </View>
      </View>
    </View>
  )
}

export default map
