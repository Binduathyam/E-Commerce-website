import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./DeliveryHistory.css";

const DeliveryHistory = ({ deliveryPartner }) => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =================================
  // GET AUTH TOKEN
  // =================================

  // =================================
  // LOAD DELIVERY HISTORY
  // =================================

  const loadDeliveryHistory = async () => {
    if (!deliveryPartner?.id) {
      setLoading(false);
      setError(
        "Delivery partner information not found."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token =
  localStorage.getItem("delivery_token") ||
  deliveryPartner?.token;

      console.log(
        "History Partner ID:",
        deliveryPartner.id
      );

      console.log(
        "History Token exists:",
        !!token
      );

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/delivery/history/${deliveryPartner.id}`,
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
        "Delivery history:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load delivery history"
        );
      }

      const history =
        data.deliveries ||
        data.orders ||
        [];

      setDeliveries(history);

    } catch (error) {
      console.error(
        "Delivery history error:",
        error
      );

      setError(
        error.message ||
          "Unable to load delivery history."
      );

    } finally {
      setLoading(false);
    }
  };

  // =================================
  // LOAD ON PAGE OPEN
  // =================================

  useEffect(() => {
    loadDeliveryHistory();
  }, [deliveryPartner?.id]);

  // =================================
  // GET CUSTOMER
  // =================================

  const getCustomerName = (delivery) => {
    return (
      delivery.customer_name ||
      delivery.customer ||
      delivery.name ||
      delivery.user_name ||
      "Customer"
    );
  };

  // =================================
  // FORMAT AMOUNT
  // =================================

  const formatAmount = (amount) => {
    if (
      amount === undefined ||
      amount === null
    ) {
      return "₹0";
    }

    return `₹${Number(
      amount
    ).toLocaleString("en-IN")}`;
  };

  // =================================
  // FORMAT DATE
  // =================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // =================================
  // FILTER DELIVERIES
  // =================================

  const filteredDeliveries =
    selectedFilter === "All"
      ? deliveries
      : deliveries.filter(
          (delivery) => {
            const status =
              delivery.status ||
              delivery.delivery_status ||
              "";

            return (
              status.toLowerCase() ===
              selectedFilter.toLowerCase()
            );
          }
        );

  return (
    <div className="history-page">

      {/* ===================== HEADER ===================== */}

      <section className="history-header">

        <div>
          <p>
            DELIVERY RECORDS
          </p>

          <h1>
            Delivery History
          </h1>

          <span>
            View your completed deliveries
            and return records.
          </span>
        </div>

        <div className="history-summary">

          <span>
            Total Completed
          </span>

          <strong>
            {
              deliveries.filter(
                (item) =>
                  (
                    item.status ||
                    item.delivery_status ||
                    ""
                  ).toLowerCase() ===
                  "delivered"
              ).length
            }
          </strong>

        </div>

      </section>

      {/* ===================== FILTER ===================== */}

      <section className="history-filter">

        {[
          "All",
          "Delivered",
          "Returned",
        ].map((filter) => (

          <button
            key={filter}
            className={
              selectedFilter === filter
                ? "history-filter-button active"
                : "history-filter-button"
            }
            onClick={() =>
              setSelectedFilter(filter)
            }
          >
            {filter}
          </button>

        ))}

      </section>

      {/* ===================== LOADING ===================== */}

      {loading && (
        <div className="history-empty">

          <div>
            ⏳
          </div>

          <h3>
            Loading delivery history...
          </h3>

          <p>
            Please wait while we load
            your delivery records.
          </p>

        </div>
      )}

      {/* ===================== ERROR ===================== */}

      {!loading && error && (
        <div className="history-empty">

          <div>
            ⚠️
          </div>

          <h3>
            Unable to load history
          </h3>

          <p>
            {error}
          </p>

          <button
            onClick={
              loadDeliveryHistory
            }
          >
            Try Again
          </button>

        </div>
      )}

      {/* ===================== DELIVERY LIST ===================== */}

      {!loading && !error && (
        <section className="history-list">

          {filteredDeliveries.map(
            (delivery) => {

              const orderId =
                delivery.order_number ||
                delivery.id ||
                delivery.order_id;

              const customer =
                getCustomerName(
                  delivery
                );

              const product =
                delivery.product_name ||
                delivery.product ||
                delivery.items_name ||
                "Order Items";

              const amount =
                delivery.total_amount ||
                delivery.amount ||
                0;

              const status =
                delivery.status ||
                delivery.delivery_status ||
                "Delivered";

              const isDelivered =
                status.toLowerCase() ===
                "delivered";

              return (

                <div
                  className="history-card"
                  key={orderId}
                >

                  {/* ================= CARD TOP ================= */}

                  <div className="history-card-top">

                    <div className="history-order-info">

                      <div className="history-order-icon">
                        {isDelivered
                          ? "✓"
                          : "↩"}
                      </div>

                      <div>

                        <strong>
                          #{orderId}
                        </strong>

                        <span>
                          {product}
                        </span>

                      </div>

                    </div>

                    <span
                      className={
                        isDelivered
                          ? "history-status delivered"
                          : "history-status returned"
                      }
                    >
                      {status}
                    </span>

                  </div>

                  {/* ================= DETAILS ================= */}

                  <div className="history-details">

                    {/* CUSTOMER */}

                    <div>

                      <small>
                        Customer
                      </small>

                      <strong>
                        {customer}
                      </strong>

                    </div>

                    {/* DELIVERY DATE */}

                    <div>

                      <small>
                        Delivery Date
                      </small>

                      <strong>
                        {formatDate(
                          delivery.delivered_at ||
                          delivery.updated_at ||
                          delivery.created_at
                        )}
                      </strong>

                    </div>

                    {/* ORDER AMOUNT */}

                    <div>

                      <small>
                        Order Amount
                      </small>

                      <strong>
                        {formatAmount(
                          amount
                        )}
                      </strong>

                    </div>

                  </div>

                </div>

              );
            }
          )}

          {/* ================= EMPTY ================= */}

          {filteredDeliveries.length ===
            0 && (

            <div className="history-empty">

              <div>
                📦
              </div>

              <h3>
                No delivery records found
              </h3>

              <p>
                There are no records
                available in this category.
              </p>

            </div>

          )}

        </section>
      )}

    </div>
  );
};

export default DeliveryHistory;