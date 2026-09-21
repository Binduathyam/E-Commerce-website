import React, {
  useEffect,
  useState,
} from "react";

import "./Earnings.css";


/* =================================
   LOCAL BACKEND URL
================================= */

const API_BASE_URL = "http://3.110.90.184";


const Earnings = ({
  deliveryPartner,
}) => {

  const [activeTab, setActiveTab] =
    useState("This Week");

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =================================
     LOAD DELIVERY HISTORY
  ================================= */

  useEffect(() => {

    if (
      !deliveryPartner?.id
    ) {
      setLoading(false);

      setError(
        "Delivery partner not found"
      );

      return;
    }


    const loadEarnings = async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await fetch(

            `${API_BASE_URL}/api/delivery/history/${deliveryPartner.id}`

          );


        const data =
          await response.json();


        console.log(
          "Earnings API response:",
          data
        );


        if (
          !response.ok ||
          !data.success
        ) {

          throw new Error(

            data.message ||
            "Failed to load earnings"

          );

        }


        setOrders(
          data.orders || []
        );


      } catch (error) {

        console.error(
          "Earnings error:",
          error
        );

        setError(
          error.message
        );

      } finally {

        setLoading(false);

      }

    };


    loadEarnings();


  }, [
    deliveryPartner?.id
  ]);


  /* =================================
     DATE HELPERS
  ================================= */

  const isToday = (
    dateString
  ) => {

    if (!dateString)
      return false;


    const date =
      new Date(dateString);

    const today =
      new Date();


    return (

      date.getDate() ===
        today.getDate() &&

      date.getMonth() ===
        today.getMonth() &&

      date.getFullYear() ===
        today.getFullYear()

    );

  };


  const isThisWeek = (
    dateString
  ) => {

    if (!dateString)
      return false;


    const date =
      new Date(dateString);

    const today =
      new Date();


    const firstDay =
      new Date(today);


    firstDay.setDate(
      today.getDate() -
      today.getDay()
    );


    firstDay.setHours(
      0,
      0,
      0,
      0
    );


    return date >= firstDay;

  };


  const isThisMonth = (
    dateString
  ) => {

    if (!dateString)
      return false;


    const date =
      new Date(dateString);

    const today =
      new Date();


    return (

      date.getMonth() ===
        today.getMonth() &&

      date.getFullYear() ===
        today.getFullYear()

    );

  };


  /* =================================
     FILTER ORDERS
  ================================= */

  const filteredOrders =
    orders.filter(
      (order) => {

        const date =
          order.delivered_at ||
          order.updated_at ||
          order.created_at;


        if (
          activeTab ===
          "Today"
        ) {

          return isToday(date);

        }


        if (
          activeTab ===
          "This Week"
        ) {

          return isThisWeek(date);

        }


        if (
          activeTab ===
          "This Month"
        ) {

          return isThisMonth(date);

        }


        return true;

      }
    );


  /* =================================
     CALCULATE EARNINGS

     IMPORTANT:
     Currently earning = 10% of
     order total amount.

     You can change this later.
  ================================= */

  const calculateEarning =
    (order) => {

      const amount =
        Number(
          order.total_amount || 0
        );


      return amount * 0.10;

    };


  const totalEarnings =
    filteredOrders.reduce(

      (total, order) => {

        return (

          total +
          calculateEarning(order)

        );

      },

      0

    );


  const completedDeliveries =
    filteredOrders.length;


  const averagePerDelivery =
    completedDeliveries > 0

      ? totalEarnings /
        completedDeliveries

      : 0;


  /* =================================
     TODAY TOTAL
  ================================= */

  const todayOrders =
    orders.filter(
      (order) => {

        const date =
          order.delivered_at ||
          order.updated_at ||
          order.created_at;


        return isToday(date);

      }
    );


  const todayEarnings =
    todayOrders.reduce(

      (total, order) => {

        return (

          total +
          calculateEarning(order)

        );

      },

      0

    );


  /* =================================
     FORMAT DATE
  ================================= */

  const formatDate =
    (dateString) => {

      if (!dateString)
        return "N/A";


      const date =
        new Date(dateString);


      return date.toLocaleString(
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


  /* =================================
     LOADING
  ================================= */

  if (loading) {

    return (

      <div
        className="earnings-page"
      >

        <h2>
          Loading earnings...
        </h2>

      </div>

    );

  }


  /* =================================
     ERROR
  ================================= */

  if (error) {

    return (

      <div
        className="earnings-page"
      >

        <h2>
          Unable to load earnings
        </h2>


        <p>
          {error}
        </p>

      </div>

    );

  }


  /* =================================
     MAIN RETURN
  ================================= */

  return (

    <div
      className="earnings-page"
    >


      {/* =========================
          HEADER
      ========================= */}

      <section
        className="earnings-header"
      >

        <div>

          <p>
            PAYMENTS
          </p>


          <h1>
            Earnings
          </h1>


          <span>

            Track your delivery
            earnings and payment
            history.

          </span>

        </div>


        <div
          className="earnings-wallet"
        >

          <span>
            Total Earnings
          </span>


          <strong>

            ₹
            {totalEarnings.toFixed(2)}

          </strong>

        </div>

      </section>



      {/* =========================
          TABS
      ========================= */}

      <section
        className="earnings-tabs"
      >

        {[
          "Today",
          "This Week",
          "This Month"
        ].map(
          (tab) => (

            <button

              key={tab}

              className={

                activeTab === tab

                  ? "earnings-tab active"

                  : "earnings-tab"

              }

              onClick={() =>
                setActiveTab(tab)
              }

            >

              {tab}

            </button>

          )
        )}

      </section>



      {/* =========================
          MAIN EARNINGS CARD
      ========================= */}

      <section
        className="earnings-main-card"
      >

        <div
          className="earnings-main-left"
        >

          <span>
            Total Earnings
          </span>


          <h2>

            ₹
            {totalEarnings.toFixed(2)}

          </h2>


          <p>

            Earnings for{" "}

            {activeTab.toLowerCase()}

          </p>

        </div>


        <div
          className="earnings-main-icon"
        >

          ₹

        </div>

      </section>



      {/* =========================
          STATISTICS
      ========================= */}

      <section
        className="earnings-stat-grid"
      >


        {/* COMPLETED DELIVERIES */}

        <div
          className="earnings-stat-card"
        >

          <div
            className="earnings-stat-icon"
          >

            📦

          </div>


          <span>
            Completed Deliveries
          </span>


          <strong>

            {completedDeliveries}

          </strong>


          <small>

            Successfully completed
            orders

          </small>

        </div>



        {/* TODAY EARNINGS */}

        <div
          className="earnings-stat-card"
        >

          <div
            className="earnings-stat-icon"
          >

            💰

          </div>


          <span>
            Today's Earnings
          </span>


          <strong>

            ₹
            {todayEarnings.toFixed(2)}

          </strong>


          <small>

            Earnings from today's
            deliveries

          </small>

        </div>



        {/* AVERAGE */}

        <div
          className="earnings-stat-card"
        >

          <div
            className="earnings-stat-icon"
          >

            📈

          </div>


          <span>
            Average Per Delivery
          </span>


          <strong>

            ₹
            {averagePerDelivery.toFixed(2)}

          </strong>


          <small>

            Average earning
            per order

          </small>

        </div>


      </section>



      {/* =========================
          PAYMENT SUMMARY
      ========================= */}

      <section
        className="payment-summary"
      >

        <div
          className="payment-summary-content"
        >

          <div>

            <p>
              AVAILABLE EARNINGS
            </p>


            <h2>

              ₹
              {totalEarnings.toFixed(2)}

            </h2>


            <span>

              Earnings from your
              completed deliveries.

            </span>

          </div>


          <div
            className="payment-date"
          >

            <span>
              Completed Orders
            </span>


            <strong>

              {completedDeliveries}

            </strong>

          </div>

        </div>

      </section>



      {/* =========================
          TRANSACTION HISTORY
      ========================= */}

      <section
        className="earnings-transactions"
      >

        <div
          className="earnings-section-heading"
        >

          <div>

            <p>
              RECENT ACTIVITY
            </p>


            <h2>
              Recent Earnings
            </h2>

          </div>

        </div>



        {/* =========================
            EMPTY STATE
        ========================= */}

        {filteredOrders.length === 0 ? (

          <div
            className="earnings-empty"
          >

            <h3>
              No completed deliveries
            </h3>


            <p>

              No earnings found for{" "}

              {activeTab.toLowerCase()}.

            </p>

          </div>

        ) : (

          <div
            className="earnings-transaction-list"
          >

            {filteredOrders.map(
              (order) => {

                const earning =
                  calculateEarning(
                    order
                  );


                const date =
                  order.delivered_at ||
                  order.updated_at ||
                  order.created_at;


                return (

                  <div

                    className="earnings-transaction"

                    key={order.id}

                  >


                    <div
                      className="transaction-left"
                    >

                      <div
                        className="transaction-icon"
                      >

                        ₹

                      </div>


                      <div>

                        <strong>

                          #ORD
                          {order.id}

                        </strong>


                        <span>

                          Order ID:
                          {" "}
                          {order.id}

                        </span>


                        <small>

                          {formatDate(
                            date
                          )}

                        </small>

                      </div>

                    </div>



                    <div
                      className="transaction-right"
                    >

                      <strong>

                        +₹
                        {earning.toFixed(2)}

                      </strong>


                      <span>

                        Completed

                      </span>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </section>

    </div>

  );

};


export default Earnings;