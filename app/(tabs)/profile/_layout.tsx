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

      {/* Mechanic */}
      <Stack.Screen name="mechanic" options={{ headerShown: false }} />
    </Stack>
  )
}
