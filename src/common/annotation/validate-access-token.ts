import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ErrorDto } from 'src/common/dto/error';
import { AccessTokenValidatorGuard } from '../guard/access-token-validator.guard';

export function ValidateAccessToken() {
  return applyDecorators(
    ApiHeader({
      name: 'authorization',
      description: 'Access token returned by login endpoint',
      required: true,
    }),
    ApiBadRequestResponse({
      type: ErrorDto,
      description: 'Access token should be specified',
    }),
    ApiNotFoundResponse({
      type: ErrorDto,
      description: 'User not found',
    }),
    UseGuards(AccessTokenValidatorGuard),
  );
}
