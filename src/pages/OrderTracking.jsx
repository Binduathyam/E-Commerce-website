function OrderTracking({
  order,
  onBack,
}) {
  const currentStatus = "Confirmed";

  const steps = [
    {
      title: "Order Placed",
      description:
        "Your order has been placed successfully.",
      icon: "✓",
    },
    {
      title: "Confirmed",
      description:
        "Your order has been confirmed.",
      icon: "✓",
    },
    {
      title: "Shipped",
      description:
        "Your order will be shipped soon.",
      icon: "📦",
    },
    {
      title: "Out for Delivery",
      description:
        "Your order will be out for delivery soon.",
      icon: "🚚",
    },
    {
      title: "Delivered",
      description:
        "Your order will be delivered soon.",
      icon: "✓",
    },
  ];

  const currentIndex = steps.findIndex(
    (step) =>
      step.title === currentStatus
  );

  return (
    <section className="order-tracking-page">

      <div className="order-tracking-card">

        {/* HEADER */}

        <div className="tracking-header">

          <button
            type="button"
            className="tracking-back-button"
            onClick={onBack}
          >
            ←
          </button>

          <div>
            <p className="tracking-label">
              ORDER TRACKING
            </p>

            <h1>
              Track Your Order
            </h1>
          </div>

        </div>

        {/* ORDER SUMMARY */}

        <div className="tracking-summary">

          <div>
            <span>Order Status</span>

            <strong>
              {currentStatus}
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

        {/* TRACKING TIMELINE */}

        <div className="tracking-timeline">

          {steps.map(
            (step, index) => {

              const isCompleted =
                index <= currentIndex;

              return (
                <div
                  className={
                    isCompleted
                      ? "tracking-step completed"
                      : "tracking-step"
                  }
                  key={step.title}
                >

                  <div className="tracking-step-icon">
                    {isCompleted
                      ? "✓"
                      : step.icon}
                  </div>

                  <div className="tracking-step-content">

                    <h3>
                      {step.title}
                    </h3>

                    <p>
                      {step.description}
                    </p>

                  </div>

                  {index <
                    steps.length - 1 && (
                    <div
                      className={
                        index <
                        currentIndex
                          ? "tracking-line completed-line"
                          : "tracking-line"
                      }
                    />
                  )}

                </div>
              );
            }
          )}

        </div>

        {/* CONTINUE SHOPPING */}

        <button
          type="button"
          className="continue-shopping-button"
          onClick={onBack}
        >
          Continue Shopping
        </button>

      </div>

    </section>
  );
}

export default OrderTracking;