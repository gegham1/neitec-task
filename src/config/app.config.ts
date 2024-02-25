import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT || 3000,
  env: process.env.APP_ENV,
  serviceName: process.env.SERVICE_NAME,
}));
