import { Tabs } from 'expo-router'
import React from 'react'
import Search from '../../public/assets/icons/search-icon.svg'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name = "map"
            options={{
                title: "Map",
                headerShown:false,
                tabBarIcon: () => (<Search width={30} height={30} />)
            }}
        />
        <Tabs.Screen
            name = "index"
            options={{
                title: "Search",
                headerShown:false,
            }}
        />
        <Tabs.Screen
            name = "garage"
            options={{
                title: "Garage",
                headerShown:false,
            }}
        />
        <Tabs.Screen
            name = "profile"
            options={{
                title: "Profile",
                headerShown:false,
            }}
        />
    </Tabs>
  )
}

export default _layout