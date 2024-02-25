import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/transaction/repository';
import {
  CreateTransactionBodyDto,
  CreateTransactionResponseDto,
  GetTransactionDataResponse,
  GetTransactionResponseDto,
  PagedFilteredTransactionsParamDto,
  UpdateTransactionBodyDto,
} from './dto/http.dto';
import * as _ from 'lodash';
import { logger } from 'src/common/helpers/logger';
import { Status } from 'src/domain/transaction/enum';
import { BadRequestErrorCode } from 'src/common/enum/error-code';
import { Transactional } from 'typeorm-transactional';
import { Transaction } from 'src/domain/transaction/entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  @Transactional()
  async create(
    payload: CreateTransactionBodyDto,
    userId: string,
  ): Promise<CreateTransactionResponseDto> {
    logger.info('Creating transaction');

    const transaction = await this.transactionRepository.create({
      ...payload,
      userId,
    });

    logger.info('Transaction has been created, recalculating balance');

    return new CreateTransactionResponseDto(transaction);
  }

  async get(
    payload: PagedFilteredTransactionsParamDto,
  ): Promise<GetTransactionResponseDto> {
    const { transactions, total } =
      await this.transactionRepository.getPaginatedTransactions(payload);

    const data: GetTransactionDataResponse[] = await Promise.all(
      transactions.map(GetTransactionDataResponse.from),
    );

    return {
      data,
      total,
    };
  }

  @Transactional()
  async update(
    transactionId: string,
    payload: UpdateTransactionBodyDto,
  ): Promise<void> {
    logger.info({ transactionId }, 'Updating transaction');

    const transaction = await this.transactionRepository.getOneByIdOrFail(
      transactionId,
    );

    this.validateTransactionStatus(transaction.status, payload.status);

    const updatePayload: DeepPartial<Transaction> = {
      status: payload.status,
    };

    logger.info('Updating transaction');

    await this.transactionRepository.updateById(transaction.id, updatePayload);
  }

  /**
   * Method that checks whether new status could be applied to transaction
   * @param currentStatus - current status of transaction
   * @param newStatus - target status to check and apply
   * @private
   * @throws {BadRequestException} - if new status cannot be applied
   */
  private validateTransactionStatus(currentStatus: Status, newStatus?: Status) {
    if (!newStatus || currentStatus === newStatus) {
      throw new BadRequestException(
        'Status should not be the same or empty',
        BadRequestErrorCode.INVALID_TRANSACTION_STATUS,
      );
    }

    if (currentStatus !== Status.PENDING) {
      throw new BadRequestException(
        'Cannot change a processed transaction',
        BadRequestErrorCode.INVALID_TRANSACTION_STATUS,
      );
    }
  }
}
