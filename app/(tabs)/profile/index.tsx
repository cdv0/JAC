import {
  handleGoogleSignIn,
  loginHandler,
  registerHandler,
  verifyAccountHandler,
} from '@/_backend/auth'
import NormalButton from '@/app/components/NormalButton'
import GoogleLogo from '@/public/assets/icons/google-logo.svg'
import AppLogo from '@/public/assets/images/group-name.svg'
import { getCurrentUser } from 'aws-amplify/auth'
import { useRouter } from 'expo-router'
import { JSX, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
    setError,
    clearErrors,
    reset,
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
      reset()
      setProfileStatus('SignIn')
    } else {
      // notify user about wrong code or other error
    }
  }

  const router = useRouter()

  const signinOnClick = async (data: FormData) => {
    if (data.email.trim() === '' || data.password.trim() === '') return

    clearErrors('root')

    const result = await loginHandler(data.email, data.password)

    if (result?.user) {
      if (result.user?.nextStep.signInStep === 'DONE') {
        //handle signing in change
        reset()
        router.push('/profile/logged')
      }
    }

    if (result?.code) {
      switch (result.code) {
        case 'UserNotFoundException':
          setError('email', {
            type: 'Cognito',
            message: 'Email is not registered!',
          })
          break
        case 'UserNotConfirmedException':
          setError('email', {
            type: 'validate',
            message: 'User Email Not Verified',
          })
          break
        case 'NotAuthorizedException':
          setError('email', {})
          setError('password', {})
          setError('root', {
            type: 'validate',
            message: 'Incorrect email or password',
          })
          break
        default:
          setError('root', {
            type: 'server',
            message: 'Please try again later',
          })
      }
    }
    reset()
  }

  let content: JSX.Element = <View />

  switch (profileStatus) {
    case 'SignUp':
      content = (
        <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
          <AppLogo width={300} height={75} className="self-center mb-10" />

          {/* SIGN UP: NAME INPUT */}
          <View className="gap-2">
            <Text className="smallTextBold">Name</Text>
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
                  className="px-4 py-3 bg-white border rounded-full smallTextGray border-stroke h-fit"
                />
              )}
            />
          </View>
          {errors.name && (
            <Text className="mx-2 dangerText">{errors.name.message}</Text>
          )}

          {/* SIGN UP: EMAIL INPUT */}
          <View className="gap-2">
            <Text className="smallTextBold">Email</Text>
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
                  className={`px-4 py-3 bg-white border rounded-full smallTextGray h-fit ${errors.email ? 'border-dangerBrightRed' : 'border-stroke'}`}
                />
              )}
            />
            {errors.email && (
              <Text className="mx-2 dangerText">{errors.email.message}</Text>
            )}
          </View>

          {/* SIGN UP: PASSWORD INPUT */}
          <View className="gap-2">
            <Text className="smallTextBold">Password</Text>
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
                  className={`px-4 py-3 bg-white border rounded-full smallTextGray h-fit ${errors.password ? 'border-dangerBrightRed' : 'border-stroke'}`}
                />
              )}
            />
            {errors.password && (
              <Text className="mx-2 dangerText">{errors.password.message}</Text>
            )}
          </View>

          <View className="items-center mt-5 mb-10">
            <NormalButton
              onClick={handleSubmit((data) => signupOnClick(data))}
              text="Sign up"
            />
          </View>

          {/* SIGN UP: Sign in navigation */}
          <View className="flex flex-row justify-center gap-1.5">
            <Text className="font-semibold text-textBlack">
              Already have an account?
            </Text>
            <Text
              onPress={() => {
                reset()
                setProfileStatus('SignIn')
              }}
              className="font-bold text-lightBlueText"
            >
              Sign in
            </Text>
          </View>
        </View>
      )
      break
    case 'VerifyAccount':
      content = (
        <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
          <Text className="smallTextBold">Enter Verification Code</Text>
          <TextInput
            placeholder="Type here"
            className="px-4 py-3 bg-white border rounded-full smallTextGray border-stroke h-fit"
            onChangeText={setVerifyCode}
            value={verifyCode}
            maxLength={6}
            keyboardType="numeric"
          ></TextInput>
          <View className="items-center">
            <NormalButton onClick={verifyAccountClick} text="Submit" />
          </View>
        </View>
      )
      break
    case 'SignIn':
      content = (
        <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left ">
          <AppLogo width={300} height={75} className="self-center mb-10" />

          {errors.root && (
            <Text className="mt-2 text-lg text-center dangerText">
              {errors.root.message}
            </Text>
          )}

          {/* SIGN IN: Email input */}
          <View className="gap-2">
            <Text className="smallTextBold">Email</Text>
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
                  onChangeText={(text) => {
                    onChange(text)
                    if (errors.email) clearErrors('email')
                  }}
                  value={value}
                  placeholder="Type here"
                  className={`px-4 py-3 bg-white border rounded-full smallTextGray h-fit ${errors.email ? 'border-dangerBrightRed' : 'border-stroke'}`}
                />
              )}
            />
            {errors.email && (
              <Text className="mx-2 dangerText">{errors.email.message}</Text>
            )}
          </View>

          {/* SIGN IN: Password input */}
          <View className="gap-2">
            <Text className="smallTextBold">Password</Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: 8,
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={(text) => {
                    onChange(text)
                    if (errors.password) clearErrors('password')
                  }}
                  value={value}
                  placeholder="Type here"
                  secureTextEntry
                  className={`px-4 py-3 bg-white border rounded-full smallTextGray h-fit ${errors.password ? 'border-dangerBrightRed' : 'border-stroke'}`}
                />
              )}
            />
            {errors.password && (
              <Text className="mx-2 dangerText">{errors.password.message}</Text>
            )}
          </View>

          {/* SIGN IN: Forgot password */}
          <Text className="flex mx-2 font-bold text-right text-lightBlueText">
            Forgot password?
          </Text>

          {/* SIGN IN: Log in button */}
          <View className="flex items-center justify-center mt-5">
            <NormalButton
              onClick={handleSubmit((data) => signinOnClick(data))}
              text="Log in"
              paddingHorizontal={20}
            />
          </View>

          {/* hr */}
          <View className="w-full h-px my-6 bg-stroke" />

          {/* SIGN IN: Sign in with Google */}
          <View className="relative flex-row items-center justify-center mb-10">
            <NormalButton
              text="Sign in with Google"
              variant="outline"
              onClick={() => handleGoogleSignIn('Google')}
              icon={<GoogleLogo width={20} height={20} />}
            />
          </View>

          {/* SIGN IN: Sign up navigation */}
          <View className="flex flex-row justify-center gap-1.5">
            <Text className="font-semibold text-textBlack">
              Don't have an account?
            </Text>
            <Text
              onPress={() => {
                reset()
                setProfileStatus('SignUp')
              }}
              className="font-bold text-lightBlueText"
            >
              Sign up
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

  useEffect(() => {
    const checkUser = async () => {
      try {
        await getCurrentUser()
        router.push('/profile/logged')
      } catch {}
    }
    checkUser()
  }, [])

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className="justify-center w-full h-full overflow-hidden bg-white"
    >
      <View>{content}</View>
    </SafeAreaView>
  )
}

export default profile
