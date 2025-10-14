import { defineAuth, secret } from '@aws-amplify/backend'

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('COGNITO_GOOGLE_CLIENTID'),
        clientSecret: secret('COGNITO_GOOGLE_SECRET'),
      },
      callbackUrls: [],
      logoutUrls: [],
    },
  },
})
