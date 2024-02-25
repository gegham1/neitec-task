import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { V2 as paseto } from 'paseto';
import { logger } from 'src/common/helpers/logger';
import { UnauthorizedErrorCode } from 'src/common/enum/error-code';
import { User } from 'src/domain/user/entity';
import { UserRepository } from 'src/domain/user/repository';
import { AccessTokenPayload } from './types';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { RegisterBodyDto } from './dto/http.dto';

@Injectable()
export class AuthenticationService {
  private readonly Error = {
    EmailPasswordIsNotValidException: () =>
      new UnauthorizedException(
        'Email/password combination is invalid. Please try again or reset your password',
        UnauthorizedErrorCode.UNAUTHORIZED_USER,
      ),
  };

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async register(payload: RegisterBodyDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(
      payload.password,
      this.configService.get<number>('security.login.passwordSaltRound'),
    );

    await this.userRepository.create({ ...payload, password: hashedPassword });
  }

  async generateAccessToken(user: User) {
    logger.info({ userId: user.id }, 'Generate access token');

    const tokenExpiresAt = moment()
      .add(
        this.configService.get<number>(
          'security.login.accessToken.expireIn.amount',
        ),
        this.configService.get<moment.DurationInputArg2>(
          'security.login.accessToken.expireIn.unit',
        ),
      )
      .toISOString();

    const accessTokenKey = uuidv4();

    const tokenPayload: AccessTokenPayload = {
      exp: tokenExpiresAt,
      userId: user.id,
      key: accessTokenKey,
    };

    const accessToken = await paseto.sign(
      tokenPayload as unknown as Record<string, unknown>,
      this.configService.get<Buffer>('security.login.accessToken.privateKey'),
    );

    logger.info({ userId: user.id }, 'Saving access token key into database');

    await this.userRepository.updateById(user.id, {
      accessTokenKey,
    });

    return accessToken;
  }

  async validateCredential(email: string, password: string): Promise<any> {
    logger.info({ email }, 'Validating user credentials');
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw this.Error.EmailPasswordIsNotValidException();
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw this.Error.EmailPasswordIsNotValidException();
    }

    logger.info({ userId: user.id }, 'User credentials validation passed');

    return user;
  }

  async logout(user: User): Promise<void> {
    logger.info({ userId: user.id }, 'Logging user out');

    await this.userRepository.updateById(user.id, {
      accessTokenKey: null,
    });
  }
}
