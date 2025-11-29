import { icons } from '@/constants/icons'
import { Stack, router } from 'expo-router'
import { Pressable, Text } from 'react-native'

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
            <Pressable
              onPress={() => router.replace('/profile/settings')}
              hitSlop={8}
              className="mr-4"
            >
              <icons.settings height={24} width={24} />
            </Pressable>
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

      {/* Forget Password */}
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

      {/* Mechanic Login */}
      <Stack.Screen
        name="mechanic/mechanicSignIn"
        options={{
          headerTitle: () => (
            <Text className="buttonTextBlack">Mechanic Login</Text>
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

      {/* Mechanic Sign Up */}
      <Stack.Screen
        name="mechanic/mechanicSignUp"
        options={{
          headerTitle: () => (
            <Text className="buttonTextBlack">Mechanic Sign Up</Text>
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
    </Stack>
  )
}
