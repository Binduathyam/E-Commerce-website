import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";

function OrderDetails({
  order,
  onBack,
  onTrack,
  onCancel,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // ORDER STATUS
  // =========================================

  const [currentOrder, setCurrentOrder] =
    useState(order);

  const [cancelling, setCancelling] =
    useState(false);

  const [cancelMessage, setCancelMessage] =
    useState("");

  // =========================================
  // FETCH ORDER ITEMS
  // =========================================

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!currentOrder?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/orders/${currentOrder.id}/items`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch order items"
          );
        }

        setItems(data.items || []);
      } catch (err) {
        console.error(
          "Order details error:",
          err
        );

        setError(
          "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [currentOrder]);

  // =========================================
  // UPDATE WHEN ORDER PROP CHANGES
  // =========================================

  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  // =========================================
  // ORDER NOT FOUND
  // =========================================

  if (!currentOrder) {
    return (
      <section className="order-details-page">

        <div className="order-details-empty">

          <div className="order-details-empty-icon">
            📦
          </div>

          <h2>
            Order not found
          </h2>

          <p>
            We couldn't find this order.
          </p>

          <button
            type="button"
            onClick={onBack}
          >
            ← Back to My Orders
          </button>

        </div>

      </section>
    );
  }

  // =========================================
  // PAYMENT METHOD
  // =========================================

  const paymentMethod = String(
    currentOrder.payment_method ||
      currentOrder.paymentMethod ||
      "cod"
  ).toLowerCase();

  let paymentText =
    "Cash on Delivery";

  if (paymentMethod === "upi") {
    paymentText = "UPI";
  }

  if (
    paymentMethod === "card" ||
    paymentMethod === "credit" ||
    paymentMethod === "debit"
  ) {
    paymentText =
      "Credit / Debit Card";
  }

  // =========================================
  // TOTAL
  // =========================================

  const totalAmount = Number(
    currentOrder.total_amount ||
      currentOrder.total ||
      0
  );

  // =========================================
  // ORDER STATUS
  // =========================================

  const orderStatus =
    currentOrder.order_status ||
    "Placed";

  const normalizedStatus =
    String(orderStatus).toLowerCase();

  // =========================================
  // CANCEL ALLOWED?
  // =========================================

  const canCancel =
    normalizedStatus === "placed" ||
    normalizedStatus === "confirmed";

  // =========================================
  // CANCEL ORDER
  // =========================================

  const handleCancelOrder = async () => {
    if (!currentOrder?.id) {
      return;
    }

    if (!currentOrder?.user_id) {
      alert(
        "User information is missing."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setCancelMessage("");

      const response = await fetch(
        `${API_BASE_URL}/api/orders/${currentOrder.id}/cancel`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id:
              currentOrder.user_id,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to cancel order"
        );
      }

      // Update current page immediately
      setCurrentOrder((previous) => ({
        ...previous,

        order_status:
          data.order_status ||
          "Cancelled",
      }));

      setCancelMessage(
        "Order cancelled successfully."
      );

      // Notify App.jsx if callback exists
      if (onCancel) {
        onCancel({
          ...currentOrder,
          order_status:
            data.order_status ||
            "Cancelled",
        });
      }
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      setCancelMessage(
        error.message ||
          "Failed to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  // =========================================
  // STATUS CLASS
  // =========================================

  let statusClass =
    "order-status-badge";

  if (
    normalizedStatus ===
    "delivered"
  ) {
    statusClass +=
      " delivered";
  }

  if (
    normalizedStatus ===
    "cancelled"
  ) {
    statusClass +=
      " cancelled";
  }

  if (
    normalizedStatus ===
    "shipped"
  ) {
    statusClass +=
      " shipped";
  }

  return (
    <section className="order-details-page">

      {/* =====================================
          TOP HEADER
      ====================================== */}

      <header className="order-details-topbar">

        <button
          type="button"
          className="order-details-back"
          onClick={onBack}
        >
          ← My Orders
        </button>

        <div className="order-details-heading">

          <p>
            ORDER DETAILS
          </p>

          <h1>
            Order #{currentOrder.id}
          </h1>

        </div>

        <div className="order-details-topbar-right">

          <span className={statusClass}>
            {orderStatus}
          </span>

        </div>

      </header>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="order-details-content">

        {/* ===================================
            SUCCESS / ERROR MESSAGE
        ==================================== */}

        {cancelMessage && (
          <div
            className={
              normalizedStatus ===
              "cancelled"
                ? "order-cancel-success"
                : "order-cancel-error"
            }
          >
            {normalizedStatus ===
            "cancelled"
              ? "✓ "
              : "⚠️ "}

            {cancelMessage}
          </div>
        )}


        {/* ===================================
            ORDER META
        ==================================== */}

        <div className="order-details-meta">

          <div>

            <span>
              ORDER NUMBER
            </span>

            <strong>
              #{currentOrder.id}
            </strong>

          </div>


          <div>

            <span>
              ORDER DATE
            </span>

            <strong>
              {currentOrder.created_at
                ? new Date(
                    currentOrder.created_at
                  ).toLocaleString(
                    "en-IN"
                  )
                : "—"}
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


        {/* ===================================
            ORDERED ITEMS
        ==================================== */}

        <div className="order-details-products-section">

          <div className="order-details-section-title">

            <div>

              <p>
                YOUR PURCHASE
              </p>

              <h2>
                Ordered Items
              </h2>

            </div>

            <span>
              {items.length}{" "}
              {items.length === 1
                ? "item"
                : "items"}
            </span>

          </div>


          {/* LOADING */}

          {loading && (
            <div className="order-details-state">

              <div>
                📦
              </div>

              <p>
                Loading your order...
              </p>

            </div>
          )}


          {/* ERROR */}

          {!loading &&
            error && (
              <div className="order-details-state error">

                <div>
                  ⚠️
                </div>

                <p>
                  {error}
                </p>

              </div>
            )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            items.length === 0 && (
              <div className="order-details-state">

                <div>
                  📦
                </div>

                <p>
                  No items found for
                  this order.
                </p>

              </div>
            )}


          {/* ITEMS */}

          {!loading &&
            !error &&
            items.length > 0 && (

              <div className="order-details-items">

                {items.map((item) => {

                  const price =
                    Number(
                      item.price || 0
                    );

                  const quantity =
                    Number(
                      item.quantity || 0
                    );

                  const itemTotal =
                    price * quantity;

                  return (
                    <div
                      className="order-details-product-row"
                      key={item.id}
                    >

                      {/* PRODUCT IMAGE */}

                      <div className="order-details-product-image">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={
                              item.name ||
                              "Product"
                            }
                          />
                        ) : (
                          <span>
                            🛍️
                          </span>
                        )}

                      </div>


                      {/* PRODUCT INFO */}

                      <div className="order-details-product-info">

                        <p>
                          {item.category ||
                            "PRODUCT"}
                        </p>

                        <h3>
                          {item.name ||
                            "Product"}
                        </h3>

                        <span>
                          Quantity{" "}
                          <strong>
                            {quantity}
                          </strong>
                        </span>

                      </div>


                      {/* UNIT PRICE */}

                      <div className="order-details-unit-price">

                        <span>
                          Price
                        </span>

                        <strong>
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>


                      {/* TOTAL */}

                      <div className="order-details-product-total">

                        <span>
                          Total
                        </span>

                        <strong>
                          ₹
                          {itemTotal.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </div>


        {/* ===================================
            DELIVERY + PAYMENT
        ==================================== */}

        <div className="order-details-lower">


          {/* DELIVERY ADDRESS */}

          <div className="order-details-info-section">

            <div className="order-details-info-title">

              <span>
                📍
              </span>

              <div>

                <p>
                  DELIVERY
                </p>

                <h2>
                  Delivery Address
                </h2>

              </div>

            </div>


            <div className="order-details-address">

              {currentOrder.full_name && (
                <strong>
                  {currentOrder.full_name}
                </strong>
              )}

              {currentOrder.phone && (
                <p>
                  {currentOrder.phone}
                </p>
              )}

              {currentOrder.address_line && (
                <p>
                  {currentOrder.address_line}
                </p>
              )}

              {(currentOrder.city ||
                currentOrder.state ||
                currentOrder.pincode) && (
                <p>

                  {currentOrder.city ||
                    ""}

                  {currentOrder.state
                    ? `, ${currentOrder.state}`
                    : ""}

                  {currentOrder.pincode
                    ? ` - ${currentOrder.pincode}`
                    : ""}

                </p>
              )}

            </div>

          </div>


          {/* PAYMENT DETAILS */}

          <div className="order-details-info-section">

            <div className="order-details-info-title">

              <span>
                💳
              </span>

              <div>

                <p>
                  PAYMENT
                </p>

                <h2>
                  Payment Details
                </h2>

              </div>

            </div>


            <div className="order-details-payment">

              <div>

                <span>
                  Method
                </span>

                <strong>
                  {paymentText}
                </strong>

              </div>


              <div>

                <span>
                  Status
                </span>

                <strong>
                  {currentOrder.payment_status ||
                    "Pending"}
                </strong>

              </div>


              <div className="payment-total">

                <span>
                  Order Total
                </span>

                <strong>
                  ₹
                  {totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================
            BOTTOM ACTIONS
        ==================================== */}

        <div className="order-details-bottom">

          <div>

            <p>
              Order #{currentOrder.id}
            </p>

            <span>
              {normalizedStatus ===
              "cancelled"
                ? "This order has been cancelled."
                : "Need help with this order? Track your delivery or cancel the order if eligible."}
            </span>

          </div>


          <div className="order-details-buttons">

            {/* TRACK ORDER */}

            {normalizedStatus !==
              "cancelled" && (
              <button
                type="button"
                className="order-details-track-button"
                onClick={() => {
                  if (onTrack) {
                    onTrack(
                      currentOrder
                    );
                  }
                }}
              >
                🚚 Track Order
              </button>
            )}


            {/* CANCEL ORDER */}

            {canCancel &&
              !cancelling && (
                <button
                  type="button"
                  className="order-details-cancel-button"
                  onClick={
                    handleCancelOrder
                  }
                >
                  Cancel Order
                </button>
              )}


            {/* CANCELLING */}

            {canCancel &&
              cancelling && (
                <button
                  type="button"
                  className="order-details-cancel-button"
                  disabled
                >
                  Cancelling...
                </button>
              )}

          </div>

        </div>

      </div>

    </section>
  );
}

export default OrderDetails;