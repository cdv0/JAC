import { Text, View, ScrollView, ActivityIndicator, TextInput, Pressable, Modal, Platform, FlatList } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useLayoutEffect } from "react";
import { readServiceRecord, updateServiceRecord, deleteServiceRecord } from "@/_backend/api/serviceRecord";
import { useNavigation } from "expo-router";
import { icons } from "@/constants/icons";
import NormalButton from "@/app/components/NormalButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import DeleteModal from "@/app/components/DeleteModal";
import { type File, MAX_RECORD_SIZE, ALLOWED_MIME_TYPES_RECORD } from "@/_backend/api/fileUpload";
import * as DocumentPicker from "expo-document-picker";
import {uploadVehicleImage} from "@/_backend/api/fileUpload";

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
  const [fileDisplay, setFileDisplay] = useState<string[]>([]);  // Files initially loaded in. Name only
  const [files, setFiles] = useState<File[]>([]); // New files added in
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);

  // New set of states to store temporary values until save is pressed
  const [newTitle, setNewTitle] = useState('');
  const [newServiceDate, setNewServiceDate] = useState<Date>(new Date());
  const [newMileage, setNewMileage] = useState('');
  const [newNote, setNewNote] = useState('');

  const [record, setRecord] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editDetails, setEditDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Submission state & empty value check
  const [submittedEdit, setSubmittedEdit] = useState(false);

  const isNewTitleInvalid = submittedEdit && !(newTitle?.trim());
  const isNewServiceDateInvalid = submittedEdit && !newServiceDate;
  const isNewMileageInvalid = submittedEdit && !(newMileage?.trim());
  const isNewNoteInvalid = submittedEdit && !(newNote?.trim());
  const isFileInvalid = submittedEdit && files.some(file => 
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

    setFileDisplay(prev => [...prev, pickedFile.name]);
  };

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
    });
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

    if (!nt || !nsd ) {
      return;
    }

    // If a file exists, make sure it's valid
    if (files.some(file => file.size > MAX_RECORD_SIZE || !ALLOWED_MIME_TYPES_RECORD.includes(file.mimeType ?? ""))) {
      console.log("Add service record: Invalid file selected");
      return;
    }

    try {
      const fileKeys: string[] = []

      // UPLOAD FILES TO S3 IF ANY
      if (files.length > 0) {
        try {
          for (const file of files) {
            const recordFileKey = await uploadVehicleImage(file, "record");
            console.log("Add service record: Service records upload successful:", recordFileKey);
            fileKeys.push(recordFileKey);
          }
          console.log("All file keys", fileKeys);
        } catch (e: any) {
          console.log("Add service record: Error uploading service records:", e);
          console.log("Add service record: Error message:", e?.message);
          return;
        }
      }

      // Combine existing (without the removed files) and newly uploaded
      const updatedFiles = Array.from(new Set([...(fileDisplay ?? []), ...fileKeys]));

      await updateServiceRecord({
        serviceRecordId: serviceRecordId,
        vehicleId: vehicleId,
        title: nt,
        serviceDate: nsd,
        mileage: newMileage,
        note: newNote,
        files: updatedFiles,
        removedFiles: removedFiles
      });

      setTitle(nt);
      setServiceDate(nsdDate);
      setServiceDateDisplay(formatServiceDate(nsdDate));
      setMileage(newMileage);
      setNote(newNote);
      setFileDisplay(updatedFiles);
      setFiles([]);

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

        const filesFromDb = data.files ?? []
        setFileDisplay(filesFromDb);        

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

  const deleteRecord = async () => {
    try {
      await deleteServiceRecord({
        vehicleId: vehicleId,
        serviceRecordId: serviceRecordId
      })
      router.back();
    } catch (e: any) {
        console.log("Failed to delete service record:", e?.message || e);
    }
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
        <View className={`flex-1 flex-row justify-end gap-3 items-center ${Platform.OS === "ios" ? "pr-16" : ""}`}>
          {!editDetails ? (
            <>
              <Pressable onPress={() => editPressed()}>
                <icons.pencil width={22} height={22} />
              </Pressable>
              <Pressable
                onPress={() => setShowDeleteModal(true)}
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
                  className={`flex-1 flex-row border rounded-full px-4 py-3 justify-between items-center
                    ${isNewServiceDateInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
                >
                  <Text className="smallTextGray">
                    {formatServiceDate(newServiceDate)}
                  </Text>
                </Pressable>

                {Platform.OS === "ios" ? (
                  <Modal
                    transparent={true}
                    visible={showDatePicker}
                    onRequestClose={() => setShowDatePicker(false)}
                  >
                    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                      <View className="bg-white p-8">
                        <Pressable 
                          onPress={() => setShowDatePicker(false)}
                          className="self-end pb-5"
                        >
                          <Text className="text-primaryBlue font-semibold">Done</Text>
                        </Pressable>
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={newServiceDate}
                          mode="date"
                          display="spinner"
                          onChange={onDateChange}
                          maximumDate={new Date()}
                        />
                      </View>
                    </View>
                  </Modal>
                ) : (
                  // ANDROID
                  showDatePicker && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={newServiceDate}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                      maximumDate={new Date()}
                    />
                  )
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
                <Text className={`${mileage === "" ? "italic smallTextGray" : "smallThinTextBlue"}`}>{mileage!= null && mileage != "" ? `${mileage} mi` : "- mi"}</Text>
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
              </View>
            )}

            {/* FILES */}
            { !editDetails ? (
              // FILE DISPLAY
              <View className="gap-1.5">
                <Text className="smallTextBold">Files</Text>
                {fileDisplay.length === 0 ? (
                  <Text className="smallTextGray italic">No files yet.</Text>
                ) : (
                  <View style={{ maxHeight: 200 }}>
                    <FlatList
                      data={fileDisplay}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <View className="w-full flex-1 flex-row justify-between items-center mb-2.52">
                          <Text className="smallThinTextBlue italic">{item}</Text>
                        </View>
                      )}
                    />
                  </View>
                 )
                }
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
                    <Text className="xsTextGray">No file selected</Text>
                  </View>
                </Pressable>

                {/* LIST EXISTING FILES */}
                {fileDisplay.length === 0 ? null : (
                  <View style={{ maxHeight: 200 }}>
                    <FlatList
                      data={fileDisplay}
                      keyExtractor={(item) => item}
                      renderItem={({ item, index }) => (
                        <View className="w-full bg-secondary rounded-xl flex-1 flex-row justify-between items-center px-4 py-3 mt-1.5 mb-1">
                          <Text>{item}</Text>
                          <Pressable
                            onPress={() => {
                              setFileDisplay(prev => prev.filter((_, i) => i !== index));
                              setRemovedFiles(prev => [...prev, item]);
                            }}
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
            )}

            {/* CANCEL and SAVE BUTTON */}
            {editDetails && (
              <View className="flex-1 mt-5 flex-row justify-center items-center gap-5">
                <NormalButton
                  variant="cancel"
                  text="Cancel"
                  onClick={() => {
                    setEditDetails(false);

                    setNewTitle(title ?? "");
                    setNewServiceDate(serviceDate ?? new Date());
                    setNewMileage(mileage ?? "");
                    setNewNote(note ?? "");

                    setFiles([]);
                    setRemovedFiles([]);
                  }}
                />

                <NormalButton
                  variant="primary"
                  text="Save"
                  onClick={handleSave}
                />
              </View>
            )}

            {/* DELETE MODAL */}
            <DeleteModal
              visible={showDeleteModal}
              setHide={setShowDeleteModal}
              type="record"
              onConfirm={deleteRecord}
            />

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
          </View>
        </View>
      </View>
    );
  }
  return (
    // <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1">{content}</View>
      </ScrollView>
    // </SafeAreaView>
  );
};

export default ServiceRecord;