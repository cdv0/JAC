import NormalButton from "@/app/components/NormalButton";
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createVehicle } from "@/_backend/api/vehicle";
import { getCurrentUser } from "aws-amplify/auth";
import { router } from "expo-router";
import { icons } from "@/constants/icons";

export const ServiceRecord = () => {

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView>
        <Text>Add service record</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ServiceRecord;