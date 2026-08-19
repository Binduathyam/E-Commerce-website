function OrderTracking({ order, onBack }) {
  // =========================================
  // DATABASE STATUS
  // =========================================

  const rawStatus = String(
    order?.order_status || "Placed"
  ).trim();

  const normalizedStatus =
    rawStatus.toLowerCase();

  // =========================================
  // CANCELLED ORDER
  // =========================================

  const isCancelled =
    normalizedStatus === "cancelled";

  // =========================================
  // STATUS → STEP INDEX
  // =========================================

  const statusMap = {
    placed: 0,
    confirmed: 1,
    shipped: 2,
    "out for delivery": 3,
    delivered: 4,
  };

  const currentIndex =
    statusMap[normalizedStatus] ?? 0;

  // =========================================
  // STEPS
  // =========================================

  const steps = [
    {
      title: "Order Placed",
      status: "Placed",
      description:
        "Your order has been placed successfully.",
      icon: "✓",
    },

    {
      title: "Confirmed",
      status: "Confirmed",
      description:
        "Your order has been confirmed.",
      icon: "✓",
    },

    {
      title: "Shipped",
      status: "Shipped",
      description:
        "Your order has been shipped.",
      icon: "📦",
    },

    {
      title: "Out for Delivery",
      status: "Out for Delivery",
      description:
        "Your order is out for delivery.",
      icon: "🚚",
    },

    {
      title: "Delivered",
      status: "Delivered",
      description:
        "Your order has been delivered successfully.",
      icon: "✓",
    },
  ];

  // =========================================
  // PAYMENT METHOD
  // =========================================

  const paymentMethod = String(
  order?.payment_method ||
    order?.paymentMethod ||
    "cod"
).toLowerCase();

let paymentText = "Cash on Delivery";

if (
  paymentMethod === "razorpay" ||
  paymentMethod === "online" ||
  paymentMethod === "card" ||
  paymentMethod === "credit" ||
  paymentMethod === "debit"
) {
  paymentText = "Credit / Debit Card";
}

if (
  paymentMethod === "upi"
) {
  paymentText = "UPI";
}

if (
  paymentMethod === "cash on delivery" ||
  paymentMethod === "cod"
) {
  paymentText = "Cash on Delivery";
}

  // =========================================
  // TOTAL AMOUNT
  // =========================================

  const totalAmount = Number(
    order?.total_amount ??
      order?.total ??
      0
  );

  // =========================================
  // DELIVERY ADDRESS EXISTS?
  // =========================================

  const hasAddress =
    order?.full_name ||
    order?.address_line ||
    order?.city;

  return (
    <section className="order-tracking-page">

      <div className="order-tracking-card">

        {/* =====================================
            HEADER
        ====================================== */}

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

            {order?.id && (
              <p className="tracking-order-number">
                Order #{order.id}
              </p>
            )}

          </div>

        </div>


        {/* =====================================
            CANCELLED ORDER
        ====================================== */}

        {isCancelled ? (

          <div className="tracking-cancelled">

            <div className="tracking-cancelled-icon">
              ✕
            </div>

            <div>

              <p className="tracking-cancelled-label">
                ORDER CANCELLED
              </p>

              <h2>
                This order has been cancelled
              </h2>

              <p>
                Your order was cancelled
                successfully and will not be
                delivered.
              </p>

            </div>

          </div>

        ) : (

          <>
            {/* =================================
                ORDER SUMMARY
            ================================== */}

            <div className="tracking-summary">

              <div>

                <span>
                  Order Status
                </span>

                <strong>
                  {rawStatus}
                </strong>

              </div>


              <div>

                <span>
                  Payment Method
                </span>

                <strong>
                  {paymentText}
                </strong>

              </div>


              <div>

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹
                  {totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>


            {/* =================================
                TRACKING TIMELINE
            ================================== */}

            <div className="tracking-timeline">

              {steps.map(
                (step, index) => {

                  const isCompleted =
                    index <= currentIndex;

                  const isCurrent =
                    index === currentIndex;

                  return (
                    <div
                      key={step.status}
                      className={
                        "tracking-step" +
                        (isCompleted
                          ? " completed"
                          : "") +
                        (isCurrent
                          ? " current-step"
                          : "")
                      }
                    >

                      {/* ICON */}

                      <div
                        className={
                          "tracking-step-icon" +
                          (isCompleted
                            ? " completed-icon"
                            : "")
                        }
                      >

                        {isCompleted
                          ? "✓"
                          : step.icon}

                      </div>


                      {/* CONTENT */}

                      <div className="tracking-step-content">

                        <h3>
                          {step.title}
                        </h3>

                        <p>
                          {isCurrent
                            ? step.description
                            : index <
                              currentIndex
                            ? "Completed"
                            : "Pending"}
                        </p>

                        {isCurrent && (
                          <span className="tracking-current-label">
                            CURRENT STATUS
                          </span>
                        )}

                      </div>


                      {/* LINE */}

                      {index <
                        steps.length - 1 && (
                        <div
                          className={
                            "tracking-line" +
                            (index <
                            currentIndex
                              ? " completed-line"
                              : "")
                          }
                        />
                      )}

                    </div>
                  );
                }
              )}

            </div>

          </>
        )}


        {/* =====================================
            DELIVERY ADDRESS
        ====================================== */}

        {hasAddress && (
          <div className="tracking-delivery">

            <h2>
              Delivery Address
            </h2>

            {order.full_name && (
              <p>
                <strong>
                  {order.full_name}
                </strong>
              </p>
            )}

            {order.phone && (
              <p>
                {order.phone}
              </p>
            )}

            {order.address_line && (
              <p>
                {order.address_line}
              </p>
            )}

            <p>

              {order.city || ""}

              {order.state
                ? `, ${order.state}`
                : ""}

              {order.pincode
                ? ` - ${order.pincode}`
                : ""}

            </p>

          </div>
        )}


        {/* =====================================
            ORDER INFORMATION
        ====================================== */}

        <div className="tracking-order-info">

          <div>

            <span>
              ORDER
            </span>

            <strong>
              #{order?.id || "—"}
            </strong>

          </div>


          <div>

            <span>
              PAYMENT
            </span>

            <strong>
              {paymentText}
            </strong>

          </div>


          <div>

            <span>
              TOTAL
            </span>

            <strong>
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>


        {/* =====================================
            BACK BUTTON
        ====================================== */}

        <button
          type="button"
          className="continue-shopping-button"
          onClick={onBack}
        >
          ← Back to My Orders
        </button>

      </div>

    </section>
  );
}

export default OrderTracking;