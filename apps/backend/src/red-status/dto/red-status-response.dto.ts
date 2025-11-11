import { ApiProperty } from '@nestjs/swagger';
import { RedStatusResponse } from '@food-store-calculator/shared';

export class RedStatusResponseDto implements RedStatusResponse {
  @ApiProperty({ example: true })
  canOrder: boolean;

  @ApiProperty({ required: false, example: '2025-01-01T12:00:00.000Z' })
  lastOrderedAt?: string;

  @ApiProperty({ required: false, example: 'Red Set is available to order' })
  message?: string;
}
