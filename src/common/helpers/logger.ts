import { dotEnvConfig } from './config';
dotEnvConfig();

import Logger from 'pino';

const IS_LOCAL = process.env.APP_ENV === 'local';

export const logger = Logger({
  level: IS_LOCAL ? 'debug' : 'info',
  redact: [
    'req.headers["authorization"]',
    'headers["authorization"]',
    'headers.authorization',
    'request.headers.authorization',
    'password',
  ],
});
