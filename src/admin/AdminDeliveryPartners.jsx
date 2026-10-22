import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminDeliveryPartners.css";

function AdminDeliveryPartners({ admin, onBack }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPartner, setSelectedPartner] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);

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

  /* =========================
     APPROVE / REJECT
  ========================= */

  const handleApproval = async (
    partnerId,
    action
  ) => {
    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/delivery-partners/${partnerId}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update delivery partner"
        );
      }

      setSelectedPartner(null);

      await fetchDeliveryPartners();

    } catch (error) {
      console.error(
        "Delivery approval error:",
        error
      );

      alert(
        error.message ||
          "Failed to update delivery partner"
      );

    } finally {
      setActionLoading(false);
    }
  };

  /* =========================
     SUMMARY
  ========================= */

  const totalPartners =
    partners.length;

  const activePartners =
    partners.filter(
      (partner) =>
        String(partner.status || "")
          .toLowerCase() === "active"
    ).length;

  const inactivePartners =
    partners.filter(
      (partner) =>
        String(partner.status || "")
          .toLowerCase() === "inactive"
    ).length;

  const onlinePartners =
    partners.filter(
      (partner) =>
        partner.availability_status ===
        "Online"
    ).length;

  const busyPartners =
    partners.filter(
      (partner) =>
        partner.availability_status ===
        "Busy"
    ).length;

  const offlinePartners =
    partners.filter(
      (partner) =>
        partner.availability_status ===
        "Offline"
    ).length;

  return (
    <div className="admin-delivery-page">

      {/* =========================
          HEADER
      ========================= */}

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
          <strong>
            {totalPartners}
          </strong>
        </div>

        <div className="admin-delivery-stat-card">
          <span>Active</span>
          <strong>
            {activePartners}
          </strong>
        </div>

        <div className="admin-delivery-stat-card">
          <span>Inactive</span>
          <strong>
            {inactivePartners}
          </strong>
        </div>

        <div className="admin-delivery-stat-card">
          <span>Online</span>
          <strong>
            {onlinePartners}
          </strong>
        </div>

        <div className="admin-delivery-stat-card">
          <span>Busy</span>
          <strong>
            {busyPartners}
          </strong>
        </div>

        <div className="admin-delivery-stat-card">
          <span>Offline</span>
          <strong>
            {offlinePartners}
          </strong>
        </div>

      </div>

      {/* =========================
          PARTNER LIST
      ========================= */}

      <div className="admin-delivery-list-section">

        <div className="admin-delivery-list-header">

          <h2>
            All Delivery Partners
          </h2>

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

                    <th>
                      Partner
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      City
                    </th>

                    <th>
                      Vehicle
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

                    <th>
                      Availability
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {partners.map(
                    (partner) => (

                      <tr
                        key={partner.id}
                      >

                        {/* PARTNER */}

                        <td>

                          <div className="admin-delivery-partner">

                            <div className="admin-delivery-avatar">

                              {partner.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "D"}

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

                        {/* PHONE */}

                        <td>
                          {partner.phone ||
                            "—"}
                        </td>

                        {/* CITY */}

                        <td>
                          {partner.city ||
                            "—"}
                        </td>

                        {/* VEHICLE */}

                        <td>

                          {partner.vehicle_type
                            ? `${partner.vehicle_type}${
                                partner.vehicle_number
                                  ? ` • ${partner.vehicle_number}`
                                  : ""
                              }`
                            : "—"}

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`delivery-approval-status ${String(
                              partner.approval_status ||
                                "Pending"
                            ).toLowerCase()}`}
                          >
                            {partner.approval_status ||
                              "Pending"}
                          </span>

                        </td>

                        {/* DETAILS */}

                        <td>

                          <button
                            type="button"
                            className="delivery-details-button"
                            onClick={() =>
                              setSelectedPartner(
                                partner
                              )
                            }
                          >
                            View Details
                          </button>

                        </td>

                        {/* ACTION */}

                        <td>

                          <div className="delivery-action-buttons">

                            {partner.approval_status !==
                              "Approved" && (
                              <button
                                type="button"
                                className="delivery-accept-button"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  handleApproval(
                                    partner.id,
                                    "approved"
                                  )
                                }
                              >
                                Accept
                              </button>
                            )}

                            {partner.approval_status !==
                              "Rejected" && (
                              <button
                                type="button"
                                className="delivery-reject-button"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  handleApproval(
                                    partner.id,
                                    "rejected"
                                  )
                                }
                              >
                                Reject
                              </button>
                            )}

                          </div>

                        </td>

                        {/* AVAILABILITY */}

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

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

      </div>

      {/* =========================
          DETAILS MODAL
      ========================= */}

      {selectedPartner && (

        <div
          className="delivery-modal-overlay"
          onClick={() =>
            setSelectedPartner(null)
          }
        >

          <div
            className="delivery-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="delivery-modal-header">

              <h2>
                Delivery Partner Details
              </h2>

              <button
                type="button"
                className="delivery-modal-close"
                onClick={() =>
                  setSelectedPartner(null)
                }
              >
                ×
              </button>

            </div>

            <div className="delivery-details-grid">

              <div>
                <strong>
                  Full Name
                </strong>
                <span>
                  {selectedPartner.name ||
                    "—"}
                </span>
              </div>

              <div>
                <strong>
                  Email
                </strong>
                <span>
                  {selectedPartner.email ||
                    "—"}
                </span>
              </div>

              <div>
                <strong>
                  Phone
                </strong>
                <span>
                  {selectedPartner.phone ||
                    "—"}
                </span>
              </div>

              <div>
                <strong>
                  City
                </strong>
                <span>
                  {selectedPartner.city ||
                    "—"}
                </span>
              </div>

              <div>
                <strong>
                  Vehicle Type
                </strong>
                <span>
                  {selectedPartner.vehicle_type ||
                    "—"}
                </span>
              </div>

              <div>
                <strong>
                  Vehicle Number
                </strong>
                <span>
                  {selectedPartner.vehicle_number ||
                    "—"}
                </span>
              </div>

              <div>
                <strong>
                  Driving Licence Number
                </strong>
                <span>
                  {selectedPartner.license_number ||
                    "—"}
                </span>
              </div>

              <div>
                <strong>
                  Account Status
                </strong>
                <span>
                  {selectedPartner.status ||
                    "—"}
                </span>
              </div>

              <div>
                <strong>
                  Approval Status
                </strong>
                <span>
                  {selectedPartner.approval_status ||
                    "Pending"}
                </span>
              </div>

              <div>
                <strong>
                  Availability
                </strong>
                <span>
                  {selectedPartner.availability_status ||
                    "Offline"}
                </span>
              </div>

            </div>

            {/* =========================
                DRIVING LICENCE
            ========================= */}

            <div className="delivery-document-section">

              <h3>
                Driving Licence Document
              </h3>

              {selectedPartner.license_image ? (

                <img
                  src={`${API_BASE_URL}${selectedPartner.license_image}`}
                  alt="Driving Licence"
                  className="delivery-license-image"
                />

              ) : (

                <p>
                  Driving Licence image not
                  available.
                </p>

              )}

            </div>

            {/* =========================
                MODAL ACTIONS
            ========================= */}

            <div className="delivery-modal-actions">

              {selectedPartner.approval_status !==
                "Approved" && (

                <button
                  type="button"
                  className="delivery-accept-button"
                  disabled={actionLoading}
                  onClick={() =>
                    handleApproval(
                      selectedPartner.id,
                      "approved"
                    )
                  }
                >
                  Accept
                </button>

              )}

              {selectedPartner.approval_status !==
                "Rejected" && (

                <button
                  type="button"
                  className="delivery-reject-button"
                  disabled={actionLoading}
                  onClick={() =>
                    handleApproval(
                      selectedPartner.id,
                      "rejected"
                    )
                  }
                >
                  Reject
                </button>

              )}

              <button
                type="button"
                className="delivery-close-button"
                onClick={() =>
                  setSelectedPartner(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDeliveryPartners;