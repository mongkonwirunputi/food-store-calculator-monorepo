import {
  calculateSubtotal,
  calculatePairDiscount,
  calculateMemberDiscount,
  calculateDiscounts,
} from './discount';
import { OrderItem } from '../types/order';
import { ProductId } from '../types/product';

describe('Discount Calculations', () => {
  describe('calculateSubtotal', () => {
    it('should calculate subtotal correctly', () => {
      const items: OrderItem[] = [
        { productId: ProductId.RED, quantity: 2 },
        { productId: ProductId.BLUE, quantity: 1 },
      ];
      const subtotal = calculateSubtotal(items);
      // Red: 50 * 2 = 100, Blue: 30 * 1 = 30, Total = 130
      expect(subtotal).toBe(130);
    });

    it('should return 0 for empty items', () => {
      const items: OrderItem[] = [];
      const subtotal = calculateSubtotal(items);
      expect(subtotal).toBe(0);
    });
  });

  describe('calculatePairDiscount', () => {
    it('should calculate pair discount for Orange sets', () => {
      const items: OrderItem[] = [{ productId: ProductId.ORANGE, quantity: 2 }];
      const discount = calculatePairDiscount(items);
      // Orange: 120 * 2 = 240, 5% = 12
      expect(discount).toBe(12);
    });

    it('should calculate pair discount for multiple pairs', () => {
      const items: OrderItem[] = [
        { productId: ProductId.ORANGE, quantity: 4 }, // 2 pairs
        { productId: ProductId.PINK, quantity: 2 }, // 1 pair
      ];
      const discount = calculatePairDiscount(items);
      // Orange: 120 * 4 = 480, 5% = 24
      // Pink: 80 * 2 = 160, 5% = 8
      // Total = 32
      expect(discount).toBe(32);
    });

    it('should not apply discount for non-pair products', () => {
      const items: OrderItem[] = [
        { productId: ProductId.RED, quantity: 2 },
        { productId: ProductId.BLUE, quantity: 2 },
      ];
      const discount = calculatePairDiscount(items);
      expect(discount).toBe(0);
    });
  });

  describe('calculateMemberDiscount', () => {
    it('should calculate 10% member discount', () => {
      const subtotal = 100;
      const pairDiscount = 10;
      const memberDiscount = calculateMemberDiscount(subtotal, pairDiscount, true);
      // (100 - 10) * 0.1 = 9
      expect(memberDiscount).toBe(9);
    });

    it('should return 0 when no member card', () => {
      const subtotal = 100;
      const pairDiscount = 10;
      const memberDiscount = calculateMemberDiscount(subtotal, pairDiscount, false);
      expect(memberDiscount).toBe(0);
    });
  });

  describe('calculateDiscounts', () => {
    it('should calculate all discounts correctly', () => {
      const items: OrderItem[] = [
        { productId: ProductId.ORANGE, quantity: 2 },
        { productId: ProductId.RED, quantity: 1 },
      ];
      const result = calculateDiscounts(items, true);

      expect(result.subtotal).toBe(290); // Orange: 240 + Red: 50
      expect(result.discounts.pairDiscount).toBe(12); // 5% of 240
      expect(result.discounts.memberDiscount).toBe(27.8); // 10% of 278
      expect(result.total).toBe(250.2);
    });

    it('should handle no discounts', () => {
      const items: OrderItem[] = [
        { productId: ProductId.RED, quantity: 1 },
      ];
      const result = calculateDiscounts(items, false);

      expect(result.subtotal).toBe(50);
      expect(result.discounts.pairDiscount).toBe(0);
      expect(result.discounts.memberDiscount).toBe(0);
      expect(result.total).toBe(50);
    });
  });
});

