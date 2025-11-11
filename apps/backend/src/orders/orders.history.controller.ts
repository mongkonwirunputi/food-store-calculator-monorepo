import { Controller, Get, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrderHistoryResponseDto } from './dto/order-history-response.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersHistoryController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List recent orders with items' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of orders to return',
    schema: { type: 'number', default: 20, minimum: 1, maximum: 100 },
  })
  @ApiOkResponse({ type: OrderHistoryResponseDto, isArray: true })
  async listOrders(@Query('limit') limit?: number): Promise<OrderHistoryResponseDto[]> {
    const sanitizedLimit = Number(limit);
    const resolvedLimit =
      Number.isFinite(sanitizedLimit) && sanitizedLimit > 0 ? Math.min(sanitizedLimit, 100) : 20;

    return this.ordersService.getOrderHistory(resolvedLimit);
  }
}
