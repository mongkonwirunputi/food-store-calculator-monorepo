import { ApiProperty } from '@nestjs/swagger';
import { CalculateResponse } from '@food-store-calculator/shared';
import { DiscountBreakdownDto } from './discount-breakdown.dto';

export class CalculateResponseDto implements CalculateResponse {
  @ApiProperty({ example: 150 })
  subtotal: number;

  @ApiProperty({ type: () => DiscountBreakdownDto })
  discounts: DiscountBreakdownDto;

  @ApiProperty({ example: 133 })
  total: number;
}
