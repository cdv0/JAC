import { readUserProfile } from '@/_backend/api/profile'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Cog6ToothIcon, UserCircleIcon } from 'react-native-heroicons/solid'
import { SafeAreaView } from 'react-native-safe-area-context'

export const account = () => {
  const router = useRouter()
  //const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      try {
        const { userId } = await getCurrentUser()
        const attrs = await fetchUserAttributes() 
        const email = attrs.email
        if (!email) {
          throw new Error(
            'No email on the Cognito profile (check pool/app-client readable attributes).'
          )
        }
        console.log('userid:', userId, 'email:', email)
        const userData = await readUserProfile(userId, email)
        setFirstName(userData.firstName ?? '')
        setLastName(userData.lastName ?? '')
        setCreatedAt(userData.createdAt ?? '')
      } catch (e: any) {
        console.log('Account: Error loading user data:', e)
        console.log('Account: Error message:', e.message)
      }
    })()
  }, [firstName, lastName])

  // initials from user's full name
  const firstNameInitial = firstName[0]
  const lastNameInitial = lastName[0]
  const fullInitials = firstNameInitial + lastNameInitial
  
  return (
    <SafeAreaView className="flex-col bg-secondary" edges={['top', 'bottom']}>
      <ScrollView>
        <View className="flex-row justify-end bg-white rounded-md bg-primaryBlue">
          <Pressable onPress={() => router.push('/profile/settings')}>
            <Cog6ToothIcon size={32} color="#000" />
          </Pressable>
        </View>
        <View className="relative items-center justify-center bg-white h-52">
          <UserCircleIcon size={200} color="#e3e3e3" />
          <Text>
            {firstName} {lastName} {createdAt}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default account
