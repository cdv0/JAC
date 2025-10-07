import NormalButton from "@/app/components/NormalButton";
import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const addVehicle = () => {
  const [VIN, setVIN] = useState("");
  const [plateNum, setPlateNum] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-1 mx-5 mt-3 gap-3">

        {/* Form inputs */}

        {/* VIN */}
        <View className="gap-2">
          <Text className="smallTextBold">VIN</Text>
          <TextInput 
            value={VIN} 
            placeholder="Type here" 
            keyboardType="numeric"
            onChangeText={setVIN}
            className="border rounded-full border-stroke px-4 py-2 smallTextGray"
            />
        </View>

        {/* Plate number */}
        <View className="gap-2">
          <Text className="smallTextBold">Plate number</Text>
          <TextInput 
            value={plateNum} 
            placeholder="Type here" 
            keyboardType="default"
            onChangeText={setPlateNum}
            className="border rounded-full border-stroke px-4 py-2 smallTextGray"
            />
        </View>

        {/* Make */}
        <View className="gap-2">
          <Text className="smallTextBold">Make</Text>
          <TextInput 
            value={make} 
            placeholder="Type here" 
            keyboardType="default"
            onChangeText={setMake}
            className="border rounded-full border-stroke px-4 py-2 smallTextGray"
            />
        </View>

        {/* Model */}
        <View className="gap-2">
          <Text className="smallTextBold">Model</Text>
          <TextInput 
            value={model} 
            placeholder="Type here" 
            keyboardType="default"
            onChangeText={setModel}
            className="border rounded-full border-stroke px-4 py-2 smallTextGray"
            />
        </View>

        {/* Year */}
        <View className="gap-2">
          <Text className="smallTextBold">Year</Text>
          <TextInput 
            value={year} 
            placeholder="Type here" 
            keyboardType="numeric"
            onChangeText={setYear}
            className="border rounded-full border-stroke px-4 py-2 smallTextGray"
            />
        </View>

        {/* Save button */}

        {/* TODO: Add save functionality (onClick) */}
        <View className="mt-5">
          <NormalButton variant="primary" text="Save"></NormalButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default addVehicle