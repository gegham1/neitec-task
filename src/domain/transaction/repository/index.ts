import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { isFinite as _isFinite } from 'lodash';
import { PagedFilteredTransactionsParamDto } from 'src/transaction/dto/http.dto';
import { Transaction } from 'src/domain/transaction/entity';
import { NotFoundException } from '@nestjs/common';
import { NotFoundErrorCode } from 'src/common/enum/error-code';
export interface getPaginatedTransactionsResult {
  transactions: Transaction[];
  total: number;
}

export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
  ) {}

  async create(payload: Partial<Transaction>): Promise<Transaction> {
    return this.repository.save(this.repository.create(payload));
  }

  async getPaginatedTransactions(
    payload: PagedFilteredTransactionsParamDto,
  ): Promise<getPaginatedTransactionsResult> {
    const query = this.buildQueryTransaction(payload);
    const total = await query.getCount();

    query.limit(payload.limit || 50);
    query.offset(payload.offset || 0);

    const transactions = await query.getMany();

    return { transactions, total };
  }

  private buildQueryTransaction(
    payload: PagedFilteredTransactionsParamDto,
  ): SelectQueryBuilder<Transaction> {
    const query = this.repository.createQueryBuilder('transaction');

    if (payload.status) {
      query.andWhere('transaction.status IN (:...status)', {
        status: payload.status,
      });
    }

    return query.orderBy('transaction.createdAt', 'DESC');
  }

  async updateById(id: string, payload: DeepPartial<Transaction>) {
    await this.repository.update({ id }, payload);
  }

  async getOneByIdOrFail(id: string): Promise<Transaction> {
    const transaction = await this.repository.findOneBy({ id });

    if (!transaction) {
      throw new NotFoundException(
        'Please try again with valid transaction id',
        NotFoundErrorCode.TRANSACTION_NOT_FOUND,
      );
    }

    return transaction;
  }
}
