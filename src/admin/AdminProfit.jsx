import React, {
  useEffect,
  useState,
} from "react";

import {
  API_BASE_URL,
} from "../api";

import "./AdminProfit.css";


function AdminProfit({
  admin,
  onBack,
}) {

  const [summary, setSummary] =
    useState(null);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =====================================================
     FETCH PROFIT DATA
  ===================================================== */

  const fetchProfit =
    async () => {

      try {

        setLoading(true);

        setError("");


        const token =
          admin?.token ||
          localStorage.getItem(
            "adminToken"
          );


        if (!token) {

          throw new Error(
            "Admin authentication token not found. Please login again."
          );

        }


        const response =
          await fetch(
            `${API_BASE_URL}/api/admin/profit`,
            {
              method: "GET",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response.json();


        if (!response.ok ||
            !data.success) {

          throw new Error(
            data.message ||
            "Failed to load profit details"
          );

        }


        setSummary(
          data.summary
        );

        setOrders(
          data.orders || []
        );


      } catch (error) {

        console.error(
          "Admin profit error:",
          error
        );

        setError(
          error.message ||
          "Unable to load profit details"
        );


      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    fetchProfit();

  }, []);


  /* =====================================================
     FORMAT MONEY
  ===================================================== */

  const money = (value) => {

    return Number(
      value || 0
    ).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    );

  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="admin-profit-page">

        <div className="admin-profit-loading">

          Loading financial details...

        </div>

      </div>

    );

  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {

    return (

      <div className="admin-profit-page">

        <div className="admin-profit-error">

          <div className="admin-profit-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to load financial details
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchProfit}
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  return (

    <section className="admin-profit-page">


      {/* =================================================
         HEADER
      ================================================= */}

      <div className="admin-profit-header">

        <button
          type="button"
          className="admin-profit-back"
          onClick={onBack}
        >
          ← Back
        </button>


        <div>

          <p className="admin-profit-label">
            FINANCIAL MANAGEMENT
          </p>

          <h1>
            Profit & Revenue
          </h1>

          <p className="admin-profit-subtitle">
            Track sales, merchant payouts,
            delivery earnings and ShopEase profit.
          </p>

        </div>

      </div>


      {/* =================================================
         SUMMARY CARDS
      ================================================= */}

      <div className="admin-profit-summary">


        {/* TOTAL SALES */}

        <div className="admin-profit-card">

          <div className="admin-profit-card-icon">
            ₹
          </div>

          <span>
            Total Sales
          </span>

          <strong>
            ₹{money(
              summary?.total_sales
            )}
          </strong>

          <small>
            Delivered & paid orders
          </small>

        </div>


        {/* MERCHANT PAYOUT */}

        <div className="admin-profit-card">

          <div className="admin-profit-card-icon">
            🏪
          </div>

          <span>
            Merchant Payouts
          </span>

          <strong>
            ₹{money(
              summary?.merchant_payouts
            )}
          </strong>

          <small>
            {summary?.merchant_payout_percentage || 90}%
            of sales
          </small>

        </div>


        {/* DELIVERY PARTNER */}

        <div className="admin-profit-card">

          <div className="admin-profit-card-icon">
            🚚
          </div>

          <span>
            Delivery Partner Pay
          </span>

          <strong>
            ₹{money(
              summary?.delivery_partner_pay
            )}
          </strong>

          <small>
            ₹{summary?.delivery_partner_fee || 50}
            per delivered order
          </small>

        </div>


        {/* SHOP EASE PROFIT */}

        <div className="admin-profit-card profit">

          <div className="admin-profit-card-icon">
            📈
          </div>

          <span>
            ShopEase Profit
          </span>

          <strong>
            ₹{money(
              summary?.shop_ease_profit
            )}
          </strong>

          <small>
            {summary?.profit_percentage || 0}%
            profit margin
          </small>

        </div>

      </div>


      {/* =================================================
         FINANCIAL OVERVIEW
      ================================================= */}

      <section className="admin-profit-overview">

        <div className="admin-profit-overview-header">

          <div>

            <p>
              OVERVIEW
            </p>

            <h2>
              Financial Summary
            </h2>

          </div>

          <button
            type="button"
            onClick={fetchProfit}
            className="admin-profit-refresh"
          >
            ↻ Refresh
          </button>

        </div>


        <div className="admin-profit-breakdown">


          <div className="admin-profit-breakdown-row">

            <span>
              Total Sales
            </span>

            <strong>
              ₹{money(
                summary?.total_sales
              )}
            </strong>

          </div>


          <div className="admin-profit-breakdown-row">

            <span>
              − Merchant Payouts
            </span>

            <strong className="expense">
              ₹{money(
                summary?.merchant_payouts
              )}
            </strong>

          </div>


          <div className="admin-profit-breakdown-row">

            <span>
              − Delivery Partner Pay
            </span>

            <strong className="expense">
              ₹{money(
                summary?.delivery_partner_pay
              )}
            </strong>

          </div>


          <div className="admin-profit-breakdown-divider" />


          <div className="admin-profit-breakdown-row final">

            <span>
              ShopEase Profit
            </span>

            <strong>
              ₹{money(
                summary?.shop_ease_profit
              )}
            </strong>

          </div>

        </div>

      </section>


      {/* =================================================
         ORDER BREAKDOWN
      ================================================= */}

      <section className="admin-profit-orders">

        <div className="admin-profit-orders-header">

          <div>

            <p>
              TRANSACTIONS
            </p>

            <h2>
              Delivered Orders
            </h2>

          </div>

          <span>
            {summary?.total_delivered_orders || 0}
            {" "}orders
          </span>

        </div>


        <div className="admin-profit-table-wrapper">

          {orders.length > 0 ? (

            <table className="admin-profit-table">

              <thead>

                <tr>

                  <th>
                    Order
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Sale
                  </th>

                  <th>
                    Merchant
                  </th>

                  <th>
                    Delivery
                  </th>

                  <th>
                    ShopEase Profit
                  </th>

                </tr>

              </thead>


              <tbody>

                {orders.map(
                  (order) => (

                    <tr
                      key={order.id}
                    >

                      <td>
                        <strong>
                          #{order.id}
                        </strong>
                      </td>

                      <td>
                        {order.customer_name ||
                         "Customer"}
                      </td>

                      <td>
                        ₹{money(
                          order.total_amount
                        )}
                      </td>

                      <td>
                        ₹{money(
                          order.merchant_payout
                        )}
                      </td>

                      <td>
                        ₹{money(
                          order.delivery_partner_pay
                        )}
                      </td>

                      <td>

                        <strong className="profit-value">

                          ₹{money(
                            order.shop_ease_profit
                          )}

                        </strong>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          ) : (

            <div className="admin-profit-empty">

              No delivered and paid orders found.

            </div>

          )}

        </div>

      </section>


    </section>

  );

}


export default AdminProfit;