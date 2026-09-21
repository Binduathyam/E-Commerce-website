import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./MerchantSales.css";

function MerchantSales({
  merchant,
  onBack,
}) {
  const [summary, setSummary] = useState({
    total_orders: 0,
    total_sales: 0,
    paid_orders: 0,
    cod_orders: 0,
  });

  const [sales, setSales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      if (!merchant?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

      const token =
  localStorage.getItem("merchant_token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("accessToken");

if (!token) {
  throw new Error(
    "Authentication required. Please login again."
  );
}

const response = await fetch(
  `${API_BASE_URL}/api/merchant/sales/${merchant.id}`,
  {
    method: "GET",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${token}`,

      "x-user-id": merchant.id,
    },
  }
);

        const data = await response.json();

        console.log(
          "Merchant sales response:",
          data
        );

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to fetch sales"
          );
        }

        setSummary(
          data.summary || {
            total_orders: 0,
            total_sales: 0,
            paid_orders: 0,
            cod_orders: 0,
          }
        );

        setSales(
          Array.isArray(data.sales)
            ? data.sales
            : []
        );

        setMonthlySales(
          Array.isArray(data.monthly_sales)
            ? data.monthly_sales
            : []
        );
      } catch (err) {
        console.error(
          "Merchant sales error:",
          err
        );

        setError(
          err.message ||
            "Unable to load sales"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [merchant?.id]);

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleString(
      "en-IN"
    );
  };

  return (
    <section className="merchant-sales-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="merchant-sales-header">

        <button
          type="button"
          className="merchant-sales-back"
          onClick={onBack}
        >
          ←
        </button>

        <div>
          <p>
            MERCHANT
          </p>

          <h1>
            Sales
          </h1>

          <span>
            Track your store revenue and sales
          </span>
        </div>

      </div>


      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <div className="merchant-sales-error">
          ⚠️ {error}
        </div>
      )}


      {/* =========================================
          SUMMARY CARDS
      ========================================= */}

      <div className="merchant-sales-summary">

        {/* TOTAL SALES */}

        <div className="merchant-sales-card">

          <div className="sales-card-icon">
            ₹
          </div>

          <div>

            <p>
              Total Sales
            </p>

            <h2>
              ₹
              {loading
                ? "..."
                : formatAmount(
                    summary.total_sales
                  )}
            </h2>

            <span>
              Revenue generated
            </span>

          </div>

        </div>


        {/* ORDERS */}

        <div className="merchant-sales-card">

          <div className="sales-card-icon">
            ▤
          </div>

          <div>

            <p>
              Total Orders
            </p>

            <h2>
              {loading
                ? "..."
                : summary.total_orders}
            </h2>

            <span>
              Orders received
            </span>

          </div>

        </div>


        {/* PAID */}

        <div className="merchant-sales-card">

          <div className="sales-card-icon">
            ✓
          </div>

          <div>

            <p>
              Paid Orders
            </p>

            <h2>
              {loading
                ? "..."
                : summary.paid_orders}
            </h2>

            <span>
              Online payments
            </span>

          </div>

        </div>


        {/* COD */}

        <div className="merchant-sales-card">

          <div className="sales-card-icon">
            ₹
          </div>

          <div>

            <p>
              COD Orders
            </p>

            <h2>
              {loading
                ? "..."
                : summary.cod_orders}
            </h2>

            <span>
              Cash on delivery
            </span>

          </div>

        </div>

      </div>


      {/* =========================================
          MONTHLY SALES
      ========================================= */}

      <div className="merchant-sales-panel">

        <div className="merchant-sales-panel-header">

          <div>

            <p>
              PERFORMANCE
            </p>

            <h2>
              Monthly Sales
            </h2>

          </div>

        </div>


        {loading ? (

          <div className="merchant-sales-empty">
            Loading sales...
          </div>

        ) : monthlySales.length === 0 ? (

          <div className="merchant-sales-empty">
            No monthly sales available yet.
          </div>

        ) : (

          <div className="monthly-sales-list">

            {monthlySales.map(
              (item) => (
                <div
                  className="monthly-sales-row"
                  key={item.month}
                >

                  <span>
                    {item.month}
                  </span>

                  <strong>
                    ₹
                    {formatAmount(
                      item.sales
                    )}
                  </strong>

                </div>
              )
            )}

          </div>

        )}

      </div>


      {/* =========================================
          SALES HISTORY
      ========================================= */}

      <div className="merchant-sales-panel">

        <div className="merchant-sales-panel-header">

          <div>

            <p>
              TRANSACTIONS
            </p>

            <h2>
              Sales History
            </h2>

          </div>

        </div>


        {loading ? (

          <div className="merchant-sales-empty">
            Loading transactions...
          </div>

        ) : sales.length === 0 ? (

          <div className="merchant-sales-empty">
            No sales found.
          </div>

        ) : (

          <div className="merchant-sales-table">

            <div className="sales-table-header">

              <span>
                Product
              </span>

              <span>
                Order
              </span>

              <span>
                Date
              </span>

              <span>
                Payment
              </span>

              <span>
                Status
              </span>

              <span>
                Amount
              </span>

            </div>


            {sales.map(
              (item, index) => (

                <div
                  className="sales-table-row"
                  key={`${item.order_id}-${item.product_id}-${index}`}
                >

                  {/* PRODUCT */}

                  <div className="sales-product">

                    <div className="sales-product-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={
                            item.product_name
                          }
                        />
                      ) : (
                        <span>
                          {item.product_name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "P"}
                        </span>
                      )}

                    </div>

                    <div>

                      <strong>
                        {item.product_name}
                      </strong>

                      <span>
                        Qty:{" "}
                        {item.quantity}
                      </span>

                    </div>

                  </div>


                  {/* ORDER */}

                  <span>
                    #{item.order_id}
                  </span>


                  {/* DATE */}

                  <span>
                    {formatDate(
                      item.created_at
                    )}
                  </span>


                  {/* PAYMENT */}

                  <span className="sales-payment">

                    {item.payment_method ||
                      "Payment"}

                  </span>


                  {/* STATUS */}

                  <span
                    className={`sales-status ${String(
                      item.order_status ||
                        "Placed"
                    )
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      )}`}
                  >
                    {item.order_status ||
                      "Placed"}
                  </span>


                  {/* AMOUNT */}

                  <strong>
                    ₹
                    {formatAmount(
                      item.item_total
                    )}
                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </section>
  );
}

export default MerchantSales;