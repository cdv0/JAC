import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { readVehicle, type Vehicle } from "@/_backend/api/vehicle";
import { getCurrentUser } from "aws-amplify/auth";
import NormalButton from "@/app/components/NormalButton";

export default function VehicleDetail() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    (async () => {
      const { userId } = await getCurrentUser();
      const data = await readVehicle(userId, String(vehicleId));
      setVehicle(data);
    })();
  }, [vehicleId]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top","bottom"]}>
      <View className="m-5">
        <Text className="mediumTitle">Vehicle</Text>
      </View>
    </SafeAreaView>
  );
}