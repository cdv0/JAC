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
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => <Text className="buttonTextBlack">Settings</Text>,
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.push('/(tabs)/profile/logged')}
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
        name="account"
        options={{
          headerTitle: () => <Text className="buttonTextBlack">Account</Text>,
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.push('/(tabs)/profile/settings')}
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
        name="contact"
        options={{
          headerTitle: () => (
            <Text className="buttonTextBlack">Contact us</Text>
          ),
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.push('/(tabs)/profile/settings')}
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
        name="editEmail"
        options={{
          headerTitle: () => <Text className="buttonTextBlack">Email</Text>,
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.push('/(tabs)/profile/settings/account')}
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
        name="editName"
        options={{
          headerTitle: () => <Text className="buttonTextBlack">Name</Text>,
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.push('/(tabs)/profile/settings/account')}
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
        name="editPassword"
        options={{
          headerTitle: () => <Text className="buttonTextBlack">Password</Text>,
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.push('/(tabs)/profile/settings/account')}
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
