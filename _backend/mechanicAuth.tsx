import {
  CognitoIdentityProvider,
  ConfirmSignUpCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const REGION = 'us-west-2'

const cognitoClient = new CognitoIdentityProvider({ region: REGION })

let mechanicSession: {
  accessToken?: string
  idToken?: string
  refreshToken?: string
  username?: string
} = {}

export async function mechanicSignUp(email: string, password: string) {
  const command = new SignUpCommand({
    ClientId: process.env.MECHANIC_CLIENT_ID,
    Username: email,
    Password: password,
  })

  const response = await cognitoClient.send(command)

  return response
}

export async function mechanicConfirmSignUp(email: string, code: string) {
  const command = new ConfirmSignUpCommand({
    ClientId: process.env.MECHANIC_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  })

  return cognitoClient.send(command)
}

export async function mechanicSignIn(email: string, password: string) {
  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.MECHANIC_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  })

  const response = await cognitoClient.send(command)

  const result = response.AuthenticationResult

  if (!result) return null

  mechanicSession = {
    accessToken: result.AccessToken,
    idToken: result.IdToken,
    refreshToken: result.RefreshToken,
    username: email,
  }

  return mechanicSession
}

export async function mechanicSignOut() {
  if (mechanicSession.accessToken) {
    try {
      await cognitoClient.send(
        new GlobalSignOutCommand({
          AccessToken: mechanicSession.accessToken,
        })
      )
    } catch (error) {
      console.log('Mechanic Sign Out Error: ', error)
    }
  }

  mechanicSession = {}
}
