import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";

function OrderHistory({ loggedInUser, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!loggedInUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/orders/${loggedInUser.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error("Order history error:", err);
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [loggedInUser]);

  return (
    <section className="orders-page">

      {/* HEADER */}
      <div className="orders-header">

        <button
          type="button"
          className="orders-back-button"
          onClick={onBack}
        >
          ←
        </button>

        <h1>My Orders</h1>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="orders-message">
          Loading your orders...
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="orders-message">
          {error}
        </div>
      )}

      {/* NO ORDERS */}
      {!loading &&
        !error &&
        orders.length === 0 && (
          <div className="orders-empty">

            <div className="orders-empty-icon">
              📦
            </div>

            <h2>No orders yet</h2>

            <p>
              Your completed orders will
              appear here.
            </p>

          </div>
        )}

      {/* ORDERS */}
      {!loading &&
        !error &&
        orders.length > 0 && (
          <div className="orders-list">

            {orders.map((order) => (
              <div
                className="order-card"
                key={order.id}
              >

                <div className="order-card-header">

                  <div>
                    <h2>
                      Order #{order.id}
                    </h2>

                    <p>
                      {new Date(
                        order.created_at
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <span className="order-status">
                    {order.order_status}
                  </span>

                </div>

                <div className="order-card-details">

                  <div className="order-detail-row">
                    <span>Total Amount</span>

                    <strong>
                      ₹
                      {Number(
                        order.total_amount
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="order-detail-row">
                    <span>Payment</span>

                    <strong>
                      {String(
                        order.payment_method
                      ).toUpperCase()}
                    </strong>
                  </div>

                  <div className="order-detail-row">
                    <span>Payment Status</span>

                    <strong>
                      {order.payment_status}
                    </strong>
                  </div>

                </div>

                {/* ADDRESS */}
                <div className="order-address">

                  <h3>Delivery Address</h3>

                  <p>
                    <strong>
                      {order.full_name}
                    </strong>
                  </p>

                  <p>
                    {order.phone}
                  </p>

                  <p>
                    {order.address_line}
                  </p>

                  <p>
                    {order.city},{" "}
                    {order.state} -{" "}
                    {order.pincode}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

    </section>
  );
}

export default OrderHistory;