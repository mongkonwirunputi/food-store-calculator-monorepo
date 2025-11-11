import { ProductId, Product, PRODUCTS } from '../types/product';
import { OrderItem, DiscountBreakdown } from '../types/order';

/**
 * Calculate pair discount (5%) for pairs of Orange, Pink, or Green
 */
export function calculatePairDiscount(items: OrderItem[]): number {
  const pairProducts = [ProductId.ORANGE, ProductId.PINK, ProductId.GREEN];
  let totalPairDiscount = 0;

  for (const productId of pairProducts) {
    const item = items.find((i) => i.productId === productId);
    if (item && item.quantity >= 2) {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (product) {
        const pairs = Math.floor(item.quantity / 2);
        const pairValue = pairs * product.price * 2;
        totalPairDiscount += pairValue * 0.05; // 5% discount
      }
    }
  }

  return totalPairDiscount;
}

/**
 * Calculate member discount (10%) on subtotal after pair discount
 */
export function calculateMemberDiscount(
  subtotal: number,
  pairDiscount: number,
  hasMemberCard: boolean
): number {
  if (!hasMemberCard) {
    return 0;
  }
  const amountAfterPairDiscount = subtotal - pairDiscount;
  return amountAfterPairDiscount * 0.1; // 10% discount
}

/**
 * Calculate subtotal from order items
 */
export function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce((total, item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    if (!product) return total;
    return total + product.price * item.quantity;
  }, 0);
}

/**
 * Calculate all discounts and total
 */
export function calculateDiscounts(
  items: OrderItem[],
  hasMemberCard: boolean
): {
  subtotal: number;
  discounts: DiscountBreakdown;
  total: number;
} {
  const subtotal = calculateSubtotal(items);
  const pairDiscount = calculatePairDiscount(items);
  const memberDiscount = calculateMemberDiscount(
    subtotal,
    pairDiscount,
    hasMemberCard
  );

  const discounts: DiscountBreakdown = {
    pairDiscount,
    memberDiscount,
    totalDiscount: pairDiscount + memberDiscount,
  };

  const total = subtotal - discounts.totalDiscount;

  return {
    subtotal,
    discounts,
    total: Math.max(0, total), // Ensure total is not negative
  };
}

