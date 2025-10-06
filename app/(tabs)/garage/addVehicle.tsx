import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const addVehicle = () => {
  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center">
        <Text className="smallTitle">Add vehicle</Text>
        {/* TODO */}
      </View>
    </SafeAreaView>
  );
}
