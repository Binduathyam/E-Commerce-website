import React, {
  useEffect,
  useState,
} from "react";

import {
  API_BASE_URL,
} from "../api";

import "./MerchantOrders.css";

function MerchantOrders({
  merchant,
  onBack,
}) {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingOrder, setUpdatingOrder] =
    useState(null);

  // =====================================================
  // GET AUTH TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("merchant_token");
  };

  // =====================================================
  // FETCH MERCHANT ORDERS
  // =====================================================

  const fetchOrders = async () => {
    if (!merchant?.id) {
      setError("Merchant information is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/orders/merchant/${merchant.id}`,
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

            "x-user-id":
              merchant.id,
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "Merchant orders response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to fetch merchant orders"
        );
      }

      setOrders(
        data.orders || []
      );

    } catch (error) {

      console.error(
        "Merchant orders error:",
        error
      );

      setError(
        error.message ||
          "Unable to load orders"
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    if (merchant?.id) {
      fetchOrders();
    } else {
      setLoading(false);
    }

  }, [merchant?.id]);


  // =====================================================
  // UPDATE ORDER STATUS + CREATE SHIPMENT
  // =====================================================

  
const handleStatusChange = async (orderId, newStatus) => {
  try {
    setUpdatingOrder(orderId);

    const token = getToken();

    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-user-id": String(merchant.id),
    };

    // STEP 1: Create shipment before marking order as shipped
    if (newStatus === "Shipped") {
      const shipmentResponse = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/ready-for-pickup`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({}),
        }
      );

      const shipmentData = await shipmentResponse.json();

      if (!shipmentResponse.ok || !shipmentData.success) {
        throw new Error(
          shipmentData.message || "Shipment creation failed."
        );
      }

      alert(
        `Shipment created successfully!\nTracking Number: ${shipmentData.shipment.tracking_number}`
      );
    }

    // STEP 2: Update order status
    const statusResponse = await fetch(
      `${API_BASE_URL}/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          order_status: newStatus,
        }),
      }
    );

    const statusData = await statusResponse.json();

    if (!statusResponse.ok || !statusData.success) {
      throw new Error(
        statusData.message || "Failed to update order status"
      );
    }

    // STEP 3: Update UI
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? { ...order, order_status: newStatus }
          : order
      )
    );

  } catch (error) {
    console.error("Order status update error:", error);
    alert(error.message);
  } finally {
    setUpdatingOrder(null);
  }
};

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status
  ) => {

    switch (
      String(
        status || ""
      ).toLowerCase()
    ) {

      case "placed":
        return "merchant-order-status-placed";

      case "confirmed":
        return "merchant-order-status-confirmed";

      case "shipped":
        return "merchant-order-status-shipped";

      case "delivered":
        return "merchant-order-status-delivered";

      case "cancelled":
        return "merchant-order-status-cancelled";

      default:
        return "merchant-order-status-placed";
    }
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "N/A";
    }

    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        dateStyle:
          "medium",

        timeStyle:
          "short",
      }
    );
  };

  // =====================================================
  // ORDER COUNTS
  // =====================================================

  const totalOrders =
    orders.length;

  const placedOrders =
    orders.filter(
      (order) =>
        String(
          order.order_status
        ).toLowerCase() ===
        "placed"
    ).length;

  const confirmedOrders =
    orders.filter(
      (order) =>
        String(
          order.order_status
        ).toLowerCase() ===
        "confirmed"
    ).length;

  const shippedOrders =
    orders.filter(
      (order) =>
        String(
          order.order_status
        ).toLowerCase() ===
        "shipped"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        String(
          order.order_status
        ).toLowerCase() ===
        "delivered"
    ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <section className="merchant-orders-page">

        <div className="merchant-orders-loading">

          Loading orders...

        </div>

      </section>

    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <section className="merchant-orders-page">

        <div className="merchant-orders-error">

          <div className="merchant-orders-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Orders
          </h2>

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

      </section>

    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (

    <section className="merchant-orders-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="merchant-orders-header">

        <div className="merchant-orders-heading">

          <button
            type="button"
            className="merchant-orders-back"
            onClick={onBack}
          >
            ←
          </button>

          <div>

            <p>
              MERCHANT
            </p>

            <h1>
              Orders
            </h1>

            <span>
              Manage customer orders
            </span>

          </div>

        </div>

        <button
          type="button"
          className="merchant-orders-refresh"
          onClick={fetchOrders}
        >
          ↻ Refresh
        </button>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="merchant-orders-summary">

        <div className="merchant-order-summary-card">

          <span>
            Total Orders
          </span>

          <strong>
            {totalOrders}
          </strong>

        </div>


        <div className="merchant-order-summary-card">

          <span>
            Placed
          </span>

          <strong>
            {placedOrders}
          </strong>

        </div>


        <div className="merchant-order-summary-card">

          <span>
            Confirmed
          </span>

          <strong>
            {confirmedOrders}
          </strong>

        </div>


        <div className="merchant-order-summary-card">

          <span>
            Shipped
          </span>

          <strong>
            {shippedOrders}
          </strong>

        </div>


        <div className="merchant-order-summary-card">

          <span>
            Delivered
          </span>

          <strong>
            {deliveredOrders}
          </strong>

        </div>

      </div>


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {orders.length === 0 ? (

        <div className="merchant-orders-empty">

          <div className="merchant-orders-empty-icon">
            🧾
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            Orders containing your products
            will appear here.
          </p>

          <button
            type="button"
            onClick={fetchOrders}
          >
            ↻ Refresh Orders
          </button>

        </div>

      ) : (

        /* ===============================================
           ORDER LIST
        =============================================== */

        <div className="merchant-orders-list">

          {orders.map(
            (order) => (

              <div
                className="merchant-order-card"
                key={order.id}
              >

                {/* ORDER HEADER */}

                <div className="merchant-order-top">

                  <div>

                    <span className="merchant-order-label">
                      ORDER
                    </span>

                    <h2>
                      #{order.id}
                    </h2>

                  </div>

                  <span
                    className={`merchant-order-status ${getStatusClass(
                      order.order_status
                    )}`}
                  >
                    {order.order_status}
                  </span>
                  {order.return_status && (
  <span className="merchant-return-status">
    ↩ {order.return_status}
  </span>
)}

                </div>


                {/* CUSTOMER */}

                <div className="merchant-order-customer">

                  <div className="merchant-order-info">

                    <span>
                      CUSTOMER
                    </span>

                    <strong>
                      {order.customer_name ||
                        order.address_name ||
                        "Customer"}
                    </strong>

                  </div>


                  <div className="merchant-order-info">

                    <span>
                      EMAIL
                    </span>

                    <strong>
                      {order.customer_email ||
                        "N/A"}
                    </strong>

                  </div>


                  <div className="merchant-order-info">

                    <span>
                      PHONE
                    </span>

                    <strong>
                      {order.customer_phone ||
                        order.address_phone ||
                        order.phone ||
                        "N/A"}
                    </strong>

                  </div>

                </div>


                {/* PRODUCTS */}

                <div className="merchant-order-products">

                  <h3>
                    Products
                  </h3>

                  {order.items &&
                  order.items.length > 0 ? (

                    order.items.map(
                      (item) => (

                        <div
                          className="merchant-order-product"
                          key={item.id}
                        >

                          <div className="merchant-order-product-image">

                            {item.product_image ? (

                              <img
                                src={
                                  item.product_image
                                }
                                alt={
                                  item.product_name
                                }
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />

                            ) : (

                              <span>
                                📦
                              </span>

                            )}

                          </div>


                          <div className="merchant-order-product-details">

                            <strong>
                              {item.product_name}
                            </strong>

                            <span>
                              {item.brand ||
                                item.category ||
                                "Product"}
                            </span>

                          </div>


                          <div className="merchant-order-product-quantity">

                            <span>
                              Qty
                            </span>

                            <strong>
                              {item.quantity}
                            </strong>

                          </div>


                          <div className="merchant-order-product-price">

                            <span>
                              Price
                            </span>

                            <strong>
                              ₹
                              {Number(
                                item.price
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                          </div>

                        </div>

                      )
                    )

                  ) : (

                    <p className="merchant-order-no-items">

                      Product details unavailable.

                    </p>

                  )}

                </div>

{order.return_status && (
  <div className="merchant-return-order-box">

    <div className="merchant-return-order-title">
      ↩ Return Order
    </div>

    <div className="merchant-return-order-details">

      <div>
        <span>Return Status</span>
        <strong>
          {order.return_status}
        </strong>
      </div>

      <div>
        <span>Return Reason</span>
        <strong>
          {order.return_reason || "Not provided"}
        </strong>
      </div>

      {order.return_requested_at && (
        <div>
          <span>Requested On</span>
          <strong>
            {formatDate(order.return_requested_at)}
          </strong>
        </div>
      )}

    </div>

  </div>
)}

                {/* DELIVERY ADDRESS */}

                <div className="merchant-order-address">

                  <h3>
                    📍 Delivery Address
                  </h3>

                  <p>

                    <strong>
                      {order.address_name ||
                        "Customer"}
                    </strong>

                    <br />

                    {order.address_line}

                    <br />

                    {order.city},{" "}
                    {order.state} -{" "}
                    {order.pincode}

                    <br />

                    Phone:{" "}

                    {order.address_phone ||
                      order.phone ||
                      "N/A"}

                  </p>

                </div>


                {/* PAYMENT */}

                <div className="merchant-order-payment">

                  <div>

                    <span>
                      Payment Method
                    </span>

                    <strong>
                      {order.payment_method ||
                        "N/A"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Payment Status
                    </span>

                    <strong
                      className={
                        String(
                          order.payment_status
                        ).toLowerCase() ===
                        "paid"
                          ? "payment-paid"
                          : "payment-pending"
                      }
                    >

                      {order.payment_status ||
                        "Pending"}

                    </strong>

                  </div>


                  <div>

                    <span>
                      Order Date
                    </span>

                    <strong>

                      {formatDate(
                        order.created_at
                      )}

                    </strong>

                  </div>


                  <div className="merchant-order-total">

                    <span>
                      Order Total
                    </span>

                    <strong>

                      ₹
                      {Number(
                        order.total_amount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </strong>

                  </div>

                </div>


                {/* STATUS UPDATE */}

                <div className="merchant-order-actions">

                  {String(
                    order.order_status
                  ).toLowerCase() ===
                    "placed" && (

                    <button
                      type="button"
                      className="merchant-confirm-order-button"
                      onClick={() =>
                        handleStatusChange(
                          order.id,
                          "Confirmed"
                        )
                      }
                      disabled={
                        updatingOrder ===
                        order.id
                      }
                    >

                      {updatingOrder ===
                      order.id
                        ? "Confirming..."
                        : "✓ Confirm Order"}

                    </button>

                  )}


                  {String(
                    order.order_status
                  ).toLowerCase() ===
                    "confirmed" && (

                    <button
                      type="button"
                      className="merchant-ship-order-button"
                      onClick={() =>
                        handleStatusChange(
                          order.id,
                          "Shipped"
                        )
                      }
                      disabled={
                        updatingOrder ===
                        order.id
                      }
                    >

                      {updatingOrder ===
                      order.id
                        ? "Updating..."
                        : "🚚 Mark as Shipped"}

                    </button>

                  )}


                  {String(
                    order.order_status
                  ).toLowerCase() ===
                    "shipped" && (

                    <div className="merchant-order-status-message">

                      🚚 Order has been shipped

                    </div>

                  )}


                  {String(
                    order.order_status
                  ).toLowerCase() ===
                    "delivered" && (

                    <div className="merchant-order-status-message">

                      ✓ Order delivered

                    </div>

                  )}


                  {String(
                    order.order_status
                  ).toLowerCase() ===
                    "cancelled" && (

                    <div className="merchant-order-status-message">

                      ✕ Order cancelled

                    </div>

                  )}

                </div>

              </div>

            )
          )}

        </div>

      )}

    </section>

  );
}

export default MerchantOrders;