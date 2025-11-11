import { ApiProperty } from '@nestjs/swagger';
import { OrderHistoryEntry } from '@food-store-calculator/shared';
import { OrderItemSummaryDto } from './order-item-summary.dto';

export class OrderHistoryResponseDto implements OrderHistoryEntry {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 150.5 })
  total: number;

  @ApiProperty({ example: '2025-01-01T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ required: false, example: 'MEMBER-123456' })
  memberCard?: string | null;

  @ApiProperty({ example: true })
  hasRedSet: boolean;

  @ApiProperty({ type: () => OrderItemSummaryDto, isArray: true })
  items: OrderItemSummaryDto[];
}
