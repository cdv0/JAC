import { signUp } from 'aws-amplify/auth'

export const registerHandler = async (
  name: string,
  email: string,
  password: string
) => {
  const { isSignUpComplete, userId, nextStep } = await signUp({
    username: email,
    password,
  })

  return { nextStep: nextStep.signUpStep, userId: userId }
}
