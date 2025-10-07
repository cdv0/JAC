import NormalButton from "@/app/components/NormalButton";
import { icons } from "@/constants/icons";
import { getCurrentUser } from "aws-amplify/auth";
import { Stack, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GarageLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkUser();
  }, []);

  if (isAuthenticated === false) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center gap-2.5 w-4/5">
          <icons.lock width={65} height={65} />
          <Text className="smallTitle text-center">Your garage is waiting</Text>
          <Text className="smallTextGray text-center">
            Sign in to view your saved vehicles and maintenance history.
          </Text>
          <NormalButton
            text="Log in"
            paddingHorizontal={20}
            variant="primary"
            onClick={() => router.replace("/profile")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >

      {/* Home screen (index) */}
      <Stack.Screen
        name="index"
        options={{
          title: "Garage",
          headerShown: false,
        }}
      />

      {/* Add vehicle screen */}
      <Stack.Screen
        name="addVehicle"
        options={{
          headerTitle: () => (
            <Text className="buttonTextBlack">Add vehicle</Text>
          ),
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/garage")}
              className="flex-row items-center px-2"
              hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
            >
              <icons.chevBack width={24} height={24} fill="#1B263B" />
              <Text className="ml-1 text-[#415A77] text-[15px] font-medium">
                Back
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}