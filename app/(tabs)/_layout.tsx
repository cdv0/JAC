import { icons } from '@/constants/icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';



const TabIcon = ({Icon}:any)  =>{
    return (
        <View className='flex-1 justify-center items-center '>
            <Icon classname='w-{65} h-full' />
        </View>
            
    )
    
}

const _layout = () => {
  return (
    <Tabs 
        screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle:{
                backgroundColor:'#D9D9D9'
                
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
                                Icon = {focused? icons.mapH:icons.map}    
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
                                Icon = {focused? icons.seachH:icons.search}   
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
                                Icon = {focused? icons.garageH:icons.garage}    
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
                                Icon = {focused? icons.profileH:icons.profile}    
                            />
                )
            }}
        />
    </Tabs>
  )
}

export default _layout
