import { Tabs } from 'expo-router'
import React from 'react'
import Search from "../../public/assets/icons/search-icon.svg"
import Garage from "../../public/assets/icons/garage-icon.svg"
import Profile from "../../public/assets/icons/profile-icon.svg"
import Map from "../../public/assets/icons/map-icon.svg"
import Home from "../../public/assets/icons/home-icon.svg"

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name = "map"
            options={{
                title: "Map",
                headerShown:false,
                tabBarIcon: () => (<Map width={30} height={30} />)
            }}
        />
        <Tabs.Screen
            name = "index"
            options={{
                title: "Search",
                headerShown:false,
                tabBarIcon: () => (<Search width={30} height={30} />)
            }}
        />
        <Tabs.Screen
            name = "garage"
            options={{
                title: "Garage",
                headerShown:false,
                tabBarIcon: () => (<Garage width={30} height={30} />)
            }}
        />
        <Tabs.Screen
            name = "profile"
            options={{
                title: "Profile",
                headerShown:false,
                tabBarIcon: () => (<Profile width={30} height={30} />)
            }}
        />
    </Tabs>
  )
}

export default _layout