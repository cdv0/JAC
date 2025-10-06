import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1, 
        
    },
    content: {
        flex :0.9,
        
    }
});

const TabIcon = ({focused, Icon}:any)  =>{
    if(focused){
        return(
            <View style = {styles.container}>
                <images.highlight width= {100} height = "100%" style={styles.background} fill='#3A5779'>
                    
                </images.highlight>
                <Icon width= {100} height= "100%"  style = {styles.content} color = "#e8e5e5ff" />
            </View>
        )
    }
    else{
        return(
            <View style = {styles.container}>
                <Icon width= {100}   height= "100%" style = {styles.content} color = "#3A5779" />
            </View>
        )
    }
}

const _layout = () => {
  return (
    <Tabs 
        screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle:{
                backgroundColor: '#DBDBDB',
                
            }
        }}
    >
        <Tabs.Screen
            name = "map"
            options={{
                title: "Map",
                headerShown:false,
                tabBarIcon: ({focused}) => (
                            <TabIcon 
                                focused = {focused} 
                                Icon = {icons.map}    
                            />
                )
            }}
        />
        <Tabs.Screen
            name = "index"
            options={{
                title: "Search",
                headerShown:false,
                tabBarIcon: ({focused}) => (
                            <TabIcon 
                                focused = {focused} 
                                Icon = {icons.search}   
                            />
                )
            }}
        />
        <Tabs.Screen
            name = "garage"
            options={{
                title: "Garage",
                headerShown:false,
                tabBarIcon: ({focused}) => (
                            <TabIcon 
                                focused = {focused} 
                                Icon = {icons.garage}    
                            />
                )
            }}
        />
        <Tabs.Screen
            name = "profile"
            options={{
                title: "Profile",
                headerShown:false,
                tabBarIcon: ({focused}) => (
                            <TabIcon 
                                focused = {focused} 
                                Icon = {icons.profile}    
                            />
                )
            }}
        />
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  content: {
    flex: 0.9,
  },
})

const TabIcon = ({ focused, Icon }: any) => {
  if (focused) {
    return (
      <View style={styles.container}>
        <images.highlight
          width={100}
          height="100%"
          style={styles.background}
          color="#3A5779"
        ></images.highlight>
        <Icon
          width={100}
          height="100%"
          style={styles.content}
          color="#e8e5e5ff"
        />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Icon
          width={100}
          height="100%"
          style={styles.content}
          color="#3A5779"
        />
      </View>
    )
  }
}

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#DBDBDB',
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={icons.map} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={icons.search} />
          ),
        }}
      />
      <Tabs.Screen
        name="garage"
        options={{
          title: 'Garage',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={icons.garage} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={icons.profile} />
          ),
        }}
      />
    </Tabs>
  )
}

export default _layout
