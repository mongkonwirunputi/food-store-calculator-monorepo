import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CalculateRequest,
  CalculateResponse,
  calculateDiscounts,
  ProductId,
} from '@food-store-calculator/shared';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { RedStatusService } from '../red-status/red-status.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private redStatusService: RedStatusService
  ) {}

  async calculate(request: CalculateRequest): Promise<CalculateResponse> {
    const { items, memberCard } = request;

    // Check if Red Set is in the order
    const hasRedSet = items.some(
      (item) => item.productId === ProductId.RED && item.quantity > 0
    );

    if (hasRedSet) {
      // Check if Red Set can be ordered
      const redStatus = await this.redStatusService.checkRedStatus();
      if (!redStatus.canOrder) {
        throw new BadRequestException({
          message: redStatus.message || 'Red Set can only be ordered once per hour',
          lastOrderedAt: redStatus.lastOrderedAt,
        });
      }
    }

    // Calculate discounts using shared logic
    const calculation = calculateDiscounts(items, !!memberCard);

    // Save order to database (optional, for history)
    const order = this.orderRepository.create({
      total: calculation.total,
      memberCard: memberCard || null,
    });
    const savedOrder = await this.orderRepository.save(order);

    // Save order items
    const orderItems = items.map((item) =>
      this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
      })
    );
    await this.orderItemRepository.save(orderItems);

    // Log Red Set order if present
    if (hasRedSet) {
      await this.redStatusService.logRedOrder();
    }

    return {
      subtotal: calculation.subtotal,
      discounts: calculation.discounts,
      total: calculation.total,
    };
  }
}

