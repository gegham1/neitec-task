import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/common/database/database.module';
import { HealthcheckModule } from 'src/healthcheck/healthcheck.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { composeConfigModuleOptions } from './common/helpers/config';
import { TransactionModule } from './transaction/transaction.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  imports: [
    ConfigModule.forRoot(composeConfigModuleOptions()),
    DatabaseModule,
    HealthcheckModule,
    AuthenticationModule,
    TransactionModule,
    UserModule,
  ],
})
export class AppModule {}
