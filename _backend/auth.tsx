import {
  confirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signInWithRedirect,
  signOut,
  signUp,
} from 'aws-amplify/auth';

// --- GUARDS ---

export const isSignedIn = async (): Promise<boolean> => {
  try {
    const { tokens } = await fetchAuthSession();
    return !!tokens; 
  } catch {
    return false;
  }
};

export const guardNotSignedIn = async (): Promise<void> => {
  if (await isSignedIn()) {
    throw Object.assign(new Error('User already authenticated'), {
      name: 'UserAlreadyAuthenticatedException',
    });
  }
};

export const ensureSignedOut = async () => {
  try {
    await getCurrentUser(); 
    await signOut();        
  } catch {
  }
};

// --- HANDLERS ---
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

type providerTypes = 'Google'
export const handleGoogleSignIn = async (provider: providerTypes) => {
  try {
    await signInWithRedirect({ provider: provider })
  } catch (error) {
    console.error('Federated Sign-In Error: ', error)
  }
}
