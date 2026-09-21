import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminReports.css";

function AdminReports({ onBack, admin }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

    const token =
  admin?.token ||
  localStorage.getItem("adminToken");

console.log(
  "ADMIN REPORTS TOKEN:",
  token ? "Token found" : "Token missing"
);

if (!token) {
  throw new Error(
    "Authentication required. Please login again."
  );
}

const response = await fetch(
  `${API_BASE_URL}/api/admin/reports`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load reports"
        );
      }

      setReport(data.report || data);
    } catch (error) {
      console.error("Admin reports error:", error);

      setError(
        error.message || "Unable to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-reports-page">

      {/* HEADER */}

      <header className="admin-reports-header">

        <button
          type="button"
          className="admin-reports-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <p>ADMIN</p>

          <h1>
            Reports
          </h1>

          <span>
            Business overview and performance reports
          </span>
        </div>

      </header>


      {/* CONTENT */}

      <main className="admin-reports-content">

        {loading && (
          <div className="admin-reports-message">
            Loading reports...
          </div>
        )}


        {error && (
          <div className="admin-reports-error">

            <h3>
              Unable to load reports
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={fetchReport}
            >
              Try Again
            </button>

          </div>
        )}


        {!loading &&
          !error &&
          report && (

          <>
            {/* SUMMARY */}

            <div className="admin-report-cards">

              <div className="admin-report-card">

                <span>
                  👥
                </span>

                <div>
                  <p>
                    Customers
                  </p>

                  <h2>
                    {Number(
                      report.total_customers || 0
                    ).toLocaleString("en-IN")}
                  </h2>
                </div>

              </div>


              <div className="admin-report-card">

                <span>
                  🏪
                </span>

                <div>
                  <p>
                    Merchants
                  </p>

                  <h2>
                    {Number(
                      report.total_merchants || 0
                    ).toLocaleString("en-IN")}
                  </h2>
                </div>

              </div>


              <div className="admin-report-card">

                <span>
                  📦
                </span>

                <div>
                  <p>
                    Products
                  </p>

                  <h2>
                    {Number(
                      report.total_products || 0
                    ).toLocaleString("en-IN")}
                  </h2>
                </div>

              </div>


              <div className="admin-report-card">

                <span>
                  🛒
                </span>

                <div>
                  <p>
                    Orders
                  </p>

                  <h2>
                    {Number(
                      report.total_orders || 0
                    ).toLocaleString("en-IN")}
                  </h2>
                </div>

              </div>

            </div>


            {/* REVENUE */}

            <div className="admin-report-revenue">

              <div>
                <p>
                  Total Revenue
                </p>

                <h2>
                  ₹
                  {Number(
                    report.total_revenue || 0
                  ).toLocaleString("en-IN")}
                </h2>
              </div>

              <div>
                <p>
                  Pending Orders
                </p>

                <h2>
                  {Number(
                    report.pending_orders || 0
                  )}
                </h2>
              </div>

              <div>
                <p>
                  Low Stock Products
                </p>

                <h2>
                  {Number(
                    report.low_stock || 0
                  )}
                </h2>
              </div>

            </div>


            {/* INFORMATION */}

            <div className="admin-report-section">

              <div className="admin-report-section-header">

                <div>
                  <p>
                    BUSINESS REPORT
                  </p>

                  <h2>
                    ShopEase Overview
                  </h2>
                </div>

              </div>


              <div className="admin-report-info-grid">

                <div>
                  <span>
                    Total Customers
                  </span>

                  <strong>
                    {Number(
                      report.total_customers || 0
                    )}
                  </strong>
                </div>


                <div>
                  <span>
                    Total Merchants
                  </span>

                  <strong>
                    {Number(
                      report.total_merchants || 0
                    )}
                  </strong>
                </div>


                <div>
                  <span>
                    Total Products
                  </span>

                  <strong>
                    {Number(
                      report.total_products || 0
                    )}
                  </strong>
                </div>


                <div>
                  <span>
                    Total Orders
                  </span>

                  <strong>
                    {Number(
                      report.total_orders || 0
                    )}
                  </strong>
                </div>


                <div>
                  <span>
                    Pending Orders
                  </span>

                  <strong>
                    {Number(
                      report.pending_orders || 0
                    )}
                  </strong>
                </div>


                <div>
                  <span>
                    Low Stock
                  </span>

                  <strong>
                    {Number(
                      report.low_stock || 0
                    )}
                  </strong>
                </div>

              </div>

            </div>

          </>
        )}

      </main>

    </section>
  );
}

export default AdminReports;