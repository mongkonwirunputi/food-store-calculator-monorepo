import { useState, useEffect, useCallback } from 'react';
import type {
  Product,
  ProductId,
  OrderItem,
  CalculateResponse,
  OrderHistoryEntry,
  RedStatusResponse,
} from '@food-store-calculator/shared';
import { api } from './services/api';
import ProductList from './components/ProductList';
import MemberCardInput from './components/MemberCardInput';
import ResultSummary from './components/ResultSummary';
import RedStatusIndicator from './components/RedStatusIndicator';
import OrderHistory from './components/OrderHistory';
import './App.css';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [memberCard, setMemberCard] = useState<string>('');
  const [calculation, setCalculation] = useState<CalculateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryEntry[]>([]);
  const [redStatus, setRedStatus] = useState<RedStatusResponse | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await api.getProducts();
      setProducts(data);
      // Initialize order items with zero quantities
      setOrderItems(
        data.map((product) => ({
          productId: product.id,
          quantity: 0,
        }))
      );
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await api.getOrderHistory();
      setOrderHistory(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const loadRedStatus = useCallback(async () => {
    try {
      const data = await api.getRedStatus();
      setRedStatus(data);
    } catch (err) {
      console.error('Failed to load red status', err);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    loadRedStatus();
    const interval = setInterval(loadRedStatus, 30000);
    return () => clearInterval(interval);
  }, [loadRedStatus]);

  const handleQuantityChange = (productId: ProductId, quantity: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
    setCalculation(null);
    setSuccessMessage(null);
  };

  const handleCalculate = async () => {
    const items = orderItems.filter((item) => item.quantity > 0);
    if (items.length === 0) {
      setError('Please select at least one product');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await api.calculate({
        items,
        memberCard: memberCard || undefined,
      });
      setCalculation(result);
      await loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to calculate');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    const items = orderItems.filter((item) => item.quantity > 0);
    if (!calculation || items.length === 0) {
      setError('Please calculate your order before confirming');
      return;
    }

    setConfirming(true);
    setError(null);
    try {
      await api.createOrder({
        items,
        memberCard: memberCard || undefined,
      });
      setSuccessMessage('Order placed successfully!');
      setCalculation(null);
      setOrderItems((prev) =>
        prev.map((item) => ({
          ...item,
          quantity: 0,
        }))
      );
      await Promise.all([loadOrders(), loadRedStatus()]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setConfirming(false);
    }
  };

  const selectedItemsCount = orderItems.filter((item) => item.quantity > 0).length;
  const hasRedSetSelected = orderItems.some(
    (item) => item.productId === 'red' && item.quantity > 0
  );
  const redLocked = redStatus ? !redStatus.canOrder : false;
  const confirmDisabled =
    !calculation ||
    selectedItemsCount === 0 ||
    (redLocked && hasRedSetSelected);

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🧾 Food Store Calculator</h1>
          <p>Calculate your order with automatic discounts</p>
        </header>

        <RedStatusIndicator />

        <div className="content">
          <div className="left-panel">
            {productsLoading ? (
              <div className="loading-message">กำลังโหลดสินค้า...</div>
            ) : (
              <ProductList
                products={products}
                orderItems={orderItems}
                redStatus={redStatus}
                onQuantityChange={handleQuantityChange}
              />
            )}

            <MemberCardInput
              value={memberCard}
              onChange={setMemberCard}
            />

            <button
              className="calculate-button"
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate Total'}
            </button>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
          </div>

          <div className="right-panel">
            {calculation && (
              <ResultSummary
                calculation={calculation}
                onConfirm={handleConfirmOrder}
                confirming={confirming}
                disabled={confirmDisabled || confirming}
              />
            )}
            <OrderHistory orders={orderHistory} loading={ordersLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
