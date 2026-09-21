import React, {
  useEffect,
  useState,
} from "react";

import {
  API_BASE_URL,
} from "../api";

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
  onDeliveryPartners,
  onProfit,
}) {


  /* ===============================
     STATE
  =============================== */

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeSection, setActiveSection] =
    useState("Dashboard");


  /* ===============================
     LOAD ADMIN DASHBOARD
  =============================== */

  const fetchDashboard =
    async () => {

      try {

        setLoading(true);

        setError("");


        /* ===============================
           GET ADMIN TOKEN ONLY

           IMPORTANT:
           Do NOT use:

           localStorage.getItem("token")

           Because that may contain
           merchant/customer token.
        =============================== */

        const token =
          localStorage.getItem(
            "adminToken"
          );


        console.log(
          "Admin token exists:",
          !!token
        );


        /* ===============================
           TOKEN CHECK
        =============================== */

        if (!token) {

          throw new Error(
            "Admin authentication token not found. Please login again."
          );

        }


        /* ===============================
           CALL ADMIN DASHBOARD API
        =============================== */

        const response =
          await fetch(
            `${API_BASE_URL}/api/admin/dashboard`,
            {

              method: "GET",

              headers: {

                "Content-Type":
                  "application/json",

                "Authorization":
                  `Bearer ${token}`,

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
          "Admin dashboard response:",
          data
        );


        /* ===============================
           HANDLE API ERROR
        =============================== */

        if (
          !response.ok ||
          !data.success
        ) {

          throw new Error(
            data.message ||
            "Failed to load dashboard"
          );

        }


        /* ===============================
           SAVE DASHBOARD DATA
        =============================== */

        setDashboard(
          data.dashboard
        );


      } catch (error) {

        console.error(
          "Admin dashboard error:",
          error
        );


        /* ===============================
           TOKEN ERROR

           Optional:
           If unauthorized, remove invalid
           admin login data.
        =============================== */

        if (
          error.message ===
          "Authentication token has expired"
        ) {

          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminUser"
          );

        }


        setError(
          error.message ||
          "Unable to load dashboard"
        );


      } finally {

        setLoading(false);

      }

    };


  /* ===============================
     LOAD DASHBOARD ON START
  =============================== */

  useEffect(() => {

    fetchDashboard();

  }, []);



  /* ===============================
     NAVIGATION
  =============================== */

  const handleNavigation = (
    section,
    callback
  ) => {

    setActiveSection(
      section
    );


    if (callback) {

      callback();

    }

  };



  /* ===============================
     LOGOUT
  =============================== */

  const handleLogout =
    () => {

      /* Remove only admin data */

      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "adminUser"
      );


      /* Call parent logout */

      if (onLogout) {

        onLogout();

      }

    };



  /* ===============================
     LOADING SCREEN
  =============================== */

  if (loading) {

    return (

      <section className="admin-page">

        <div className="admin-loading">

          Loading Admin Dashboard...

        </div>

      </section>

    );

  }



  /* ===============================
     ERROR SCREEN
  =============================== */

  if (error) {

    return (

      <section className="admin-page">

        <div className="admin-error">


          <div className="admin-error-icon">

            ⚠️

          </div>


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



  /* ===============================
     MAIN ADMIN PAGE
  =============================== */

  return (

    <section className="admin-page">


      {/* =============================
          TOP HEADER
      ============================== */}

      <header className="admin-topbar">


        {/* BRAND */}

        <div className="admin-brand">


          <div className="admin-brand-mark">

            S

          </div>


          <div>

            <strong>

              Shop<span>Ease</span>

            </strong>


            <small>

              Admin Panel

            </small>

          </div>


        </div>



        {/* USER INFO */}

        <div className="admin-topbar-right">


          <div className="admin-user-info">


            <div className="admin-user-avatar">

              {
                (
                  admin?.name ||
                  "A"
                )
                  .charAt(0)
                  .toUpperCase()
              }

            </div>



            <div>


              <strong>

                {
                  admin?.name ||
                  "ShopEase Admin"
                }

              </strong>


              <span>

                Administrator

              </span>


            </div>


          </div>



          {/* LOGOUT */}

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >

            Logout

          </button>


        </div>


      </header>



      {/* =============================
          DASHBOARD BODY
      ============================== */}

      <div className="admin-layout">


        {/* ===========================
            SIDEBAR
        ============================ */}

        <aside className="admin-sidebar">


          <div className="admin-sidebar-title">

            MANAGEMENT

          </div>



          <nav className="admin-sidebar-nav">


            {/* DASHBOARD */}

            <button
              type="button"
              className={
                activeSection === "Dashboard"
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
              onClick={() =>
                handleNavigation(
                  "Dashboard",
                  null
                )
              }
            >

              <span className="admin-nav-icon">

                ◈

              </span>


              <span>

                Dashboard

              </span>

            </button>



            {/* CUSTOMERS */}

            <button
              type="button"
              className={
                activeSection === "Customers"
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
              onClick={() =>
                handleNavigation(
                  "Customers",
                  onCustomers
                )
              }
            >

              <span className="admin-nav-icon">

                👤

              </span>


              <span>

                Customers

              </span>

            </button>



            {/* MERCHANTS */}

            <button
              type="button"
              className={
                activeSection === "Merchants"
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
              onClick={() =>
                handleNavigation(
                  "Merchants",
                  onMerchants
                )
              }
            >

              <span className="admin-nav-icon">

                🏪

              </span>


              <span>

                Merchants

              </span>

            </button>
            
{/* DELIVERY PARTNERS */}

<button
  type="button"
  className={
    activeSection === "Delivery Partners"
      ? "admin-nav-item active"
      : "admin-nav-item"
  }
  onClick={() =>
    handleNavigation(
      "Delivery Partners",
      onDeliveryPartners
    )
  }
>
  <span className="admin-nav-icon">
    🚚
  </span>

  <span>
    Delivery Partners
  </span>
</button>

{/* PROFIT */}

<button
  type="button"
  className={
    activeSection === "Profit"
      ? "admin-nav-item active"
      : "admin-nav-item"
  }
  onClick={() =>
    handleNavigation(
      "Profit",
      onProfit
    )
  }
>
  <span className="admin-nav-icon">
    📈
  </span>

  <span>
    Profit
  </span>
</button>

            {/* PRODUCTS */}

            <button
              type="button"
              className={
                activeSection === "Products"
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
              onClick={() =>
                handleNavigation(
                  "Products",
                  onProducts
                )
              }
            >

              <span className="admin-nav-icon">

                📦

              </span>


              <span>

                Products

              </span>

            </button>



            {/* ORDERS */}

            <button
              type="button"
              className={
                activeSection === "Orders"
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
              onClick={() =>
                handleNavigation(
                  "Orders",
                  onOrders
                )
              }
            >

              <span className="admin-nav-icon">

                🛒

              </span>


              <span>

                Orders

              </span>

            </button>



            {/* PAYMENTS */}

            <button
              type="button"
              className={
                activeSection === "Payments"
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
              onClick={() =>
                handleNavigation(
                  "Payments",
                  onPayments
                )
              }
            >

              <span className="admin-nav-icon">

                💳

              </span>


              <span>

                Payments

              </span>

            </button>



            {/* REPORTS */}

            <button
              type="button"
              className={
                activeSection === "Reports"
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
              onClick={() =>
                handleNavigation(
                  "Reports",
                  onReports
                )
              }
            >

              <span className="admin-nav-icon">

                📊

              </span>


              <span>

                Reports

              </span>

            </button>


          </nav>


        </aside>


        {/* ===========================
            MAIN CONTENT
        ============================ */}

        <main className="admin-main">


          {/* PAGE HEADING */}

          <div className="admin-page-heading">


            <div>


              <p>

                OVERVIEW

              </p>


              <h1>

                Dashboard

              </h1>


              <span>

                Welcome back,{" "}

                {
                  admin?.name ||
                  "ShopEase Admin"
                }

              </span>


            </div>



            <div className="admin-heading-status">

              <span className="admin-status-dot" />

              System Active

            </div>


          </div>



          {/* =========================
              STATISTICS
          ========================== */}

          <section className="admin-stat-grid">


            {/* TOTAL CUSTOMERS */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon">

                  👤

                </div>

              </div>


              <span>

                Total Customers

              </span>


              <strong>

                {
                  dashboard?.total_customers ??
                  0
                }

              </strong>

            </div>



            {/* TOTAL MERCHANTS */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon">

                  🏪

                </div>

              </div>


              <span>

                Total Merchants

              </span>


              <strong>

                {
                  dashboard?.total_merchants ??
                  0
                }

              </strong>

            </div>



            {/* TOTAL PRODUCTS */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon">

                  📦

                </div>

              </div>


              <span>

                Total Products

              </span>


              <strong>

                {
                  dashboard?.total_products ??
                  0
                }

              </strong>

            </div>



            {/* TOTAL ORDERS */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon">

                  🛒

                </div>

              </div>


              <span>

                Total Orders

              </span>


              <strong>

                {
                  dashboard?.total_orders ??
                  0
                }

              </strong>

            </div>



            {/* TOTAL REVENUE */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon">

                  ₹

                </div>

              </div>


              <span>

                Total Revenue

              </span>


              <strong>

                ₹

                {
                  Number(
                    dashboard?.total_revenue ||
                    0
                  ).toLocaleString(
                    "en-IN"
                  )
                }

              </strong>

            </div>



            {/* PENDING ORDERS */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon">

                  ⏳

                </div>

              </div>


              <span>

                Pending Orders

              </span>


              <strong>

                {
                  dashboard?.pending_orders ??
                  0
                }

              </strong>

            </div>



            {/* LOW STOCK */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon">

                  ⚠️

                </div>

              </div>


              <span>

                Low Stock

              </span>


              <strong>

                {
                  dashboard?.low_stock ??
                  0
                }

              </strong>

            </div>



            {/* OUT OF STOCK */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon">

                  ❌

                </div>

              </div>


              <span>

                Out of Stock

              </span>


              <strong>

                {
                  dashboard?.out_of_stock ??
                  0
                }

              </strong>

            </div>


          </section>



          {/* =========================
              RECENT ORDERS
          ========================== */}

          <section className="admin-recent-section">


            <div className="admin-section-heading">


              <div>


                <p>

                  ACTIVITY

                </p>


                <h2>

                  Recent Orders

                </h2>


              </div>



              <span>

                {
                  dashboard?.recent_orders
                    ?.length || 0
                }{" "}

                recent

              </span>


            </div>



            <div className="admin-order-list">


              {
                dashboard?.recent_orders
                  ?.length > 0 ? (

                  dashboard.recent_orders.map(
                    (order) => (

                      <div
                        className="admin-order-row"
                        key={order.id}
                      >


                        <div className="admin-order-left">


                          <div className="admin-order-number">

                            #{order.id}

                          </div>



                          <div>


                            <strong>

                              {
                                order.customer_name ||
                                "Customer"
                              }

                            </strong>


                            <span>

                              Order placed

                            </span>


                          </div>


                        </div>



                        <div className="admin-order-right">


                          <strong>

                            ₹

                            {
                              Number(
                                order.total_amount ||
                                0
                              ).toLocaleString(
                                "en-IN"
                              )
                            }

                          </strong>



                          <span
                            className={
                              `admin-order-status ${
                                String(
                                  order.order_status ||
                                  "Pending"
                                )
                                  .toLowerCase()
                                  .replace(
                                    /\s+/g,
                                    "-"
                                  )
                              }`
                            }
                          >

                            {
                              order.order_status ||
                              "Pending"
                            }

                          </span>


                        </div>


                      </div>

                    )
                  )

                ) : (

                  <div className="admin-empty">

                    No orders found.

                  </div>

                )
              }


            </div>


          </section>


        </main>


      </div>


    </section>

  );

}


export default AdminHome;