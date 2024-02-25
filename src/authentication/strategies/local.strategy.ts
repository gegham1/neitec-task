import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../../authentication/authentication.service';
import { User } from 'src/domain/user/entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  validate(email: string, password: string): Promise<User> {
    return this.authenticationService.validateCredential(email, password);
  }
}
