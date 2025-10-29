import { readUserProfile, updateProfileInfo } from '@/_backend/api/profile'
import { icons } from '@/constants/icons'
import { confirmUserAttribute, fetchAuthSession, fetchUserAttributes, getCurrentUser, updateUserAttribute } from 'aws-amplify/auth'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Modal, Pressable, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Account() {

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [createdAt, setCreatedAt] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    const [newEmail, setNewEmail] = useState<string>('')
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [updateEmailVisibile, setUpdateEmailVisible] = useState(false)

    const oldEmailRef = useRef<string>(email);
  
    useEffect(() => {
      (async () => {
        try {
          const { userId } = await getCurrentUser()
          const attrs = await fetchUserAttributes() 
          const email = attrs.email
          if (!email) {
            throw new Error(
              'No email on the Cognito profile (check pool/app-client readable attributes).'
            )
          }
          const userData = await readUserProfile(userId, email)
          setFirstName(userData.firstName ?? '')
          setLastName(userData.lastName ?? '')
          setEmail(attrs.email ?? '')
          setCreatedAt(attrs.createdAt ?? '')
        } catch (e: any) {
          console.log('Account: Error loading user data:', e)
          console.log('Account: Error message:', e.message)
        }
      })()
    }, [firstName, lastName])

      const handleUpdateEmail = async () => {
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
    <SafeAreaView className="flex-col" edges={['top', 'bottom']}>
      <View className="flex-col justify-start">
        <View className="h-full px-2 pt-3">
          
          <View className="bg-white rounded-xl">
            <Pressable className="flex-row justify-between px-5 pt-5 pb-3">
              <Text className="font-semibold text-textBlack">Name</Text>
              <View className="flex-row">
              <Text className="font-semibold text-textBlack">{firstName} {lastName}</Text>
              <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 2 28 28"
              stroke-width="2.5"
              stroke="currentColor"
              className="w-6 h-6 font-extrabold text-textBlack"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
              </svg>
              {/* <ChevronRightIcon size={28} color="#000" /> */}
              </View>
            </Pressable>

            
            <Pressable
              className="flex-row justify-between px-5 py-3"
              onPress={()=>{setUpdateEmailVisible(!updateEmailVisibile)}}
            >
              <Text className="font-semibold text-textBlack">Email</Text>
              <View className="flex-row">
                <Text className="flex-row font-semibold text-textBlack">{email}</Text>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 2 28 28"
                stroke-width="2.5"
                stroke="currentColor"
                className="w-6 h-6 font-extrabold text-textBlack"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
                </svg>
                {/* <ChevronRightIcon size={28} color="#000" /> */}
              </View>
            </Pressable>
            <Pressable
              className="flex-row justify-between px-5 py-3"
            >
              <Text className="font-semibold text-textBlack">Password</Text>
              <View className="flex-row">
                <Text className="font-semibold text-textBlack">*********</Text>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 2 28 28"
                stroke-width="2.5"
                stroke="currentColor"
                className="w-6 h-6 font-extrabold text-textBlack"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
                </svg>
                {/* <ChevronRightIcon size={28} color="#000" /> */}
              </View>
            </Pressable>
          </View>
        </View>
        <Modal visible={updateEmailVisibile}>
          <SafeAreaView>
          <Pressable
              onPress={() => {setUpdateEmailVisible(!updateEmailVisibile)}}
              className="flex-row items-center px-2"
              hitSlop={2}
            >
              <icons.chevBack width={24} height={24} fill="#1B263B" />
              <Text className="ml-1 text-primaryBlue text-[15px] font-medium">
                Back
              </Text>
            </Pressable>
            <View>
              {!isVerifying ? (
                <View>
                  <Text className="largeTitle">Update Email</Text>
                  <TextInput
                    placeholder="New Email"
                    value={newEmail}
                    onChangeText={setNewEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`border rounded-full px-4 py-2 smallTextGray`}
                  />
                  <Button 
                    title="Update Email" 
                    onPress={() => {
                    handleUpdateEmail();
                  }} />
                </View>
              ) : (
                <View>
                  <Text>Verify New Email</Text>
                  <Text>Enter the verification code sent to {newEmail}.</Text>
                  <TextInput
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="numeric"
                    className={`border rounded-full px-4 py-2 smallTextGray`}
                  />
                  <Button title="Verify Code" onPress={handleVerifyEmail} />
                </View>
              )}
            </View>
          </SafeAreaView>
        </Modal> 
      </View>
    </SafeAreaView>
    )
  }
