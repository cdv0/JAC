import { Stack, router } from 'expo-router';
import { icons } from "@/constants/icons";
import { Pressable } from "react-native";

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
              <icons.settings height={24} width={24}/>
            </Pressable>
          )
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />
    </Stack>
  )
}
