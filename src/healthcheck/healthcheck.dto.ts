import { ApiProperty } from '@nestjs/swagger';

export class HealtcheckDto {
  @ApiProperty({
    example: {
      status: 'OK',
    },
  })
  status: 'OK';
}
