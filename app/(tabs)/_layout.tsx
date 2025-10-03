import { icons } from '@/constants/icons'
import { Tabs } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name = "map"
            options={{
                title: "Map",
                headerShown:false,
                tabBarIcon: () => (<icons.map width={30} height={30} />)
            }}
        />
        <Tabs.Screen
            name = "index"
            options={{
                title: "Search",
                headerShown:false,
                tabBarIcon: () => (<icons.search width={30} height={30} />)
            }}
        />
        <Tabs.Screen
            name = "garage"
            options={{
                title: "Garage",
                headerShown:false,
                tabBarIcon: () => (<icons.garage width={30} height={30} />)
            }}
        />
        <Tabs.Screen
            name = "profile"
            options={{
                title: "Profile",
                headerShown:false,
                tabBarIcon: () => (<icons.profile width={30} height={30} />)
            }}
        />
    </Tabs>
  )
}

export default _layout