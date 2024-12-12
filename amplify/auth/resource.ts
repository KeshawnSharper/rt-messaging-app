import { defineAuth,secret } from '@aws-amplify/backend';
/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email:true,
    externalProviders: {
      google: {
        clientId: secret("73995472879-2cjhihknmvgu8dttrqjbeo5f9hrupf3o.apps.googleusercontent.com"),
        clientSecret: secret('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'),
        scopes: ['email'],
                
        attributeMapping: {
          email: 'email'
        }
      },
      callbackUrls: [
        'http://localhost:4200/profile',
        'https://mywebsite.com/profile'
      ],
      
      logoutUrls: ['http://localhost:4200/', 'https://mywebsite.com'],
    }

  },
  groups: ["ADMINS"],
    
});