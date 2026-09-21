import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminCustomers.css";

function AdminCustomers({ onBack, admin }) {

  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================
  //  CUSTOMERS
  // =====================================

  const fetchCustomers = async () => {

    try {

      setLoading(true);
      setError("");

     // =====================================
// GET ADMIN LOGIN TOKEN
// =====================================

const token =
  admin?.token ||
  localStorage.getItem("adminToken");

console.log("=================================");
console.log(
  "ADMIN CUSTOMERS TOKEN:",
  token ? "Token found" : "Token missing"
);
console.log(
  "ADMIN CUSTOMERS USER:",
  localStorage.getItem("adminUser")
);
console.log("ADMIN OBJECT:", admin);
console.log("=================================");

// =====================================
// TOKEN CHECK
// =====================================

if (!token) {
  throw new Error(
    "Authentication required. Please login again."
  );
}

// =====================================
// GET CUSTOMERS FROM BACKEND
// =====================================

const response = await fetch(
  `${API_BASE_URL}/api/admin/customers`,
  {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);

      // =====================================
      // READ RESPONSE
      // =====================================

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
        "ADMIN CUSTOMERS RESPONSE:",
        data
      );

      // =====================================
      // CHECK RESPONSE
      // =====================================

      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to load customers"
        );

      }

      // =====================================
      // SAVE CUSTOMERS
      // =====================================

      setCustomers(
        Array.isArray(data.customers)
          ? data.customers
          : []
      );

    } catch (error) {

      console.error(
        "Customers error:",
        error
      );

      setCustomers([]);

      setError(
        error.message ||
        "Unable to load customers"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // LOAD WHEN PAGE OPENS
  // =====================================

  useEffect(() => {

    fetchCustomers();

  }, []);


  // =====================================
  // RENDER
  // =====================================

  return (

    <section className="admin-customers-page">

      {/* =================================
          HEADER
      ================================= */}

      <header className="admin-customers-header">

        <button
          type="button"
          className="admin-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>

          <p>
            ADMIN
          </p>

          <h1>
            Customers
          </h1>

          <span>
            Manage registered ShopEase customers
          </span>

        </div>

      </header>


      {/* =================================
          CONTENT
      ================================= */}

      <main className="admin-customers-content">


        {/* =================================
            SUMMARY
        ================================= */}

        <div className="customers-summary">

          <div>

            <span>
              👤
            </span>

            <div>

              <p>
                Total Customers
              </p>

              <h2>
                {customers.length}
              </h2>

            </div>

          </div>

        </div>


        {/* =================================
            LOADING
        ================================= */}

        {loading && (

          <div className="customers-message">

            Loading customers...

          </div>

        )}


        {/* =================================
            ERROR
        ================================= */}

        {!loading && error && (

          <div className="customers-error">

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={fetchCustomers}
            >
              Try Again
            </button>

          </div>

        )}


        {/* =================================
            EMPTY
        ================================= */}

        {!loading &&
          !error &&
          customers.length === 0 && (

            <div className="customers-message">

              No customers found.

            </div>

          )}


        {/* =================================
            CUSTOMERS TABLE
        ================================= */}

        {!loading &&
          !error &&
          customers.length > 0 && (

            <div className="customers-table-wrapper">

              <table className="customers-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Orders
                    </th>

                    <th>
                      Total Spent
                    </th>

                    <th>
                      Registered
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {customers.map(
                    (customer) => (

                      <tr
                        key={
                          customer.id
                        }
                      >

                        {/* ID */}

                        <td>

                          #
                          {
                            customer.id
                          }

                        </td>


                        {/* CUSTOMER */}

                        <td>

                          <div className="customer-name">

                            <div className="customer-avatar">

                              {
                                customer.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                "C"
                              }

                            </div>

                            <strong>

                              {
                                customer.name
                              }

                            </strong>

                          </div>

                        </td>


                        {/* EMAIL */}

                        <td>

                          {
                            customer.email
                          }

                        </td>


                        {/* PHONE */}

                        <td>

                          {
                            customer.phone ||
                            "Not provided"
                          }

                        </td>


                        {/* ORDERS */}

                        <td>

                          {
                            customer.total_orders ||
                            0
                          }

                        </td>


                        {/* TOTAL SPENT */}

                        <td>

                          ₹
                          {
                            Number(
                              customer.total_spent ||
                              0
                            ).toLocaleString(
                              "en-IN"
                            )
                          }

                        </td>


                        {/* REGISTERED */}

                        <td>

                          {
                            customer.created_at
                              ? new Date(
                                  customer.created_at
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "-"
                          }

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

      </main>

    </section>

  );

}

export default AdminCustomers;