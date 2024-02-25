import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/domain/user/repository';
import { logger } from 'src/common/helpers/logger';
import { UserRole } from 'src/domain/user/enums';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.createAdmin();
  }

  async createAdmin(): Promise<void> {
    logger.info('Creating admin user');

    const email = this.configService.get<string>('security.admin.email');

    const admin = await this.userRepository.getByEmail(email);

    if (admin) return;

    const password = await bcrypt.hash(
      this.configService.get<string>('security.admin.password'),
      this.configService.get<number>('security.admin.passwordSaltRound'),
    );

    await this.userRepository.create({ email, password, role: UserRole.ADMIN });
  }
}
