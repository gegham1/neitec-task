import { Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [DomainModule],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
