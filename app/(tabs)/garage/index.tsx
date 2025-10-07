import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const garage = () => {
  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center">
        <Text className="smallTitle">Garage</Text>
        {/* TODO */}
      </View>
    </SafeAreaView>
  );
}

export default garage