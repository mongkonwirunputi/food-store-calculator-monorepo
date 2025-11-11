import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CalculateRequest,
  CalculateResponse,
  OrderItem as OrderItemPayload,
  calculateDiscounts,
  OrderHistoryEntry,
  OrderHistoryLineItem,
  ProductId,
  PRODUCTS,
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

  private readonly productLookup = new Map(
    PRODUCTS.map(product => [product.id, product])
  );

  async calculate(request: CalculateRequest): Promise<CalculateResponse> {
    const { items, memberCard } = request;

    await this.ensureRedSetAllowed(items);

    // Calculate discounts using shared logic
    const calculation = calculateDiscounts(items, !!memberCard);
    return {
      subtotal: calculation.subtotal,
      discounts: calculation.discounts,
      total: calculation.total,
    };
  }

  async placeOrder(request: CalculateRequest): Promise<OrderHistoryEntry> {
    const { items, memberCard } = request;
    await this.ensureRedSetAllowed(items);

    const calculation = calculateDiscounts(items, !!memberCard);

    const order = this.orderRepository.create({
      total: calculation.total,
      memberCard: memberCard || null,
    });
    const savedOrder = await this.orderRepository.save(order);

    const orderItems = items.map(item =>
      this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
      })
    );
    await this.orderItemRepository.save(orderItems);

    const hasRedSet = this.containsRedSet(items);
    if (hasRedSet) {
      await this.redStatusService.logRedOrder();
    }

    const savedOrderWithItems = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: { items: true },
    });

    return this.mapOrderToHistoryEntry(savedOrderWithItems ?? savedOrder);
  }

  async getOrderHistory(limit: number): Promise<OrderHistoryEntry[]> {
    const orders = await this.orderRepository.find({
      relations: { items: true },
      order: {
        created_at: 'DESC',
      },
      take: limit,
    });

    return orders.map(order => this.mapOrderToHistoryEntry(order));
  }

  private containsRedSet(items: OrderItemPayload[]): boolean {
    return items.some(item => item.productId === ProductId.RED && item.quantity > 0);
  }

  private async ensureRedSetAllowed(items: OrderItemPayload[]): Promise<void> {
    if (!this.containsRedSet(items)) {
      return;
    }

    const redStatus = await this.redStatusService.checkRedStatus();
    if (!redStatus.canOrder) {
      throw new BadRequestException({
        message: redStatus.message || 'Red Set can only be ordered once per hour',
        lastOrderedAt: redStatus.lastOrderedAt,
        nextAvailableAt: redStatus.nextAvailableAt,
      });
    }
  }

  private mapOrderToHistoryEntry(order: Order): OrderHistoryEntry {
    const items: OrderHistoryLineItem[] = (order.items ?? []).map(item => {
      const product = this.productLookup.get(item.productId as ProductId);
      const unitPrice = product?.price ?? 0;
      return {
        productId: item.productId as ProductId,
        productName: product?.name ?? item.productId,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    });

    const hasRedSet = items.some(item => item.productId === ProductId.RED && item.quantity > 0);

    return {
      id: order.id,
      total: Number(order.total),
      memberCard: order.memberCard,
      createdAt: order.created_at instanceof Date ? order.created_at.toISOString() : new Date(order.created_at).toISOString(),
      hasRedSet,
      items,
    };
  }
}
