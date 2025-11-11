import { ApiProperty } from '@nestjs/swagger';
import { DiscountBreakdown } from '@food-store-calculator/shared';

export class DiscountBreakdownDto implements DiscountBreakdown {
  @ApiProperty({ example: 5 })
  pairDiscount: number;

  @ApiProperty({ example: 12 })
  memberDiscount: number;

  @ApiProperty({ example: 17 })
  totalDiscount: number;
}
