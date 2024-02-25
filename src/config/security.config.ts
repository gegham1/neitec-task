import { registerAs } from '@nestjs/config';
import { DurationInputArg2 } from 'moment';

export default registerAs('security', () => ({
  admin: {
    email: process.env.ADMIN_USER_EMAIL,
    password: process.env.ADMIN_USER_PASSWORD,
    passwordSaltRound: +process.env.ADMIN_PASSWORD_SALT_ROUND,
  },
  login: {
    maxAttempts: 3,
    passwordSaltRound: +process.env.PASSWORD_SALT_ROUND,
    accessToken: {
      expireIn: {
        amount: 3,
        unit: 'hour' as DurationInputArg2,
      },
      /**
       * const keyStore = await paseto.generateKey('public', { format: 'paserk' });
       * console.log('keyStore', keyStore);
       */
      privateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
      publicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    },
  },
}));
