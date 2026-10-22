import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminMerchants.css";

function AdminMerchants({ onBack, admin }) {

  const [merchants, setMerchants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedMerchant, setSelectedMerchant] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);


  // =====================================
  // GET ADMIN TOKEN
  // =====================================

  const getToken = () => {

    return (
      admin?.token ||
      localStorage.getItem("adminToken")
    );

  };


  // =====================================
  // FETCH MERCHANTS
  // =====================================

  const fetchMerchants = async () => {

    try {

      setLoading(true);

      setError("");

      const token = getToken();


      console.log(
        "ADMIN MERCHANTS TOKEN:",
        token ? "Token found" : "Token missing"
      );


      if (!token) {

        throw new Error(
          "Authentication required. Please login again."
        );

      }


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


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to load merchants"
        );

      }


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
  // LOAD MERCHANTS
  // =====================================

  useEffect(() => {

    fetchMerchants();

  }, []);


  // =====================================
  // ACCEPT / REJECT MERCHANT
  // =====================================

  const updateMerchantStatus = async (
    merchantId,
    status
  ) => {

    try {

      setActionLoading(true);


      const token = getToken();


      if (!token) {

        throw new Error(
          "Authentication required."
        );

      }


      const endpoint =
        status === "Approved"
          ? "approved"
          : "rejected";


      const response = await fetch(
        `${API_BASE_URL}/api/admin/merchants/${merchantId}/${endpoint}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          `Failed to ${endpoint} merchant`
        );

      }


      alert(
        data.message ||
        `Merchant ${endpoint} successfully`
      );


      setSelectedMerchant(null);


      await fetchMerchants();


    } catch (error) {

      console.error(
        "Merchant status error:",
        error
      );


      alert(
        error.message ||
        "Unable to update merchant status"
      );


    } finally {

      setActionLoading(false);

    }

  };


  // =====================================
  // STATUS CLASS
  // =====================================

  const getStatusClass = (
    status
  ) => {

    if (
      status === "Approved"
    ) {

      return "status-approved";

    }


    if (
      status === "Rejected"
    ) {

      return "status-rejected";

    }


    return "status-pending";

  };


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
            MERCHANT TABLE
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
                    Status
                  </th>

                  <th>
                    Details
                  </th>

                  <th>
                    Action
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


                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          `merchant-status ${
                            getStatusClass(
                              merchant.approval_status
                            )
                          }`
                        }
                      >

                        {
                          merchant.approval_status ||
                          "Pending"
                        }

                      </span>

                    </td>


                    {/* DETAILS */}

                    <td>

                      <button
                        type="button"
                        className="merchant-details-button"
                        onClick={() =>
                          setSelectedMerchant(
                            merchant
                          )
                        }
                      >
                        View Details
                      </button>

                    </td>


                    {/* ACTION */}

                    <td>

                      <div className="merchant-action-buttons">


                        {merchant.approval_status !==
                          "Approved" && (

                          <button
                            type="button"
                            className="merchant-accept-button"
                            disabled={
                              actionLoading
                            }
                            onClick={() =>
                              updateMerchantStatus(
                                merchant.id,
                                "Approved"
                              )
                            }
                          >
                            Accept
                          </button>

                        )}


                        {merchant.approval_status !==
                          "Rejected" && (

                          <button
                            type="button"
                            className="merchant-reject-button"
                            disabled={
                              actionLoading
                            }
                            onClick={() =>
                              updateMerchantStatus(
                                merchant.id,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </main>


      {/* =================================
          DETAILS MODAL
      ================================= */}

      {selectedMerchant && (

        <div
          className="merchant-modal-overlay"
          onClick={() =>
            setSelectedMerchant(null)
          }
        >

          <div
            className="merchant-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="merchant-modal-header">

              <div>

                <p>
                  MERCHANT DETAILS
                </p>

                <h2>

                  {
                    selectedMerchant.name
                  }

                </h2>

              </div>


              <button
                type="button"
                className="merchant-modal-close"
                onClick={() =>
                  setSelectedMerchant(null)
                }
              >
                ×
              </button>

            </div>


            {/* MERCHANT INFORMATION */}

            <div className="merchant-details-grid">


              <div>

                <label>
                  Merchant ID
                </label>

                <p>

                  #
                  {
                    selectedMerchant.id
                  }

                </p>

              </div>


              <div>

                <label>
                  Full Name
                </label>

                <p>

                  {
                    selectedMerchant.name ||
                    "Not provided"
                  }

                </p>

              </div>


              <div>

                <label>
                  Business Name
                </label>

                <p>

                  {
                    selectedMerchant.business_name ||
                    "Not provided"
                  }

                </p>

              </div>


              <div>

                <label>
                  Email
                </label>

                <p>

                  {
                    selectedMerchant.email ||
                    "Not provided"
                  }

                </p>

              </div>


              <div>

                <label>
                  Phone
                </label>

                <p>

                  {
                    selectedMerchant.phone ||
                    "Not provided"
                  }

                </p>

              </div>


              <div>

                <label>
                  Products
                </label>

                <p>

                  {
                    selectedMerchant.total_products ||
                    0
                  }

                </p>

              </div>


              <div>

                <label>
                  Registration Date
                </label>

                <p>

                  {
                    selectedMerchant.created_at
                      ? new Date(
                          selectedMerchant.created_at
                        ).toLocaleString(
                          "en-IN"
                        )
                      : "-"
                  }

                </p>

              </div>


              <div>

                <label>
                  Approval Status
                </label>

                <p>

                  <span
                    className={
                      `merchant-status ${
                        getStatusClass(
                          selectedMerchant.approval_status
                        )
                      }`
                    }
                  >

                    {
                      selectedMerchant.approval_status ||
                      "Pending"
                    }

                  </span>

                </p>

              </div>

            </div>


            {/* =================================
                AADHAAR DOCUMENT
            ================================= */}

            <div className="merchant-document-section">

              <h3>
                Aadhaar Card
              </h3>


              {selectedMerchant.aadhaar_image ? (

                <img
                  src={
                    `${API_BASE_URL}${selectedMerchant.aadhaar_image}`
                  }
                  alt="Merchant Aadhaar"
                  className="merchant-aadhaar-image"
                />

              ) : (

                <div className="merchant-no-document">

                  Aadhaar document not available.

                </div>

              )}

            </div>


            {/* =================================
                MODAL ACTIONS
            ================================= */}

            <div className="merchant-modal-actions">


              {selectedMerchant.approval_status !==
                "Approved" && (

                <button
                  type="button"
                  className="merchant-accept-button"
                  disabled={actionLoading}
                  onClick={() =>
                    updateMerchantStatus(
                      selectedMerchant.id,
                      "Approved"
                    )
                  }
                >
                  Accept Merchant
                </button>

              )}


              {selectedMerchant.approval_status !==
                "Rejected" && (

                <button
                  type="button"
                  className="merchant-reject-button"
                  disabled={actionLoading}
                  onClick={() =>
                    updateMerchantStatus(
                      selectedMerchant.id,
                      "Rejected"
                    )
                  }
                >
                  Reject Merchant
                </button>

              )}


              <button
                type="button"
                className="merchant-close-button"
                onClick={() =>
                  setSelectedMerchant(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  );

}

export default AdminMerchants;