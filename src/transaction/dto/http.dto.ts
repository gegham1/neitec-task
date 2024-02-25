import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Transaction } from 'src/domain/transaction/entity';
import { singleItemToArray } from 'src/common/helpers/utils';
import { Status as TransactionStatus } from 'src/domain/transaction/enum';

export class CreateTransactionBodyDto extends PickType(Transaction, [
  'amount',
]) {}

export class PagedFilteredTransactionsParamDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Limit of records to return',
    minimum: 1,
  })
  limit?: number = 10;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Offset of records to return',
  })
  offset?: number;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    enum: TransactionStatus,
    example: TransactionStatus.APPROVED,
    isArray: true,
  })
  @Transform(singleItemToArray())
  status?: TransactionStatus;
}

export class GetTransactionResponseDto {
  @IsArray()
  @ApiProperty({
    description: 'Transaction data',
  })
  'data': CreateTransactionResponseDto[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Total of transactions',
    example: '10',
  })
  'total': number;
}

export class CreateTransactionResponseDto extends PickType(Transaction, [
  'id',
  'amount',
  'status',
  'createdAt',
]) {
  constructor(transaction: Transaction) {
    super();

    this.id = transaction.id;
    this.amount = transaction.amount;
    this.status = transaction.status;
    this.createdAt = transaction.createdAt;
  }
}

export class UpdateTransactionBodyDto extends PickType(
  PartialType(Transaction),
  ['status'],
) {}

export class GetTransactionDataResponse extends PickType(Transaction, [
  'id',
  'createdAt',
  'updatedAt',
  'amount',
  'status',
]) {
  constructor(payload: Transaction) {
    super();

    this.id = payload.id;
    this.amount = payload.amount;
    this.status = payload.status;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }

  static async from(payload: Transaction): Promise<GetTransactionDataResponse> {
    return new GetTransactionDataResponse(payload);
  }
}
