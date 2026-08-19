import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";

function OrderHistory({
  loggedInUser,
  onBack,
  onViewDetails,
  onTrackOrder,
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!loggedInUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/orders/${loggedInUser.id}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch orders"
          );
        }

        setOrders(
          data.orders || []
        );
      } catch (err) {
        console.error(
          "Order history error:",
          err
        );

        setError(
          "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [loggedInUser]);

  return (
    <section className="orders-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="orders-header">

        <button
          type="button"
          className="orders-back-button"
          onClick={onBack}
        >
          ←
        </button>

        <div>
          <p className="orders-header-label">
            ACCOUNT
          </p>

          <h1>
            My Orders
          </h1>
        </div>

      </div>


      {/* =====================================
          LOADING
      ====================================== */}

      {loading && (
        <div className="orders-message">

          <div>

            <div className="orders-message-icon">
              📦
            </div>

            <h2>
              Loading your orders...
            </h2>

            <p>
              Please wait while we fetch
              your order history.
            </p>

          </div>

        </div>
      )}


      {/* =====================================
          ERROR
      ====================================== */}

      {!loading && error && (
        <div className="orders-message">

          <div>

            <div className="orders-message-icon">
              ⚠️
            </div>

            <h2>
              Something went wrong
            </h2>

            <p>
              {error}
            </p>

          </div>

        </div>
      )}


      {/* =====================================
          NO ORDERS
      ====================================== */}

      {!loading &&
        !error &&
        orders.length === 0 && (

          <div className="orders-empty">

            <div className="orders-empty-icon">
              📦
            </div>

            <h2>
              No orders yet
            </h2>

            <p>
              Your orders will appear here
              after you place your first order.
            </p>

            <button
              type="button"
              className="orders-empty-back"
              onClick={onBack}
            >
              Continue Shopping
            </button>

          </div>
        )}


      {/* =====================================
          ORDERS LIST
      ====================================== */}

      {!loading &&
        !error &&
        orders.length > 0 && (

          <div className="orders-list">

            {orders.map((order) => {

              const totalAmount =
                Number(
                  order.total_amount || 0
                );

              const paymentMethod =
                String(
                  order.payment_method ||
                    "cod"
                ).toLowerCase();

              const paymentText =
                paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : paymentMethod === "upi"
                  ? "UPI"
                  : "Credit / Debit Card";

              return (
                <div
                  className="order-card"
                  key={order.id}
                >

                  {/* =================================
                      ORDER BASIC INFO
                  ================================== */}

                  <div className="order-card-header">

                    <div>

                      <p className="order-card-label">
                        ORDER
                      </p>

                      <h2>
                        #{order.id}
                      </h2>

                      <p>
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleString(
                              "en-IN"
                            )
                          : "Date unavailable"}
                      </p>

                    </div>

                    <span className="order-status">
                      {order.order_status ||
                        "Placed"}
                    </span>

                  </div>


                  {/* =================================
                      ORDER SUMMARY
                  ================================== */}

                  <div className="order-card-details">

                    <div className="order-detail-row">

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


                    <div className="order-detail-row">

                      <span>
                        Payment
                      </span>

                      <strong>
                        {paymentText}
                      </strong>

                    </div>


                    <div className="order-detail-row">

                      <span>
                        Payment Status
                      </span>

                      <strong>
                        {order.payment_status ||
                          "Pending"}
                      </strong>

                    </div>

                  </div>


                  {/* =================================
                      DELIVERY ADDRESS
                  ================================== */}

                  <div className="order-address">

                    <h3>
                      📍 Delivery Address
                    </h3>

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

                    {(order.city ||
                      order.state ||
                      order.pincode) && (
                      <p>

                        {order.city || ""}

                        {order.state
                          ? `, ${order.state}`
                          : ""}

                        {order.pincode
                          ? ` - ${order.pincode}`
                          : ""}

                      </p>
                    )}

                  </div>


                  {/* =================================
                      ACTIONS
                  ================================== */}

                  <div className="order-card-actions">

                    <button
                      type="button"
                      className="order-view-details-button"
                      onClick={() => {

                        if (onViewDetails) {
                          onViewDetails(
                            order
                          );
                        }

                      }}
                    >
                      View Details
                      <span>
                        →
                      </span>
                    </button>


                    <button
                      type="button"
                      className="order-track-button-small"
                      onClick={() => {

                        if (onTrackOrder) {
                          onTrackOrder(
                            order
                          );
                        }

                      }}
                    >
                      🚚 Track Order
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

    </section>
  );
}

export default OrderHistory;