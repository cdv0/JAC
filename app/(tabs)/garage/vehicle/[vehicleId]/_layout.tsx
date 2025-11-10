import { Stack, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { icons } from "@/constants/icons";

export default function VehicleLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center"
      }}
    >

      {/* VEHICLE PAGE */}
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerTintColor: "#1f3559",
          headerBackVisible: false,
          headerLeft: () => (
          <Pressable
              onPress={() => router.push("/garage")}
              className="flex-row items-center px-2"
              hitSlop={8}
          >
              <icons.chevBack width={24} height={24} fill="#1B263B" />
              <Text className="ml-1 text-primaryBlue text-[15px] font-medium">
              Back
              </Text>
          </Pressable>
          ),
          headerRight: () => (
            <Pressable
            // TODO: ADD DELETE VEHICLE LOGIC
              onPress={()=> {}}
              className="items-center mr-4"
              hitSlop={8}
            >
              <icons.trash width={24} height={24}/>
            </Pressable>
          ),
        }}
      />

      {/* ADD SERVICE RECORD PAGE */}
      <Stack.Screen
        name="addServiceRecord"
        options={{
          headerShadowVisible: true,
          headerTintColor: "#1f3559",
          headerBackVisible: false,
          headerLeft: () => (
          <Pressable
              onPress={() => router.back()}
              className="flex-row items-center px-2"
              hitSlop={8}
          >
              <icons.chevBack width={24} height={24} fill="#1B263B" />
              <Text className="ml-1 text-primaryBlue text-[15px] font-medium">
              Back
              </Text>
          </Pressable>
          ),
          headerTitle: () => (
            <Text className="buttonTextBlack">Add service record</Text>
          )
        }}
      />

      {/* SERVICE RECORD PAGE */}
      <Stack.Screen
        name="[serviceRecordId]"
        options={{
          headerTitle: "Service Record",
          headerShadowVisible: true,
          headerTintColor: "#1f3559",
          headerBackVisible: false,
          headerLeft: () => (
          <Pressable
              onPress={() => router.back()}
              className="flex-row items-center px-2"
              hitSlop={8}
          >
              <icons.chevBack width={24} height={24} fill="#1B263B" />
              <Text className="ml-1 text-primaryBlue text-[15px] font-medium">
              Back
              </Text>
          </Pressable>
          ),
          headerRight: () => (
            // TODO: ADD EDIT SERVICE RECORD LOGIC AND DELETE SERVICE RECORD LOGIC
            <View className="flex-1 flex-row justify-end gap-3 items-center">
              <Pressable>
                <icons.pencil width={22} height={22}/>
              </Pressable>
              <Pressable
                onPress={()=> {}}
                className="items-center mr-4"
                hitSlop={8}
              >
                <icons.trash width={24} height={24}/>
              </Pressable>
            </View>
          ),
        }}
      />
    </Stack>
  );
}