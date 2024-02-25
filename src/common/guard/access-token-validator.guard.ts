import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { V2 as paseto } from 'paseto';
import { logger } from 'src/common/helpers/logger';
import {
  ForbiddenErrorCode,
  UnauthorizedErrorCode,
} from 'src/common/enum/error-code';
import { User } from 'src/domain/user/entity';
import { UserRepository } from 'src/domain/user/repository';
import { AccessTokenPayload } from 'src/authentication/types';

@Injectable()
export class AccessTokenValidatorGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers['authorization'] || '';

    const [, accessToken] = bearerToken.split('Bearer ');

    logger.info('Validating access token');

    if (!accessToken) {
      throw new ForbiddenException(
        'Access token is required for this request',
        ForbiddenErrorCode.TOKEN_IS_MISSING,
      );
    }

    const decryptedToken = await this.isValid(accessToken);
    const user = await this.userRepository.getOneById(decryptedToken.userId);
      
    if (!user) {
      throw new UnauthorizedException(
        'Please try again with valid access token',
        UnauthorizedErrorCode.INVALID_ACCESS_TOKEN,
      );
    }

    // compare access token key with stored key, this prevents two auth sessions
    if (user.accessTokenKey !== decryptedToken.key) {
      logger.info(
        { userId: user.id },
        "User access token's key does not match",
      );
      throw new UnauthorizedException(
        "Current session doesn't seem to be active",
        UnauthorizedErrorCode.OVERLAPPING_SESSION,
      );
    }

    logger.info({ userId: user.id }, 'User access token is valid');

    // injecting user, so it could be used later
    request.user = user;

    return true;
  }

  private async isValid(token: string): Promise<AccessTokenPayload> {
    try {
      // verifing access token using public key
      // expire also be verifyed using `exp` claim
      const decoded = await paseto.verify(
        token,
        this.configService.get<Buffer>('security.login.accessToken.publicKey'),
      );

      return decoded as unknown as AccessTokenPayload;
    } catch (e) {
      throw new UnauthorizedException(
        'Invalid access token',
        UnauthorizedErrorCode.INVALID_ACCESS_TOKEN,
      );
    }
  }
}
