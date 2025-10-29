import { Stack, router } from "expo-router";
import { Pressable, Text } from "react-native";
import { icons } from "@/constants/icons";

export default function VehicleLayout() {
  return (
    <Stack
      screenOptions={{
        title: "",
        headerTitleAlign: "center",
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
  );
}