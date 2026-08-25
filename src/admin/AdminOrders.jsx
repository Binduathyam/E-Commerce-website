import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminOrders.css";

function AdminOrders({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/orders`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Admin orders error:", error);

      setError(
        error.message || "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "delivered") {
      return "order-status delivered";
    }

    if (value === "shipped") {
      return "order-status shipped";
    }

    if (value === "confirmed") {
      return "order-status confirmed";
    }

    if (
      value === "cancelled" ||
      value === "canceled"
    ) {
      return "order-status cancelled";
    }

    return "order-status placed";
  };

  const getPaymentClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "paid") {
      return "payment-status paid";
    }

    return "payment-status pending";
  };

  return (
    <section className="admin-orders-page">

      {/* HEADER */}

      <header className="admin-orders-header">

        <button
          type="button"
          className="admin-orders-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <p>ADMIN</p>

          <h1>
            Orders
          </h1>

          <span>
            Manage all customer orders
          </span>
        </div>

      </header>


      {/* CONTENT */}

      <main className="admin-orders-content">

        {/* SUMMARY */}

        <div className="admin-orders-summary">

          <div className="orders-summary-card">
            <div className="orders-summary-icon">
              🛒
            </div>

            <div>
              <p>Total Orders</p>
              <h2>{orders.length}</h2>
            </div>
          </div>


          <div className="orders-summary-card">
            <div className="orders-summary-icon">
              ⏳
            </div>

            <div>
              <p>Pending</p>

              <h2>
                {
                  orders.filter(
                    (order) =>
                      String(
                        order.order_status || ""
                      ).toLowerCase() === "placed"
                  ).length
                }
              </h2>
            </div>
          </div>


          <div className="orders-summary-card">
            <div className="orders-summary-icon">
              🚚
            </div>

            <div>
              <p>Shipped</p>

              <h2>
                {
                  orders.filter(
                    (order) =>
                      String(
                        order.order_status || ""
                      ).toLowerCase() === "shipped"
                  ).length
                }
              </h2>
            </div>
          </div>


          <div className="orders-summary-card">
            <div className="orders-summary-icon">
              ✓
            </div>

            <div>
              <p>Delivered</p>

              <h2>
                {
                  orders.filter(
                    (order) =>
                      String(
                        order.order_status || ""
                      ).toLowerCase() === "delivered"
                  ).length
                }
              </h2>
            </div>
          </div>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="admin-orders-message">
            Loading orders...
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="admin-orders-error">

            <h3>
              Unable to load orders
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={fetchOrders}
            >
              Try Again
            </button>

          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="admin-orders-message">
              No orders found.
            </div>
          )}


        {/* TABLE */}

        {!loading &&
          !error &&
          orders.length > 0 && (

            <div className="admin-orders-table-wrapper">

              <table className="admin-orders-table">

                <thead>

                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Date</th>
                  </tr>

                </thead>


                <tbody>

                  {orders.map((order) => (

                    <tr key={order.id}>

                      {/* ORDER */}

                      <td>
                        <strong>
                          #{order.id}
                        </strong>
                      </td>


                      {/* CUSTOMER */}

                      <td>

                        <div className="admin-order-customer">

                          <strong>
                            {order.customer_name ||
                              "Customer"}
                          </strong>

                          <small>
                            User #{order.user_id}
                          </small>

                        </div>

                      </td>


                      {/* PRODUCTS */}

                      <td>
                        <div className="admin-order-products">
                          {order.product_names ||
                            "Product"}
                        </div>
                      </td>


                      {/* QUANTITY */}

                      <td>
                        {Number(
                          order.total_quantity || 0
                        )}
                      </td>


                      {/* AMOUNT */}

                      <td>
                        <strong>
                          ₹
                          {Number(
                            order.total_amount || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </td>


                      {/* PAYMENT METHOD */}

                      <td>
                        {order.payment_method ||
                          "-"}
                      </td>


                      {/* PAYMENT STATUS */}

                      <td>

                        <span
                          className={getPaymentClass(
                            order.payment_status
                          )}
                        >
                          {order.payment_status ||
                            "Pending"}
                        </span>

                      </td>


                      {/* ORDER STATUS */}

                      <td>

                        <span
                          className={getStatusClass(
                            order.order_status
                          )}
                        >
                          {order.order_status ||
                            "Placed"}
                        </span>

                      </td>


                      {/* DATE */}

                      <td>
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

      </main>

    </section>
  );
}

export default AdminOrders;