import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealtcheckDto } from './healthcheck.dto';

@ApiTags('Health Check')
@Controller('healthcheck')
export class HealthcheckController {
  @ApiOkResponse({
    description: 'Service is alive',
    type: HealtcheckDto,
  })
  @Get('liveness')
  getLiveness(): HealtcheckDto {
    return {
      status: 'OK',
    };
  }

  @ApiOkResponse({
    description: 'Service is ready to accept requests',
    type: HealtcheckDto,
  })
  @Get('readiness')
  getReadiness(): HealtcheckDto {
    return {
      status: 'OK',
    };
  }
}
