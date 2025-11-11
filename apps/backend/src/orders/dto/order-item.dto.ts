import { ApiProperty } from '@nestjs/swagger';
import { ProductId, OrderItem } from '@food-store-calculator/shared';
import { IsEnum, IsNumber, Min } from 'class-validator';

export class OrderItemDto implements OrderItem {
  @ApiProperty({ enum: ProductId })
  @IsEnum(ProductId)
  productId: ProductId;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
