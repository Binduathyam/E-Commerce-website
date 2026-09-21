import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminPayments.css";

function AdminPayments({ onBack, admin }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
  admin?.token ||
  localStorage.getItem("adminToken");

console.log(
  "ADMIN PAYMENTS TOKEN:",
  token ? "Token found" : "Token missing"
);

if (!token) {
  throw new Error(
    "Authentication required. Please login again."
  );
}

const response = await fetch(
  `${API_BASE_URL}/api/admin/payments`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load payments"
        );
      }

      setPayments(data.payments || []);
    } catch (error) {
      console.error("Admin payments error:", error);

      setError(
        error.message || "Unable to load payments"
      );
    } finally {
      setLoading(false);
    }
  };

  const paidPayments = payments.filter(
    (payment) =>
      String(payment.payment_status || "")
        .toLowerCase() === "paid"
  );

  const pendingPayments = payments.filter(
    (payment) =>
      String(payment.payment_status || "")
        .toLowerCase() === "pending"
  );

  const codPayments = payments.filter(
    (payment) =>
      String(payment.payment_method || "")
        .toLowerCase()
        .includes("cash")
  );

  const totalRevenue = payments.reduce(
    (total, payment) =>
      total + Number(payment.total_amount || 0),
    0
  );

  return (
    <section className="admin-payments-page">

      <header className="admin-payments-header">

        <button
          type="button"
          className="admin-payments-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <p>ADMIN</p>

          <h1>Payments</h1>

          <span>
            Monitor payments and transaction information
          </span>
        </div>

      </header>


      <main className="admin-payments-content">

        {/* SUMMARY */}

        <div className="admin-payments-summary">

          <div className="payment-summary-card">

            <div className="payment-summary-icon">
              💰
            </div>

            <div>
              <p>Total Revenue</p>

              <h2>
                ₹
                {totalRevenue.toLocaleString(
                  "en-IN"
                )}
              </h2>
            </div>

          </div>


          <div className="payment-summary-card">

            <div className="payment-summary-icon">
              ✓
            </div>

            <div>
              <p>Paid Payments</p>

              <h2>
                {paidPayments.length}
              </h2>
            </div>

          </div>


          <div className="payment-summary-card">

            <div className="payment-summary-icon">
              ⏳
            </div>

            <div>
              <p>Pending Payments</p>

              <h2>
                {pendingPayments.length}
              </h2>
            </div>

          </div>


          <div className="payment-summary-card">

            <div className="payment-summary-icon">
              💵
            </div>

            <div>
              <p>COD Orders</p>

              <h2>
                {codPayments.length}
              </h2>
            </div>

          </div>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="admin-payments-message">
            Loading payments...
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="admin-payments-error">

            <h3>
              Unable to load payments
            </h3>

            <p>{error}</p>

            <button
              type="button"
              onClick={fetchPayments}
            >
              Try Again
            </button>

          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          payments.length === 0 && (
            <div className="admin-payments-message">
              No payment records found.
            </div>
          )}


        {/* TABLE */}

        {!loading &&
          !error &&
          payments.length > 0 && (

            <div className="admin-payments-table-wrapper">

              <table className="admin-payments-table">

                <thead>

                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Date</th>
                  </tr>

                </thead>

                <tbody>

                  {payments.map((payment) => {

                    const paymentStatus =
                      String(
                        payment.payment_status || ""
                      ).toLowerCase();

                    const orderStatus =
                      String(
                        payment.order_status || ""
                      ).toLowerCase();

                    return (
                      <tr key={payment.id}>

                        <td>
                          <strong>
                            #{payment.id}
                          </strong>
                        </td>

                        <td>

                          <div className="payment-customer">

                            <strong>
                              {payment.customer_name ||
                                "Customer"}
                            </strong>

                            <small>
                              User #
                              {payment.user_id}
                            </small>

                          </div>

                        </td>

                        <td>
                          <strong>
                            ₹
                            {Number(
                              payment.total_amount || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </td>

                        <td>
                          {payment.payment_method ||
                            "-"}
                        </td>

                        <td>

                          <span
                            className={
                              paymentStatus === "paid"
                                ? "payment-badge paid"
                                : "payment-badge pending"
                            }
                          >
                            {payment.payment_status ||
                              "Pending"}
                          </span>

                        </td>

                        <td>

                          <span
                            className={
                              orderStatus === "delivered"
                                ? "payment-order-status delivered"
                                : orderStatus === "cancelled"
                                ? "payment-order-status cancelled"
                                : "payment-order-status active"
                            }
                          >
                            {payment.order_status ||
                              "Placed"}
                          </span>

                        </td>

                        <td>
                          {payment.created_at
                            ? new Date(
                                payment.created_at
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

      </main>

    </section>
  );
}

export default AdminPayments;