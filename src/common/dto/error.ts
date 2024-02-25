import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ErrorCode, ErrorCodeValues } from '../enum/error-code';

export class ErrorDto {
  @ApiProperty({ enum: Object.values(ErrorCodeValues) })
  @IsNotEmpty()
  @IsEnum(Object.values(ErrorCodeValues))
  error_code: ErrorCode;

  @ApiProperty({ example: 'Error explanation here' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
