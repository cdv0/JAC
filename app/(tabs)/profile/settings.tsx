import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Settings() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <View className="justify-start flex-1">
        <View className="h-full px-2 pt-3">
          <View className="bg-white rounded-2xl">
            {/* Account */}
            <Pressable className="flex-row justify-between px-6 pt-3 pb-2 mt-2 ">
              <Text className="font-bold text-textBlack">Account</Text>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 2 24 24"
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
            </Pressable>

            {/* Contact US */}
            <Pressable className="flex-row justify-between px-6 pt-3 pb-2 mt-2 ">
              <Text className="font-bold text-textBlack">Contact us</Text>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 2 24 24"
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
            </Pressable>
          </View>

          {/* Sign out */}
          <Pressable
            className="flex-row justify-between px-6 pt-3 pb-2 mt-2 align-middle bg-white rounded-2xl"
            onPointerDown={async () => {
              try {
                await signOut()
                router.replace('/profile') // go to your public/profile route
              } catch (error) {
                console.error('Error signing out:', error)
              }
            }}
          >
            <Text className="font-extrabold align-middle text-dangerDarkRed">
              Sign out
            </Text>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 2 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              className="w-6 h-6 font-extrabold text-dangerDarkRed"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
