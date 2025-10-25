import { readUserProfile } from '@/_backend/api/profile'
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth"
import { useRouter } from 'expo-router'
import { useEffect, useState } from "react"
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const account = () => {
  const router = useRouter()
  //const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  
  useEffect(() => {
    (async () => {
    try {
      const { userId } = await getCurrentUser();
      const attrs = await fetchUserAttributes();
      console.log("TESTING")
      const email = attrs.email;
      if (!email) {
        throw new Error("No email on the Cognito profile (check pool/app-client readable attributes).");
      }
      const userData = await readUserProfile(userId, email);
      setFirstName(userData.firstName ?? "");
      setLastName(userData.lastName ?? "");
      setCreatedAt(userData.createdAt ?? "");
    } catch (e: any) {
      console.log("Account: Error loading user data:", e)
      console.log("Account: Error message:", e.message)
    }
  })();
  }, [firstName, lastName]);

  // initials from user's full name
  const firstNameInitial = firstName[0];
  const lastNameInitial = lastName[0];
  const fullInitials = firstNameInitial + lastNameInitial;
  
  return (
    <SafeAreaView className="flex-col bg-secondary" edges={["top", "bottom"]}>
      <ScrollView>
      <View className = "flex-row bg-white justify-end bg-primaryBlue rounded-md">
          <Pressable 
          onPress={() => router.push('profile/settings')}>
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="32px" 
            viewBox="0 -960 960 960" 
            width="32px" 
            fill="#000000"
            >
              <path 
              d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
            </svg>
          </Pressable>
          </View>
        <View className = "relative h-52 bg-white justify-center items-center">
          <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="200px" 
          viewBox="0 -960 960 960" 
          width="200px" fill="#e3e3e3">
            <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/>
          </svg>
          <Text>
            {firstName}{lastName} test
          </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default account;