/* eslint-disable @typescript-eslint/no-var-requires */
import { ConfigModuleOptions } from '@nestjs/config';
import securityConfig from 'src/config/security.config';
import appConfiguration from 'src/config/app.config';
import databaseConfiguration from 'src/config/database.config';

export const composeConfigModuleOptions = (): ConfigModuleOptions => {
  const configModuleOptions: ConfigModuleOptions = {
    isGlobal: true,
    load: [appConfiguration, databaseConfiguration, securityConfig],
    cache: true,
  };

  return configModuleOptions;
};

export const dotEnvConfig = () => {
  return require('dotenv').config({ path: '.env' });
};
