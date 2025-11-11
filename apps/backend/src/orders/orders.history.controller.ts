import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrderHistoryResponseDto } from './dto/order-history-response.dto';
import { CalculateRequestDto } from './dto/calculate-request.dto';

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

  @Post()
  @ApiOperation({ summary: 'Confirm an order and persist it', operationId: 'createOrder' })
  @ApiCreatedResponse({ type: OrderHistoryResponseDto })
  async createOrder(@Body() request: CalculateRequestDto): Promise<OrderHistoryResponseDto> {
    return this.ordersService.placeOrder(request);
  }
}
