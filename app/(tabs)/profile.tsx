import {
  loginHandler,
  registerHandler,
  verifyAccountHandler,
} from '@/_backend/auth'
import React, { JSX, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, TextInput, View } from 'react-native'
import NormalButton from '../components/NormalButton'

export interface FormData {
  name: string
  email: string
  password: string
}

const profile = () => {
  const [verifyCode, setVerifyCode] = useState<string>('')
  const [profileStatus, setProfileStatus] = useState<
    'SignIn' | 'SignUp' | 'User' | 'VerifyAccount'
  >('SignIn')
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<FormData>({
    defaultValues: { name: '', email: '', password: '' },
  })

  const signupOnClick = async (data: FormData) => {
    const { nextStep, userId } = await registerHandler(
      data.name,
      data.email,
      data.password
    )

    if (nextStep === 'CONFIRM_SIGN_UP') {
      setProfileStatus('VerifyAccount')
    }
  }

  const verifyAccountClick = async () => {
    const email: string = getValues('email')
    const result = await verifyAccountHandler(verifyCode, email)

    // handle success account
    if (result === 'success') {
      setVerifyCode('')
      setProfileStatus('SignIn')
    } else {
      // notify user about wrong code or other error
    }
  }

  const signinOnClick = async (data: FormData) => {
    if (data.email.trim() === '' || data.password.trim() === '') return

    const user = await loginHandler(data.email, data.password)

    if (user === null) console.log('error encountered logging in')

    //handle signing in change
    if (user?.nextStep.signInStep === 'DONE') {
      console.log('Signed In')
      setProfileStatus('User')
    }
  }

  let content: JSX.Element = <View />

  switch (profileStatus) {
    case 'SignUp':
      content = (
        <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
          {/* NAME INPUT */}
          <Text className="font-bold text-textBlack">Name</Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Name is required',
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="Type here"
                className="p-3 bg-white border rounded-2xl text-textLightGray border-stroke"
              />
            )}
          />

          {/* EMAIL INPUT */}
          <Text className="font-bold text-textBlack">Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Please enter a valid email',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="Type here"
                className={`p-3 bg-white border rounded-2xl text-textLightGray ${errors.email ? 'border-dangerBrightRed' : 'border-stroke'}`}
              />
            )}
          />
          {errors.email && (
            <Text className="text-sm text-dangerBrightRed">
              {errors.email.message}
            </Text>
          )}

          {/* PASSWORD INPUT */}
          <Text className="font-bold text-textBlack">Password</Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  'Please enter password at least 8 characters with 1 uppercase, 1 number, 1 special case',
              },
              minLength: 8,
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="Type here"
                secureTextEntry
                className={`p-3 bg-white border rounded-2xl text-textLightGray ${errors.password ? 'border-dangerBrightRed' : 'border-stroke'}`}
              />
            )}
          />
          {errors.password && (
            <Text className="text-sm text-dangerBrightRed">
              {errors.password.message}
            </Text>
          )}

          <View className="items-center">
            <NormalButton
              onClick={handleSubmit((data) => signupOnClick(data))}
              text="Sign up"
              size="5"
            />
          </View>
        </View>
      )
      break
    case 'VerifyAccount':
      content = (
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
      )
      break
    case 'SignIn':
      content = (
        <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
          <Text className="font-bold text-textBlack">Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Please enter a valid email',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="Type here"
                className={`p-3 bg-white border rounded-2xl text-textLightGray ${errors.email ? 'border-dangerBrightRed' : 'border-stroke'}`}
              />
            )}
          />
          {errors.email && (
            <Text className="text-sm text-dangerBrightRed">
              {errors.email.message}
            </Text>
          )}

          <Text className="font-bold text-textBlack">Password</Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: 8,
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="Type here"
                secureTextEntry
                className={`p-3 bg-white border rounded-2xl text-textLightGray ${errors.password ? 'border-dangerBrightRed' : 'border-stroke'}`}
              />
            )}
          />
          {errors.password && (
            <Text className="text-sm text-dangerBrightRed">
              {errors.password.message}
            </Text>
          )}

          <Text className="flex justify-end font-bold text-lightBlueText">
            Forgot password?
          </Text>

          <View className="flex items-center justify-center">
            <NormalButton
              onClick={handleSubmit((data) => signinOnClick(data))}
              text="Log in"
              size="5"
            />
          </View>

          <hr className="w-full h-4 border-t-2 stroke-stroke" />

          {/*TODO: Sign In With Google */}

          <View className="flex flex-row justify-center gap-2">
            <Text className="font-bold text-textBlack">
              Don't have an account?
            </Text>
            <Text
              onPress={() => setProfileStatus('SignUp')}
              className="font-bold text-lightBlueText"
            >
              Sign up
            </Text>
          </View>
        </View>
      )
      break
    case 'User':
      content = (
        <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
          <Text className="underline text-dangerBrightRed">
            Signed In to the Account
          </Text>
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
  return <View className="w-full overflow-hidden min-h-dvh">{content}</View>
}

export default profile
