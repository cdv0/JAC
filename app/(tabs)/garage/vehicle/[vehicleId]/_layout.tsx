import React, { useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View, Alert } from "react-native";
import { icons } from "@/constants/icons";
import { getCurrentUser } from "aws-amplify/auth";
import { deleteVehicle } from "@/_backend/api/vehicle";
import DeleteModal from "@/app/components/DeleteModal";

export default function VehicleLayout() {
  const params = useLocalSearchParams<{ vehicleId?: string }>();
  const vehicleId = params.vehicleId ? String(params.vehicleId) : "";

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirmDeleteVehicle = async () => {
    try {
      if (!vehicleId) {
        console.warn("Missing vehicleId, cannot delete");
        return;
      }

      const { userId } = await getCurrentUser();

      await deleteVehicle({
        userId,
        vehicleId,
      });

      router.replace("/garage");
    } catch (e: any) {
      console.error("Failed to delete vehicle:", e?.message || e);
      Alert.alert("Error", "Failed to delete vehicle. Please try again.");
    }
  };

  return (
    <>
      <DeleteModal
        visible={showDeleteModal}
        setHide={setShowDeleteModal}
        type="vehicle"
        onConfirm={handleConfirmDeleteVehicle}
      />

      <Stack
        screenOptions={{
          headerTitleAlign: "center",
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
                onPress={() => setShowDeleteModal(true)}
                className="items-center mr-4"
                hitSlop={8}
                disabled={!vehicleId}
              >
                <icons.trash width={24} height={24} />
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
            ),
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
              <View className="flex-1 flex-row justify-end gap-3 items-center">
                <Pressable>
                  <icons.pencil width={22} height={22} />
                </Pressable>
                <Pressable
                  onPress={() => {}}
                  className="items-center mr-4"
                  hitSlop={8}
                >
                  <icons.trash width={24} height={24} />
                </Pressable>
              </View>
            ),
          }}
        />
      </Stack>
    </>
  );
}