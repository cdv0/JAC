import { icons } from '@/constants/icons'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { Tabs } from 'expo-router'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

const TabIcon = ({ Icon }: any) => {
  return (
    <View className="items-center justify-center flex-1 ">
      <Icon width={65} height="100%" />
    </View>
  )
}

const _layout = () => {
  const [firstName, setFirstName] = useState<string>('')

  async function fetchNames() {
    try {
      await getCurrentUser()
      const attrs = await fetchUserAttributes()
      const given = (attrs.name || '').trim()
      setFirstName(given)
    } catch {
      setFirstName('')
    }
  }

  useEffect(() => {
    fetchNames()
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      const event = payload?.event
      switch (event) {
        case 'signedIn':
          fetchNames()
          break
        case 'signedOut':
          setFirstName('')
          break
      }
    })
    return () => unsubscribe()
  }, [])

  const firstInitial = (firstName?.[0] ?? '').toUpperCase()

  return (
    <Tabs
      detachInactiveScreens={false}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#D9D9D9',
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={focused ? icons.mapH : icons.map} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Index',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={focused ? icons.seachH : icons.search} />
          ),
        }}
      />
      <Tabs.Screen
        name="garage"
        options={{
          title: 'Garage',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={focused ? icons.garageH : icons.garage} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            firstInitial ? (
              focused ? (
                <View className="items-center justify-center">
                  <View className="items-center justify-center w-16 rounded-full h-7 bg-primaryBlue">
                    <View className="items-center justify-center w-6 h-6 rounded-full bg-accountOrange">
                      <Text className="font-bold text-white">
                        {firstInitial}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View className="items-center justify-center w-6 h-6 rounded-full bg-accountOrange">
                  <Text className="font-bold text-white">{firstInitial}</Text>
                </View>
              )
            ) : (
              <TabIcon Icon={focused ? icons.profileH : icons.profile} />
            ),
        }}
      />
    </Tabs>
  )
}

export default _layout
