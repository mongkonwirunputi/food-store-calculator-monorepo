import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Product } from '@food-store-calculator/shared';
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List available products' })
  @ApiOkResponse({ type: ProductResponseDto, isArray: true })
  async getProducts(): Promise<Product[]> {
    return this.productsService.getProducts();
  }
}
