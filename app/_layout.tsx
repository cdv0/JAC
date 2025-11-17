import { Amplify, ResourcesConfig } from 'aws-amplify'
import * as Linking from 'expo-linking'
import { Stack } from 'expo-router'
import '../global.css'

// || Amplify Cognito & Backend Connection ||
const redirectSignIn = Linking.createURL('profile/logged')
const redirectSignOut = Linking.createURL('profile')

console.log(redirectSignIn)
console.log(redirectSignOut)

const authConfig: ResourcesConfig['Auth'] = {
  Cognito: {
    userPoolId: 'us-west-1_n5PoqvBKe',
    userPoolClientId: '7vh2kml0k33akevf29gmnqod73',
    // identityPoolId: 'us-west-1:db1a864e-1308-405c-b084-cfadbf17eca5',
    signUpVerificationMethod: 'code',
    loginWith: {
      email: true,
      phone: false,
      oauth: {
        domain: 'us-west-1n5poqvbke.auth.us-west-1.amazoncognito.com',
        scopes: ['email', 'aws.cognito.signin.user.admin', 'openid', 'profile'],
        redirectSignIn: [
          'http://localhost:8081/profile/logged',
          'jac://profile/logged',
          'exp://10.39.76.156:8081/--/profile/logged',
        ],
        redirectSignOut: [
          'jac://profile',
          'http://localhost:8081/profile',
          'exp://10.39.76.156:8081/--/profile',
        ],
        responseType: 'code',
      },
    },
  },
}
Amplify.configure({ Auth: authConfig })

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen 
      name="(tabs)" 
      options={{ 
        headerShown: false 
      }} 
      />
    </Stack>
  )
}
