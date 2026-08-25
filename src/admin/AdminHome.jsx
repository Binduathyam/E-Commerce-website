import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminHome.css";

function AdminHome({
  admin,
  onLogout,
  onCustomers,
  onMerchants,
  onProducts,
  onOrders,
  onPayments,
  onReports,
}) {

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/dashboard`
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
          "Failed to load dashboard"
        );
      }

      setDashboard(
        data.dashboard
      );

    } catch (error) {

      console.error(
        "Admin dashboard error:",
        error
      );

      setError(
        error.message ||
        "Unable to load dashboard"
      );

    } finally {

      setLoading(false);

    }
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="admin-page">

        <div className="admin-loading">
          Loading Admin Dashboard...
        </div>

      </section>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <section className="admin-page">

        <div className="admin-error">

          <h2>
            Unable to load dashboard
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboard}
          >
            Try Again
          </button>

        </div>

      </section>
    );
  }


  return (
    <section className="admin-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="admin-header">

        <div>

          <p>
            ADMIN
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <span>
            Welcome,{" "}
            {admin?.name ||
              "ShopEase Admin"}
          </span>

        </div>


        <button
          type="button"
          onClick={onLogout}
        >
          Logout
        </button>

      </header>


      {/* =========================
          CONTENT
      ========================= */}

      <main className="admin-content">


        {/* =========================
            STATISTICS
        ========================= */}

        <div className="admin-stat-grid">


          {/* CUSTOMERS */}

          <div className="admin-stat-card">

            <span>
              👤
            </span>

            <p>
              Total Customers
            </p>

            <h2>
              {dashboard?.total_customers ?? 0}
            </h2>

          </div>


          {/* MERCHANTS */}

          <div className="admin-stat-card">

            <span>
              🏪
            </span>

            <p>
              Total Merchants
            </p>

            <h2>
              {dashboard?.total_merchants ?? 0}
            </h2>

          </div>


          {/* PRODUCTS */}

          <div className="admin-stat-card">

            <span>
              📦
            </span>

            <p>
              Total Products
            </p>

            <h2>
              {dashboard?.total_products ?? 0}
            </h2>

          </div>


          {/* ORDERS */}

          <div className="admin-stat-card">

            <span>
              🛒
            </span>

            <p>
              Total Orders
            </p>

            <h2>
              {dashboard?.total_orders ?? 0}
            </h2>

          </div>


          {/* REVENUE */}

          <div className="admin-stat-card">

            <span>
              ₹
            </span>

            <p>
              Total Revenue
            </p>

            <h2>
              ₹
              {Number(
                dashboard?.total_revenue || 0
              ).toLocaleString("en-IN")}
            </h2>

          </div>


          {/* PENDING ORDERS */}

          <div className="admin-stat-card">

            <span>
              ⏳
            </span>

            <p>
              Pending Orders
            </p>

            <h2>
              {dashboard?.pending_orders ?? 0}
            </h2>

          </div>


          {/* LOW STOCK */}

          <div className="admin-stat-card">

            <span>
              ⚠️
            </span>

            <p>
              Low Stock
            </p>

            <h2>
              {dashboard?.low_stock ?? 0}
            </h2>

          </div>


          {/* OUT OF STOCK */}

          <div className="admin-stat-card">

            <span>
              ❌
            </span>

            <p>
              Out of Stock
            </p>

            <h2>
              {dashboard?.out_of_stock ?? 0}
            </h2>

          </div>

        </div>


        {/* =========================
            MANAGEMENT
        ========================= */}

        <div className="admin-sections">


           <button
    type="button"
    onClick={onCustomers}
  >
    👤

    <span>
      Customers
    </span>
  </button>


         <button
  type="button"
  onClick={onMerchants}
>
  🏪

  <span>
    Merchants
  </span>
</button>


          <button
  type="button"
  onClick={onProducts}
>
  📦

  <span>
    Products
  </span>
</button>

<button
  type="button"
  onClick={onOrders}
>
  🛒
  <span>
    Orders
  </span>
</button>

          <button
  type="button"
  onClick={onPayments}
>
  💳
  <span>
    Payments
  </span>
</button>


          <button
  type="button"
  onClick={onReports}
>
  📊
  <span>
    Reports
  </span>
</button>

        </div>


        {/* =========================
            RECENT ORDERS
        ========================= */}

        <section className="admin-recent-section">

          <div className="admin-section-title">

            <div>

              <p>
                ACTIVITY
              </p>

              <h2>
                Recent Orders
              </h2>

            </div>

          </div>


          <div className="admin-order-list">

            {dashboard?.recent_orders?.length > 0 ? (

              dashboard.recent_orders.map(
                (order) => (

                  <div
                    className="admin-order-row"
                    key={order.id}
                  >

                    <div>

                      <strong>
                        #{order.id}
                      </strong>

                      <span>
                        {order.customer_name ||
                          "Customer"}
                      </span>

                    </div>


                    <div>

                      <strong>
                        ₹
                        {Number(
                          order.total_amount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <span>
                        {order.order_status ||
                          "Pending"}
                      </span>

                    </div>

                  </div>

                )
              )

            ) : (

              <div className="admin-empty">
                No orders found.
              </div>

            )}

          </div>
        </section>


      </main>

    </section>
  );
}

export default AdminHome;