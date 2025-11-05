import NormalButton from '@/app/components/NormalButton'
import { useLocalSearchParams, useRouter } from 'expo-router'
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
  const router = useRouter()
  const { username } = useLocalSearchParams()

  const validateOldPassword = async () => {
    try {
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
            <NormalButton onClick={validateOldPassword} text="Save" />
          </View>
        </View>
      )}
      {index === 2 && (
        <View className="flex gap-4">
          <Text className="text-xl font-bold">Enter new password</Text>
          {/* <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                id="email"
                placeholder="Type here"
                className="px-4 py-3 bg-white border rounded-full smallTextGray border-stroke h-fit"
              />
            )}
          /> */}

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
