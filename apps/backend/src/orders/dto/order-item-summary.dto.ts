import { ApiProperty } from '@nestjs/swagger';
import { OrderHistoryLineItem, ProductId } from '@food-store-calculator/shared';

export class OrderItemSummaryDto implements OrderHistoryLineItem {
  @ApiProperty({ enum: ProductId })
  productId: ProductId;

  @ApiProperty({ example: 'Red Set' })
  productName: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 50 })
  unitPrice: number;

  @ApiProperty({ example: 100 })
  lineTotal: number;
}
