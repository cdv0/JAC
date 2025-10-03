import { Amplify, ResourcesConfig } from 'aws-amplify'
import { Stack } from 'expo-router'
import './global.css'

// || Amplify Cognito & Backend Connection ||
const authConfig: ResourcesConfig['Auth'] = {
  Cognito: {
    userPoolId: 'us-west-2_Uejqr4LnW',
    userPoolClientId: '3r4dhpaqdrq1ap7lcih1lp9t62',
    identityPoolId: 'us-west-2:b8d8a775-c847-4198-85b0-d7000c2694ca',
    signUpVerificationMethod: 'link',
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
