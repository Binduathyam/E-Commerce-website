import React, {
  useEffect,
  useState,
} from "react";

import "./DeliveryDashboard.css";

import MyDeliveries from "./MyDeliveries";
import AssignedOrders from "./AssignedOrders";
import Returns from "./Returns";
import DeliveryHistory from "./DeliveryHistory";
import Earnings from "./Earnings";
import Profile from "./Profile";


const API_BASE_URL = "http://3.110.90.184";


const DeliveryDashboard = ({
  deliveryPartner,
  onLogout,
}) => {

  /* =====================================================
     PAGE
  ===================================================== */

  const [activePage, setActivePage] =
    useState("Dashboard");


  /* =====================================================
     AVAILABILITY
  ===================================================== */

  const [isAvailable, setIsAvailable] = useState(
  deliveryPartner?.availability_status === "Online"
);

const handleAvailabilityToggle = async () => {
  if (!deliveryPartner?.id) return;

  const newStatus = isAvailable ? "Offline" : "Online";

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/delivery/availability/${deliveryPartner.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availability_status: newStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update availability");
    }

    setIsAvailable(data.availability_status === "Online");
  } catch (error) {
    console.error("Availability update error:", error);
    alert(error.message || "Failed to update availability");
  }
};
  /* =====================================================
     DASHBOARD STATS
  ===================================================== */

  const [stats, setStats] =
    useState([
      {
        icon: "📦",
        title: "Assigned Orders",
        value: "0",
        description:
          "Orders assigned to you",
      },

      {
        icon: "🚚",
        title: "Out for Delivery",
        value: "0",
        description:
          "Currently delivering",
      },

      {
        icon: "✓",
        title: "Delivered Today",
        value: "0",
        description:
          "Successfully delivered",
      },

      {
        icon: "↩",
        title: "Returns",
        value: "0",
        description:
          "Return requests",
      },
    ]);


  /* =====================================================
     RECENT ORDERS
  ===================================================== */

  const [recentOrders, setRecentOrders] =
    useState([]);


  /* =====================================================
     LOADING
  ===================================================== */

  const [loading, setLoading] =
    useState(true);


  /* =====================================================
     LOAD DASHBOARD DATA
  ===================================================== */

  useEffect(() => {

    if (!deliveryPartner?.id) {

      setLoading(false);

      return;
    }


    const loadDashboardData =
      async () => {

        try {

          setLoading(true);


          /* ==========================================
             FETCH DELIVERY PARTNER ORDERS
          ========================================== */

          const response =
            await fetch(
              `${API_BASE_URL}/api/delivery/my-orders/${deliveryPartner.id}`
            );


          const data =
            await response.json();


          /* ==========================================
             CHECK RESPONSE
          ========================================== */

          if (!response.ok) {

            throw new Error(
              data.message ||
              "Failed to load dashboard"
            );

          }


          /* ==========================================
             ORDERS
          ========================================== */

          const orders =
            Array.isArray(data.orders)
              ? data.orders
              : [];


          /* ==========================================
             DEBUG
          ========================================== */

          console.log(
            "DASHBOARD ORDERS:",
            orders
          );


          console.table(
            orders.map(
              (order) => ({
                id:
                  order.id,

                delivery_status:
                  order.delivery_status,

                order_status:
                  order.order_status,

                return_status:
                  order.return_status,

                created_at:
                  order.created_at,

                delivered_at:
                  order.delivered_at,
              })
            )
          );


          /* =================================================
             ASSIGNED ORDERS
          ================================================= */

          const assignedOrders =
            orders.filter(
              (order) =>
                String(
                  order.delivery_status ||
                  ""
                )
                  .trim()
                  .toLowerCase() ===
                "assigned"
            ).length;


          /* =================================================
             OUT FOR DELIVERY
          ================================================= */

          const outForDelivery =
            orders.filter(
              (order) =>
                String(
                  order.delivery_status ||
                  ""
                )
                  .trim()
                  .toLowerCase() ===
                "out for delivery"
            ).length;


          /* =================================================
             DELIVERED ORDERS
          ================================================= */

          const deliveredOrders =
            orders.filter(
              (order) =>
                String(
                  order.delivery_status ||
                  ""
                )
                  .trim()
                  .toLowerCase() ===
                "delivered"
            );


          /* =================================================
             DELIVERED TODAY
          ================================================= */

          const today =
            new Date()
              .toLocaleDateString(
                "en-CA",
                {
                  timeZone:
                    "Asia/Kolkata",
                }
              );


          const deliveredToday =
            deliveredOrders.filter(
              (order) => {

                /*
                  Prefer delivered_at because
                  the order may have been created
                  on an earlier day.
                */

                const dateValue =
                  order.delivered_at ||
                  order.created_at;


                if (!dateValue) {
                  return false;
                }


                const orderDate =
                  new Date(
                    dateValue
                  )
                    .toLocaleDateString(
                      "en-CA",
                      {
                        timeZone:
                          "Asia/Kolkata",
                      }
                    );


                return (
                  orderDate ===
                  today
                );

              }
            ).length;


          /* =================================================
             RETURNS
          ================================================= */

          const returns =
            orders.filter(
              (order) =>
                [
                  "Requested",
                  "Pickup Scheduled",
                  "Picked Up",
                  "Return Completed",
                ].includes(
                  String(
                    order.return_status ||
                    ""
                  ).trim()
                )
            ).length;


          /* =================================================
             UPDATE STATS
          ================================================= */

          setStats([

            {
              icon: "📦",
              title:
                "Assigned Orders",

              value:
                String(
                  assignedOrders
                ),

              description:
                "Orders waiting for acceptance",
            },


            {
              icon: "🚚",
              title:
                "Out for Delivery",

              value:
                String(
                  outForDelivery
                ),

              description:
                "Currently delivering",
            },


            {
              icon: "✓",
              title:
                "Delivered Today",

              value:
                String(
                  deliveredToday
                ),

              description:
                "Successfully delivered",
            },


            {
              icon: "↩",
              title:
                "Returns",

              value:
                String(
                  returns
                ),

              description:
                "Return requests",
            },

          ]);


          /* =================================================
             RECENT ORDERS
          ================================================= */

          const latestOrders =
            orders
              .filter(
                (order) =>
                  order.delivery_status !==
                    "Delivered" ||
                  order.return_status
              )
              .slice(0, 5);


          setRecentOrders(
            latestOrders
          );

        } catch (error) {

          console.error(
            "Dashboard error:",
            error
          );

        } finally {

          setLoading(false);

        }

      };


    loadDashboardData();

  }, [
    deliveryPartner?.id
  ]);


  /* =====================================================
     SIDEBAR MENU
  ===================================================== */

  const menuItems = [

    {
      name: "Dashboard",
      icon: "⌂",
    },

    {
      name: "My Deliveries",
      icon: "📦",
    },

    {
      name: "Assigned Orders",
      icon: "📋",
    },

    {
      name: "Returns",
      icon: "↩",
    },

    {
      name: "Delivery History",
      icon: "◷",
    },

    {
      name: "Earnings",
      icon: "₹",
    },

    {
      name: "Profile",
      icon: "👤",
    },

  ];


  /* =====================================================
     FORMAT ADDRESS
  ===================================================== */

  const getAddress = (
    order
  ) => {

    if (
      !order.shipping_address
    ) {

      return "Address not available";

    }


    if (
      typeof
      order.shipping_address ===
      "string"
    ) {

      try {

        const address =
          JSON.parse(
            order.shipping_address
          );


        return [

          address.address_line1,

          address.address_line2,

          address.city,

          address.state,

          address.pincode,

        ]
          .filter(Boolean)
          .join(", ");

      } catch {

        return (
          order.shipping_address
        );

      }

    }


    /*
      If backend already returns an
      object, format it here.
    */

    if (
      typeof
      order.shipping_address ===
      "object"
    ) {

      const address =
        order.shipping_address;


      return [

        address.address_line1,

        address.address_line2,

        address.city,

        address.state,

        address.pincode,

      ]
        .filter(Boolean)
        .join(", ") ||
        "Address not available";

    }


    return "Address not available";

  };


  /* =====================================================
     RENDER PAGE
  ===================================================== */

  const renderPage = () => {

    switch (
      activePage
    ) {


      /* ================================================
         MY DELIVERIES
      ================================================ */

      case "My Deliveries":

        return (

          <MyDeliveries
            deliveryPartner={
              deliveryPartner
            }
          />

        );


      /* ================================================
         ASSIGNED ORDERS
      ================================================ */

      case "Assigned Orders":

        return (

          <AssignedOrders
            deliveryPartner={
              deliveryPartner
            }
          />

        );


      /* ================================================
         RETURNS
      ================================================ */

      case "Returns":

        return (

          <Returns
            deliveryPartner={
              deliveryPartner
            }
          />

        );


      /* ================================================
         DELIVERY HISTORY
      ================================================ */

      case "Delivery History":

        return (

          <DeliveryHistory
            deliveryPartner={
              deliveryPartner
            }
          />

        );


      /* ================================================
         EARNINGS
      ================================================ */

      case "Earnings":

        return (

          <Earnings
            deliveryPartner={
              deliveryPartner
            }
          />

        );


      /* ================================================
         PROFILE
      ================================================ */

      case "Profile":

        return (

          <Profile
            deliveryPartner={
              deliveryPartner
            }
          />

        );


      /* ================================================
         DASHBOARD
      ================================================ */

      default:

        return (

          <>


            {/* =========================================
                PAGE HEADING
            ========================================= */}

            <section
              className="delivery-page-heading"
            >

              <div>

                <p>
                  OVERVIEW
                </p>


                <h1>
                  Dashboard
                </h1>


                <span>

                  Welcome back

                  {deliveryPartner?.name
                    ? `, ${deliveryPartner.name}`
                    : ""}

                  !

                  {" "}

                  Here is your delivery
                  activity.

                </span>

              </div>


              <div
                className="delivery-date"
              >

                📅 Today

              </div>

            </section>


            {/* =========================================
                WELCOME CARD
            ========================================= */}

            <section
              className="delivery-welcome-card"
            >

              <div>

                <p>
                  GOOD MORNING 👋
                </p>


                <h2>
                  Ready to start
                  delivering?
                </h2>


                <span>

                  You have{" "}

                  {
                    stats[0]?.value ||
                    "0"
                  }

                  {" "}
                  orders waiting for you.

                </span>

              </div>


              <div
                className="delivery-welcome-icon"
              >

                🚚

              </div>

            </section>


            {/* =========================================
                STATISTICS
            ========================================= */}

            <section
              className="delivery-stat-grid"
            >

              {stats.map(
                (stat) => (

                  <div
                    className="delivery-stat-card"
                    key={
                      stat.title
                    }
                  >

                    <div
                      className="delivery-stat-icon"
                    >

                      {
                        stat.icon
                      }

                    </div>


                    <span>

                      {
                        stat.title
                      }

                    </span>


                    <strong>

                      {
                        loading
                          ? "..."
                          : stat.value
                      }

                    </strong>


                    <small>

                      {
                        stat.description
                      }

                    </small>

                  </div>

                )
              )}

            </section>


            {/* =========================================
                TODAY'S DELIVERIES
            ========================================= */}

            <section
              className="delivery-orders-section"
            >

              <div
                className="delivery-section-heading"
              >

                <div>

                  <p>
                    TODAY'S ACTIVITY
                  </p>


                  <h2>
                    Recent Deliveries
                  </h2>

                </div>


                <button
                  onClick={() =>
                    setActivePage(
                      "My Deliveries"
                    )
                  }
                >

                  View All →

                </button>

              </div>


              {/* =====================================
                  ORDERS
              ===================================== */}

              <div
                className="delivery-order-list"
              >

                {loading && (

                  <p>
                    Loading orders...
                  </p>

                )}


                {!loading &&
                  recentOrders.length ===
                    0 && (

                    <p>
                      No recent deliveries
                      found.
                    </p>

                  )}


                {!loading &&
                  recentOrders.map(
                    (order) => (

                      <div
                        className="delivery-order-row"
                        key={
                          order.id
                        }
                      >

                        <div
                          className="delivery-order-left"
                        >

                          <div
                            className="delivery-order-icon"
                          >

                            📦

                          </div>


                          <div>

                            <strong>

                              #
                              {
                                order.id
                              }

                            </strong>


                            <span>

                              Customer ID:{" "}

                              {
                                order.user_id ||
                                "N/A"
                              }

                            </span>


                            <small>

                              📍{" "}

                              {
                                getAddress(
                                  order
                                )
                              }

                            </small>

                          </div>

                        </div>


                        <div
                          className="delivery-order-right"
                        >

                          <span
                            className="delivery-status"
                          >

                            {
                              order.delivery_status ||
                              "Assigned"
                            }

                          </span>


                          <button
                            className="delivery-view-button"
                            onClick={() =>
                              setActivePage(
                                "My Deliveries"
                              )
                            }
                          >

                            View

                          </button>

                        </div>

                      </div>

                    )
                  )}

              </div>

            </section>


            {/* =========================================
                QUICK ACTIONS
            ========================================= */}

            <section
              className="delivery-quick-section"
            >

              <div
                className="delivery-section-heading"
              >

                <div>

                  <p>
                    QUICK ACTIONS
                  </p>


                  <h2>
                    Manage Deliveries
                  </h2>

                </div>

              </div>


              <div
                className="delivery-quick-grid"
              >

                {/* =================================
                    ASSIGNED ORDERS
                ================================= */}

                <button
                  onClick={() =>
                    setActivePage(
                      "Assigned Orders"
                    )
                  }
                >

                  <span>
                    📦
                  </span>


                  <strong>
                    View Assigned Orders
                  </strong>


                  <small>
                    Check all orders
                    assigned to you
                  </small>

                </button>


                {/* =================================
                    START DELIVERY
                ================================= */}

                <button
                  onClick={() =>
                    setActivePage(
                      "My Deliveries"
                    )
                  }
                >

                  <span>
                    🚚
                  </span>


                  <strong>
                    Start Delivery
                  </strong>


                  <small>
                    Update your delivery
                    status
                  </small>

                </button>


                {/* =================================
                    MANAGE RETURNS
                ================================= */}

                <button
                  onClick={() =>
                    setActivePage(
                      "Returns"
                    )
                  }
                >

                  <span>
                    ↩
                  </span>


                  <strong>
                    Manage Returns
                  </strong>


                  <small>
                    View and update
                    return requests
                  </small>

                </button>

              </div>

            </section>

          </>

        );

    }

  };


  /* =====================================================
     MAIN RETURN
  ===================================================== */

  return (

    <div
      className="delivery-page"
    >


      {/* ================================================
          TOP HEADER
      ================================================ */}

      <header
        className="delivery-topbar"
      >

        {/* ==============================================
            BRAND
        ============================================== */}

        <div
          className="delivery-brand"
        >

          <div
            className="delivery-brand-mark"
          >

            S

          </div>


          <div>

            <strong>

              Shop
              <span>
                Ease
              </span>

            </strong>


            <small>
              Delivery Partner
            </small>

          </div>

        </div>


        {/* ==============================================
            TOP RIGHT
        ============================================== */}

        <div
          className="delivery-topbar-right"
        >


          {/* ============================================
              AVAILABILITY
          ============================================ */}

          <div
            className="delivery-availability"
          >

            <span
              className={
                isAvailable
                  ? "availability-dot online"
                  : "availability-dot offline"
              }
            />


            <span>

              {
                isAvailable
                  ? "Available"
                  : "Unavailable"
              }

            </span>


           <button onClick={handleAvailabilityToggle}>
  {isAvailable ? "Go Offline" : "Go Online"}
</button>
          </div>


          {/* ============================================
              USER
          ============================================ */}

          <div
            className="delivery-user"
          >

            <div
              className="delivery-avatar"
            >

              {
                deliveryPartner?.name
                  ? deliveryPartner.name
                      .charAt(0)
                      .toUpperCase()
                  : "D"
              }

            </div>


            <div>

              <strong>

                {
                  deliveryPartner?.name ||
                  "Delivery Partner"
                }

              </strong>


              <span>

                {
                  deliveryPartner?.city ||
                  "Not specified"
                }

              </span>

            </div>

          </div>


          {/* ============================================
              LOGOUT
          ============================================ */}

          <button
            className="delivery-logout"
            onClick={onLogout}
          >

            Logout

          </button>

        </div>

      </header>


      {/* =================================================
          MAIN LAYOUT
      ================================================= */}

      <div
        className="delivery-layout"
      >


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          className="delivery-sidebar"
        >

          <div
            className="delivery-sidebar-title"
          >

            DELIVERY PANEL

          </div>


          <nav
            className="delivery-nav"
          >

            {
              menuItems.map(
                (item) => (

                  <button
  key={item.name}

  id={
    item.name === "My Deliveries"
      ? "tour-delivery-my-deliveries"
      : item.name === "Assigned Orders"
      ? "tour-delivery-assigned-orders"
      : item.name === "Returns"
      ? "tour-delivery-returns"
      : item.name === "Delivery History"
      ? "tour-delivery-history"
      : item.name === "Earnings"
      ? "tour-delivery-earnings"
      : item.name === "Profile"
      ? "tour-delivery-profile"
      : undefined
  }

  className={
    activePage === item.name
      ? "delivery-nav-item active"
      : "delivery-nav-item"
  }

  onClick={() =>
    setActivePage(item.name)
  }
>

                    <span
                      className="delivery-nav-icon"
                    >

                      {
                        item.icon
                      }

                    </span>


                    <span>

                      {
                        item.name
                      }

                    </span>

                  </button>

                )
              )
            }

          </nav>


          {/* =================================================
              LOCATION
          ================================================= */}

          <div
            className="delivery-sidebar-bottom"
          >

            <div
              className="delivery-location-card"
            >

              <span
                className="location-icon"
              >

                📍

              </span>


              <div>

                <strong>
                  Delivery Location
                </strong>


                <span>

                  {
                    deliveryPartner?.city ||
                    "Not specified"
                  }

                </span>

              </div>

            </div>

          </div>

        </aside>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main
          className="delivery-main"
        >

          {
            renderPage()
          }

        </main>

      </div>

    </div>

  );

};


export default DeliveryDashboard;