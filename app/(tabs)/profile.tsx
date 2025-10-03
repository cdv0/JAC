import {
  loginHandler,
  registerHandler,
  verifyAccountHandler,
} from '@/_backend/auth'
import React, { JSX, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import NormalButton from '../components/NormalButton'

const profile = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [verifyCode, setVerifyCode] = useState<string>('')
  const [profileStatus, setProfileStatus] = useState<string>('User')

  const signupOnClick = async () => {
    const { nextStep, userId } = await registerHandler(name, email, password)

    if (nextStep === 'CONFIRM_SIGN_UP') {
      setProfileStatus('VerifyAccount')
    }
  }

  const verifyAccountClick = async () => {
    const result = await verifyAccountHandler(verifyCode, email)

    // handle success account
    if (result === 'success') {
      setName('')
      setEmail('')
      setPassword('')
      setVerifyCode('')
      setProfileStatus('SignIn')
    } else {
      // notify user about wrong code or other error
    }
  }

  const signinOnClick = async () => {
    const user = await loginHandler(email, password)

    //handle signing in change
    console.log('User: ', user)
    if (user.nextStep.signInStep === 'DONE') {
      console.log('Signed In')
      setProfileStatus('LoggedIn')
    }

    console.log('Profile Status: ', profileStatus)
  }

  let content: JSX.Element = <View />

  switch (profileStatus) {
    case 'SignUp':
      content = (
        <View>
          <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
            <Text className="font-bold text-textBlack">Name</Text>
            <TextInput
              onChangeText={setName}
              value={name}
              placeholder="Type here"
              className="p-3 bg-white border rounded-2xl text-textLightGray border-stroke"
            ></TextInput>
            <Text className="font-bold text-textBlack">Email</Text>
            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="Type here"
              className="p-3 bg-white border rounded-2xl text-textLightGray border-stroke"
            ></TextInput>
            <Text className="font-bold text-textBlack">Password</Text>
            <TextInput
              onChangeText={setPassword}
              value={password}
              placeholder="Type here"
              className="p-3 bg-white border rounded-2xl text-textLightGray border-stroke"
              secureTextEntry={true}
            ></TextInput>

            <View className="items-center">
              <NormalButton onClick={signupOnClick} text="Sign up" size="24" />
            </View>
          </View>
        </View>
      )
      break
    case 'VerifyAccount':
      content = (
        <View>
          <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
            <Text className="font-bold text-textBlack">
              Enter Verification Code
            </Text>
            <TextInput
              placeholder="Type here"
              className="p-3 bg-white border rounded-2xl text-textLightGray border-stroke"
              onChangeText={setVerifyCode}
              value={verifyCode}
            ></TextInput>
            <View className="items-center">
              <NormalButton
                onClick={verifyAccountClick}
                text="Submit"
                size="28"
              />
            </View>
          </View>
        </View>
      )
      break
    case 'SignIn':
      content = (
        <View>
          <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
            <Text className="font-bold text-textBlack">Email</Text>
            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="Type here"
              className="p-3 bg-white border rounded-2xl text-textLightGray border-stroke"
            ></TextInput>
            <Text className="font-bold text-textBlack">Password</Text>
            <TextInput
              onChangeText={setPassword}
              value={password}
              placeholder="Type here"
              className="p-3 bg-white border rounded-2xl text-textLightGray border-stroke"
              secureTextEntry={true}
            ></TextInput>
            <NormalButton onClick={signinOnClick} text="Log in" size="24" />
          </View>
        </View>
      )
      break
    case 'User':
      content = (
        <View>
          <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
            <Text className="underline text-dangerBrightRed">
              Signed In to the Account
            </Text>
          </View>
        </View>
      )
      break
    default:
      content = (
        <View>
          <Text>Empty View</Text>
        </View>
      )
      break
  }
  return <View>{content}</View>
}

export default profile
