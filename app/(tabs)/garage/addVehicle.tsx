import NormalButton from "@/app/components/NormalButton";
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createVehicle } from "@/_backend/api/vehicle";
import { getCurrentUser } from "aws-amplify/auth";
import { router } from "expo-router";
import { icons } from "@/constants/icons";

export const addVehicle = () => {
  const [submitted, setSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [VIN, setVIN] = useState('')
  const [plateNum, setPlateNum] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')

  // Check for empty input upon submission
  const isVINInvalid = submitted && !VIN.trim();
  const isPlateInvalid = submitted && !plateNum.trim();
  const isMakeInvalid = submitted && !make.trim();
  const isModelInvalid = submitted && !model.trim();
  const isYearInvalid = submitted && !year.trim();

  const handleSave = async () => {
    // Check all inputs are filled
    setSubmitted(true)

    if (
      !VIN.trim() ||
      !plateNum.trim() ||
      !make.trim() ||
      !model.trim() ||
      !year.trim()
    ) {
      console.log('Add vehicle: Missing fields:', {
        VIN,
        plateNum,
        make,
        model,
        year,
      })
      return
    }

    // Make API call to create vehicle
    try {
      const { userId } = await getCurrentUser()
      const payload = {
        userId: userId,
        VIN,
        plateNum,
        make,
        model,
        year: Number(year),
      }

      const data = await createVehicle(payload)
      console.log('Add vehicle: success:', data)

      setVIN('')
      setPlateNum('')
      setMake('')
      setModel('')
      setYear('')

      router.replace('/(tabs)/garage')
    } catch (err: any) {
      console.log('Add vehicle: Error creating vehicle:', err)
      console.log('Add vehicle: Error message:', err?.message)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView>
        <View className="flex-1 mx-5 mt-3 gap-3 mb-5">

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
              className={`border rounded-full px-4 py-2 smallTextGray ${isVINInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
            />
            
            {/* Error message for empty input */}
            {isVINInvalid ? (
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
              className={`border rounded-full px-4 py-2 smallTextGray ${isPlateInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
            />

            {/* Error message for empty input */}
            {isPlateInvalid ? (
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
              className={`border rounded-full px-4 py-2 smallTextGray ${isMakeInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
            />

            {/* Error message for empty input */}
            {isMakeInvalid ? (
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
              className={`border rounded-full px-4 py-2 smallTextGray ${isModelInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
            />

            {/* Error message for empty input */}
            {isModelInvalid ? (
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
              className={`border rounded-full px-4 py-2 smallTextGray ${isYearInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
            />

            {/* Error message for empty input */}
            {isYearInvalid ? (
              <Text className="dangerText mx-2">Year is required</Text>
            ): null}
          </View>

          {/* Vehicle image file/photo uploader */}
          <View className="gap-2">
            <Text className="smallTextBold">Upload vehicle image</Text>
            <Text className="xsTextGray">Up to 5MB per file in HEIC, HEIF, JPEG, JPG, PNG</Text>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
              className="flex-1 flex-row gap-2 border border-dashed border-grayBorder rounded-lg px-2 py-3"
            >
              <icons.upload/>
              <View className="flex-1 justify-center gap-0.5">
                <Text className="xsTextGray">Upload</Text>
                {/* TODO: ADD DIMENSION HERE e.g. 1024(w) X 128(h) */}
                <Text className="xsTextGray"></Text>
              </View>
            </Pressable>
          </View>

          {/* File/photo uploader modal */}
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            {/* Fullscreen */}
            <View className="flex-1 justify-end px-2">
              {/* Shadow background */}
              <Pressable 
                className="absolute inset-0 bg-black/40"
                onPress={() => setModalVisible(false)}>
              </Pressable>

              {/* Bottom popup */}
              <View className="w-full mb-3 gap-2 mx-3 self-center">

                {/* Select source buttons */}
                <View className="bg-white px-4 py-3 rounded-lg">
                  <Text className="smallTextGray">Choose source</Text>
                  <Pressable className="py-3 border-b border-stroke">
                    <Text className="smallText">Choose a file</Text>
                  </Pressable>
                  <Pressable className="py-3">
                    <Text className="smallText">Choose from photos</Text>
                  </Pressable>
                </View>

                {/* Cancel button */}
                <View className="bg-white rounded-lg">
                  <Pressable 
                    onPress={() => setModalVisible(false)}
                    className="px-4 py-3"
                  >
                    <Text className="text-center smallTextBold">Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          {/* SAVE BUTTON */}
          <View className="mt-5">
            <NormalButton variant="primary" text="Save" onClick={handleSave} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default addVehicle