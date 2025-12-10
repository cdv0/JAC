import { icons } from '@/constants/icons'
import { Stack, router } from 'expo-router'
import { Pressable, Text } from 'react-native'

export default function mechanicLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.push('/(tabs)')}
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
        name="createReview"
        options={{
          headerTitle: '',
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
      <Stack.Screen
        name="viewReview"
        options={{
          headerTitle: '',
          headerBackVisible: false,
          headerShadowVisible: false,
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
      <Stack.Screen
        name="updateReview"
        options={{
          headerTitle: '',
          headerBackVisible: false,
          headerShadowVisible: false,
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
        name="viewOtherUser"
        options={{
          headerTitle: '',
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
      <Stack.Screen
        name="deleteReview"
        options={{
          headerTitle: '',
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