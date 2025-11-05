import { confirmResetPassword, resetPassword } from 'aws-amplify/auth'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, TextInput, View } from 'react-native'
import NormalButton from '../../components/NormalButton'

type ForgotPasswordForm = {
  email: string
  verifyCode: string
  password: string
}

const forgetPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordForm>({
    defaultValues: { email: '', verifyCode: '', password: '' },
  })
  const [forgetStage, setForgetStage] = useState<number>(1)
  const router = useRouter()

  const sendCode = async (data: ForgotPasswordForm) => {
    console.log('Data: ', data)
    try {
      const response = await resetPassword({ username: data.email })

      console.log(
        'Reset Response: ',
        response.nextStep.codeDeliveryDetails.destination
      )
      if (
        response.nextStep.resetPasswordStep !==
        'CONFIRM_RESET_PASSWORD_WITH_CODE'
      ) {
        setError('email', { type: 'validate', message: 'Invalid Email!' })
        return
      }
    } catch (error) {
      console.log('Error: ', error)
    }
    setForgetStage(2)
  }

  const verifyCode = async (data: ForgotPasswordForm) => {
    console.log('Data: ', data)
    try {
      const response = await confirmResetPassword({
        username: data.email,
        confirmationCode: data.verifyCode,
        newPassword: data.password,
      })

      console.log('Reset Response: ', response)

      setForgetStage(4)
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  if (forgetStage === 2)
    return (
      <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
        <Text className="smallTextBold">Enter verification code</Text>
        {errors.verifyCode && (
          <Text className="mx-2 dangerText">{errors.verifyCode.message}</Text>
        )}
        <Controller
          control={control}
          name="verifyCode"
          rules={{
            required: 'Verification Code is required',
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              id="verifyCode"
              placeholder="Type here"
              className="px-4 py-3 bg-white border rounded-full smallTextGray border-stroke h-fit"
            />
          )}
        />

        <View className="items-center">
          <NormalButton
            onClick={handleSubmit((data) => {
              console.log('Part 2 Data: ', data)
              setForgetStage(3)
            })}
            text="Submit"
          />
        </View>
      </View>
    )

  if (forgetStage === 3)
    return (
      <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
        <Text className="smallTextBold">Enter new password</Text>
        {errors.password && (
          <Text className="mx-2 dangerText">{errors.password.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
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
              id="password"
              placeholder="Type here"
              className="px-4 py-3 bg-white border rounded-full smallTextGray border-stroke h-fit"
              secureTextEntry
            />
          )}
        />

        <View className="items-center">
          <NormalButton
            onClick={handleSubmit((data) => verifyCode(data))}
            text="Submit"
          />
        </View>
      </View>
    )

  if (forgetStage === 4)
    return (
      <View className="flex flex-col items-start gap-4 mt-6 ml-6">
        <Text className="text-base font-bold text-textBlack">
          New password set
        </Text>
        <NormalButton text="Log in" onClick={() => router.push('/profile')} />
      </View>
    )

  return (
    <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
      <Text className="smallTextBold">Enter email address</Text>
      {errors.email && (
        <Text className="mx-2 dangerText">{errors.email.message}</Text>
      )}
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
