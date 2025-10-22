import { icons } from '@/constants/icons'
import { Stack, router } from 'expo-router'
import { Pressable, Text } from 'react-native'

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      {/* Account page */}
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
          title: 'Logged',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: () => <Text className="buttonTextBlack">Settings</Text>,
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
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
