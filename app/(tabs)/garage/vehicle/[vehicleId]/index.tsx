import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { readVehicle, type Vehicle } from "@/_backend/api/vehicle";
import { getCurrentUser } from "aws-amplify/auth";
import { icons } from "@/constants/icons";

export default function VehicleDetail() {
  const params = useLocalSearchParams<{ vehicleId: string}>();
  const vehicleId = params.vehicleId;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [editDetails, setEditDetails] = useState(false);

  useEffect(() => {(async () => {
      try {
        setLoading(true);
        if (!vehicleId) throw new Error("Missing vehicleId");
        const { userId } = await getCurrentUser();
        const data = await readVehicle(userId, String(vehicleId));
        setVehicle(data);
      } catch (e: any) {
        console.log("Failed to load vehicle.")
      } finally {
        setLoading(false);
      }
    })();
  }, [vehicleId]);

  let content: React.ReactNode;

  if (loading) {
    content = (
      <View className="items-center mt-10">
        <ActivityIndicator />
        <Text className="smallTextGray mt-2">Loading vehicle…</Text>
      </View>
    );
  } else if (!vehicle) {
    content = (
      <View className="items-center mt-10">
        <Text className="smallTextGray">Vehicle not found.</Text>
      </View>
    );
  } else {
    content = (
      <View className="flex-1">
        {/* Vehicle banner */}
        <View className="flex-row items-center gap-4 bg-white w-full p-2 px-8">
          <View className="items-center justify-center h-24 w-24">
            <icons.noImage height={50} width={70} />
          </View>
          <View>
            <Text className="buttonTextBlue">{vehicle.model}</Text>
            <Text className="smallThinTextBlue">{vehicle.make} {vehicle.year}</Text>
          </View>
        </View>

        {/* Lower section */}
        <View className="flex-1 mt-2.5 mx-2.5 mb-5 gap-2.5">

          {/* Details card */}
          <View className="bg-white rounded-xl px-4 py-5">
            {/* Detail card top bar */}
            <View className="flex-row items-center justify-between">
              {/* Title */}
              <Text className="smallTitle">Details</Text>
              {/* Buttons (right side) */}
              <View>
                <Pressable onPress={() => setDetailsExpanded(v => !v)}>
                  {detailsExpanded ? <icons.arrowUp height={28} width={28} /> : <icons.arrowDown height={28} width={28} />}
                </Pressable>
              </View>
            </View>

            {detailsExpanded && (
              <View className="mt-4 gap-3.5">
                <View className="gap-1.5">
                  <Text className="smallTextBold">VIN</Text>
                  <Text className="smallThinTextBlue">{vehicle.VIN}</Text>
                </View>
                <View className="gap-1.5">
                  <Text className="smallTextBold">Plate number</Text>
                  <Text className="smallThinTextBlue">{vehicle.plateNum}</Text>
                </View>
                <View className="gap-1.5">
                  <Text className="smallTextBold">Make</Text>
                  <Text className="smallThinTextBlue">{vehicle.make}</Text>
                </View>
                <View className="gap-1.5">
                  <Text className="smallTextBold">Model</Text>
                  <Text className="smallThinTextBlue">{vehicle.model}</Text>
                </View>
                <View className="gap-1.5">
                  <Text className="smallTextBold">Year</Text>
                  <Text className="smallThinTextBlue">{vehicle.year}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Services card */}
          <View className="bg-white rounded-xl px-4 py-5">
            <View className="flex-row items-center justify-between">
              <Text className="smallTitle">Services</Text>
              <Pressable
                onPress={() => setServicesExpanded(v => !v)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Toggle services"
              >
                {servicesExpanded ? <icons.arrowUp height={28} width={28} /> : <icons.arrowDown height={28} width={28} />}
              </Pressable>
            </View>

            {/* TODO: Add service record logic */}
            {servicesExpanded && (
              <View className="mt-4 gap-3">
                <Text className="smallTextGray">No services yet.</Text>
                {/* Render a list of service records here */}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-secondary" edges={["top", "bottom"]}>
      <ScrollView>
        <View className="flex-1">{content}</View>
      </ScrollView>
    </SafeAreaView>
  );
}