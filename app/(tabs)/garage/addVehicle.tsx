import { createVehicle } from "@/_backend/api/vehicle";
import NormalButton from "@/app/components/NormalButton";
import { icons } from "@/constants/icons";
import { getCurrentUser } from "aws-amplify/auth";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type File, MAX_IMAGE_SIZE, ALLOWED_MIME_TYPES_IMAGE } from "@/_backend/api/fileUpload";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VEHICLE_IMAGE_URI_KEY_PREFIX = 'vehicleImageUri'
const getVehicleImageKey = (vehicleId: string) => `${VEHICLE_IMAGE_URI_KEY_PREFIX}:${vehicleId}`

export const addVehicle = () => {
  const [submitted, setSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [VIN, setVIN] = useState('')
  const [plateNum, setPlateNum] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [file, setFile] = useState<File | null>(null);

  // Check for empty input upon submission
  const isVINInvalid = submitted && !VIN.trim();
  const isPlateInvalid = submitted && !plateNum.trim();
  const isMakeInvalid = submitted && !make.trim();
  const isModelInvalid = submitted && !model.trim();
  const isYearInvalid = submitted && !year.trim();
  
  const isFileInvalid = submitted && file !== null && (
    file.size > MAX_IMAGE_SIZE || !ALLOWED_MIME_TYPES_IMAGE.includes(file.mimeType ?? "")
  )

  const handleChooseFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ALLOWED_MIME_TYPES_IMAGE,
      multiple: false,
      copyToCacheDirectory: true,
    });

    if (res.canceled) return;

    const doc = res.assets[0];

    const pickedFile: File = {
      uri: doc.uri,
      name: doc.name,
      size: doc.size ?? 0,
      mimeType: doc.mimeType ?? null,
    };

    setFile(pickedFile);
    setModalVisible(false);
  };

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

    // If a file exists, make sure it's valid
    if ( file && (file.size > MAX_IMAGE_SIZE || !ALLOWED_MIME_TYPES_IMAGE.includes(file.mimeType ?? ""))) {
      console.log("Add vehicle: Invalid file selected");
      return;
    }

    // Make API call to create vehicle
    try {
      const { userId } = await getCurrentUser()
      let vehicleImageKey: string | null = null;

      const payload = {
        userId: userId,
        VIN,
        plateNum,
        make,
        model,
        year: Number(year),
        vehicleImage: vehicleImageKey
      }

      const data = await createVehicle(payload)
      console.log('Add vehicle: success:', data)

      const vehicleId = data?.vehicleId
      if (file && vehicleId) {
        try {
          await AsyncStorage.setItem(getVehicleImageKey(String(vehicleId)), file.uri)
        } catch (e) {
          console.log('Add vehicle: Error saving image uri:', e)
        }
      }

      setVIN('')
      setPlateNum('')
      setMake('')
      setModel('')
      setYear('')
      setFile(null)

      router.replace('/(tabs)/garage')
    } catch (err: any) {
      console.log('Add vehicle: Error creating vehicle:', err)
      console.log('Add vehicle: Error message:', err?.message)
    }
  }

  return (
    // <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{flexGrow: 1}}>
        <View className="mx-5 mt-3 gap-3 mb-5">

          {/* VIN INPUT */}
          <View className="gap-2">
            <View className="flex-row">
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
            <View className="flex-row">
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
            <View className="flex-row">
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
            <View className="flex-row">
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
            <View className="flex-row">
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
            <Text className="xsTextGray">Up to 256KB per file in JPEG, JPG</Text>

            {/* FILE UPLOADER BUTTON */}
            <Pressable
              disabled={!!file}
              onPress={!file ? () => setModalVisible(!modalVisible) : undefined}
              className={`flex-row gap-2 border border-dashed rounded-lg px-2 py-3 items-center ${isFileInvalid ? "border-dangerBrightRed" : "border-grayBorder"}`}
            >
              <icons.upload/>
              <View style={{flex: 1, gap: 2}}>
                <Text className="xsTextGray">Upload</Text>
                <Text className="xsTextGray">
                  {!file ? "No file selected" : "1 file selected"}
                </Text>
              </View>
            </Pressable>

            {/* UPLOADED FILE NAME */}
            {!file ? (
              null
            ) : (
              <View className="w-full bg-secondary rounded-xl flex-1 flex-row justify-between items-center px-4 py-1.5 mt-1.5">
                <Text>{file.name}</Text>
                <Pressable
                  onPress={()=> {setFile(null);}}
                  className=""
                  hitSlop={8}
                >
                  <icons.trash width={24} height={24}/>
                </Pressable>
              </View>
            )}
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
                  <Pressable className="py-3 border-stroke" onPress={handleChooseFile}>
                    <Text className="smallText">Choose a file</Text>
                  </Pressable>
                  {/* <Pressable className="py-3">
                    <Text className="smallText">Choose from photos</Text>
                  </Pressable> */}
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
    // </SafeAreaView>
  )
}

export default addVehicle