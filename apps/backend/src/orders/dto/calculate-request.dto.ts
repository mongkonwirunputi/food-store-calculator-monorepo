import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsOptional, IsString } from 'class-validator';
import { CalculateRequest } from '@food-store-calculator/shared';
import { OrderItemDto } from './order-item.dto';

export class CalculateRequestDto implements CalculateRequest {
  @ApiProperty({ type: () => [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ required: false, example: 'MEMBER-123456' })
  @IsOptional()
  @IsString()
  memberCard?: string;
}
