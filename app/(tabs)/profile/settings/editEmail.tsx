import { readUserProfile, updateProfileInfo } from "@/_backend/api/profile";
import NormalButton from "@/app/components/NormalButton";
import { confirmUserAttribute, fetchAuthSession, fetchUserAttributes, getCurrentUser, updateUserAttribute } from "aws-amplify/auth";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Contact() {

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [createdAt, setCreatedAt] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    const [newEmail, setNewEmail] = useState<string>('')
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [updateEmailVisibile, setUpdateEmailVisible] = useState(false)
    const [submitted, setSubmitted] = useState(false);
    const isEmailInvalid = submitted && !newEmail.trim();

    const oldEmailRef = useRef<string>(email);

    const handleUpdateEmail = async () => {
      setSubmitted(true);
    if (!newEmail || newEmail === email) {
      Alert.alert("No change", "Enter a different email.");
      return;
    }
    try {
      const attrs = await fetchUserAttributes();
      oldEmailRef.current = attrs.email || email;

      const output = await updateUserAttribute({
        userAttribute: { attributeKey: "email", value: newEmail },
      });

      const step = output?.nextStep?.updateAttributeStep;
      if (step === "CONFIRM_ATTRIBUTE_WITH_CODE") {
        setIsVerifying(true);
        Alert.alert(
          "Verify your email",
          "We sent a code to your new email address. Enter it to confirm."
        );
      } else if (step === "DONE") {
        await afterCognitoConfirm();
      }
    } catch (error: any) {
      console.log("Error updating email:", error);
      Alert.alert("Error", error?.message || "Could not start email change.");
    }
  };

  //After user enters code, confirm with Cognito, then move the row in Dynamo
  const handleVerifyEmail = async () => {
    try {
      if (!verificationCode.trim()) {
        Alert.alert("Missing code", "Enter the 6-digit verification code.");
        return;
      }
      await confirmUserAttribute({
        userAttributeKey: "email",
        confirmationCode: verificationCode.trim(),
      });

      await afterCognitoConfirm();
      router.back();
    } catch (error: any) {
      console.log("Error confirming email:", error);
      Alert.alert("Error", error?.message || "Could not confirm email.");
    }
  };

  const afterCognitoConfirm = async () => {
    try {
      // Refresh tokens
      await fetchAuthSession({ forceRefresh: true });

      const { userId } = await getCurrentUser();

      // Use captured oldEmailRef.current for the Dynamo move
      const oldEmail = oldEmailRef.current || email;
      await updateProfileInfo(userId, oldEmail, newEmail);

      const profile = await readUserProfile(userId, newEmail);

      setEmail(newEmail);
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setCreatedAt(profile.createdAt ?? "");

      // reset modal state
      setIsVerifying(false);
      setVerificationCode("");
      setNewEmail("");
      setUpdateEmailVisible(false);

      Alert.alert("Success", "Email updated in Cognito and Dynamo.");
    } catch (e: any) {
      console.log("Post-confirm / Dynamo move failed:", e?.message || e);
      Alert.alert("Error", e?.message || "Could not finish updating your email.");
    }
  };
    return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="flex-1 bg-white rounded-xl px-4 py-5">
                <View>
                  {!isVerifying ? (
                    <View className="gap-2.5">
                      <Text className="font-semibold text-textBlack">Enter new email</Text>
                      <View className="gap-2">
                        <View>
                          <TextInput
                              value={newEmail}
                              placeholder="Type here"
                              keyboardType="email-address"
                              onChangeText={setNewEmail}
                              autoCapitalize="none"
                              className={`mb-2 border rounded-full px-4 py-2 smallTextGray ${isEmailInvalid ? "border-dangerBrightRed" : "border-stroke"
                              }`}
                          />
                              {isEmailInvalid ? (
                                  <Text className="dangerText mx-2">Email is required</Text>
                              ) : null}
                            </View>
                        </View>
                      <View className="mt-3">
                        <NormalButton 
                          text="Save" 
                          variant="primary" 
                          paddingHorizontal={30} 
                          onClick={() => {
                          handleUpdateEmail();
                        }} />
                      </View>
                    </View>
                  ) : (
                    <View className="gap-2.5">
                      <Text className="font-semibold text-textBlack">Enter verification code</Text>
                      <TextInput
                            value={verificationCode}
                            placeholder="Type here"
                            keyboardType="numeric"
                            onChangeText={setVerificationCode}
                            className={`mb-2 border rounded-full px-4 py-2 smallTextGray border-stroke`}
                        />
                        <View className="mt-3">
                          <NormalButton 
                          text="Submit" 
                          variant="primary" 
                          onClick={() => {
                          handleVerifyEmail();
                        }} />
                      </View>
                    </View>
                  )}
                </View>
                </View>
              </SafeAreaView>
    )
}