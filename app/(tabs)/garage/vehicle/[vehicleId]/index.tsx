import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { readVehicle, updateVehicleDetails } from "@/_backend/api/vehicle";
import { getCurrentUser } from "aws-amplify/auth";
import { icons } from "@/constants/icons";
import NormalButton from "@/app/components/NormalButton";

export default function VehicleDetail() {
  const params = useLocalSearchParams<{ vehicleId: string}>();
  const vehicleId = params.vehicleId;

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

  const isNewVINInvalid = submittedEdit && !(newVIN?.trim());
  const isNewPlateNumInvalid = submittedEdit && !(newPlateNum?.trim());
  const isNewMakeInvalid = submittedEdit && !(newMake?.trim());
  const isNewModelInvalid = submittedEdit && !(newModel?.trim());
  const isNewYearInvalid = submittedEdit && !(newYear?.trim());

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

        setVehicle(true);
      } catch (e: any) {
        console.log("Failed to load vehicle.")
      } finally {
        setLoading(false);
      }
    })();
  }, [vehicleId]);

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
          <View className="items-center justify-center h-24 w-24">
            <icons.noImage height={50} width={70} />
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
                // TODO: ADD ONPRESS LOGIC FOR CREATING A SERVICE RECORD
                  onPress={() => {}}
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