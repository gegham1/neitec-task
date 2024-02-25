import { Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { AuthenticationController } from 'src/authentication/authentication.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [DomainModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy],
})
export class AuthenticationModule {}
