import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminDeliveryPartners.css";

function AdminDeliveryPartners({ admin, onBack }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token =
    admin?.token ||
    localStorage.getItem("adminToken");

  const fetchDeliveryPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/delivery-partners`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch delivery partners"
        );
      }

      setPartners(data.partners || []);
    } catch (error) {
      console.error(
        "Delivery partners error:",
        error
      );

      setError(
        error.message ||
          "Unable to load delivery partners"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryPartners();
  }, []);

  const totalPartners = partners.length;

  const activePartners = partners.filter(
    (partner) =>
      String(partner.status || "")
        .toLowerCase() === "active"
  ).length;

  const inactivePartners = partners.filter(
    (partner) =>
      String(partner.status || "")
        .toLowerCase() === "inactive"
  ).length;

  const onlinePartners = partners.filter(
    (partner) =>
      partner.availability_status === "Online"
  ).length;

  const busyPartners = partners.filter(
    (partner) =>
      partner.availability_status === "Busy"
  ).length;

  const offlinePartners = partners.filter(
    (partner) =>
      partner.availability_status === "Offline"
  ).length;

  return (
    <div className="admin-delivery-page">

      <div className="admin-delivery-header">

        <button
          type="button"
          className="admin-delivery-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <p className="admin-delivery-label">
            ADMINISTRATION
          </p>

          <h1>
            Delivery Partners
          </h1>

          <p className="admin-delivery-subtitle">
            Manage delivery partners and
            monitor their availability.
          </p>
        </div>

      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="admin-delivery-stats">

        <div className="admin-delivery-stat-card">
          <span>Total Partners</span>
          <strong>{totalPartners}</strong>
        </div>

        <div className="admin-delivery-stat-card">
          <span>Active</span>
          <strong>{activePartners}</strong>
        </div>

        <div className="admin-delivery-stat-card">
          <span>Inactive</span>
          <strong>{inactivePartners}</strong>
        </div>

        <div className="admin-delivery-stat-card">
          <span>Online</span>
          <strong>{onlinePartners}</strong>
        </div>

        <div className="admin-delivery-stat-card">
          <span>Busy</span>
          <strong>{busyPartners}</strong>
        </div>

        <div className="admin-delivery-stat-card">
          <span>Offline</span>
          <strong>{offlinePartners}</strong>
        </div>

      </div>

      {/* =========================
          PARTNER LIST
      ========================= */}

      <div className="admin-delivery-list-section">

        <div className="admin-delivery-list-header">
          <h2>All Delivery Partners</h2>

          <button
            type="button"
            className="admin-delivery-refresh"
            onClick={fetchDeliveryPartners}
          >
            ↻ Refresh
          </button>
        </div>

        {loading && (
          <div className="admin-delivery-message">
            Loading delivery partners...
          </div>
        )}

        {!loading && error && (
          <div className="admin-delivery-message error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          partners.length === 0 && (
            <div className="admin-delivery-message">
              No delivery partners found.
            </div>
          )}

        {!loading &&
          !error &&
          partners.length > 0 && (

            <div className="admin-delivery-table-wrapper">

              <table className="admin-delivery-table">

                <thead>
                  <tr>
                    <th>Partner</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Vehicle</th>
                    <th>Account</th>
                    <th>Availability</th>
                  </tr>
                </thead>

                <tbody>

                  {partners.map((partner) => (

                    <tr key={partner.id}>

                      <td>
                        <div className="admin-delivery-partner">

                          <div className="admin-delivery-avatar">
                            {partner.name
                              ?.charAt(0)
                              ?.toUpperCase() || "D"}
                          </div>

                          <div>
                            <strong>
                              {partner.name}
                            </strong>

                            <small>
                              {partner.email}
                            </small>
                          </div>

                        </div>
                      </td>

                      <td>
                        {partner.phone || "—"}
                      </td>

                      <td>
                        {partner.city || "—"}
                      </td>

                      <td>
                        {partner.vehicle_type
                          ? `${partner.vehicle_type}${
                              partner.vehicle_number
                                ? ` • ${partner.vehicle_number}`
                                : ""
                            }`
                          : "—"}
                      </td>

                      <td>
                        <span
                          className={
                            String(
                              partner.status || ""
                            ).toLowerCase() ===
                            "active"
                              ? "delivery-status active"
                              : "delivery-status inactive"
                          }
                        >
                          {partner.status || "Unknown"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`delivery-availability ${String(
                            partner.availability_status ||
                              "Offline"
                          ).toLowerCase()}`}
                        >
                          ●{" "}
                          {partner.availability_status ||
                            "Offline"}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

      </div>

    </div>
  );
}

export default AdminDeliveryPartners;