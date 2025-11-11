import { CalculateResponse } from '@food-store-calculator/shared';
import './ResultSummary.css';

interface ResultSummaryProps {
  calculation: CalculateResponse;
}

export default function ResultSummary({ calculation }: ResultSummaryProps) {
  const { subtotal, discounts, total } = calculation;

  return (
    <div className="result-summary">
      <h2>Order Summary</h2>
      <div className="summary-content">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>฿{subtotal.toFixed(2)}</span>
        </div>

        {discounts.pairDiscount > 0 && (
          <div className="summary-row discount">
            <span>Pair Discount (5%)</span>
            <span>-฿{discounts.pairDiscount.toFixed(2)}</span>
          </div>
        )}

        {discounts.memberDiscount > 0 && (
          <div className="summary-row discount">
            <span>Member Discount (10%)</span>
            <span>-฿{discounts.memberDiscount.toFixed(2)}</span>
          </div>
        )}

        {discounts.totalDiscount > 0 && (
          <div className="summary-divider" />
        )}

        <div className="summary-row total">
          <span>Total</span>
          <span>฿{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

