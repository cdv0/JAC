import NormalButton from '@/app/components/NormalButton'
import { Ionicons } from '@expo/vector-icons'
import { getCurrentUser } from "aws-amplify/auth"
import { useRouter } from 'expo-router'
import { useEffect, useState } from "react"
import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const account = () => {
  const router = useRouter()
  const [username, setUsername] = useState<string>("Your Account");

    useEffect(() => {
    (async () => {
      try {
        const { username } = await getCurrentUser();
        setUsername(username || "Your Account");
      } catch {
        // not signed in or error — keep placeholder
      }
    })();
  }, []);

  // initials from username
  const letters = username.match(/\b\w/g) || [];
  const cleaned = username.replace(/[^a-z0-9]/gi, "");
  const initials =
    (letters[0]?.toUpperCase() || cleaned[0]?.toUpperCase() || "U") +
    (letters[1]?.toUpperCase() || cleaned[1]?.toUpperCase() || "");
  
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
          <Pressable
            onPress={() => router.push('/profile/settings')}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: 8,
              borderRadius: 999,
            }}
            hitSlop={8}
          >
            <Ionicons name="settings" size={22} color="#fff" />
          </Pressable>
          <View
              style={{
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>{initials}</Text>
            </View>

            <Text style={{ color: "white", fontSize: 20, fontWeight: "600", marginTop: 10 }}>
              {username}
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
