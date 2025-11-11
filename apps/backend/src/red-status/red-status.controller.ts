import { Controller, Get } from '@nestjs/common';
import { RedStatusService } from './red-status.service';
import { RedStatusResponse } from '@food-store-calculator/shared';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RedStatusResponseDto } from './dto/red-status-response.dto';

@ApiTags('Red Status')
@Controller('red-status')
export class RedStatusController {
  constructor(private readonly redStatusService: RedStatusService) {}

  @Get()
  @ApiOperation({ summary: 'Check Red Set availability' })
  @ApiOkResponse({ type: RedStatusResponseDto })
  async getRedStatus(): Promise<RedStatusResponse> {
    return this.redStatusService.checkRedStatus();
  }
}
