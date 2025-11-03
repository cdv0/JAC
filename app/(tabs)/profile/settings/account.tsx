import { readUserProfile } from '@/_backend/api/profile'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Account() {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')
  const [email, setEmail] = useState<string>('')

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

  return (
    <SafeAreaView className="flex-col" edges={['top', 'bottom']}>
      <View className="flex-col justify-start">
        <View className="h-full px-2 pt-3">
          <View className="bg-white rounded-xl">
            <Pressable
              className="flex-row justify-between px-5 pt-5 pb-3"
              onPress={() => router.push('/profile/settings/editName')}
            >
              <Text className="font-semibold text-textBlack">Name</Text>
              <View className="flex-row gap-3">
                <Text className="xsText">
                  {firstName} {lastName}
                </Text>
                {/* <svg
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
                </svg> */}
                <ChevronRightIcon size={28} color="#000" />
              </View>
            </Pressable>
            {/* EMAIL */}
            <Pressable
              className="flex-row justify-between px-5 py-3"
              onPress={() => {
                router.push('/profile/settings/editEmail')
              }}
            >
              <Text className="font-semibold text-textBlack">Email</Text>
              <View className="flex-row">
                <Text className="flex-row font-semibold text-textBlack">
                  {email}
                </Text>
                {/* <svg
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
                </svg> */}
                <ChevronRightIcon size={28} color="#000" />
              </View>
            </Pressable>
            <Pressable className="flex-row justify-between px-5 py-3">
              <Text className="font-semibold text-textBlack">Password</Text>
              <View className="flex-row">
                <Text className="font-semibold text-textBlack">*********</Text>
                {/* <svg
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
                </svg> */}
                <ChevronRightIcon size={28} color="#000" />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
