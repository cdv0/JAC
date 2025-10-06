import { confirmSignUp, signIn, signUp } from 'aws-amplify/auth'

export const registerHandler = async (
  name: string,
  email: string,
  password: string
) => {
  const { isSignUpComplete, userId, nextStep } = await signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        name: name,
      },
    },
  })

  return { nextStep: nextStep.signUpStep, userId: userId }
}

export const verifyAccountHandler = async (code: string, username: string) => {
  if (code.length !== 6) {
    return
  }

  try {
    const response = await confirmSignUp({
      username: username,
      confirmationCode: code,
    })

    console.log('Verify Response: ', response)

    return 'success'
  } catch (error) {
    console.log('Error: ', error)
    return 'error'
  }
}

export const loginHandler = async (email: string, password: string) => {
  try {
    const user = await signIn({ username: email, password })

    return user
  } catch (error) {
    console.log('Error: ', error)
    return null
  }
}
