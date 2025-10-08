import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NormalButton from "@/app/components/NormalButton";
import { useRouter } from "expo-router";

export const account = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <View className="flex-row justify-between items-end mx-5 mt-6">
        <Text className="mediumTitle">Account</Text>
      </View>
    </SafeAreaView>
  );
}

export default account;