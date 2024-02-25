import {
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  LoginResponseDto,
  RegisterBodyDto,
} from 'src/authentication/dto/http.dto';
import { ErrorDto } from 'src/common/dto/error';
import { User } from 'src/domain/user/entity';
import { AuthenticationService } from './authentication.service';
import { LoginBodyValidatorGuard } from './guard/login-body-validator.guard';
import { GetRequestData } from 'src/common/annotation/get-request-data';
import { ValidateAccessToken } from 'src/common/annotation/validate-access-token';

@Controller('v1/auth')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logs user in' })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: ErrorDto,
  })
  @UseGuards(LoginBodyValidatorGuard, AuthGuard('local'))
  async login(@Request() request): Promise<LoginResponseDto> {
    return {
      access_token: await this.authenticationService.generateAccessToken(
        request.user,
      ),
    };
  }

  @Post('/register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registers a user' })
  @ApiOkResponse({
    description: 'User successfully registered',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: ErrorDto,
  })
  async register(@Body() body: RegisterBodyDto): Promise<void> {
    await this.authenticationService.register(body);
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logs user out' })
  @ApiNoContentResponse({ description: 'User successfully logged out' })
  @ValidateAccessToken()
  @HttpCode(204)
  async logout(@GetRequestData('user') user: User): Promise<void> {
    return this.authenticationService.logout(user);
  }
}
