import NormalButton from "@/app/components/NormalButton";
import React, { useState } from "react";
import { View, Text, TextInput, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createVehicle } from "@/_backend/api/vehicle";
import { getCurrentUser } from "aws-amplify/auth";
import { router } from "expo-router";
import { icons } from "@/constants/icons"

export const addVehicle = () => {
  const [submitted, setSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [VIN, setVIN] = useState("");
  const [plateNum, setPlateNum] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const handleSave = async () => {
    // Check all inputs are filled
    setSubmitted(true);

    if (!VIN.trim() || !plateNum.trim() || !make.trim() || !model.trim() || !year.trim()) {
      console.log("Add vehicle: Missing fields:", { VIN, plateNum, make, model, year });
      return;
    }

    // Make API call to create vehicle
    try {
      const { userId } = await getCurrentUser();
      const payload = {
        userId: userId,
        VIN,
        plateNum,
        make,
        model,
        year: Number(year),
      };

      const data = await createVehicle(payload);
      console.log("Add vehicle: success:", data);

      setVIN("");
      setPlateNum("");
      setMake("");
      setModel("");
      setYear("");

      router.replace("/(tabs)/garage");

    } catch (err: any) {
      console.log("Add vehicle: Error creating vehicle:", err);
      console.log("Add vehicle: Error message:", err?.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-1 mx-5 mt-3 gap-3">

        {/* VIN INPUT */}
        <View className="gap-2">
          <View className="flex-1 flex-row">
            <Text className="smallTextBold">VIN</Text>
            <Text className="dangerText"> *</Text>
          </View>
          <TextInput
            value={VIN}
            placeholder="Type here"
            keyboardType="default"
            onChangeText={setVIN}
            className="border rounded-full border-stroke px-4 py-2 smallTextGray"
          />
          
          {/* Error message for empty input */}
          {submitted && !VIN.trim() ? (
            <Text className="dangerText mx-2">VIN is required</Text>
          ): null}
        </View>

        {/* PLATE NUMBER INPUT */}
        <View className="gap-2">
          <View className="flex-1 flex-row">
            <Text className="smallTextBold">Plate number</Text>
            <Text className="dangerText"> *</Text>
          </View>
          <TextInput
            value={plateNum}
            placeholder="Type here"
            onChangeText={setPlateNum}
            className="border rounded-full border-stroke px-4 py-2 smallTextGray"
          />

          {/* Error message for empty input */}
          {submitted && !plateNum.trim() ? (
            <Text className="dangerText mx-2">Plate number is required</Text>
          ): null}
        </View>

        {/* MAKE INPUT */}
        <View className="gap-2">
          <View className="flex-1 flex-row">
            <Text className="smallTextBold">Make</Text>
            <Text className="dangerText"> *</Text>
          </View>
          <TextInput
            value={make}
            placeholder="Type here"
            onChangeText={setMake}
            className="border rounded-full border-stroke px-4 py-2 smallTextGray"
          />

          {/* Error message for empty input */}
          {submitted && !make.trim() ? (
            <Text className="dangerText mx-2">Make is required</Text>
          ): null}
        </View>

        {/* MODEL INPUT */}
        <View className="gap-2">
          <View className="flex-1 flex-row">
            <Text className="smallTextBold">Model</Text>
            <Text className="dangerText"> *</Text>
          </View>
          <TextInput
            value={model}
            placeholder="Type here"
            onChangeText={setModel}
            className="border rounded-full border-stroke px-4 py-2 smallTextGray"
          />

          {/* Error message for empty input */}
          {submitted && !model.trim() ? (
            <Text className="dangerText mx-2">Model is required</Text>
          ): null}
        </View>

        {/* YEAR INPUT */}
        <View className="gap-2">
          <View className="flex-1 flex-row">
            <Text className="smallTextBold">Year</Text>
            <Text className="dangerText"> *</Text>
          </View>
          <TextInput
            value={year}
            placeholder="Type here"
            keyboardType="numeric"
            onChangeText={setYear}
            className="border rounded-full border-stroke px-4 py-2 smallTextGray"
          />

          {/* Error message for empty input */}
          {submitted && !year.trim() ? (
            <Text className="dangerText mx-2">Year is required</Text>
          ): null}
        </View>

        {/* SAVE BUTTON */}
        <View className="mt-5">
          <NormalButton variant="primary" text="Save" onClick={handleSave} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default addVehicle;