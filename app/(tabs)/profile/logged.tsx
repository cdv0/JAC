import NormalButton from '@/app/components/NormalButton'
import { useRouter } from 'expo-router'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const account = () => {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <View className="flex-1 mx-5 mt-6">
        {/* Banner Section */}
        <View
          style={{
            position: 'relative',
            height: 200,
            backgroundColor: '#3A5779',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 28,
              fontWeight: 'bold',
              zIndex: 1,
            }}
          >
            todo: get profile from backend and make profile pic with their
            initial
          </Text>
        </View>

        <View className="flex-row justify-end mt-5">
          <NormalButton variant="primary" text="Filters"></NormalButton>
        </View>

        {/* Content Below Banner */}
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 16 }}>profile page content.</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default account
