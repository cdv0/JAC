import { resetPassword } from 'aws-amplify/auth'
import { Controller, useForm } from 'react-hook-form'
import { Text, TextInput, View } from 'react-native'
import NormalButton from '../../components/NormalButton'

type ForgotPasswordForm = { email: string }

const forgetPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    defaultValues: { email: '' },
  })

  const sendCode = async (data: ForgotPasswordForm) => {
    resetPassword({ username: data.email })
  }
  return (
    <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
      <Text className="smallTextBold">Enter email address</Text>
      <Controller
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
      />
      <View className="items-center">
        <NormalButton
          onClick={handleSubmit((data) => sendCode(data))}
          text="Submit"
        />
      </View>
    </View>
  )
}
export default forgetPassword
