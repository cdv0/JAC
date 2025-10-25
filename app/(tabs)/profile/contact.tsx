import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Contact() {
  const router = useRouter()
  return (
  <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <View className="justify-start flex-1">
        TEST
        </View>
    </SafeAreaView>
    )
}