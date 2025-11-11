import { ApiProperty } from '@nestjs/swagger';
import { Product, ProductId } from '@food-store-calculator/shared';

export class ProductResponseDto implements Product {
  @ApiProperty({ enum: ProductId, example: ProductId.RED })
  id: ProductId;

  @ApiProperty({ example: 'Red Set' })
  name: string;

  @ApiProperty({ example: 50 })
  price: number;
}
