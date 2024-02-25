import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterBodyDto {
  @ApiProperty({ description: 'User email', example: 'user@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginBodyDto {
  @ApiProperty({ description: 'User email', example: 'user@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Access token' })
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
