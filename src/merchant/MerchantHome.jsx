import React, {
  useEffect,
  useState,
} from "react";

import { API_BASE_URL } from "../api";

import "./MerchantHome.css";

function MerchantHome({
  merchant = {
    name: "ShopEase Merchant",
    businessName: "My Store",
    email: "merchant@shopease.com",
  },

  onLogout,
  onAddProduct,
  onProducts,
  onOrders,
  onInventory,
  onSales,
  onProfile,
}) {
  const [activeMenu, setActiveMenu] =
    useState("Dashboard");

  /* =====================================================
     DASHBOARD DATA
  ===================================================== */

  const [dashboard, setDashboard] =
    useState({
      total_products: 0,
      total_orders: 0,
      total_sales: 0,
      low_stock: 0,
      out_of_stock: 0,
      recent_orders: [],
      low_stock_products: [],
    });

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  const [dashboardError, setDashboardError] =
    useState("");


  /* =====================================================
     FETCH MERCHANT DASHBOARD
  ===================================================== */

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!merchant?.id) {
        setDashboardLoading(false);
        return;
      }

      try {
        setDashboardLoading(true);
        setDashboardError("");

        const response = await fetch(
          `${API_BASE_URL}/api/merchant/dashboard/${merchant.id}`
        );

        const data =
          await response.json();

        console.log(
          "Merchant dashboard response:",
          data
        );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to fetch dashboard"
          );
        }

        const apiDashboard =
          data.dashboard || {};

        setDashboard({
          total_products:
            Number(
              apiDashboard.total_products || 0
            ),

          total_orders:
            Number(
              apiDashboard.total_orders || 0
            ),

          total_sales:
            Number(
              apiDashboard.total_sales || 0
            ),

          low_stock:
            Number(
              apiDashboard.low_stock || 0
            ),

          out_of_stock:
            Number(
              apiDashboard.out_of_stock || 0
            ),

          recent_orders:
            Array.isArray(
              apiDashboard.recent_orders
            )
              ? apiDashboard.recent_orders
              : [],

          low_stock_products:
            Array.isArray(
              apiDashboard.low_stock_products
            )
              ? apiDashboard.low_stock_products
              : [],
        });

      } catch (error) {
        console.error(
          "Merchant dashboard error:",
          error
        );

        setDashboardError(
          error.message ||
            "Unable to load dashboard"
        );

      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboard();
  }, [merchant?.id]);


  /* =====================================================
     MENU ITEMS
  ===================================================== */

  const menuItems = [
    {
      name: "Dashboard",
      icon: "▦",
    },

    {
      name: "My Products",
      icon: "▣",
    },

    {
      name: "Orders",
      icon: "▤",
    },

    {
      name: "Inventory",
      icon: "◫",
    },

    {
      name: "Sales",
      icon: "↗",
    },

    {
      name: "Profile",
      icon: "○",
    },
  ];


  /* =====================================================
     MENU CLICK
  ===================================================== */

  const handleMenuClick = (item) => {
    setActiveMenu(item.name);

    if (
      item.name === "My Products" &&
      onProducts
    ) {
      onProducts();
    }

    if (
      item.name === "Orders" &&
      onOrders
    ) {
      onOrders();
    }

    if (
      item.name === "Inventory" &&
      onInventory
    ) {
      onInventory();
    }

    if (
      item.name === "Sales" &&
      onSales
    ) {
      onSales();
    }

    if (
      item.name === "Profile" &&
      onProfile
    ) {
      onProfile();
    }
  };


  /* =====================================================
     FORMAT SALES
  ===================================================== */

  const formattedSales =
    Number(
      dashboard.total_sales || 0
    ).toLocaleString("en-IN");


  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="merchant-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="merchant-sidebar">

        {/* LOGO */}

        <div className="merchant-logo">

          <div className="merchant-logo-circle">
            S
          </div>

          <div>
            <h2>
              ShopEase
            </h2>

            <span>
              Merchant
            </span>
          </div>

        </div>


        {/* MENU */}

        <nav className="merchant-nav">

          <p className="merchant-nav-title">
            MAIN MENU
          </p>

          {menuItems.map(
            (item) => (

              <button
                key={item.name}
                type="button"
                className={
                  activeMenu ===
                  item.name
                    ? "merchant-nav-item active"
                    : "merchant-nav-item"
                }
                onClick={() =>
                  handleMenuClick(item)
                }
              >

                <span className="merchant-nav-icon">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </button>

            )
          )}

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="merchant-sidebar-bottom">

          <div className="merchant-help-box">

            <div className="merchant-help-icon">
              ?
            </div>

            <div>

              <strong>
                Need Help?
              </strong>

              <p>
                Contact ShopEase support
              </p>

            </div>

          </div>


          <button
            type="button"
            className="merchant-logout-button"
            onClick={onLogout}
          >

            <span>
              ↪
            </span>

            Logout

          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="merchant-main">

        {/* HEADER */}

        <header className="merchant-header">

          <div>

            <p className="merchant-breadcrumb">
              Merchant / Dashboard
            </p>

            <h1>
              Dashboard
            </h1>

          </div>


          <div className="merchant-header-right">

            {/* NOTIFICATION */}

            <button
              type="button"
              className="merchant-notification"
              title="Notifications"
            >

              ♧

              <span className="notification-dot"></span>

            </button>


            {/* PROFILE */}

            <button
              type="button"
              className="merchant-profile-button"
              onClick={onProfile}
            >

              <div className="merchant-avatar">

                {merchant.name
                  ?.charAt(0)
                  ?.toUpperCase() || "M"}

              </div>


              <div className="merchant-profile-info">

                <strong>
                  {merchant.name ||
                    "Merchant"}
                </strong>

                <span>
                  Merchant
                </span>

              </div>


              <span className="merchant-profile-arrow">
                ▼
              </span>

            </button>

          </div>

        </header>


        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="merchant-welcome">

          <div>

            <p>
              Welcome back 👋
            </p>

            <h2>
              {merchant.name ||
                "Merchant"}
            </h2>

            <span>
              Here's what's happening
              with your store today.
            </span>

          </div>


          <button
            type="button"
            className="merchant-add-product-button"
            onClick={onAddProduct}
          >

            <span>
              +
            </span>

            Add Product

          </button>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {dashboardError && (

          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#fff1f2",
              color: "#b91c1c",
              fontSize: "14px",
            }}
          >
            ⚠️ {dashboardError}
          </div>

        )}


        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="merchant-stats">


          {/* TOTAL PRODUCTS */}

          <div className="merchant-stat-card">

            <div className="merchant-stat-top">

              <div className="merchant-stat-icon products-icon">
                ▣
              </div>

              <span className="stat-growth positive">
                +12%
              </span>

            </div>

            <p>
              Total Products
            </p>

            <h3>

              {dashboardLoading
                ? "..."
                : dashboard.total_products}

            </h3>

            <span className="stat-description">
              Active products in your store
            </span>

          </div>


          {/* TOTAL ORDERS */}

          <div className="merchant-stat-card">

            <div className="merchant-stat-top">

              <div className="merchant-stat-icon orders-icon">
                ▤
              </div>

              <span className="stat-growth positive">
                +8%
              </span>

            </div>

            <p>
              Total Orders
            </p>

            <h3>

              {dashboardLoading
                ? "..."
                : dashboard.total_orders}

            </h3>

            <span className="stat-description">
              Orders received
            </span>

          </div>


          {/* TOTAL SALES */}

          <div className="merchant-stat-card">

            <div className="merchant-stat-top">

              <div className="merchant-stat-icon sales-icon">
                ₹
              </div>

              <span className="stat-growth positive">
                +18%
              </span>

            </div>

            <p>
              Total Sales
            </p>

            <h3>

              ₹
              {dashboardLoading
                ? "..."
                : formattedSales}

            </h3>

            <span className="stat-description">
              Total revenue generated
            </span>

          </div>


          {/* LOW STOCK */}

          <div className="merchant-stat-card">

            <div className="merchant-stat-top">

              <div className="merchant-stat-icon stock-icon">
                !
              </div>

              <span className="stat-growth warning">
                Attention
              </span>

            </div>

            <p>
              Low Stock
            </p>

            <h3>

              {dashboardLoading
                ? "..."
                : dashboard.low_stock}

            </h3>

            <span className="stat-description">
              Products need restocking
            </span>

          </div>

        </section>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="merchant-section">

          <div className="merchant-section-header">

            <div>

              <p>
                QUICK ACTIONS
              </p>

              <h2>
                Manage Your Store
              </h2>

            </div>

          </div>


          <div className="merchant-quick-actions">


            {/* ADD PRODUCT */}

            <button
              type="button"
              onClick={onAddProduct}
              className="merchant-action-card"
            >

              <div className="action-card-icon purple">
                +
              </div>

              <div>

                <strong>
                  Add Product
                </strong>

                <span>
                  Add a new product to your store
                </span>

              </div>

              <span className="action-arrow">
                →
              </span>

            </button>


            {/* PRODUCTS */}

            <button
              type="button"
              onClick={onProducts}
              className="merchant-action-card"
            >

              <div className="action-card-icon blue">
                ▣
              </div>

              <div>

                <strong>
                  Manage Products
                </strong>

                <span>
                  Edit or remove your products
                </span>

              </div>

              <span className="action-arrow">
                →
              </span>

            </button>


            {/* ORDERS */}

            <button
              type="button"
              onClick={onOrders}
              className="merchant-action-card"
            >

              <div className="action-card-icon green">
                ▤
              </div>

              <div>

                <strong>
                  View Orders
                </strong>

                <span>
                  Check and manage customer orders
                </span>

              </div>

              <span className="action-arrow">
                →
              </span>

            </button>

          </div>

        </section>


        {/* =================================================
            RECENT ORDERS + LOW STOCK
        ================================================= */}

        <div className="merchant-dashboard-grid">


          {/* =================================================
              RECENT ORDERS
          ================================================= */}

          <section className="merchant-panel">

            <div className="merchant-panel-header">

              <div>

                <p>
                  RECENT ACTIVITY
                </p>

                <h2>
                  Recent Orders
                </h2>

              </div>


              <button
                type="button"
                onClick={onOrders}
                className="view-all-button"
              >
                View All →
              </button>

            </div>


            <div className="merchant-orders-list">

              {dashboardLoading ? (

                <div className="merchant-empty-state">
                  Loading orders...
                </div>

              ) : dashboard.recent_orders.length === 0 ? (

                <div className="merchant-empty-state">
                  📦 No orders received yet.
                </div>

              ) : (

                dashboard.recent_orders.map(
                  (order) => {

                    const status =
                      order.order_status ||
                      "Placed";

                    return (

                      <div
                        className="merchant-order-row"
                        key={order.id}
                      >

                        <div className="order-product-icon">

                          {order.product_names
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "P"}

                        </div>


                        <div className="order-info">

                          <strong>
                            {order.product_names ||
                              "Product"}
                          </strong>

                          <span>
                            #{order.id}
                            {" • "}
                            {order.customer_name ||
                              "Customer"}
                          </span>

                        </div>


                        <strong className="order-amount">

                          ₹
                          {Number(
                            order.total_amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </strong>


                        <span
                          className={`order-status ${String(
                            status
                          )
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >
                          {status}
                        </span>

                      </div>

                    );
                  }
                )

              )}

            </div>

          </section>


          {/* =================================================
              LOW STOCK
          ================================================= */}

          <section className="merchant-panel">

            <div className="merchant-panel-header">

              <div>

                <p>
                  INVENTORY
                </p>

                <h2>
                  Low Stock
                </h2>

              </div>


              <button
                type="button"
                onClick={onInventory}
                className="view-all-button"
              >
                View All →
              </button>

            </div>


            <div className="low-stock-list">

              {dashboardLoading ? (

                <div className="merchant-empty-state">
                  Checking inventory...
                </div>

              ) : dashboard.low_stock_products.length === 0 ? (

                <div className="merchant-empty-state">
                  🎉 All products have sufficient stock.
                </div>

              ) : (

                dashboard.low_stock_products.map(
                  (product) => (

                    <div
                      className="low-stock-row"
                      key={product.id}
                    >

                      <div className="stock-product-icon">

                        {product.name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "P"}

                      </div>


                      <div className="stock-product-info">

                        <strong>
                          {product.name}
                        </strong>

                        <span>
                          Only{" "}
                          {product.stock}{" "}
                          items left
                        </span>

                      </div>


                      <span className="stock-warning">
                        Low Stock
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </section>

        </div>


        {/* =================================================
            STORE SUMMARY
        ================================================= */}

        <section className="merchant-store-summary">

          <div className="store-summary-content">

            <div className="store-summary-icon">
              S
            </div>

            <div>

              <p>
                YOUR STORE
              </p>

              <h2>
                {merchant.businessName ||
                  merchant.business_name ||
                  "My Store"}
              </h2>

              <span>
                {merchant.email || ""}
              </span>

            </div>

          </div>


          <button
            type="button"
            onClick={onProfile}
            className="store-profile-button"
          >
            Manage Store Profile →
          </button>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="merchant-footer">

          <span>
            © 2026 ShopEase Merchant
          </span>

          <span>
            Merchant Dashboard
          </span>

        </footer>

      </main>

    </div>
  );
}

export default MerchantHome;