import { icons } from '@/constants/icons';
import { Tabs } from 'expo-router';
import { View, Text, Image } from 'react-native';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_IMAGE_URI_KEY = 'profileImageUri';

const TabIcon = ({ Icon }: any) => {
  return (
    <View className="items-center justify-center flex-1 ">
      <Icon width={65} height="100%" />
    </View>
  )
}

const _layout = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  async function fetchNames() {
    try {
      await getCurrentUser()
      const attrs = await fetchUserAttributes()
      const given = (attrs.name || '').trim()
      setFirstName(given)
    } catch {
      setFirstName('');
    }
  }

  async function fetchProfileImage() {
    try {
      const uri = await AsyncStorage.getItem(PROFILE_IMAGE_URI_KEY);
      setProfileImage(uri);
    } catch {
      setProfileImage(null);
    }
  }

  useEffect(() => {
    fetchNames();
    fetchProfileImage();

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      const event = payload?.event;
      switch (event) {
        case 'signedIn':
          fetchNames();
          fetchProfileImage();
          break;
        case 'signedOut':
          setFirstName('');
          setProfileImage(null);
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  const firstInitial = (firstName?.[0] ?? '').toUpperCase();

  return (
    <Tabs
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
            profileImage ? (
              focused ? (
                <View className="items-center justify-center">
                  <View className="h-7 w-16 rounded-full bg-primaryBlue items-center justify-center">
                    <Image
                      source={{ uri: profileImage }}
                      className="h-6 w-6 rounded-full"
                    />
                  </View>
                </View>
              ) : (
                <Image
                  source={{ uri: profileImage }}
                  className="h-6 w-6 rounded-full"
                />
              )
            ) : firstInitial ? (
              focused ? (
                <View className="items-center justify-center">
                  <View className="h-7 w-16 rounded-full bg-primaryBlue items-center justify-center">
                    <View className="h-6 w-6 rounded-full items-center justify-center bg-accountOrange">
                      <Text className="text-white font-bold">{firstInitial}</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View className="h-6 w-6 rounded-full items-center justify-center bg-accountOrange">
                  <Text className="text-white font-bold">{firstInitial}</Text>
                </View>
              )
            ) : (
              <TabIcon Icon={focused ? icons.profileH : icons.profile} />
            ),
        }}
      />
    </Tabs>
  );
};

export default _layout;