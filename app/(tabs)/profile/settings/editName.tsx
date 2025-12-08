import { updateName } from "@/_backend/api/profile";
import NormalButton from "@/app/components/NormalButton";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// helper: split "First Middle Last Jr." -> { firstName: "First", lastName: "Middle Last Jr." }
function splitFirstLast(full: string) {
  const clean = full.trim().replace(/\s+/g, " ");
  if (!clean) return { firstName: "", lastName: "" };
  const parts = clean.split(" ");
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export default function EditName() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isNameInvalid = submitted && !name.trim();

  const onSave = async () => {
    setSubmitted(true);
    if (!name.trim()) return;

    const { firstName, lastName } = splitFirstLast(name);

    try {
      const { userId } = await getCurrentUser();
    
      const attrs = await fetchUserAttributes();
      const email = attrs.email || "";
      
      const result = await updateName(userId, email, firstName, lastName);

      setName("");
        // Navigate back to account settings after successful update
        router.back();
    } catch (e: any) {
      console.log("Update name failed:", e?.message || e);
    } finally {
    }
  };

  return (
    // <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <View className="flex-1 bg-white rounded-xl px-4 py-5">
        <View className="gap-2.5">
          <Text className="font-semibold text-textBlack">Enter new name</Text>
          <View className="gap-2">
            <View>
              <TextInput
                value={name}
                placeholder="Type here"
                keyboardType="default"
                onChangeText={setName}
                autoCapitalize="words"
                className={`mb-2 border rounded-full px-4 py-2 smallTextGray ${
                  isNameInvalid ? "border-dangerBrightRed" : "border-stroke"
                }`}
              />
              {isNameInvalid ? (
                <Text className="dangerText mx-2">Name is required</Text>
              ) : null}
            </View>
          </View>
        </View>
        
        <View className="mt-3">
          <NormalButton
            variant="primary"
            text="Save"
            paddingHorizontal={30}
            onClick={onSave}
          />
        </View>
      </View>
    // </SafeAreaView>
  );
}
