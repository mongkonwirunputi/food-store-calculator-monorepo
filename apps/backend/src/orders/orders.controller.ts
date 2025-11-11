import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CalculateRequest, CalculateResponse } from '@food-store-calculator/shared';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CalculateRequestDto } from './dto/calculate-request.dto';
import { CalculateResponseDto } from './dto/calculate-response.dto';

@ApiTags('Orders')
@Controller('calculate')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Calculate order total with discounts', operationId: 'calculateOrder' })
  @ApiBody({ type: CalculateRequestDto })
  @ApiOkResponse({ type: CalculateResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid order data or Red Set restriction violated',
  })
  async calculate(@Body() request: CalculateRequestDto): Promise<CalculateResponse> {
    return this.ordersService.calculate(request);
  }
}
