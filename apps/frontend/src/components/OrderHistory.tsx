import { OrderHistoryEntry } from '@food-store-calculator/shared';
import './OrderHistory.css';

interface OrderHistoryProps {
  orders: OrderHistoryEntry[];
  loading: boolean;
}

export default function OrderHistory({ orders, loading }: OrderHistoryProps) {
  return (
    <div className="order-history">
      <h2>Order History</h2>
      {loading ? (
        <div className="order-history__empty">กำลังโหลดประวัติคำสั่งซื้อ...</div>
      ) : orders.length === 0 ? (
        <div className="order-history__empty">ยังไม่มีคำสั่งซื้อ</div>
      ) : (
        <div className="order-history__list">
          {orders.map(order => (
            <div
              key={order.id}
              className={`order-card${order.hasRedSet ? ' order-card--highlight' : ''}`}
            >
              <div className="order-card__header">
                <div>
                  <span className="order-card__id">Order #{order.id}</span>
                  <span className="order-card__timestamp">
                    {new Date(order.createdAt).toLocaleString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </div>
                <div className="order-card__total">฿{order.total.toFixed(2)}</div>
              </div>

              <div className="order-card__content">
                <ul>
                  {order.items.map(item => (
                    <li key={`${order.id}-${item.productId}-${item.quantity}`}>
                      <span className="order-card__product">
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="order-card__line-total">
                        ฿{item.lineTotal.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                {order.memberCard && (
                  <div className="order-card__member">สมาชิก: {order.memberCard}</div>
                )}
                {order.hasRedSet && (
                  <div className="order-card__badge">Red Set จำกัด 1 ชั่วโมง</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
