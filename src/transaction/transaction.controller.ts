import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateTransactionResponseDto,
  UpdateTransactionBodyDto,
  GetTransactionResponseDto,
  PagedFilteredTransactionsParamDto,
} from './dto/http.dto';
import { GetRequestData } from 'src/common/annotation/get-request-data';
import { CreateTransactionBodyDto } from './dto/http.dto';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ErrorDto } from 'src/common/dto/error';
import { User } from 'src/domain/user/entity';
import { Roles } from 'src/common/annotation/roles.annotation';
import { UserRole } from 'src/domain/user/enums';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { ValidateAccessToken } from 'src/common/annotation/validate-access-token';

@Controller('v1/transactions')
@ApiTags('Transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get transactions',
  })
  @ApiBadRequestResponse({
    description: 'Some query param has invalid format',
    type: ErrorDto,
  })
  @ApiOkResponse({
    type: GetTransactionResponseDto,
    description: 'Transactions were returned successfully',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ValidateAccessToken()
  getTransactions(
    @Query() params: PagedFilteredTransactionsParamDto,
  ): Promise<GetTransactionResponseDto> {
    return this.transactionService.get(params);
  }

  @Post()
  @ApiOperation({
    summary: 'Create transaction',
  })
  @ApiCreatedResponse({
    type: CreateTransactionResponseDto,
    description: 'Transaction created successfully',
  })
  @ValidateAccessToken()
  create(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    payload: CreateTransactionBodyDto,
    @GetRequestData('user') user: User,
  ): Promise<CreateTransactionResponseDto> {
    return this.transactionService.create(payload, user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update transaction',
  })
  @ApiOkResponse({
    description: 'Transaction updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'If transaction status was provided, but cannot be applied',
    type: ErrorDto,
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ValidateAccessToken()
  update(
    @Param('id') id: string,
    @Body() payload: UpdateTransactionBodyDto,
  ): Promise<void> {
    return this.transactionService.update(id, payload);
  }
}
