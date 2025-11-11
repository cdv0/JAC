import NormalButton from '@/app/components/NormalButton'
import {
  CognitoIdentityProvider,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
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
    defaultValues: { oldPassword: '', newPassword: '', verifyCode: '' },
  })
  const [index, setIndex] = useState(1)
  const { email } = useLocalSearchParams()
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

  return (
    <View className="flex flex-col gap-4 mt-6 ml-10 mr-10 text-left">
      {index === 1 && (
        <View className="flex gap-4">
          <Text className="text-xl font-bold">Enter old password</Text>
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
                className="px-4 py-3 bg-white border rounded-full smallTextGray border-stroke h-fit"
              />
            )}
          />

          <View className="items-center">
            <NormalButton
              onClick={handleSubmit((data) => validateOldPassword(data))}
              text="Save"
            />
          </View>
        </View>
      )}
      {index === 2 && (
        <View className="flex gap-4">
          <Text className="text-xl font-bold">Enter new password</Text>
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
                className="px-4 py-3 bg-white border rounded-full smallTextGray border-stroke h-fit"
              />
            )}
          />

          <Text className="text-xl font-bold">Type new password again</Text>

          <View className="items-center">
            <NormalButton onClick={() => setIndex(3)} text="Save" />
          </View>
        </View>
      )}
      {index === 3 && (
        <View>
          <Text className="text-xl font-bold">New password set</Text>
        </View>
      )}
    </View>
  )
}
export default editPassword
