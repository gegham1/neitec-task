import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/domain/user/enums';
import { logger } from 'src/common/helpers/logger';
import { ROLES_KEY } from '../annotation/roles.annotation';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    logger.info({ requiredRoles }, 'Validating user role');

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.includes(user.role);
  }
}
