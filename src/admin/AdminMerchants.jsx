import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminMerchants.css";

function AdminMerchants({ onBack, admin }) {

  const [merchants, setMerchants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================
  // FETCH MERCHANTS
  // =====================================

  const fetchMerchants = async () => {

    try {

      setLoading(true);
      setError("");


      // =====================================
      // GET LOGIN TOKEN
      // =====================================

      const token =
  admin?.token ||
  localStorage.getItem("adminToken");


      console.log(
        "ADMIN MERCHANTS TOKEN:",
        token ? "Token found" : "Token missing"
      );


      // =====================================
      // TOKEN CHECK
      // =====================================

      if (!token) {

        throw new Error(
          "Authentication required. Please login again."
        );

      }


      // =====================================
      // API REQUEST
      // =====================================

      const response = await fetch(
        `${API_BASE_URL}/api/admin/merchants`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`,
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
        "ADMIN MERCHANTS RESPONSE:",
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
          "Failed to load merchants"
        );

      }


      // =====================================
      // SAVE MERCHANTS
      // =====================================

      setMerchants(
        Array.isArray(data.merchants)
          ? data.merchants
          : []
      );


    } catch (error) {

      console.error(
        "Merchants error:",
        error
      );

      setMerchants([]);

      setError(
        error.message ||
        "Unable to load merchants"
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // LOAD WHEN PAGE OPENS
  // =====================================

  useEffect(() => {

    fetchMerchants();

  }, []);


  // =====================================
  // RENDER
  // =====================================

  return (

    <section className="admin-merchants-page">


      {/* =================================
          HEADER
      ================================= */}

      <header className="admin-merchants-header">

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
            Merchants
          </h1>

          <span>
            Manage registered ShopEase merchants
          </span>

        </div>

      </header>


      {/* =================================
          CONTENT
      ================================= */}

      <main className="admin-merchants-content">


        {/* =================================
            SUMMARY
        ================================= */}

        <div className="merchants-summary">

          <div>

            <span>
              🏪
            </span>

            <div>

              <p>
                Total Merchants
              </p>

              <h2>
                {merchants.length}
              </h2>

            </div>

          </div>

        </div>


        {/* =================================
            LOADING
        ================================= */}

        {loading && (

          <div className="merchants-message">

            Loading merchants...

          </div>

        )}


        {/* =================================
            ERROR
        ================================= */}

        {!loading &&
          error && (

          <div className="merchants-error">

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={fetchMerchants}
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
          merchants.length === 0 && (

          <div className="merchants-message">

            No merchants found.

          </div>

        )}


        {/* =================================
            MERCHANTS TABLE
        ================================= */}

        {!loading &&
          !error &&
          merchants.length > 0 && (

          <div className="merchants-table-wrapper">

            <table className="merchants-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Merchant
                  </th>

                  <th>
                    Business
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Products
                  </th>

                  <th>
                    Orders
                  </th>

                  <th>
                    Sales
                  </th>

                  <th>
                    Registered
                  </th>

                </tr>

              </thead>


              <tbody>

                {merchants.map(
                  (merchant) => (

                  <tr
                    key={
                      merchant.id
                    }
                  >


                    {/* ID */}

                    <td>

                      #
                      {
                        merchant.id
                      }

                    </td>


                    {/* MERCHANT */}

                    <td>

                      <div className="merchant-name">

                        <div className="merchant-avatar">

                          {
                            merchant.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                            "M"
                          }

                        </div>


                        <strong>

                          {
                            merchant.name
                          }

                        </strong>

                      </div>

                    </td>


                    {/* BUSINESS */}

                    <td>

                      {
                        merchant.business_name ||
                        "Not provided"
                      }

                    </td>


                    {/* EMAIL */}

                    <td>

                      {
                        merchant.email
                      }

                    </td>


                    {/* PHONE */}

                    <td>

                      {
                        merchant.phone ||
                        "Not provided"
                      }

                    </td>


                    {/* PRODUCTS */}

                    <td>

                      {
                        merchant.total_products ||
                        0
                      }

                    </td>


                    {/* ORDERS */}

                    <td>

                      {
                        merchant.total_orders ||
                        0
                      }

                    </td>


                    {/* SALES */}

                    <td>

                      ₹
                      {
                        Number(
                          merchant.total_sales ||
                          0
                        ).toLocaleString(
                          "en-IN"
                        )
                      }

                    </td>


                    {/* REGISTERED */}

                    <td>

                      {
                        merchant.created_at
                          ? new Date(
                              merchant.created_at
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"
                      }

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </main>

    </section>

  );

}

export default AdminMerchants;