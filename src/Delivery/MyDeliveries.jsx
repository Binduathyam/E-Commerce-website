import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./MyDeliveries.css";

const API_URL = `${API_BASE_URL}/api/delivery`;

const MyDeliveries = ({ deliveryPartner }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =================================
  // DELIVERY PARTNER ID
  // =================================

  const deliveryPartnerId = deliveryPartner?.id;

  // =================================
  // GET AUTH TOKEN
  // =================================

  const getToken = () => {
    return localStorage.getItem("delivery_token");
  };

  // =================================
  // LOAD ASSIGNED ORDERS
  // =================================

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      console.log(
        "My Deliveries - Partner ID:",
        deliveryPartnerId
      );

      console.log(
        "My Deliveries - Token exists:",
        !!token
      );

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      if (!deliveryPartnerId) {
        throw new Error(
          "Delivery partner information not found."
        );
      }

      const response = await fetch(
        `${API_URL}/my-orders/${deliveryPartnerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "My deliveries response:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch deliveries"
        );
      }

      const allOrders = data.orders || [];

      console.log(
        "MY DELIVERIES ORDERS:",
        allOrders
      );

      // Check customer/address fields
      console.log(
        "CUSTOMER + ADDRESS DATA:",
        allOrders.map((order) => ({
          id: order.id,
          customer_name:
            order.customer_name,
          customer_phone:
            order.customer_phone,
          address_line:
            order.address_line,
          city: order.city,
          state: order.state,
          pincode: order.pincode,
          shipping_address:
            order.shipping_address,
        }))
      );

      setDeliveries(allOrders);

    } catch (err) {
      console.error(
        "My deliveries error:",
        err
      );

      setError(
        err.message ||
          "Failed to load deliveries"
      );

    } finally {
      setLoading(false);
    }
  };

  // =================================
  // LOAD ON PAGE OPEN
  // =================================

  useEffect(() => {
    loadDeliveries();
  }, [deliveryPartnerId]);

  // =================================
  // UPDATE DELIVERY STATUS
  // =================================

  const updateDeliveryStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      if (!deliveryPartnerId) {
        throw new Error(
          "Delivery partner information not found."
        );
      }

      const response = await fetch(
        `${API_URL}/update-status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            order_id: orderId,

            delivery_partner_id:
              deliveryPartnerId,

            delivery_status:
              newStatus,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Status update response:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update delivery status"
        );
      }

      await loadDeliveries();

    } catch (err) {
      console.error(
        "Update status error:",
        err
      );

      alert(
        err.message ||
          "Failed to update delivery status"
      );
    }
  };

  // =================================
  // SUMMARY COUNTS
  // =================================

  const totalAssigned =
    deliveries.length;

  const pendingPickup =
    deliveries.filter(
      (delivery) =>
        String(
          delivery.delivery_status || ""
        ).trim() === "Assigned"
    ).length;

  const onTheWay =
    deliveries.filter(
      (delivery) =>
        String(
          delivery.delivery_status || ""
        ).trim() === "Out for Delivery"
    ).length;

  const completedToday =
    deliveries.filter(
      (delivery) =>
        String(
          delivery.delivery_status || ""
        ).trim() === "Delivered"
    ).length;

  // =================================
  // FILTERS
  // =================================

  const filters = [
    "All",
    "Assigned",
    "Accepted",
    "Picked Up",
    "Out for Delivery",
    "Delivered",
  ];

  // =================================
  // FILTER + SEARCH
  // =================================

  const filteredDeliveries =
    deliveries.filter(
      (delivery) => {
        const status =
          String(
            delivery.delivery_status || ""
          ).trim();

        const customerName =
          getCustomerName(delivery);

        const statusMatch =
          activeFilter === "All" ||
          status === activeFilter;

        const searchValue =
          searchTerm.toLowerCase().trim();

        const searchMatch =
          String(delivery.id)
            .toLowerCase()
            .includes(searchValue) ||
          customerName
            .toLowerCase()
            .includes(searchValue);

        return (
          statusMatch &&
          searchMatch
        );
      }
    );

  // =================================
  // GET CUSTOMER NAME
  // =================================

  function getCustomerName(delivery) {
    return (
      delivery.customer_name ||
      delivery.address_name ||
      delivery.name ||
      delivery.user_name ||
      "Customer"
    );
  }

  // =================================
  // GET CUSTOMER PHONE
  // =================================

  function getCustomerPhone(delivery) {
    return (
      delivery.customer_phone ||
      delivery.address_phone ||
      delivery.phone ||
      delivery.phone_number ||
      "Not available"
    );
  }

  // =================================
  // GET DELIVERY ADDRESS
  // =================================

  function getAddress(delivery) {
    // ---------------------------------
    // NEW DATABASE ADDRESS FIELDS
    // ---------------------------------

    const addressParts = [
      delivery.address_line,
      delivery.city,
      delivery.state,
      delivery.pincode,
    ].filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    );

    if (addressParts.length > 0) {
      return addressParts.join(", ");
    }

    // ---------------------------------
    // FALLBACK: shipping_address
    // ---------------------------------

    if (delivery.shipping_address) {
      try {
        const address =
          typeof delivery.shipping_address ===
          "string"
            ? JSON.parse(
                delivery.shipping_address
              )
            : delivery.shipping_address;

        const fallbackParts = [
          address.address_line,
          address.address,
          address.street,
          address.area,
          address.city,
          address.state,
          address.pincode,
        ].filter(
          (value) =>
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        );

        if (
          fallbackParts.length > 0
        ) {
          return fallbackParts.join(
            ", "
          );
        }

        return String(
          delivery.shipping_address
        );

      } catch (error) {
        return String(
          delivery.shipping_address
        );
      }
    }

    return "Address not available";
  }

  // =================================
  // ACTION BUTTON
  // =================================

  const renderActionButton =
    (delivery) => {
      const status =
        delivery.delivery_status ||
        "Assigned";

      // ASSIGNED → ACCEPTED
      if (status === "Assigned") {
        return (
          <button
            className="primary-delivery-button"
            onClick={() =>
              updateDeliveryStatus(
                delivery.id,
                "Accepted"
              )
            }
          >
            Accept Order
          </button>
        );
      }

      // ACCEPTED → PICKED UP
      if (status === "Accepted") {
        return (
          <button
            className="primary-delivery-button"
            onClick={() =>
              updateDeliveryStatus(
                delivery.id,
                "Picked Up"
              )
            }
          >
            Pick Up Order
          </button>
        );
      }

      // PICKED UP → OUT FOR DELIVERY
      if (status === "Picked Up") {
        return (
          <button
            className="primary-delivery-button"
            onClick={() =>
              updateDeliveryStatus(
                delivery.id,
                "Out for Delivery"
              )
            }
          >
            Start Delivery
          </button>
        );
      }

      // OUT FOR DELIVERY → DELIVERED
      if (
        status === "Out for Delivery"
      ) {
        return (
          <button
            className="primary-delivery-button"
            onClick={() =>
              updateDeliveryStatus(
                delivery.id,
                "Delivered"
              )
            }
          >
            Mark Delivered
          </button>
        );
      }

      return null;
    };

  return (
    <div className="my-deliveries-page">

      {/* ================= HEADER ================= */}

      <section className="my-deliveries-heading">
        <div>
          <p>
            DELIVERY MANAGEMENT
          </p>

          <h1>
            My Deliveries
          </h1>

          <span>
            Manage and track all orders
            assigned to you.
          </span>
        </div>

        <div className="delivery-area-badge">
          <span>📍</span>
          My Delivery Area
        </div>
      </section>

      {/* ================= SUMMARY ================= */}

      <section className="delivery-summary-grid">

        <div className="delivery-summary-card">
          <div className="summary-icon total">
            📦
          </div>

          <div>
            <span>
              Total Assigned
            </span>

            <strong>
              {totalAssigned}
            </strong>
          </div>
        </div>

        <div className="delivery-summary-card">
          <div className="summary-icon assigned">
            📋
          </div>

          <div>
            <span>
              Pending Pickup
            </span>

            <strong>
              {pendingPickup}
            </strong>
          </div>
        </div>

        <div className="delivery-summary-card">
          <div className="summary-icon progress">
            🚚
          </div>

          <div>
            <span>
              On The Way
            </span>

            <strong>
              {onTheWay}
            </strong>
          </div>
        </div>

        <div className="delivery-summary-card">
          <div className="summary-icon completed">
            ✓
          </div>

          <div>
            <span>
              Completed
            </span>

            <strong>
              {completedToday}
            </strong>
          </div>
        </div>

      </section>

      {/* ================= DELIVERY LIST ================= */}

      <section className="delivery-list-section">

        <div className="delivery-list-top">

          <div>
            <p>
              ASSIGNED ORDERS
            </p>

            <h2>
              Your Delivery Tasks
            </h2>
          </div>

          {/* SEARCH */}

          <div className="delivery-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search order or customer..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />
          </div>

        </div>

        {/* ================= FILTERS ================= */}

        <div className="delivery-filters">

          {filters.map(
            (filter) => (
              <button
                key={filter}
                className={
                  activeFilter === filter
                    ? "delivery-filter active"
                    : "delivery-filter"
                }
                onClick={() =>
                  setActiveFilter(
                    filter
                  )
                }
              >
                {filter}
              </button>
            )
          )}

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="no-deliveries">

            <div>⏳</div>

            <h3>
              Loading deliveries...
            </h3>

          </div>
        )}

        {/* ================= ERROR ================= */}

        {error &&
          !loading && (
            <div className="no-deliveries">

              <div>⚠️</div>

              <h3>
                Unable to load deliveries
              </h3>

              <p>
                {error}
              </p>

              <button
                className="primary-delivery-button"
                onClick={
                  loadDeliveries
                }
              >
                Try Again
              </button>

            </div>
          )}

        {/* ================= ORDERS ================= */}

        {!loading &&
          !error && (
            <div className="delivery-cards">

              {filteredDeliveries.map(
                (delivery) => (

                  <div
                    className="delivery-task-card"
                    key={delivery.id}
                  >

                    {/* TOP */}

                    <div className="delivery-task-top">

                      <div className="delivery-order-id">

                        <span>📦</span>

                        <div>

                          <strong>
                            #ORD
                            {delivery.id}
                          </strong>

                          <small>
                            Assigned:{" "}
                            {delivery.assigned_at
                              ? new Date(
                                  delivery.assigned_at
                                ).toLocaleString()
                              : "Not available"}
                          </small>

                        </div>

                      </div>

                      <span
                        className={`priority ${
                          delivery.priority
                            ? delivery.priority.toLowerCase()
                            : "medium"
                        }`}
                      >
                        {delivery.priority ||
                          "Medium"}{" "}
                        Priority
                      </span>

                    </div>

                    {/* CUSTOMER INFO */}

                    <div className="delivery-customer-info">

                      {/* CUSTOMER */}

                      <div className="delivery-info-item">

                        <span className="info-label">
                          CUSTOMER
                        </span>

                        <strong>
                          {getCustomerName(
                            delivery
                          )}
                        </strong>

                        <small>
                          📞{" "}
                          {getCustomerPhone(
                            delivery
                          )}
                        </small>

                      </div>

                      {/* DELIVERY ADDRESS */}

                      <div className="delivery-info-item address">

                        <span className="info-label">
                          DELIVERY ADDRESS
                        </span>

                        <strong>
                          Delivery Location
                        </strong>

                        <small>
                          📍{" "}
                          {getAddress(
                            delivery
                          )}
                        </small>

                      </div>

                      {/* ORDER AMOUNT */}

                      <div className="delivery-info-item">

                        <span className="info-label">
                          ORDER AMOUNT
                        </span>

                        <strong>
                          ₹
                          {Number(
                            delivery.total_amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <small>
                          {delivery.payment_method ||
                            "Payment method not available"}
                        </small>

                      </div>

                    </div>

                    {/* ================= BOTTOM ================= */}

                    <div className="delivery-task-bottom">

                      <span
                        className={`delivery-task-status ${
                          (
                            delivery.delivery_status ||
                            "Assigned"
                          )
                            .toLowerCase()
                            .replaceAll(
                              " ",
                              "-"
                            )
                        }`}
                      >
                        {delivery.delivery_status ||
                          "Assigned"}
                      </span>

                      <div className="delivery-task-actions">

                        <button
                          className="view-order-button"
                          onClick={() =>
                            console.log(
                              "Order details:",
                              delivery
                            )
                          }
                        >
                          View Details
                        </button>

                        {renderActionButton(
                          delivery
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          filteredDeliveries.length ===
            0 && (
            <div className="no-deliveries">

              <div>📦</div>

              <h3>
                No deliveries found
              </h3>

              <p>
                There are no orders with
                this status.
              </p>

            </div>
          )}

      </section>
    </div>
  );
};

export default MyDeliveries;