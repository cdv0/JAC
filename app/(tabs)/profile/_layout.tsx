import { icons } from '@/constants/icons'
import { Stack, router } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { images } from '@/constants/images';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      {/* Profile page */}
      <Stack.Screen
        name="index"
        options={{
          title: 'Index',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="logged"
        options={{
          title: '',
          headerShown: true,
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => null, // Put this here because simply using headerBackVisible isn't reliable
          headerRight: () => (
            <View className="mt-4 mr-4 gap-4 items-center">
              <Pressable
                onPress={() => router.replace('/profile/settings')}
                hitSlop={8}
              >
                <icons.settings height={24} width={24} />
              </Pressable>
                <Pressable
                onPress={() => router.replace('/profile/favoriteMechanics')}>
                  <images.favoriteEmpty width={24} height={24} />
                </Pressable>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgetPassword"
        options={{
          headerTitle: () => (
            <Text className="buttonTextBlack">Forgot password</Text>
          ),
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.push('/(tabs)/profile')}
              className="flex-row items-center px-2"
              hitSlop={2}
            >
              <icons.chevBack width={24} height={24} fill="#1B263B" />
              <Text className="ml-1 text-primaryBlue text-[15px] font-medium">
                Back
              </Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="favoriteMechanics"
        options={{
          headerTitle: () => (
            <Text className="buttonTextBlack">Favorite Mechanics</Text>
          ),
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.push('/(tabs)/profile')}
              className="flex-row items-center px-2"
              hitSlop={2}
            >
              <icons.chevBack width={24} height={24} fill="#1B263B" />
              <Text className="ml-1 text-primaryBlue text-[15px] font-medium">
                Back
              </Text>
            </Pressable>
          ),
        }}
      />

      {/* Mechanic */}
      <Stack.Screen name="mechanic" options={{ headerShown: false }} />
    </Stack>
  )
}
