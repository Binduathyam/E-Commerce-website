import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";

function OrderHistory({
  loggedInUser,
  onBack,
  onViewDetails,
  onTrackOrder,
  onDownloadInvoice,
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // GET CUSTOMER TOKEN
  // =========================================

  const getToken = () => {
    return (
      loggedInUser?.token ||
      localStorage.getItem("customer_token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("token")
    );
  };

  // =========================================
  // FETCH CUSTOMER ORDERS
  // =========================================

  const fetchCustomerOrders = async () => {
    const token = getToken();

    if (!loggedInUser?.id) {
      throw new Error("Customer ID not found.");
    }

    if (!token) {
      throw new Error(
        "Login session expired. Please login again."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/orders/user/${loggedInUser.id}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-user-id": String(loggedInUser.id),
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          "Failed to fetch orders."
      );
    }

    return (
      data?.orders ||
      data?.data ||
      data ||
      []
    );
  };

  // =========================================
  // LOAD ORDERS
  // =========================================

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const customerOrders =
          await fetchCustomerOrders();

        if (!Array.isArray(customerOrders)) {
          setOrders([]);
          return;
        }

        setOrders(customerOrders);
      } catch (err) {
        console.error(
          "Order history error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [loggedInUser?.id]);

  // =========================================
  // PAYMENT TEXT
  // =========================================

  const getPaymentText = (method) => {
    const value = String(
      method || "cod"
    )
      .trim()
      .toLowerCase();

    if (
      value === "cod" ||
      value === "cash on delivery"
    ) {
      return "Cash on Delivery";
    }

    if (value === "upi") {
      return "UPI";
    }

    if (value === "razorpay") {
      return "Razorpay";
    }

    if (
      value === "card" ||
      value === "credit" ||
      value === "debit" ||
      value === "credit/debit card"
    ) {
      return "Credit / Debit Card";
    }

    return method || "Payment";
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      const parsed = new Date(date);

      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {
        return String(date);
      }

      return parsed.toLocaleString(
        "en-IN",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );
    } catch {
      return String(date);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <section style={styles.page}>
        <div style={styles.message}>

          <div style={styles.bigIcon}>
            📦
          </div>

          <h2 style={styles.messageTitle}>
            Loading your orders...
          </h2>

          <p style={styles.messageText}>
            Please wait while we fetch
            your order history.
          </p>

        </div>
      </section>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <section style={styles.page}>
        <div style={styles.message}>

          <div style={styles.bigIcon}>
            ⚠️
          </div>

          <h2 style={styles.messageTitle}>
            Something went wrong
          </h2>

          <p style={styles.messageText}>
            {error}
          </p>

        </div>
      </section>
    );
  }

  // =========================================
  // MAIN
  // =========================================

  return (
    <section style={styles.page}>

      {/* =====================================
          HEADER
      ====================================== */}

      <div style={styles.header}>

        <button
          type="button"
          style={styles.backButton}
          onClick={onBack}
        >
          ←
        </button>

        <div>

          <div style={styles.headerSmall}>
            ACCOUNT
          </div>

          <h1 style={styles.headerTitle}>
            My Orders
          </h1>

        </div>

      </div>


      {/* =====================================
          EMPTY
      ====================================== */}

      {orders.length === 0 ? (

        <div style={styles.empty}>

          <div style={styles.bigIcon}>
            📦
          </div>

          <h2 style={styles.emptyTitle}>
            No orders yet
          </h2>

          <p style={styles.messageText}>
            Your orders will appear here
            after you place your first order.
          </p>

          <button
            type="button"
            style={styles.continueButton}
            onClick={onBack}
          >
            Continue Shopping
          </button>

        </div>

      ) : (

        <div style={styles.ordersList}>

          {orders.map((order) => {

            const totalAmount =
              Number(
                order?.total_amount ||
                order?.total ||
                0
              );

            const orderStatus =
              order?.order_status ||
              order?.status ||
              "Placed";

            const paymentMethod =
              order?.payment_method ||
              order?.paymentMethod ||
              "cod";

            return (

              <div
                key={
                  order?.id ||
                  order?.order_id
                }
                style={styles.orderCard}
              >

                {/* =================================
                    ORDER HEADER
                ================================== */}

                <div
                  style={
                    styles.orderHeader
                  }
                >

                  <div>

                    <div
                      style={
                        styles.orderSmall
                      }
                    >
                      ORDER
                    </div>

                    <div
                      style={
                        styles.orderNumber
                      }
                    >
                      #
                      {order?.id ||
                        order?.order_id}
                    </div>

                    <div
                      style={
                        styles.date
                      }
                    >
                      {formatDate(
                        order?.created_at ||
                          order?.order_date
                      )}
                    </div>

                  </div>


                  {/* STATUS */}

                  <div
                    style={
                      styles.status
                    }
                  >
                    {orderStatus}
                  </div>

                </div>


                {/* =================================
                    ORDER SUMMARY
                ================================== */}

                <div
                  style={
                    styles.summary
                  }
                >

                  {/* TOTAL */}

                  <div
                    style={
                      styles.summaryItem
                    }
                  >

                    <span
                      style={
                        styles.summaryLabel
                      }
                    >
                      TOTAL AMOUNT
                    </span>

                    <strong
                      style={
                        styles.summaryValue
                      }
                    >
                      ₹
                      {totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>


                  {/* PAYMENT */}

                  <div
                    style={
                      styles.summaryItem
                    }
                  >

                    <span
                      style={
                        styles.summaryLabel
                      }
                    >
                      PAYMENT
                    </span>

                    <strong
                      style={
                        styles.summaryValue
                      }
                    >
                      {getPaymentText(
                        paymentMethod
                      )}
                    </strong>

                  </div>


                  {/* PAYMENT STATUS */}

                  <div
                    style={
                      styles.summaryItem
                    }
                  >

                    <span
                      style={
                        styles.summaryLabel
                      }
                    >
                      PAYMENT STATUS
                    </span>

                    <strong
                      style={
                        styles.summaryValue
                      }
                    >
                      {order?.payment_status ||
                        "Pending"}
                    </strong>

                  </div>

                </div>


                {/* =================================
                    RETURN STATUS
                ================================== */}

                {order?.return_status && (

                  <div
                    style={
                      styles.returnBox
                    }
                  >

                    <strong>
                      ↩ Return Request
                    </strong>

                    <span>
                      Status:{" "}
                      {order.return_status}
                    </span>

                  </div>

                )}


                {/* =================================
                    ACTION BUTTONS
                ================================== */}

                <div
                  style={
                    styles.actions
                  }
                >

                  {/* VIEW DETAILS */}

                  <button
                    type="button"
                    style={
                      styles.primaryButton
                    }
                    onClick={() => {

                      if (onViewDetails) {
                        onViewDetails(
                          order
                        );
                      }

                    }}
                  >
                    View Details →
                  </button>


                  {/* TRACK ORDER */}




                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}


/* =====================================================
   ORDER HISTORY ONLY STYLES
   No App.css changes required
===================================================== */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f7f7f5",
    padding: "25px 20px 50px",
    boxSizing: "border-box",
  },

  header: {
    width: "min(1000px, 100%)",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  backButton: {
    width: "38px",
    height: "38px",
    border: "1px solid #e5e5e2",
    borderRadius: "50%",
    background: "#fff",
    color: "#222",
    fontSize: "19px",
    cursor: "pointer",
  },

  headerSmall: {
    fontSize: "9px",
    fontWeight: "700",
    color: "#999",
    letterSpacing: "1.5px",
    marginBottom: "2px",
  },

  headerTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#171717",
  },

  ordersList: {
    width: "min(1000px, 100%)",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  orderCard: {
    background: "#fff",
    border: "1px solid #e8e8e5",
    borderRadius: "12px",
    padding: "16px",
    boxSizing: "border-box",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.035)",
  },

  orderHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "12px",
    borderBottom:
      "1px solid #eeeeeb",
  },

  orderSmall: {
    fontSize: "9px",
    fontWeight: "700",
    color: "#999",
    letterSpacing: "1px",
  },

  orderNumber: {
    marginTop: "2px",
    fontSize: "16px",
    fontWeight: "700",
    color: "#171717",
  },

  date: {
    marginTop: "3px",
    fontSize: "10px",
    color: "#999",
  },

  status: {
    padding: "5px 10px",
    borderRadius: "15px",
    background: "#eef8ef",
    color: "#26733b",
    fontSize: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  /* =================================
     ORDER SUMMARY
  ================================= */

  summary: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "15px",
    padding: "14px 0",
  },

  summaryItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },

  summaryLabel: {
    fontSize: "9px",
    color: "#999",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },

  summaryValue: {
    fontSize: "12px",
    color: "#222",
    fontWeight: "600",
  },

  /* =================================
     RETURN
  ================================= */

  returnBox: {
    marginTop: "2px",
    marginBottom: "11px",
    padding: "9px",
    borderRadius: "7px",
    background: "#fff8e8",
    border:
      "1px solid #f0dfb8",
    display: "flex",
    gap: "12px",
    fontSize: "10px",
    color: "#666",
  },

  /* =================================
     BUTTONS
  ================================= */

  actions: {
    display: "flex",
    gap: "8px",
    paddingTop: "11px",
    borderTop:
      "1px solid #eeeeeb",
  },
primaryButton: {
  minHeight: "34px",
  padding: "0 14px",
  border: "none",
  borderRadius: "7px",
  background: "#171717",
  color: "#fff",
  fontSize: "11px",
  fontWeight: "600",
  cursor: "pointer",
  whiteSpace: "nowrap",
},

  secondaryButton: {
    minHeight: "34px",
    padding: "0 12px",
    border:
      "1px solid #deded9",
    borderRadius: "7px",
    background: "#fff",
    color: "#333",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },

  /* =================================
     LOADING / ERROR
  ================================= */

  message: {
    width: "min(500px, 100%)",
    margin: "60px auto",
    padding: "35px 25px",
    background: "#fff",
    border:
      "1px solid #eeeeeb",
    borderRadius: "14px",
    textAlign: "center",
    boxSizing: "border-box",
  },

  bigIcon: {
    fontSize: "34px",
    marginBottom: "10px",
  },

  messageTitle: {
    margin: "0 0 7px",
    fontSize: "18px",
    color: "#222",
  },

  messageText: {
    margin: "0 0 15px",
    fontSize: "12px",
    lineHeight: "1.5",
    color: "#888",
  },

  /* =================================
     EMPTY
  ================================= */

  empty: {
    width: "min(500px, 100%)",
    margin: "60px auto",
    padding: "40px 25px",
    background: "#fff",
    border:
      "1px solid #eeeeeb",
    borderRadius: "15px",
    textAlign: "center",
    boxSizing: "border-box",
  },

  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
    color: "#222",
  },

  continueButton: {
    border: "none",
    background: "#171717",
    color: "#fff",
    padding: "10px 17px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default OrderHistory;