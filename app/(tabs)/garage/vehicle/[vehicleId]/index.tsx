import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Pressable, ScrollView, TextInput, FlatList, Image, Modal } from "react-native";
import { View, Text, ActivityIndicator, Pressable, ScrollView, TextInput, FlatList, Image, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { readVehicle, updateVehicleDetails, getVehicleImage } from "@/_backend/api/vehicle";
import { getCurrentUser } from "aws-amplify/auth";
import { icons } from "@/constants/icons";
import NormalButton from "@/app/components/NormalButton";
import { type ServiceRecord, listServiceRecords } from "@/_backend/api/serviceRecord";
import { type File, MAX_IMAGE_SIZE, ALLOWED_MIME_TYPES_IMAGE, updateVehicleImageRemote } from "@/_backend/api/fileUpload";
import * as DocumentPicker from "expo-document-picker";

export default function VehicleDetail() {
  const params = useLocalSearchParams<{ vehicleId: string}>();
  const vehicleId = params.vehicleId;

  // Service record
  const [records, setRecords] = useState<ServiceRecord[]>([]);  // List of service records

  // Vehicle
  const [VIN, setVIN] = useState('')
  const [plateNum, setPlateNum] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')

  // New set of states to store temporary values until save is pressed
  const [newVIN, setNewVIN] = useState('');
  const [newPlateNum, setNewPlateNum] = useState('');
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newYear, setNewYear] = useState('');

  const [vehicle, setVehicle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [editDetails, setEditDetails] = useState(false);

  // Submission state & empty value check
  const [submittedEdit, setSubmittedEdit] = useState(false);

  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const isNewVINInvalid = submittedEdit && !(newVIN?.trim());
  const isNewPlateNumInvalid = submittedEdit && !(newPlateNum?.trim());
  const isNewMakeInvalid = submittedEdit && !(newMake?.trim());
  const isNewModelInvalid = submittedEdit && !(newModel?.trim());
  const isNewYearInvalid = submittedEdit && !(newYear?.trim());

  function formatServiceDate(date: string) {
    const d = new Date(date);

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }

  const handleChooseImage = async () => {
    try {
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

      if (pickedFile.size > MAX_IMAGE_SIZE || !ALLOWED_MIME_TYPES_IMAGE.includes(pickedFile.mimeType ?? "")) {
        console.log("Vehicle: Invalid image selected");
        return;
      }

      const { userId } = await getCurrentUser();

      const result = await updateVehicleImageRemote({
        userId,
        vehicleId: String(vehicleId),
        file: pickedFile,
      });

      console.log("Vehicle: updateVehicleImageRemote result:", result);

      try {
        const img = await getVehicleImage(userId, String(vehicleId));
        setVehicleImage(img || null);
      } catch (e: any) {
        console.log("Vehicle: Error reloading image after update:", e?.message);
      }

      setImageModalVisible(false);
    } catch (e: any) {
      console.log("Vehicle: Error updating image:", e?.message || e);
    }
  };

  // LOAD VEHICLE DETAILS
  useEffect(() => {(async () => {
      try {
        setLoading(true);
        if (!vehicleId) throw new Error("Missing vehicleId");
        // Use readVehicle API & store those values into states
        const { userId } = await getCurrentUser();
        const data = await readVehicle(userId, String(vehicleId));

        setVIN(data.VIN ?? "");
        setPlateNum(data.plateNum ?? "");
        setMake(data.make ?? "");
        setModel(data.model ?? "");
        setYear(String(data.year ?? ""));

        try {
          const img = await getVehicleImage(userId, String(vehicleId));
          setVehicleImage(img || null);
        } catch (e: any) {
          console.log("Vehicle: Error loading image:", e?.message);
          setVehicleImage(null);
        }

        setVehicle(true);

        try {
          const key = getVehicleImageKey(String(vehicleId));
          const uri = await AsyncStorage.getItem(key);
          setVehicleImageUri(uri);
        } catch (e: any) {
          console.log("Vehicle: Error loading image uri:", e?.message);
        }
      } catch (e: any) {
        console.log("Failed to load vehicle.")
      } finally {
        setLoading(false);
      }
    })();
  }, [vehicleId]);

    // LOAD SERVICE RECORD METADATA
    useFocusEffect(
      useCallback(() => {(async () => {
      try {
        setLoading(true);
        if (!vehicleId) throw new Error("Missing vehicleId");
        // Use listServiceRecords API & store those values into states
        const data = await listServiceRecords(vehicleId);
        const sorted = (data.items || []).slice().sort((a, b) =>
        (a.serviceDate).localeCompare(b.serviceDate)
      );
      setRecords(sorted);
      } catch (e: any) {
        console.log("Vehicle: Service record list error:", e?.message);
        setRecords([]);
      } finally {
        setLoading(false);
      }
      })();

      return () => {};

    }, [vehicleId])
  );

  const handleSaveDetails = async() => {
    setSubmittedEdit(true);

    const nv  = (newVIN ?? "").trim();
    const np  = (newPlateNum ?? "").trim();
    const nmk = (newMake ?? "").trim();
    const nmd = (newModel ?? "").trim();
    const ny  = (newYear ?? "").trim();

    if (!nv || !np || !nmk || !nmd || !ny) {
      // Don't set setSubmittedEdit(false) because we want the error messages to show
      return;
    }

    try {
      const { userId } = await getCurrentUser();

      await updateVehicleDetails({
        userId: userId,
        vehicleId: vehicleId,
        VIN: nv,
        plateNum: np,
        make: nmk,
        model: nmd,
        year: ny
      });

    // If values are vaild, store them back in the original states
    setVIN(nv);
    setPlateNum(np);
    setMake(nmk);
    setModel(nmd);
    setYear(ny);

    setEditDetails(false);
    setSubmittedEdit(false);
    } catch (e: any) {
    console.log("Failed to update vehicle:", e?.message || e);
    }
  };

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
          <View className="items-center justify-center h-24 w-24 relative">
            {vehicleImage ? (
              <Image
                source={{ uri: vehicleImage }}
                className="h-full w-full rounded-lg"
              />
            ) : (
              <icons.noImage height={50} width={70} />
            )}
            <Pressable
              onPress={() => setImageModalVisible(true)}
              className="absolute bottom-1 right-1 bg-white rounded-full p-1"
              hitSlop={8}
            >
              <icons.pencil height={16} width={16} />
            </Pressable>
          </View>
          <View>
            <Text className="buttonTextBlue">{model}</Text>
            <Text className="smallThinTextBlue">{make} {year}</Text>
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
              {editDetails ? (
              // When editDetails === true
              <View className="flex-1 flex-row justify-end gap-3 items-center">
                <NormalButton 
                  text="Cancel" 
                  variant="cancel" 
                  paddingHorizontal={20} 
                  height={34} 
                  onClick={() => {
                    setEditDetails(false);
                    setSubmittedEdit(false);
                  }}>
                </NormalButton>
                <NormalButton text="Save" variant="primary" height={34} 
                  onClick={handleSaveDetails}></NormalButton>
              </View>
              ) : (
              // When editDetails === false
              <View className="flex-1 flex-row justify-end gap-3 items-center">
                {/* PENCIL/EDIT BUTTON */}
                <Pressable onPress={() => {
                  setEditDetails(true);
                  setDetailsExpanded(true);
                  setSubmittedEdit(false);

                  {/* Fill temporary states with the existing form values */}
                  setNewVIN(VIN ?? "");
                  setNewMake(make ?? "");
                  setNewModel(model ?? "");
                  setNewPlateNum(plateNum ?? "");
                  setNewYear(year ?? "");
                }}>
                  <icons.pencil height={22} width={22}/>
                </Pressable>

                {/* TOGGLE COLLAPSE BUTTON */}
                <Pressable onPress={() => setDetailsExpanded(v => !v)}>
                  {detailsExpanded ? <icons.arrowUp height={28} width={28} /> : <icons.arrowDown height={28} width={28} />}
                </Pressable>
              </View>       
              )}
            </View>

            {/* EXPANDED DETAILS SECTION */}
            {detailsExpanded && (
              <View className="mt-4 gap-3.5">

                {/* VIN */}
                { !editDetails ? (
                  // VIN DISPLAY
                  <View className="gap-1.5">
                    <Text className="smallTextBold">VIN</Text>
                    <Text className="smallThinTextBlue">{VIN}</Text>
                  </View>
                ) : 
                (
                  // VIN INPUT
                  <View className="gap-2">
                    <View className="flex-1 flex-row">
                      <Text className="smallTextBold">VIN</Text>
                      <Text className="dangerText"> *</Text>
                    </View>
                    <TextInput
                      value={newVIN}
                      placeholder="Type here"
                      onChangeText={setNewVIN}
                      className={`border rounded-full px-4 py-2 smallTextGray ${isNewVINInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
                    />
        
                    {/* Error message for empty input */}
                    {isNewVINInvalid ? (
                      <Text className="dangerText mx-2">VIN is required</Text>
                    ): null}
                  </View>
                )}

                {/* PLATE NUMBER */}
                { !editDetails ? (
                  // PLATE NUMBER DISPLAY
                  <View className="gap-1.5">
                    <Text className="smallTextBold">Plate number</Text>
                    <Text className="smallThinTextBlue">{plateNum}</Text>
                  </View>
                ) : 
                (
                  // PLATE NUMBER INPUT
                  <View className="gap-2">
                    <View className="flex-1 flex-row">
                      <Text className="smallTextBold">Plate number</Text>
                      <Text className="dangerText"> *</Text>
                    </View>
                    <TextInput
                      value={newPlateNum}
                      placeholder="Type here"
                      onChangeText={setNewPlateNum}
                      className={`border rounded-full px-4 py-2 smallTextGray ${isNewPlateNumInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
                    />
        
                    {/* Error message for empty input */}
                    {isNewPlateNumInvalid ? (
                      <Text className="dangerText mx-2">Plate number is required</Text>
                    ): null}
                  </View>
                )}               

                {/* MAKE */}
                { !editDetails ? (
                  // MAKE DISPLAY
                  <View className="gap-1.5">
                    <Text className="smallTextBold">Make</Text>
                    <Text className="smallThinTextBlue">{make}</Text>
                  </View>
                ) : 
                (
                  // MAKE INPUT
                  <View className="gap-2">
                    <View className="flex-1 flex-row">
                      <Text className="smallTextBold">Make</Text>
                      <Text className="dangerText"> *</Text>
                    </View>
                    <TextInput
                      value={newMake}
                      placeholder="Type here"
                      onChangeText={setNewMake}
                      className={`border rounded-full px-4 py-2 smallTextGray ${isNewMakeInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
                    />
        
                    {/* Error message for empty input */}
                    {isNewMakeInvalid ? (
                      <Text className="dangerText mx-2">Make is required</Text>
                    ): null}
                  </View>
                )}

                {/* MODEL */}
                { !editDetails ? (
                  // MODEL DISPLAY
                  <View className="gap-1.5">
                    <Text className="smallTextBold">Model</Text>
                    <Text className="smallThinTextBlue">{model}</Text>
                  </View>
                ) : 
                (
                  // MODEL INPUT
                  <View className="gap-2">
                    <View className="flex-1 flex-row">
                      <Text className="smallTextBold">Model</Text>
                      <Text className="dangerText"> *</Text>
                    </View>
                    <TextInput
                      value={newModel}
                      placeholder="Type here"
                      onChangeText={setNewModel}
                      className={`border rounded-full px-4 py-2 smallTextGray ${isNewModelInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
                    />
        
                    {/* Error message for empty input */}
                    {isNewModelInvalid ? (
                      <Text className="dangerText mx-2">Model is required</Text>
                    ): null}
                  </View>
                )}

                {/* YEAR */}
                { !editDetails ? (
                  // YEAR DISPLAY
                  <View className="gap-1.5">
                    <Text className="smallTextBold">Year</Text>
                    <Text className="smallThinTextBlue">{year}</Text>
                  </View>
                ) : 
                (
                  // YEAR INPUT
                  <View className="gap-2">
                    <View className="flex-1 flex-row">
                      <Text className="smallTextBold">Year</Text>
                      <Text className="dangerText"> *</Text>
                    </View>
                    <TextInput
                      value={newYear}
                      placeholder="Type here"
                      onChangeText={setNewYear}
                      className={`border rounded-full px-4 py-2 smallTextGray ${isNewYearInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
                    />
        
                    {/* Error message for empty input */}
                    {isNewYearInvalid ? (
                      <Text className="dangerText mx-2">Year is required</Text>
                    ): null}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Services card */}
          <View className="bg-white rounded-xl px-4 py-5">
            <View className="flex-row items-center justify-between">
              <Text className="smallTitle">Services</Text>
              <View className="flex-1 flex-row justify-end gap-3 items-center">
                <Pressable
                  onPress={() => router.push(`/garage/vehicle/${params.vehicleId}/addServiceRecord`)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Add service record"
                >
                  <icons.add height={24} width={24}/>
                </Pressable>
                <Pressable
                  onPress={() => setServicesExpanded(v => !v)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Toggle services"
                >
                  {servicesExpanded ? <icons.arrowUp height={28} width={28} /> : <icons.arrowDown height={28} width={28} />}
                </Pressable>
              </View>
            </View>

            {/* Render list of service records */}
            {servicesExpanded && (
              <View className=" gap-3">
                {/* Main content: Service record list */}
                <FlatList
                  data={records}
                  keyExtractor={(r: any) => (r.empty ? r.key : r.serviceRecordId)}
                  numColumns={1}
                  ListEmptyComponent={
                    <View className="mt-10 items-center">
                      <Text className="smallTextGray">{loading ? "Loading..." : "No services yet."}</Text>
                    </View>
                  }
                  renderItem={({ item, index }: { item: any, index: number }) => {
                    const isLast = index === records.length - 1
                    return (
                      <Pressable 
                        onPress={() => router.push(`/garage/vehicle/${params.vehicleId}/${item.serviceRecordId}`)} 
                        style={{ flex: 1 }}
                        className={`py-3 border-stroke ${!isLast ? "border-b" : ""}`}
                        >
                        {/* Row */}
                        <View className="flex-1 flex-row items-center">
                          <Text className="buttonTextBlue">{item.title}</Text>
                          {/* Right side text column */}
                          <View className="flex-1 flex-col items-end justify-center">
                            <Text className="smallTextBlue">{formatServiceDate(item.serviceDate)}</Text>
                            {item.mileage != "" ? (
                              <Text className="smallTextBlue">{item.mileage} mi</Text>
                            ) : <Text className="smallTextBlue">- mi</Text>
                            }
                          </View>
                        </View>
                      </Pressable>
                    );
                  }}
                />
              </View>
            )}
          </View>
        </View>

        <Modal
          transparent={true}
          visible={imageModalVisible}
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View className="flex-1 justify-end px-2">
            <Pressable 
              className="absolute inset-0 bg-black/40"
              onPress={() => setImageModalVisible(false)}>
            </Pressable>

            <View className="w-full mb-3 gap-2 mx-3 self-center">
              <View className="bg-white px-4 py-3 rounded-lg">
                <Text className="smallTextGray">Change vehicle image</Text>
                <Pressable className="py-3 border-stroke" onPress={handleChooseImage}>
                  <Text className="smallText">Choose a file</Text>
                </Pressable>
              </View>

              <View className="bg-white rounded-lg">
                <Pressable 
                  onPress={() => setImageModalVisible(false)}
                  className="px-4 py-3"
                >
                  <Text className="text-center smallTextBold">Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          visible={imageModalVisible}
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View className="flex-1 justify-end px-2">
            <Pressable 
              className="absolute inset-0 bg-black/40"
              onPress={() => setImageModalVisible(false)}>
            </Pressable>

            <View className="w-full mb-3 gap-2 mx-3 self-center">
              <View className="bg-white px-4 py-3 rounded-lg">
                <Text className="smallTextGray">Change vehicle image</Text>
                <Pressable className="py-3 border-stroke" onPress={handleChooseImage}>
                  <Text className="smallText">Choose a file</Text>
                </Pressable>
              </View>

              <View className="bg-white rounded-lg">
                <Pressable 
                  onPress={() => setImageModalVisible(false)}
                  className="px-4 py-3"
                >
                  <Text className="text-center smallTextBold">Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    // <SafeAreaView className="flex-1 bg-secondary" edges={["top", "bottom"]}>
      <ScrollView className="flex-1 bg-secondary">
        <View className="flex-1">{content}</View>
      </ScrollView>
    // </SafeAreaView>
  );
}