import { Text, View, ScrollView, ActivityIndicator, TextInput, Pressable, Modal, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useLayoutEffect } from "react";
import { readServiceRecord, updateServiceRecord } from "@/_backend/api/serviceRecord";
import { useNavigation } from "expo-router";
import { icons } from "@/constants/icons";
import NormalButton from "@/app/components/NormalButton";
import DateTimePicker from "@react-native-community/datetimepicker";

const ServiceRecord = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const { vehicleId, serviceRecordId } = useLocalSearchParams<{
    vehicleId: string;
    serviceRecordId: string;
  }>();

  // Service record
  const [title, setTitle] = useState('')
  const [serviceDateDisplay, setServiceDateDisplay] = useState('')
  const [serviceDate, setServiceDate] = useState<Date>(new Date())
  const [mileage, setMileage] = useState('')
  const [note, setNote] = useState('')

  // New set of states to store temporary values until save is pressed
  const [newTitle, setNewTitle] = useState('');
  const [newServiceDate, setNewServiceDate] = useState<Date>(new Date());
  const [newMileage, setNewMileage] = useState('');
  const [newNote, setNewNote] = useState('');

  const [record, setRecord] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editDetails, setEditDetails] = useState(false);
  const [areFiles, setAreFiles] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Submission state & empty value check
  const [submittedEdit, setSubmittedEdit] = useState(false);

  const isNewTitleInvalid = submittedEdit && !(newTitle?.trim());
  const isNewServiceDateInvalid = submittedEdit && !newServiceDate;
  const isNewMileageInvalid = submittedEdit && !(newMileage?.trim());
  const isNewNoteInvalid = submittedEdit && !(newNote?.trim());

  function formatServiceDate(date: Date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }); // Ex. November 12, 2025
  }

  function formatServiceDateNumber(date: Date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }); // Ex. November 12, 2025
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    // Android: Close date picker after any action
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    // Only update date if the user actually picked one
    if (event?.type === 'set' && selectedDate) {
      setNewServiceDate(selectedDate);
    }
  };

  // TODO: ADD SAVE EDIT RECORD LOGIC
  const handleSave = async () => {
    setSubmittedEdit(true);

    const nt = (newTitle ?? "").trim();
    const nsdDate = newServiceDate;
    const nsd = nsdDate.toISOString();
    const nm = (newMileage ?? "").trim();
    const nn = (newNote ?? "").trim();

    if (!nt || !nsd || !nm || !nn) {
      return;
    }

    try {
      await updateServiceRecord({
        serviceRecordId: serviceRecordId,
        vehicleId: vehicleId,
        title: nt,
        serviceDate: nsd,
        mileage: nm,
        note: nn,
      });

      setTitle(nt);
      setServiceDate(nsdDate);
      setServiceDateDisplay(formatServiceDate(nsdDate));
      setMileage(nm);
      setNote(nn);

      setEditDetails(false);
      setSubmittedEdit(false);
    } catch (e: any) {
      console.log("Failed to update service record:", e?.message || e);
    }
  };

  // LOAD SERVICE RECORD DETAILS
  useEffect(() => {(async () => {
      try {
        setLoading(true);
        if (!vehicleId) throw new Error("Missing vehicleId");

        const data = await readServiceRecord(serviceRecordId, vehicleId);
        const loadedDate = new Date(data.serviceDate);

        setTitle(data.title ?? "");
        setServiceDateDisplay(formatServiceDate(loadedDate));
        setServiceDate(loadedDate);
        setMileage(data.mileage ?? "");
        setNote(data.note ?? "");

        setRecord(true);
      } catch (e: any) {
        console.log("Failed to load service record.")
      } finally {
        setLoading(false);
      }
    })();
  }, [serviceRecordId]);

  function editPressed() {
    setEditDetails(true);

    setNewTitle(title ?? "");
    setNewServiceDate(serviceDate ?? new Date());
    setNewMileage(mileage ?? "");
    setNewNote(note ?? "");
  }

  // Update the right side of the header so we can set the state when pencil icon is clicked
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        editDetails ? (
          <Pressable 
            onPress={() => setEditDetails(false)}
            className="p-5"
            hitSlop={8}
          >
            <icons.x height={24} width={24}/>
          </Pressable>
        ) :
        (
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
          {!editDetails ? (
            <>
              <Pressable onPress={() => editPressed()}>
                <icons.pencil width={22} height={22} />
              </Pressable>
              <Pressable
                onPress={() => {}}
                className="items-center mr-4"
                hitSlop={8}
              >
                <icons.trash width={24} height={24} />
              </Pressable>
            </>
          ) : null}
        </View>
      ),
    });
  }, [navigation, editDetails, handleSave]);

  let content: React.ReactNode;

  if (loading) {
    content = (
      <View className="items-center mt-10">
        <ActivityIndicator />
        <Text className="smallTextGray mt-2">Loading service record...</Text>
      </View>
    );
  } else if (!record) {
    content = (
      <View className="items-center mt-10">
        <Text className="smallTextGray">Service record not found.</Text>
      </View>
    );
  } else {
    content = (
      <View className="flex-1">
        <View className="items-center gap-4 bg-white w-full p-2 px-5">
          <View className="mt-2.5 gap-3.5 w-full">

            {/* Title */}
            { !editDetails ? (
              // TITLE DISPLAY
              <View className="gap-1.5">
                <Text className="smallTextBold">Title</Text>
                <Text className="smallThinTextBlue">{title}</Text>
              </View>
            ) : 
            (
              // TITLE INPUT
              <View className="gap-2">
                <View className="flex-1 flex-row">
                  <Text className="smallTextBold">Title</Text>
                  <Text className="dangerText"> *</Text>
                </View>
                <TextInput
                  value={newTitle}
                  placeholder="Type here"
                  onChangeText={setNewTitle}
                  className={`border rounded-full px-4 py-2 smallTextGray ${isNewTitleInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
                />
    
                {/* Error message for empty input */}
                {isNewTitleInvalid ? (
                  <Text className="dangerText mx-2">Title is required</Text>
                ): null}
              </View>
            )}

            {/* SERVICE DATE */}
            { !editDetails ? (
              // SERVICE DATE DISPLAY
              <View className="gap-1.5">
                <Text className="smallTextBold">Service date</Text>
                <Text className="smallThinTextBlue">{serviceDateDisplay}</Text>
              </View>
            ) : 
            (
              // SERVICE DATE INPUT
              <View className="gap-2">
                <View className="flex-1 flex-row">
                  <Text className="smallTextBold">Service date</Text>
                  <Text className="dangerText"> *</Text>
                </View>

                {/* Date display and picker trigger */}
                <Pressable 
                  onPress={() => setShowDatePicker(true)}
                  className="border rounded-full px-4 py-3 border-stroke"
                >
                  <Text className="smallTextGray">
                    {formatServiceDateNumber(newServiceDate)}
                  </Text>
                </Pressable>

                {/*DATE TIME PICKER*/}
                {(showDatePicker || Platform.OS === 'ios') && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={newServiceDate}
                    mode="date"
                    display="default"
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

                {/* Error message for empty input */}
                {isNewServiceDateInvalid ? (
                  <Text className="dangerText mx-2">Service date is required</Text>
                ): null}
              </View>
            )}               

            {/* MILEAGE */}
            { !editDetails ? (
              // MILEAGE DISPLAY
              <View className="gap-1.5">
                <Text className="smallTextBold">Mileage</Text>
                <Text className="smallThinTextBlue">{mileage!= null && mileage != "" ? `${mileage} mi` : "- mi"}</Text>
              </View>
            ) : 
            (
              // MILEAGE INPUT
              <View className="gap-2">
                <View className="flex-1 flex-row">
                  <Text className="smallTextBold">Mileage</Text>
                </View>
                <TextInput
                  value={newMileage}
                  placeholder="Type here"
                  onChangeText={setNewMileage}
                  className={`border rounded-full px-4 py-2 smallTextGray border-stroke`}
                />
    
                {/* Error message for empty input */}
                {isNewMileageInvalid ? (
                  <Text className="dangerText mx-2">Enter a valid mileage value</Text>
                ): null}
              </View>
            )}

            {/* NOTE */}
            { !editDetails ? (
              // NOTE DISPLAY
              <View className="gap-1.5">
                <Text className="smallTextBold">Note</Text>
                <Text className={`${note ? "smallThinTextBlue" : "smallTextGray italic"}`}>{note ? `${note}` : "No note yet."}</Text>
              </View>
            ) : 
            (
              // NOTE INPUT
              <View className="gap-2">
                <View className="flex-1 flex-row">
                  <Text className="smallTextBold">Note</Text>
                </View>
                <TextInput
                  value={newNote}
                  multiline={true}
                  numberOfLines={6}
                  placeholder="Type here"
                  keyboardType="default"
                  onChangeText={setNewNote}
                  className={"border rounded-xl px-4 py-2 smallTextGray border-stroke"}
                />

                {/* Error message for empty input */}
                {isNewNoteInvalid ? (
                  <Text className="dangerText mx-2">Enter a valid note</Text>
                ): null}
              </View>
            )}

            {/* FILES */}
            { !editDetails ? (
              // FILE DISPLAY
              <View className="gap-1.5">
                <Text className="smallTextBold">Files</Text>
                {!areFiles && (
                  <Text className="smallTextGray italic">No files yet.</Text>
                )}
              </View>
            ) : 
            (
              // FILE UPLOADER
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
                    <Text className="xsTextGray">No file selected</Text>
                  </View>
                </Pressable>
              </View>
            )}

            {/* CANCEL and SAVE BUTTON */}
            {editDetails && (
              <View className="flex-1 mt-5 flex-row justify-center items-center gap-5">
                <NormalButton
                  variant="cancel"
                  text="Cancel"
                  onClick={() => setEditDetails(false)}
                />

                <NormalButton
                  variant="primary"
                  text="Save"
                  onClick={handleSave}
                />
              </View>
            )}

            {/* FILE MODAL */}
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
                  onPress={() => setModalVisible(false)}
                ></Pressable>

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
          </View>
        </View>
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1">{content}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceRecord;