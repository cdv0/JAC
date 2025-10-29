import { icons } from '@/constants/icons';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useEffect, useState } from 'react';

const TabIcon = ({Icon}:any)  =>{
    return (
        <View className='flex-1 justify-center items-center '>
            <Icon width={65} height="100%"/>
        </View>
    )
}

const _layout = () => {
  const [firstName, setFirstName] = useState<string>('');

  async function fetchNames() {
    try {
      await getCurrentUser();
      const attrs = await fetchUserAttributes();
      const given = (attrs.name || '').trim();
      setFirstName(given);
    } catch {
      setFirstName("");
    }
  }

  useEffect(() => {
    fetchNames();
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      const event = payload?.event;
      switch(event) {
        case "signedIn":
            fetchNames();
            break;
        case "signedOut":
            setFirstName("");
            break;
      }
    });
    return () => unsubscribe();
  }, []);

  const firstInitial = (firstName?.[0] ?? '').toUpperCase()

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
                    <TabIcon Icon={focused? icons.mapH:icons.map} />
                )
            }}
        />
        <Tabs.Screen
            name = "index"
            options={{
                title: "Index",
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
                tabBarIcon: ({focused}) =>
                  firstInitial
                    ? focused
                      ? (
                        <View className="items-center justify-center">
                          <View className="h-7 w-16 rounded-full bg-primaryBlue items-center justify-center">
                            <View className="h-6 w-6 rounded-full items-center justify-center bg-accountOrange">
                              <Text className="text-white font-bold">{firstInitial}</Text>
                            </View>
                          </View>
                        </View>
                      )
                      : (
                        <View className="h-6 w-6 rounded-full items-center justify-center bg-accountOrange">
                          <Text className="text-white font-bold">{firstInitial}</Text>
                        </View>
                      )
                    : (
                      <TabIcon Icon={focused? icons.profileH:icons.profile} />
                    )
            }}
        />
    </Tabs>
  )
}

export default _layout