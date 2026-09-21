import React, {
  useEffect,
  useState,
} from "react";

import "./Returns.css";

const API_BASE_URL = "http://3.110.90.184";

const Returns = ({
  deliveryPartner,
}) => {

  const [selectedStatus, setSelectedStatus] =
    useState("All");

  const [returns, setReturns] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================================
     FETCH DELIVERY PARTNER ORDERS
  ========================================= */

  useEffect(() => {

    const fetchReturns = async () => {

      try {

        setLoading(true);
        setError("");

        if (!deliveryPartner?.id) {

          throw new Error(
            "Delivery partner ID not found"
          );

        }

        console.log(
          "DELIVERY PARTNER:",
          deliveryPartner
        );
const token =
  localStorage.getItem("delivery_token");

if (!token) {
  throw new Error(
    "Login token not found. Please login again."
  );
}

const response =
  await fetch(
    `${API_BASE_URL}/api/delivery/my-orders/${deliveryPartner.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

        const data =
          await response.json();

        console.log(
          "ALL DELIVERY ORDERS:",
          data
        );

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to fetch orders"
          );

        }

        const orders =
          data.orders || [];

        console.log(
          "FIRST ORDER:",
          orders[0]
        );

        console.table(orders);


        /* =====================================
           FILTER ONLY RETURN ORDERS
        ===================================== */

        const returnOrders =
          orders.filter((order) => {

            console.log(
              "CHECKING ORDER:",
              order.id,
              "delivery_status:",
              order.delivery_status,
              "return_status:",
              order.return_status,
              "status:",
              order.status
            );

            return (

              order.delivery_status ===
                "Return Requested" ||

              order.delivery_status ===
                "Returned" ||

              order.return_status ===
                "Requested" ||

              order.return_status ===
                "Return Requested" ||

              order.return_status ===
                "Pickup Scheduled" ||

              order.return_status ===
                "Picked Up" ||

              order.return_status ===
                "Return Completed" ||

              order.status ===
                "Return Requested" ||

              order.status ===
                "Returned"

            );

          });


        console.log(
          "FILTERED RETURNS:",
          returnOrders
        );

        setReturns(
          returnOrders
        );


      } catch (error) {

        console.error(
          "Fetch returns error:",
          error
        );

        setError(
          error.message ||
          "Failed to load returns"
        );

      } finally {

        setLoading(false);

      }

    };


    fetchReturns();

  }, [
    deliveryPartner?.id
  ]);


  /* =========================================
     FILTER RETURNS
  ========================================= */

  const filteredReturns =

    selectedStatus === "All"

      ? returns

      : returns.filter(
          (item) =>
            item.return_status ===
            selectedStatus
        );


  /* =========================================
     UPDATE RETURN STATUS
  ========================================= */

  const updateReturnStatus = async (
    orderId,
    newStatus
  ) => {

    try {

      /* ---------------------------------------
         GET LOGIN TOKEN
      --------------------------------------- */

    const token = localStorage.getItem("delivery_token");


      console.log(
        "RETURN UPDATE TOKEN:",
        token
      );


      if (!token) {

        alert(
          "Login token not found. Please login again."
        );

        return;

      }


      /* ---------------------------------------
         UPDATE RETURN STATUS
      --------------------------------------- */

      const response =
        await fetch(
          `${API_BASE_URL}/api/orders/${orderId}/return/status`,
          {

            method: "PUT",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

            body: JSON.stringify({

              return_status:
                newStatus,

            }),

          }
        );


      const data =
        await response.json();


      console.log(
        "UPDATE RESPONSE:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update return"
        );

      }


      /* ---------------------------------------
         UPDATE UI IMMEDIATELY
      --------------------------------------- */

      setReturns(
        (previousReturns) =>

          previousReturns.map(
            (item) =>

              Number(item.id) ===
              Number(orderId)

                ? {

                    ...item,

                    return_status:
                      newStatus,

                  }

                : item
          )
      );


    } catch (error) {

      console.error(
        "Update return error:",
        error
      );


      alert(
        error.message ||
        "Failed to update return"
      );

    }

  };


  /* =========================================
     PAGE
  ========================================= */

  return (

    <div className="returns-page">


      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <section className="returns-header">

        <div>

          <p>
            RETURN MANAGEMENT
          </p>

          <h1>
            Returns
          </h1>

          <span>
            Manage product return pickups
            and updates.
          </span>

        </div>


        <div className="returns-summary">

          <span>
            Total Returns
          </span>

          <strong>
            {returns.length}
          </strong>

        </div>

      </section>


      {/* =====================================
          STATUS FILTER
      ===================================== */}

      <section className="returns-filter">

        {[

          "All",

          "Requested",

          "Pickup Scheduled",

          "Picked Up",

          "Return Completed",

        ].map(
          (status) => (

            <button

              key={status}

              className={
                selectedStatus === status

                  ? "return-filter-button active"

                  : "return-filter-button"
              }

              onClick={() =>
                setSelectedStatus(
                  status
                )
              }

            >

              {status ===
              "Requested"

                ? "Return Requested"

                : status}

            </button>

          )
        )}

      </section>


      {/* =====================================
          LOADING
      ===================================== */}

      {loading && (

        <div className="returns-empty">

          <div>
            ⏳
          </div>

          <h3>
            Loading returns...
          </h3>

        </div>

      )}


      {/* =====================================
          ERROR
      ===================================== */}

      {!loading &&
        error && (

          <div className="returns-empty">

            <div>
              ⚠️
            </div>

            <h3>
              Failed to load returns
            </h3>

            <p>
              {error}
            </p>

          </div>

        )}


      {/* =====================================
          RETURNS LIST
      ===================================== */}

      {!loading &&
        !error && (

          <section className="returns-list">


            {filteredReturns.map(
              (item) => (

                <div
                  className="return-card"
                  key={item.id}
                >


                  {/* =================================
                      TOP
                  ================================= */}

                  <div className="return-card-top">


                    <div className="return-order-info">


                      <div className="return-icon">
                        ↩
                      </div>


                      <div>

                        <strong>
                          #{item.id}
                        </strong>


                        <span>
                          {item.product_names ||
                            "Product"}
                        </span>

                      </div>

                    </div>


                    {/* RETURN STATUS */}

                    <span
                      className={
                        `return-status ${
                          String(
                            item.return_status ||
                            "Requested"
                          )
                            .toLowerCase()
                            .replaceAll(
                              " ",
                              "-"
                            )
                        }`
                      }
                    >

                      {item.return_status ===
                      "Requested"

                        ? "Return Requested"

                        : (
                            item.return_status ||
                            "Return Requested"
                          )}

                    </span>

                  </div>


                  {/* =================================
                      CUSTOMER INFORMATION
                  ================================= */}

                  <div className="return-customer-info">


                    {/* CUSTOMER */}

                    <div>

                      <small>
                        Customer
                      </small>

                      <strong>
                        {item.customer_name ||
                          item.user_name ||
                          "Customer"}
                      </strong>

                    </div>


                    {/* RETURN REASON */}

                    <div>

                      <small>
                        Return Reason
                      </small>

                      <strong>
                        {item.return_reason ||
                          "Not specified"}
                      </strong>

                    </div>


                    {/* PICKUP ADDRESS */}

                    <div>

                      <small>
                        Pickup Address
                      </small>

                      <strong>

                        📍{" "}

                        {item.address_line ||
                          item.shipping_address ||
                          "Address not available"}

                      </strong>

                    </div>

                  </div>


                  {/* =================================
                      ACTIONS
                  ================================= */}

                  <div className="return-actions">


                    {/* VIEW DETAILS */}

                    <button
                      className="return-view-button"
                    >
                      View Details
                    </button>


                    {/* =================================
                        REQUESTED
                    ================================= */}

                    {item.return_status ===
                      "Requested" && (

                      <button

                        className="return-primary-button"

                        onClick={() =>
                          updateReturnStatus(
                            item.id,
                            "Pickup Scheduled"
                          )
                        }

                      >

                        Schedule Pickup

                      </button>

                    )}


                    {/* =================================
                        PICKUP SCHEDULED
                    ================================= */}

                    {item.return_status ===
                      "Pickup Scheduled" && (

                      <button

                        className="return-primary-button"

                        onClick={() =>
                          updateReturnStatus(
                            item.id,
                            "Picked Up"
                          )
                        }

                      >

                        Mark as Picked Up

                      </button>

                    )}


                    {/* =================================
                        PICKED UP
                    ================================= */}

                    {item.return_status ===
                      "Picked Up" && (

                      <button

                        className="return-primary-button"

                        onClick={() =>
                          updateReturnStatus(
                            item.id,
                            "Return Completed"
                          )
                        }

                      >

                        Complete Return

                      </button>

                    )}

                  </div>

                </div>

              )
            )}


            {/* =====================================
                NO RETURNS
            ===================================== */}

            {filteredReturns.length ===
              0 && (

              <div className="returns-empty">

                <div>
                  📦
                </div>

                <h3>
                  No returns found
                </h3>

                <p>
                  There are no return requests
                  in this category.
                </p>

              </div>

            )}

          </section>

        )}

    </div>

  );

};


export default Returns;