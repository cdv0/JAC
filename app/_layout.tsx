import { Amplify, ResourcesConfig } from 'aws-amplify'
import { Stack } from 'expo-router'
import '../global.css'

// || Amplify Cognito & Backend Connection ||
const authConfig: ResourcesConfig['Auth'] = {
  Cognito: {
    userPoolId: 'us-west-1_n5PoqvBKe',
    userPoolClientId: '7vh2kml0k33akevf29gmnqod73',
    identityPoolId: 'us-west-1:db1a864e-1308-405c-b084-cfadbf17eca5',
    signUpVerificationMethod: 'code',
    loginWith: {
      email: true,
      phone: false,
    },
  },
}
Amplify.configure({ Auth: authConfig })

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}
