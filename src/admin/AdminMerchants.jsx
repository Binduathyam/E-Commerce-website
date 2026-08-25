import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminMerchants.css";

function AdminMerchants({ onBack }) {

  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/merchants`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load merchants"
        );
      }

      setMerchants(data.merchants || []);

    } catch (error) {
      console.error("Merchants error:", error);
      setError(
        error.message || "Unable to load merchants"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-merchants-page">

      <header className="admin-merchants-header">

        <button
          type="button"
          className="admin-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <p>ADMIN</p>
          <h1>Merchants</h1>
          <span>
            Manage registered ShopEase merchants
          </span>
        </div>

      </header>

      <main className="admin-merchants-content">

        <div className="merchants-summary">

          <div>
            <span>🏪</span>

            <div>
              <p>Total Merchants</p>

              <h2>
                {merchants.length}
              </h2>
            </div>
          </div>

        </div>

        {loading && (
          <div className="merchants-message">
            Loading merchants...
          </div>
        )}

        {error && (
          <div className="merchants-error">

            <p>{error}</p>

            <button
              type="button"
              onClick={fetchMerchants}
            >
              Try Again
            </button>

          </div>
        )}

        {!loading &&
          !error &&
          merchants.length > 0 && (

          <div className="merchants-table-wrapper">

            <table className="merchants-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Merchant</th>
                  <th>Business</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Products</th>
                  <th>Orders</th>
                  <th>Sales</th>
                  <th>Registered</th>
                </tr>
              </thead>

              <tbody>

                {merchants.map((merchant) => (

                  <tr key={merchant.id}>

                    <td>
                      #{merchant.id}
                    </td>

                    <td>
                      <div className="merchant-name">

                        <div className="merchant-avatar">
                          {merchant.name
                            ?.charAt(0)
                            ?.toUpperCase() || "M"}
                        </div>

                        <strong>
                          {merchant.name}
                        </strong>

                      </div>
                    </td>

                    <td>
                      {merchant.business_name ||
                        "Not provided"}
                    </td>

                    <td>
                      {merchant.email}
                    </td>

                    <td>
                      {merchant.phone ||
                        "Not provided"}
                    </td>

                    <td>
                      {merchant.total_products}
                    </td>

                    <td>
                      {merchant.total_orders}
                    </td>

                    <td>
                      ₹
                      {Number(
                        merchant.total_sales
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {merchant.created_at
                        ? new Date(
                            merchant.created_at
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
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