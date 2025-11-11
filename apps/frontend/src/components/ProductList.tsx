import { Product, ProductId, OrderItem } from '@food-store-calculator/shared';
import './ProductList.css';

interface ProductListProps {
  products: Product[];
  orderItems: OrderItem[];
  onQuantityChange: (productId: ProductId, quantity: number) => void;
}

export default function ProductList({
  products,
  orderItems,
  onQuantityChange,
}: ProductListProps) {
  const getQuantity = (productId: ProductId): number => {
    const item = orderItems.find((item) => item.productId === productId);
    return item?.quantity || 0;
  };

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="products-grid">
        {products.map((product) => {
          const quantity = getQuantity(product.id);
          return (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">฿{product.price.toFixed(2)}</p>
              </div>
              <div className="quantity-controls">
                <button
                  className="quantity-button"
                  onClick={() => onQuantityChange(product.id, Math.max(0, quantity - 1))}
                  disabled={quantity === 0}
                >
                  −
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="quantity-button"
                  onClick={() => onQuantityChange(product.id, quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

