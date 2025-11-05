import NormalButton from "@/app/components/NormalButton";
import { icons } from "@/constants/icons";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
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

  useEffect(() => {
    const unsub = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") setIsAuthenticated(true);
      if (payload.event === "signedOut") setIsAuthenticated(false);
    });
    return () => unsub();
  }, []);

  if (isAuthenticated === null) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" edges={["top","bottom"]}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  // Unauthenticated user view
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
            <Pressable
              onPress={() => router.push("/garage")}
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

      {/* Don't show the top bar from the parent _layout file. Show it in the nested _layout file */}
      <Stack.Screen
        name="vehicle/[vehicleId]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}