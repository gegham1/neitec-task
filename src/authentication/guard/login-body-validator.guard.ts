import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { BadRequestErrorCode } from 'src/common/enum/error-code';

@Injectable()
export class LoginBodyValidatorGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { password, email } = request.body;

    if (!password) {
      throw new BadRequestException(
        'Password is required',
        BadRequestErrorCode.API_VALIDATION,
      );
    }

    if (!email) {
      throw new BadRequestException(
        'Email is required',
        BadRequestErrorCode.API_VALIDATION,
      );
    }

    return true;
  }
}
