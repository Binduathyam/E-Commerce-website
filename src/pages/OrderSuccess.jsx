function OrderSuccess({
  order,
  onContinueShopping,
  onTrackOrder,
}) {
  return (
    <section className="order-success-page">

      <div className="order-success-card">

        {/* SUCCESS ICON */}

        <div className="success-icon">
          ✓
        </div>

        {/* TITLE */}

        <h1>
          Order Placed Successfully!
        </h1>

        <p className="success-message">
          Thank you for your order. Your
          order has been placed successfully.
        </p>

        {/* ORDER DETAILS */}

        <div className="order-success-details">

          <div>
            <span>Order Status</span>
            <strong>
              Confirmed
            </strong>
          </div>

          <div>
            <span>Payment Method</span>

            <strong>
              {order?.paymentMethod === "cod"
                ? "Cash on Delivery"
                : order?.paymentMethod === "upi"
                ? "UPI"
                : "Credit / Debit Card"}
            </strong>
          </div>

          <div>
            <span>Total Amount</span>

            <strong>
              ₹
              {order?.total
                ? order.total.toLocaleString(
                    "en-IN"
                  )
                : "0"}
            </strong>
          </div>

        </div>

        {/* TRACK ORDER */}

        <button
          type="button"
          className="track-order-button"
          onClick={onTrackOrder}
        >
          Track Order
        </button>

        {/* CONTINUE SHOPPING */}

        <button
          type="button"
          className="continue-shopping-button"
          onClick={onContinueShopping}
        >
          Continue Shopping
        </button>

      </div>

    </section>
  );
}

export default OrderSuccess;