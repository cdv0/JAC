import NormalButton from "@/app/components/NormalButton";
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView, Platform, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser } from "aws-amplify/auth";
import { useLocalSearchParams, router } from "expo-router";
import { icons } from "@/constants/icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { createServiceRecord } from "@/_backend/api/serviceRecord";
import { type File, MAX_RECORD_SIZE, ALLOWED_MIME_TYPES_RECORD } from "@/_backend/api/fileUpload";
import * as DocumentPicker from "expo-document-picker";
import uploadVehicleImage from "@/_backend/api/fileUpload";

export const ServiceRecord = () => {
  const [submitted, setSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const params = useLocalSearchParams<{ vehicleId: string}>();
  const vehicleId = params.vehicleId;

  const [title, setTitle] = useState('')
  // DATE
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [mileage, setMileage] = useState('')
  const [note, setNote] = useState('')
  const [files, setFiles] = useState<File[]>([]);

  // Check for empty input upon submission
  const isTitleInvalid = submitted && !title.trim();
  const isDateInvalid = submitted && !date;
  const isFileInvalid = submitted && files.some(file => 
    file.size > MAX_RECORD_SIZE || !ALLOWED_MIME_TYPES_RECORD.includes(file.mimeType ?? "")
  );

  const handleChooseFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ALLOWED_MIME_TYPES_RECORD,
      multiple: true,
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

    setFiles([...files, pickedFile]);
    setModalVisible(false);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    // Android: Close date picker after any action
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    // Only update date if the user actually picked one
    if (event?.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
  }

  const handleSave = async () => {
    // Check all inputs are filled
    setSubmitted(true)

    if (
      !title.trim() ||
      !date
    ) {
      console.log('Add service record: Missing fields:', {
        title,
        date
      })
      return
    }

    // If a file exists, make sure it's valid
    if (files.some(file => file.size > MAX_RECORD_SIZE || !ALLOWED_MIME_TYPES_RECORD.includes(file.mimeType ?? ""))) {
      console.log("Add service record: Invalid file selected");
      return;
    }

    // Make API call to create service record
    try {
      // UPLOAD FILES TO S3 IF ANY
      if (files.length > 0) {
        try {
          for (const file of files) {
            const recordFileKey = await uploadVehicleImage(file, "record");
            console.log("Add service record: Service records upload successful:", recordFileKey);
          }
        } catch (e: any) {
          console.log("Add service record: Error uploading service records:", e);
          console.log("Add service record: Error message:", e?.message);
          return;
        }
      }

      const payload = {
        vehicleId: vehicleId,
        title,
        serviceDate: date.toISOString(),
        mileage,
        note
      }

      const data = await createServiceRecord(payload)
      console.log('Add service record: success:', data)

      setTitle('');
      setDate(new Date());
      setMileage('');
      setNote('');

      router.replace(`/garage/vehicle/${params.vehicleId}`);
    } catch (err: any) {
      console.log('Add service record: Error adding servie record:', err);
      console.log('Add service record: Error message:', err?.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView>
        <View className="flex-1 mx-5 mt-3 gap-3 mb-5">

          {/* TITLE INPUT */}
          <View className="gap-2">
            <View className="flex-1 flex-row">
              <Text className="smallTextBold">Title</Text>
              <Text className="dangerText"> *</Text>
            </View>
            <TextInput
              value={title}
              placeholder="Type here"
              keyboardType="default"
              onChangeText={setTitle}
              className={`border rounded-full px-4 py-2 smallTextGray ${isTitleInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
            />
            
            {/* Error message for empty input */}
            {isTitleInvalid ? (
              <Text className="dangerText mx-2">Title is required</Text>
            ): null}
          </View>

          {/* SERVICE DATE INPUT */}
          <View className="gap-2">
            <View className="flex-1 flex-row">
              <Text className="smallTextBold">Service date</Text>
              <Text className="dangerText"> *</Text>
            </View>

            {/* Date display and picker trigger */}
            <Pressable 
              onPress={() => setShowDatePicker(true)}
              className={`border rounded-full px-4 py-3 ${isDateInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
            >
              <Text className="smallTextGray">
                {formatDate(date)}
              </Text>
            </Pressable>

            {/*DATE TIME PICKER*/}
            {(showDatePicker || Platform.OS === 'ios') && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}

            {/* iOS done button */}
            {Platform.OS === 'ios' && showDatePicker && (
              <Pressable 
                onPress={() => setShowDatePicker(false)}
                className="bg-primary rounded-full px-4 py-2 mt-2"
              >
                <Text className="text-center text-white smallTextBold">Done</Text>
              </Pressable>
            )}

            {/* <DatePicker
              value={date}
              onChange={setDate}
              className={`border rounded-full px-4 py-2 smallTextGray ${isDateInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
            /> */}

            {/* Error message for empty input */}
            {isDateInvalid ? (
              <Text className="dangerText mx-2">Service date is required</Text>
            ): null}
          </View>

          {/* MILEAGE INPUT */}
          <View className="gap-2">
            <View className="flex-1 flex-row">
              <Text className="smallTextBold">Mileage</Text>
            </View>
            <TextInput
              value={mileage}
              placeholder="Type here"
              onChangeText={setMileage}
              className={"border rounded-full px-4 py-2 smallTextGray border-stroke"}
            />
          </View>

          {/* NOTE INPUT */}
          <View className="gap-2">
            <View className="flex-1 flex-row">
              <Text className="smallTextBold">Note</Text>
            </View>
              <TextInput
                value={note}
                multiline = { true }
                numberOfLines = { 6 }
                placeholder="Type here"
                keyboardType="default"
                onChangeText={setNote}
                className={"border rounded-xl px-4 py-2 smallTextGray border-stroke"}
              />
          </View>

          {/* Upload files */}
          <View className="gap-2">
            <Text className="smallTextBold">Upload service records</Text>
            <Text className="xsTextGray">Up to 1MB per file in PDF</Text>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
              className={`flex-1 flex-row gap-2 border border-dashed border-grayBorder rounded-lg px-2 py-3 
                ${isFileInvalid ? "border-dangerBrightRed" : "border-grayBorder"}
                `}
            >
              <icons.upload/>
              <View className="flex-1 justify-center gap-0.5">
                <Text className="xsTextGray">Upload</Text>
                <Text className="xsTextGray">{files.length} files selected</Text>
              </View>
            </Pressable>

            {/* LIST FILES */}
            {files.length === 0 ? null : (
              <View style={{ maxHeight: 200 }}>
                <FlatList
                  data={files}
                  keyExtractor={(item, index) => `${item.uri}-${index}`}
                  renderItem={({ item, index }) => (
                    <View className="w-full bg-secondary rounded-xl flex-1 flex-row justify-between items-center px-4 py-3 mt-1.5 mb-1">
                      <Text>{item.name}</Text>
                      <Pressable
                        onPress={() => { setFiles(prev => prev.filter((_, i) => i !== index));}}
                        hitSlop={8}
                      >
                        <icons.trash width={24} height={24} />
                      </Pressable>
                    </View>
                  )}
                />
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
                  <Pressable className="py-3 border-stroke">
                    <Text className="smallText" onPress={handleChooseFile}>Choose a file</Text>
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
    </SafeAreaView>
  )
}

export default ServiceRecord;