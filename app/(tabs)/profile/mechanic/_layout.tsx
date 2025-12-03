import { icons } from '@/constants/icons'
import { Stack, router } from 'expo-router'
import { Pressable, Text } from 'react-native'

export default function MechanicLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: 'center' }}>
      {/* Mechanic Login */}
      <Stack.Screen
        name="mechanicSignIn"
        options={{
          headerTitle: () => (
            <Text className="buttonTextBlack">Mechanic Login</Text>
          ),
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
        name="mechanicSignUp"
        options={{
          headerTitle: () => (
            <Text className="buttonTextBlack">Mechanic Sign Up</Text>
          ),
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
