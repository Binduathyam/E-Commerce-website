import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import "./AssignedOrders.css";

const API_BASE_URL = "http://3.110.90.184";

const AssignedOrders = ({
  deliveryPartner,
  onBack,
}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [acceptingOrderId, setAcceptingOrderId] =
    useState(null);

  // =====================================
  // NORMALIZE DELIVERY STATUS
  // =====================================

  const normalizeStatus = (status) => {
    const value = String(
      status || "Not Assigned"
    ).trim();

    if (
      value.toLowerCase() === "notassigned"
    ) {
      return "Not Assigned";
    }

    if (
      value.toLowerCase() === "not assigned"
    ) {
      return "Not Assigned";
    }

    return value;
  };

  // =====================================
  // GET AUTH HEADERS
  // =====================================

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token");

    return {
      "Content-Type":
        "application/json",

      ...(token
        ? {
            Authorization:
              `Bearer ${token}`,
          }
        : {}),

      ...(deliveryPartner?.id
        ? {
            "x-user-id":
              deliveryPartner.id,
          }
        : {}),
    };
  };

  // =====================================
  // LOAD ORDERS
  // =====================================

  const loadAssignedOrders =
    useCallback(async () => {
      if (!deliveryPartner?.id) {
        setLoading(false);
        setOrders([]);

        setError(
          "Delivery partner information not found."
        );

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE_URL}/api/delivery/my-orders/${deliveryPartner.id}`,
            {
              method: "GET",

              headers: {
                "Content-Type":
                  "application/json",

                "x-user-id":
                  deliveryPartner.id,

                ...(localStorage.getItem(
                  "token"
                )
                  ? {
                      Authorization:
                        `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                    }
                  : {}),
              },
            }
          );

        let data;

        try {
          data =
            await response.json();
        } catch {
          throw new Error(
            "Server returned an invalid response."
          );
        }

        console.log(
          "Assigned orders response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load orders."
          );
        }

        if (
          data?.success === false
        ) {
          throw new Error(
            data?.message ||
              "Failed to load orders."
          );
        }

        const allOrders =
          Array.isArray(
            data?.orders
          )
            ? data.orders
            : Array.isArray(
                data?.data
              )
            ? data.data
            : [];

        const normalizedOrders =
          allOrders.map((order) => ({
            ...order,

            delivery_status:
              normalizeStatus(
                order.delivery_status
              ),
          }));

        setOrders(
          normalizedOrders
        );
      } catch (error) {
        console.error(
          "Assigned orders error:",
          error
        );

        setOrders([]);

        setError(
          error?.message ||
            "Unable to load orders."
        );
      } finally {
        setLoading(false);
      }
    }, [
      deliveryPartner?.id,
    ]);

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    loadAssignedOrders();
  }, [
    loadAssignedOrders,
  ]);

  // =====================================
  // ACCEPT ORDER
  // =====================================

  const acceptOrder = async (
    orderId
  ) => {
    if (!deliveryPartner?.id) {
      alert(
        "Delivery partner information not found."
      );

      return;
    }

    try {
      setAcceptingOrderId(
        orderId
      );

      const response =
        await fetch(
          `${API_BASE_URL}/api/delivery/update-status`,
          {
            method: "PUT",

            headers:
              getAuthHeaders(),

            body: JSON.stringify({
              order_id:
                orderId,

              delivery_partner_id:
                deliveryPartner.id,

              delivery_status:
                "Accepted",
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "Accept order response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data?.message ||
            "Failed to accept order."
        );
      }

      alert(
        "Order accepted successfully!"
      );

      setSelectedOrder(null);

      await loadAssignedOrders();
    } catch (error) {
      console.error(
        "Accept order error:",
        error
      );

      alert(
        error?.message ||
          "Unable to accept order."
      );
    } finally {
      setAcceptingOrderId(null);
    }
  };

  // =====================================
  // FORMAT ADDRESS
  // =====================================

  const getAddress = (
    order
  ) => {
    if (
      order.shipping_address
    ) {
      return order.shipping_address;
    }

    const addressParts = [
      order.address_line,

      [
        order.city,
        order.state,
        order.pincode,
      ]
        .filter(Boolean)
        .join(", "),
    ].filter(Boolean);

    return addressParts.length >
      0
      ? addressParts.join(
          ", "
        )
      : "Address not available";
  };

  // =====================================
  // CUSTOMER NAME
  // =====================================

  const getCustomerName = (
    order
  ) => {
    return (
      order.customer_name ||
      order.address_name ||
      order.name ||
      "Customer"
    );
  };

  // =====================================
  // PHONE
  // =====================================

  const getPhone = (
    order
  ) => {
    return (
      order.phone ||
      order.customer_phone ||
      order.address_phone ||
      "Not available"
    );
  };

  // =====================================
  // FORMAT AMOUNT
  // =====================================

  const formatAmount = (
    amount
  ) => {
    const numericAmount =
      Number(amount || 0);

    return `₹${numericAmount.toLocaleString(
      "en-IN"
    )}`;
  };

  // =====================================
  // STATUS CLASS
  // =====================================

  const getStatusClass = (
    status
  ) => {
    return String(
      normalizeStatus(status)
    )
      .toLowerCase()
      .replaceAll(
        " ",
        "-"
      );
  };

  // =====================================
  // IS NEW ORDER
  // =====================================

  const isNewOrder = (
    order
  ) => {
    return (
      normalizeStatus(
        order.delivery_status
      ).toLowerCase() ===
      "not assigned"
    );
  };

  // =====================================
  // CAN ACCEPT
  // =====================================

  const canAcceptOrder = (
    order
  ) => {
    const status =
      normalizeStatus(
        order.delivery_status
      ).toLowerCase();

    return (
      status ===
        "not assigned" ||
      status === "assigned"
    );
  };

  // =====================================
  // SEARCH
  // =====================================

  const filteredOrders =
    orders.filter(
      (order) => {
        const text = `
          ${order.id || ""}
          ${order.order_number || ""}
          ${getCustomerName(order)}
          ${getAddress(order)}
          ${normalizeStatus(
            order.delivery_status
          )}
        `.toLowerCase();

        return text.includes(
          searchTerm
            .toLowerCase()
        );
      }
    );

  // =====================================
  // SUMMARY COUNTS
  // =====================================

  const newOrdersCount =
    orders.filter(
      (order) =>
        normalizeStatus(
          order.delivery_status
        ).toLowerCase() ===
        "not assigned"
    ).length;

  const acceptedOrdersCount =
    orders.filter(
      (order) =>
        normalizeStatus(
          order.delivery_status
        ).toLowerCase() ===
        "accepted"
    ).length;

  const assignedOrdersCount =
    orders.filter(
      (order) =>
        normalizeStatus(
          order.delivery_status
        ).toLowerCase() ===
        "assigned"
    ).length;

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="assigned-orders-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="assigned-orders-header">

        <div className="assigned-header-left">

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="assigned-back-button"
            >
              ← Back
            </button>
          )}

          <div className="assigned-title-block">

            <p>
              DELIVERY MANAGEMENT
            </p>

            <h1>
              Assigned Orders
            </h1>

            <span>
              Manage available and
              assigned deliveries
            </span>

          </div>

        </div>

        <div className="assigned-location">

          <div className="assigned-location-icon">
            📍
          </div>

          <div>

            <small>
              DELIVERY PARTNER
            </small>

            <strong>
              {deliveryPartner?.name ||
                "Delivery Partner"}
            </strong>

            <span>
              {deliveryPartner?.city ||
                "Location unavailable"}
            </span>

          </div>

        </div>

      </div>

      {/* =================================
          SUMMARY
      ================================= */}

      <div className="assigned-orders-summary">

        {/* TOTAL */}

        <div className="assigned-summary-card">

          <div className="assigned-summary-icon total">
            📦
          </div>

          <div>
            <small>
              Total Orders
            </small>

            <strong>
              {orders.length}
            </strong>

            <span>
              Available in your queue
            </span>
          </div>

        </div>

        {/* NEW */}

        <div className="assigned-summary-card">

          <div className="assigned-summary-icon new">
            🔔
          </div>

          <div>
            <small>
              New Orders
            </small>

            <strong>
              {newOrdersCount}
            </strong>

            <span>
              Waiting for acceptance
            </span>
          </div>

        </div>

        {/* ACCEPTED */}

        <div className="assigned-summary-card">

          <div className="assigned-summary-icon accepted">
            ✓
          </div>

          <div>
            <small>
              Accepted
            </small>

            <strong>
              {acceptedOrdersCount}
            </strong>

            <span>
              Currently accepted
            </span>
          </div>

        </div>

        {/* ASSIGNED */}

        <div className="assigned-summary-card">

          <div className="assigned-summary-icon assigned">
            🚚
          </div>

          <div>
            <small>
              Assigned
            </small>

            <strong>
              {assignedOrdersCount}
            </strong>

            <span>
              Ready to process
            </span>
          </div>

        </div>

      </div>

      {/* =================================
          TOOLBAR
      ================================= */}

      <div className="assigned-orders-toolbar">

        <div className="assigned-search-box">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search order, customer or address..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() =>
                setSearchTerm("")
              }
              className="assigned-search-clear"
            >
              ×
            </button>
          )}

        </div>

        <button
          type="button"
          className="assigned-filter-button"
          onClick={
            loadAssignedOrders
          }
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "↻ Refresh Orders"}
        </button>

      </div>

      {/* =================================
          LOADING
      ================================= */}

      {loading && (
        <div className="assigned-empty">

          <div className="assigned-empty-icon">
            ⏳
          </div>

          <h2>
            Loading orders...
          </h2>

          <p>
            Please wait while we
            fetch your deliveries.
          </p>

        </div>
      )}

      {/* =================================
          ERROR
      ================================= */}

      {!loading &&
        error && (
          <div className="assigned-empty">

            <div className="assigned-empty-icon">
              ⚠️
            </div>

            <h2>
              Unable to load orders
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="assigned-filter-button"
              onClick={
                loadAssignedOrders
              }
            >
              Try Again
            </button>

          </div>
        )}

      {/* =================================
          ORDERS
      ================================= */}

      {!loading &&
        !error && (
          <div className="assigned-orders-list">

            {filteredOrders.length >
            0 ? (

              filteredOrders.map(
                (order) => {

                  const orderId =
                    order.id;

                  const status =
                    normalizeStatus(
                      order.delivery_status
                    );

                  const newOrder =
                    isNewOrder(
                      order
                    );

                  return (
                    <div
                      className={`assigned-order-card ${
                        newOrder
                          ? "is-new-order"
                          : ""
                      }`}
                      key={orderId}
                    >

                      {/* NEW BADGE */}

                      {newOrder && (
                        <div className="assigned-new-badge">
                          NEW DELIVERY
                        </div>
                      )}

                      {/* MAIN */}

                      <div className="assigned-order-main">

                        <div className="assigned-package-icon">
                          📦
                        </div>

                        <div className="assigned-order-info">

                          <div className="assigned-order-top">

                            <div className="assigned-order-number">

                              <span>
                                ORDER
                              </span>

                              <strong>
                                #
                                {order.order_number ||
                                  orderId}
                              </strong>

                            </div>

                            <span
                              className={`assigned-status ${getStatusClass(
                                status
                              )}`}
                            >
                              {status}
                            </span>

                          </div>

                          <h3>
                            {getCustomerName(
                              order
                            )}
                          </h3>

                          <span className="assigned-phone">
                            📞{" "}
                            {getPhone(
                              order
                            )}
                          </span>

                          <p className="assigned-address">
                            📍{" "}
                            {getAddress(
                              order
                            )}
                          </p>

                        </div>

                      </div>

                      {/* ORDER DETAILS */}

                      <div className="assigned-order-details">

                        <div>

                          <small>
                            ORDER AMOUNT
                          </small>

                          <strong>
                            {formatAmount(
                              order.total_amount
                            )}
                          </strong>

                        </div>

                        <div>

                          <small>
                            DELIVERY CITY
                          </small>

                          <strong>
                            {order.city ||
                              "Not available"}
                          </strong>

                        </div>

                        <div>

                          <small>
                            PAYMENT
                          </small>

                          <strong>
                            {order.payment_method ||
                              "N/A"}
                          </strong>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="assigned-order-actions">

                        <button
                          type="button"
                          className="assigned-view-button"
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                        >
                          View Details
                        </button>

                        {canAcceptOrder(
                          order
                        ) ? (

                          <button
                            type="button"
                            className="assigned-start-button"
                            disabled={
                              acceptingOrderId ===
                              orderId
                            }
                            onClick={() =>
                              acceptOrder(
                                orderId
                              )
                            }
                          >
                            {acceptingOrderId ===
                            orderId
                              ? "Accepting..."
                              : "Accept Order →"}
                          </button>

                        ) : (

                          <button
                            type="button"
                            className="assigned-picked-button"
                            disabled
                          >
                            ✓ {status}
                          </button>

                        )}

                      </div>

                    </div>
                  );
                }
              )

            ) : (

              <div className="assigned-empty">

                <div className="assigned-empty-icon">
                  📦
                </div>

                <h2>
                  {searchTerm
                    ? "No matching orders"
                    : "No assigned orders"}
                </h2>

                <p>
                  {searchTerm
                    ? "Try a different order number, customer or address."
                    : "There are currently no orders available for you."}
                </p>

                {searchTerm && (
                  <button
                    type="button"
                    className="assigned-filter-button"
                    onClick={() =>
                      setSearchTerm("")
                    }
                  >
                    Clear Search
                  </button>
                )}

              </div>
            )}

          </div>
        )}

      {/* =================================
          ORDER DETAILS MODAL
      ================================= */}

      {selectedOrder && (

        <div
          className="assigned-modal-overlay"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="assigned-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="assigned-modal-header">

              <div>

                <p>
                  ORDER DETAILS
                </p>

                <h2>
                  #
                  {selectedOrder.order_number ||
                    selectedOrder.id}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                ×
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="assigned-modal-content">

              {/* STATUS */}

              <div className="assigned-modal-status-row">

                <span
                  className={`assigned-status ${getStatusClass(
                    selectedOrder.delivery_status
                  )}`}
                >
                  {normalizeStatus(
                    selectedOrder.delivery_status
                  )}
                </span>

                {isNewOrder(
                  selectedOrder
                ) && (
                  <span className="assigned-modal-new">
                    NEW ORDER
                  </span>
                )}

              </div>

              {/* CUSTOMER */}

              <div className="assigned-modal-section">

                <span>
                  👤
                </span>

                <div>

                  <small>
                    CUSTOMER
                  </small>

                  <strong>
                    {getCustomerName(
                      selectedOrder
                    )}
                  </strong>

                  <p>
                    {getPhone(
                      selectedOrder
                    )}
                  </p>

                </div>

              </div>

              {/* ADDRESS */}

              <div className="assigned-modal-section">

                <span>
                  📍
                </span>

                <div>

                  <small>
                    DELIVERY ADDRESS
                  </small>

                  <strong>
                    {getAddress(
                      selectedOrder
                    )}
                  </strong>

                </div>

              </div>

              {/* ORDER AMOUNT */}

              <div className="assigned-modal-section">

                <span>
                  💰
                </span>

                <div>

                  <small>
                    ORDER AMOUNT
                  </small>

                  <strong>
                    {formatAmount(
                      selectedOrder.total_amount
                    )}
                  </strong>

                  <p>
                    {selectedOrder.payment_method ||
                      "Payment method unavailable"}
                  </p>

                </div>

              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="assigned-modal-actions">

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                Close
              </button>

              {canAcceptOrder(
                selectedOrder
              ) && (

                <button
                  type="button"
                  className="assigned-start-button"
                  disabled={
                    acceptingOrderId ===
                    selectedOrder.id
                  }
                  onClick={() =>
                    acceptOrder(
                      selectedOrder.id
                    )
                  }
                >
                  {acceptingOrderId ===
                  selectedOrder.id
                    ? "Accepting..."
                    : "Accept Order →"}
                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AssignedOrders;