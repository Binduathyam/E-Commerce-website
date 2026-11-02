
import React, { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminDispatchRequests.css";

function AdminDispatchRequests({ onBack, admin }) {
  const [requests, setRequests] = useState([]);
  const [dispatchPartners, setDispatchPartners] = useState([]);

  const [totalDispatchPartners, setTotalDispatchPartners] = useState(0);

  const [loading, setLoading] = useState(true);
  const [countLoading, setCountLoading] = useState(true);
  const [partnersLoading, setPartnersLoading] = useState(true);

  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const getToken = () =>
    admin?.token || localStorage.getItem("adminToken");

  // Common API headers
  const getHeaders = () => {
    const token = getToken();

    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch approved dispatch partner count
  const fetchDispatchPartnerCount = useCallback(async () => {
    try {
      setCountLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/dispatch-partners/count`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load dispatch partner count"
        );
      }

      setTotalDispatchPartners(Number(data.total) || 0);
    } catch (err) {
      console.error("Dispatch count error:", err);
    } finally {
      setCountLoading(false);
    }
  }, [admin]);

  // Fetch approved dispatch partners
  const fetchDispatchPartners = useCallback(async () => {
    try {
      setPartnersLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/dispatch-partners`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load approved dispatch partners"
        );
      }

      setDispatchPartners(
        Array.isArray(data.partners) ? data.partners : []
      );
    } catch (err) {
      console.error("Dispatch partners error:", err);
    } finally {
      setPartnersLoading(false);
    }
  }, [admin]);

  // Fetch pending registration requests
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/dispatch-requests`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load dispatch requests"
        );
      }

      setRequests(
        Array.isArray(data.requests) ? data.requests : []
      );
    } catch (err) {
      setError(err.message || "Unable to load dispatch requests");
    } finally {
      setLoading(false);
    }
  }, [admin]);

  // Refresh all page data
  const refreshPage = useCallback(async () => {
    await Promise.all([
      fetchRequests(),
      fetchDispatchPartnerCount(),
      fetchDispatchPartners(),
    ]);
  }, [
    fetchRequests,
    fetchDispatchPartnerCount,
    fetchDispatchPartners,
  ]);

  useEffect(() => {
    refreshPage();
  }, [refreshPage]);

  // Accept or reject a registration request
  const updateStatus = async (requestId, status) => {
    const action =
      status === "Approved" ? "approved" : "rejected";

    const label =
      status === "Approved" ? "accept" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${label} this dispatch request?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/dispatch-requests/${requestId}/${action}`,
        {
          method: "PUT",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `Failed to ${label} dispatch request`
        );
      }

      window.alert(
        data.message ||
          `Dispatch request ${status.toLowerCase()} successfully`
      );

      // Refresh approved partners and pending requests
      await refreshPage();
    } catch (err) {
      setError(
        err.message || "Unable to update dispatch request"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Approved") {
      return "dispatch-status-approved";
    }

    if (status === "Rejected") {
      return "dispatch-status-rejected";
    }

    return "dispatch-pending-status";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="admin-dispatch-page">

      {/* Header */}
      <header className="admin-dispatch-header">

        <div className="dispatch-header-left">
          <button
            type="button"
            className="dispatch-back-button"
            onClick={onBack}
          >
            ← Back
          </button>

          <div>
            <p className="dispatch-eyebrow">
              ADMIN / LOGISTICS
            </p>

            <h1>Dispatch Management</h1>

            <span>
              Manage dispatch partners and registration requests.
            </span>
          </div>
        </div>

        <button
          type="button"
          className="dispatch-refresh-button"
          onClick={refreshPage}
          disabled={loading || countLoading || partnersLoading}
        >
          ↻ {loading || countLoading || partnersLoading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </header>

      <main className="admin-dispatch-content">

        {/* Summary Cards */}
        <div className="dispatch-summary-grid">

          <div className="dispatch-summary-card">
            <div className="dispatch-summary-top">
              <span>🚚 Total Dispatch Partners</span>
              <span className="dispatch-summary-icon">✓</span>
            </div>

            <strong>
              {countLoading ? "..." : totalDispatchPartners}
            </strong>

            <small>Approved accounts</small>
          </div>

          <div className="dispatch-summary-card">
            <div className="dispatch-summary-top">
              <span>⏳ Pending Requests</span>
              <span className="dispatch-summary-icon">!</span>
            </div>

            <strong>
              {loading ? "..." : requests.length}
            </strong>

            <small>Waiting for admin approval</small>
          </div>

        </div>

        {/* Error Message */}
        {error && (
          <div className="dispatch-error" role="alert">
            <span>{error}</span>

            <button
              type="button"
              onClick={refreshPage}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Approved Dispatch Partners */}
        <section className="dispatch-section">

          <div className="dispatch-section-heading">
            <div>
              <p>ACTIVE PARTNERS</p>
              <h2>Approved Dispatch Partners</h2>
              <span>
                View all approved dispatch accounts.
              </span>
            </div>

            <span className="dispatch-section-count">
              {dispatchPartners.length} partners
            </span>
          </div>

          {partnersLoading ? (
            <div className="dispatch-message">
              Loading approved partners...
            </div>
          ) : dispatchPartners.length === 0 ? (
            <div className="dispatch-message">
              <div className="dispatch-empty-icon">🚚</div>
              <h3>No approved partners found</h3>
              <p>
                Approved dispatch accounts will appear here.
              </p>
            </div>
          ) : (
            <div className="dispatch-table-wrapper">
              <table className="dispatch-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Dispatch Partner</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Approved On</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {dispatchPartners.map((partner) => (
                    <tr key={partner.id}>
                      <td>#{partner.id}</td>

                      <td>
                        <div className="dispatch-person">
                          <div className="dispatch-avatar">
                            {partner.name
                              ?.charAt(0)
                              ?.toUpperCase() || "D"}
                          </div>

                          <strong>
                            {partner.name || "Unnamed Partner"}
                          </strong>
                        </div>
                      </td>

                      <td>
                        {partner.email || "Not provided"}
                      </td>

                      <td>
                        {partner.phone || "Not provided"}
                      </td>

                      <td>
                        {formatDate(partner.approval_date)}
                      </td>

                      <td>
                        <span className="dispatch-status-approved">
                          ● Approved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

        {/* Pending Registration Requests */}
        <section className="dispatch-section">

          <div className="dispatch-section-heading">
            <div>
              <p>REGISTRATION</p>
              <h2>Dispatch Registration Requests</h2>
              <span>
                Review and approve new dispatch registrations.
              </span>
            </div>

            <span className="dispatch-section-count pending-count">
              {requests.length} pending
            </span>
          </div>

          {loading ? (
            <div className="dispatch-message">
              Loading dispatch requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="dispatch-message">
              <div className="dispatch-empty-icon">📋</div>

              <h3>No pending dispatch requests</h3>

              <p>
                New dispatch registrations will appear here
                when submitted.
              </p>
            </div>
          ) : (
            <div className="dispatch-table-wrapper">
              <table className="dispatch-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Dispatch Partner</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Registered On</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>#{request.id}</td>

                      <td>
                        <div className="dispatch-person">
                          <div className="dispatch-avatar">
                            {request.name
                              ?.charAt(0)
                              ?.toUpperCase() || "D"}
                          </div>

                          <strong>
                            {request.name || "Unnamed"}
                          </strong>
                        </div>
                      </td>

                      <td>
                        {request.email || "Not provided"}
                      </td>

                      <td>
                        {request.phone || "Not provided"}
                      </td>

                      <td>
                        {formatDate(request.created_at)}
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            request.approval_status
                          )}
                        >
                          {request.approval_status || "Pending"}
                        </span>
                      </td>

                      <td>
                        <div className="dispatch-actions">

                          <button
                            type="button"
                            className="dispatch-accept-button"
                            disabled={actionLoading}
                            onClick={() =>
                              updateStatus(request.id, "Approved")
                            }
                          >
                            {actionLoading
                              ? "Please wait..."
                              : "Accept"}
                          </button>

                          <button
                            type="button"
                            className="dispatch-reject-button"
                            disabled={actionLoading}
                            onClick={() =>
                              updateStatus(request.id, "Rejected")
                            }
                          >
                            Reject
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

      </main>
    </section>
  );
}

export default AdminDispatchRequests;
