import { deleteAccount, readUserProfile } from '@/_backend/api/profile'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'
import NormalButton from '../../../components/NormalButton'

export default function Account() {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [deleteAccountModal, setDeleteAccountModal] = useState<boolean>(false)

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
        setUserId(attrs.sub ?? '')
      } catch (e: any) {
        console.log('Account: Error loading user data:', e)
        console.log('Account: Error message:', e.message)
      }
    })()
  }, [firstName, lastName])

  const deleteAccountHandler = async () => {
    // call lambda to delete content from DB

    const result = await deleteAccount(userId, email)
  }

  return (
    <SafeAreaView className="flex-col" edges={['top', 'bottom']}>
      <View className="flex-col justify-start">
        <View className="flex items-center h-full px-2">
          {deleteAccountModal && (
            <View className="absolute z-40 flex w-4/5 gap-6 px-8 py-8 mt-20 bg-white border-2 rounded-xl border-stroke">
              <Text className="text-center text-black largeTitle ">
                Delete Account
              </Text>
              <Text className="w-full text-xl text-center text-dangerDarkRed">
                Are you sure you want to delete your account?
              </Text>

              <View className="flex flex-row gap-8">
                <NormalButton
                  text="Cancel"
                  onClick={() => setDeleteAccountModal(false)}
                  variant="outline"
                />

                <NormalButton
                  text="Confirm"
                  onClick={deleteAccountHandler}
                  variant="danger"
                />
              </View>
            </View>
          )}

          <View className="flex w-full gap-6 bg-white rounded-xl">
            <Pressable
              className="flex-row justify-between px-5 pt-5 pb-3"
              onPress={() => router.push('/profile/settings/editName')}
            >
              <Text className="font-semibold text-textBlack">Name</Text>
              <View className="flex-row gap-3">
                <Text className=" smallText">
                  {firstName} {lastName}
                </Text>
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
              <View className="flex-row gap-3">
                <Text className="smallText">{email}</Text>
                <ChevronRightIcon size={28} color="#000" />
              </View>
            </Pressable>
            <Pressable
              className="flex-row justify-between px-5 py-3"
              onPress={() =>
                router.push({
                  pathname: '/profile/settings/editPassword',
                  params: { email: email },
                })
              }
            >
              <Text className="font-semibold text-textBlack">Password</Text>
              <View className="flex-row gap-3">
                <Text className="smallText">*********</Text>
                <ChevronRightIcon size={28} color="#000" />
              </View>
            </Pressable>
          </View>

          <Pressable
            className="items-center mt-10 "
            onPress={() => setDeleteAccountModal(true)}
          >
            <Text className="p-2 text-lg font-extrabold text-white border-2 border-secondary bg-dangerBrightRed rounded-xl">
              Delete Account
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
