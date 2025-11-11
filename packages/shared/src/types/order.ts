import { ProductId } from './product';

export interface OrderItem {
  productId: ProductId;
  quantity: number;
}

export interface CalculateRequest {
  items: OrderItem[];
  memberCard?: string;
}

export interface DiscountBreakdown {
  pairDiscount: number;
  memberDiscount: number;
  totalDiscount: number;
}

export interface CalculateResponse {
  subtotal: number;
  discounts: DiscountBreakdown;
  total: number;
}

export interface RedStatusResponse {
  canOrder: boolean;
  lastOrderedAt?: string;
  nextAvailableAt?: string;
  remainingTimeMs?: number;
  message?: string;
}
