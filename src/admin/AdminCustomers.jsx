import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminCustomers.css";

function AdminCustomers({ onBack }) {

  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/customers`
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
          "Failed to load customers"
        );
      }

      setCustomers(
        data.customers || []
      );

    } catch (error) {

      console.error(
        "Customers error:",
        error
      );

      setError(
        error.message ||
        "Unable to load customers"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <section className="admin-customers-page">

      <header className="admin-customers-header">

        <button
          type="button"
          className="admin-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <p>ADMIN</p>

          <h1>
            Customers
          </h1>

          <span>
            Manage registered ShopEase customers
          </span>
        </div>

      </header>


      <main className="admin-customers-content">

        <div className="customers-summary">

          <div>
            <span>👤</span>

            <div>
              <p>Total Customers</p>

              <h2>
                {customers.length}
              </h2>
            </div>
          </div>

        </div>


        {loading && (
          <div className="customers-message">
            Loading customers...
          </div>
        )}


        {error && (
          <div className="customers-error">

            <p>{error}</p>

            <button
              type="button"
              onClick={fetchCustomers}
            >
              Try Again
            </button>

          </div>
        )}


        {!loading &&
          !error &&
          customers.length === 0 && (
            <div className="customers-message">
              No customers found.
            </div>
          )}


        {!loading &&
          !error &&
          customers.length > 0 && (

            <div className="customers-table-wrapper">

              <table className="customers-table">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Registered</th>
                  </tr>

                </thead>


                <tbody>

                  {customers.map(
                    (customer) => (

                      <tr key={customer.id}>

                        <td>
                          #{customer.id}
                        </td>

                        <td>
                          <div className="customer-name">

                            <div className="customer-avatar">
                              {customer.name
                                ?.charAt(0)
                                ?.toUpperCase() || "C"}
                            </div>

                            <strong>
                              {customer.name}
                            </strong>

                          </div>
                        </td>

                        <td>
                          {customer.email}
                        </td>

                        <td>
                          {customer.phone ||
                            "Not provided"}
                        </td>

                        <td>
                          {customer.total_orders}
                        </td>

                        <td>
                          ₹
                          {Number(
                            customer.total_spent
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td>
                          {customer.created_at
                            ? new Date(
                                customer.created_at
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
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