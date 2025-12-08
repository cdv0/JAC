import NormalButton from '@/app/components/NormalButton'
import {
  CognitoIdentityProvider,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, TextInput, View } from 'react-native'

type NewPasswordForm = {
  oldPassword: string
  newPassword: string
  verifyCode: string
}

const editPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<NewPasswordForm>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      verifyCode: '',
    },
  })
  const [index, setIndex] = useState(1)
  const { email } = useLocalSearchParams()
  const [showPass, setShowPass] = useState<boolean>(true)
  const region = 'us-west-1'
  const providerClient = new CognitoIdentityProvider({ region })

  const validateOldPassword = async (data: NewPasswordForm) => {
    try {
      const username = Array.isArray(email) ? email[0] : (email ?? '')
      const array = Array.isArray(email)
      console.log('username: ', username)
      console.log('Email: ', email)
      console.log(array)

      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: '7vh2kml0k33akevf29gmnqod73',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: data.oldPassword,
        },
      })

      const response = await providerClient.send(command)

      if (response.AuthenticationResult?.AccessToken) setIndex(2)
    } catch (error) {
      console.log('Validate Error: ', error)
    }
  }

  const sendCode = async (data: NewPasswordForm) => {
    try {
      const username = Array.isArray(email) ? email[0] : (email ?? '')
      const response = await resetPassword({ username: username })

      if (
        response.nextStep.resetPasswordStep !==
        'CONFIRM_RESET_PASSWORD_WITH_CODE'
      ) {
        return
      }
    } catch (error) {
      console.log('Error: ', error)
    }
    setIndex(3)
  }

  const verifyCode = async (data: NewPasswordForm) => {
    try {
      const username = Array.isArray(email) ? email[0] : (email ?? '')
      await confirmResetPassword({
        username: username,
        confirmationCode: data.verifyCode,
        newPassword: data.newPassword,
      })

      setIndex(4)
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  return (
    <View className="flex-1 bg-white rounded-xl px-4 py-5">
      {index === 1 && (
        <View className="gap-2.5">
          <Text className="font-semibold text-textBlack">Enter old password</Text>
          <Controller
            control={control}
            name="oldPassword"
            rules={{
              required: 'Password is required',
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                id="oldPassword"
                placeholder="Type here"
                secureTextEntry={showPass}
                className="mb-2 border rounded-full px-4 py-2 smallTextGray border-stroke"
              />
            )}
          />

          <View className="mt-3">
            <NormalButton
              onClick={handleSubmit((data) => validateOldPassword(data))}
              text="Save"
            />
          </View>
        </View>
      )}
      {index === 2 && (
        <View className="gap-2.5">
          <Text className="font-semibold text-textBlack">Enter new password</Text>
          <Controller
            control={control}
            name="newPassword"
            rules={{
              required: 'Password is required',
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  'Please enter password with at least 8 characters with 1 uppercase, 1 number, 1 special case',
              },
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                id="newPassword"
                placeholder="Type here"
                secureTextEntry={showPass}
                className="mb-2 border rounded-full px-4 py-2 smallTextGray border-stroke"
              />
            )}
          />

          <View className="mt-3">
            <NormalButton
              onClick={handleSubmit((data) => {
                sendCode(data)
              })}
              text="Save"
            />
          </View>
        </View>
      )}
      {index === 3 && (
        <View className="gap-2.5">
          <Text className="font-semibold text-textBlack">Enter code from email</Text>
          <Controller
            control={control}
            name="verifyCode"
            rules={{
              required: 'Verify code is required',
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                id="verifyCode"
                placeholder="Type here"
                className="mb-2 border rounded-full px-4 py-2 smallTextGray border-stroke"
              />
            )}
          />

          <View className="mt-3">
            <NormalButton
              onClick={handleSubmit((data) => {
                verifyCode(data)
              })}
              text="Save"
            />
          </View>
        </View>
      )}
      {index === 4 && (
        <View>
          <Text className="font-semibold text-textBlack">New password set</Text>
        </View>
      )}
    </View>
  )
}
export default editPassword
