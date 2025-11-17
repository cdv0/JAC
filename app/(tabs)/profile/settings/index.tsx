import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Settings() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <View className="justify-start flex-1">
        <View className="h-full px-2 pt-3">
          {/* First container */}
          <View className="bg-white rounded-xl">
            {/* Account */}
            <Pressable
              className="flex-row justify-between px-5 pt-5 pb-3"
              onPress={() => router.push('/profile/settings/account')}
            >
              <Text className="font-semibold text-textBlack">Account</Text>
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
            </Pressable>

            {/* Contact us */}
            <Pressable
              className="flex-row justify-between px-5 py-3"
              onPress={() => router.push('/profile/settings/contact')}
            >
              <Text className="font-semibold text-textBlack">Contact us</Text>
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
            </Pressable>
          </View>

          {/* Sign out */}
          <Pressable
            className="flex-row justify-between px-5 pb-3 pt-4 mt-2.5 align-middle bg-white rounded-xl"
            onPress={async () => {
              try {
                await signOut({ global: false })
                router.replace('/profile') // go to your public/profile route
              } catch (error) {
                console.error('Error signing out:', error)
              }
            }}
            hitSlop={8}
          >
            <Text className="font-bold align-middle text-dangerBrightRed">
              Sign out
            </Text>

            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 2 28 28"
              stroke-width="2.5"
              stroke="currentColor"
              className="w-6 h-6 font-extrabold text-dangerBrightRed"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg> */}
            <ChevronRightIcon size={28} color="#FF4D4D" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
