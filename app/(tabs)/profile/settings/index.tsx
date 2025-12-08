import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Settings() {
  const router = useRouter()

  return (
    // <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <View className="flex-1 justify-start">
        <View className="h-full px-4 pt-3">
          {/* First container */}
          <View className="bg-white rounded-xl">
            {/* Account */}
            <Pressable
              className="flex-row justify-between px-5 pt-5 pb-3"
              onPress={() => router.push('/profile/settings/account')}
            >
              <Text className="font-semibold text-textBlack">Account</Text>

              <ChevronRightIcon size={20} color="#000" />
            </Pressable>

            {/* Contact us */}
            <Pressable
              className="flex-row justify-between px-5 py-3"
              onPress={() => router.push('/profile/settings/contact')}
            >
              <Text className="font-semibold text-textBlack">Contact us</Text>
              <ChevronRightIcon size={20} color="#000" />
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
            <ChevronRightIcon size={20} color="#FF4D4D" />
          </Pressable>
        </View>
      </View>
    // </SafeAreaView>
  )
}
