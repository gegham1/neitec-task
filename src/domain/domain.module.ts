import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './user/entity';
import { UserRepository } from './user/repository';
import { Transaction } from './transaction/entity';
import { TransactionRepository } from './transaction/repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction])],
  providers: [ConfigService, UserRepository, TransactionRepository],
  exports: [UserRepository, TransactionRepository],
})
export class DomainModule {}
