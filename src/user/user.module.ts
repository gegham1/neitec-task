import { Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { UserService } from './user.service';

@Module({
  imports: [DomainModule],
  providers: [UserService],
})
export class UserModule {}
