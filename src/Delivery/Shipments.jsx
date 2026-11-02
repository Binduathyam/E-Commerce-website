import React, { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./Shipments.css";

const API = `${API_BASE_URL}/api/delivery`;

const getToken = () => localStorage.getItem("delivery_token");

async function shipmentRequest(path, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Delivery Partner session expired. Please log in again.");
  }

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Available-shipment endpoints can return 409 when partner is Busy/Offline.
    if (response.status === 409) {
      return { ...data, unavailable: true };
    }

    throw new Error(data.message || "Shipment request failed");
  }

  return data;
}

function ShipmentCard({ children, title, subtitle, status }) {
  return (
    <article className="shipment-card">
      <div className="shipment-card-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="shipment-status">{status}</span>
      </div>
      {children}
    </article>
  );
}

export default function Shipments() {
  const [availablePickups, setAvailablePickups] = useState([]);
  const [availableLastMile, setAvailableLastMile] = useState([]);
  const [pickupAssignments, setPickupAssignments] = useState([]);
  const [lastMileAssignments, setLastMileAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const loadShipments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.all([
        shipmentRequest("/shipments/available-pickups"),
        shipmentRequest("/shipments/available-last-mile"),
        shipmentRequest("/shipments/my-assignments")
      ]);

      const [pickups, lastMile, assignments] = results;

      setAvailablePickups(
        pickups.unavailable ? [] : pickups.shipments || []
      );

      setAvailableLastMile(
        lastMile.unavailable ? [] : lastMile.shipments || []
      );

      setPickupAssignments(assignments.pickupShipments || []);
      setLastMileAssignments(assignments.lastMileShipments || []);

    } catch (err) {
      setError(err.message || "Unable to load shipments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const performAction = async (id, action, path, method, body = {}) => {
    const key = `${action}-${id}`;
    setActionId(key);
    setError("");

    try {
      await shipmentRequest(path, {
        method,
        body: method === "GET" ? undefined : JSON.stringify(body)
      });

      await loadShipments();
    } catch (err) {
      setError(err.message || "Unable to update shipment");
    } finally {
      setActionId("");
    }
  };

  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "Not available"
      : date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="shipments-page">
        <div className="shipments-loading">Loading shipments...</div>
      </div>
    );
  }

  return (
    <div className="shipments-page">
      <div className="shipments-heading">
        <div>
          <p className="shipments-eyebrow">DELIVERY OPERATIONS</p>
          <h1>Shipments</h1>
          <span>
            Manage merchant pickups and destination hub deliveries.
          </span>
        </div>

        <button
          className="shipment-refresh"
          onClick={loadShipments}
          disabled={loading || !!actionId}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="shipment-error">
          {error}
        </div>
      )}

      {/* AVAILABLE PICKUPS */}
      <section className="shipment-section">
        <div className="shipment-section-title">
          <div>
            <h2>Available Pickups</h2>
            <p>Collect parcels from merchants in your service area.</p>
          </div>
          <span className="shipment-count">
            {availablePickups.length}
          </span>
        </div>

        {availablePickups.length === 0 ? (
          <div className="shipment-empty">
            <span>📦</span>
            <h3>No available pickups</h3>
            <p>New merchant pickup requests will appear here.</p>
          </div>
        ) : (
          <div className="shipment-grid">
            {availablePickups.map((shipment) => (
              <ShipmentCard
                key={shipment.shipment_id}
                title={`Order #${shipment.order_id}`}
                subtitle={`Tracking: ${shipment.tracking_number || "N/A"}`}
                status={shipment.shipment_status}
              >
                <div className="shipment-details">
                  <p>
                    <strong>Pickup Address:</strong>
                    {shipment.pickup_address || "Not available"}
                  </p>
                  <p>
                    <strong>Location:</strong>
                    {[
                      shipment.pickup_city,
                      shipment.pickup_state,
                      shipment.pickup_pincode
                    ].filter(Boolean).join(", ")}
                  </p>
                  <p>
                    <strong>Origin Hub:</strong>
                    {shipment.origin_hub_name || "Not assigned"}
                  </p>
                  <p>
                    <strong>Ready At:</strong>
                    {formatDate(shipment.ready_at)}
                  </p>
                </div>

                <button
                  className="shipment-action primary"
                  disabled={!!actionId}
                  onClick={() =>
                    performAction(
                      shipment.shipment_id,
                      "accept-pickup",
                      `/shipments/${shipment.shipment_id}/accept-pickup`,
                      "POST"
                    )
                  }
                >
                  {actionId === `accept-pickup-${shipment.shipment_id}`
                    ? "Accepting..."
                    : "Accept Pickup"}
                </button>
              </ShipmentCard>
            ))}
          </div>
        )}
      </section>

      {/* MY PICKUPS */}
      <section className="shipment-section">
        <div className="shipment-section-title">
          <div>
            <h2>My Pickups</h2>
            <p>Track parcels assigned to you for origin hub handover.</p>
          </div>
          <span className="shipment-count">
            {pickupAssignments.length}
          </span>
        </div>

        {pickupAssignments.length === 0 ? (
          <div className="shipment-empty">
            <span>🚚</span>
            <h3>No assigned pickups</h3>
            <p>Accepted merchant pickups will appear here.</p>
          </div>
        ) : (
          <div className="shipment-grid">
            {pickupAssignments.map((shipment) => (
              <ShipmentCard
                key={shipment.shipment_id}
                title={`Order #${shipment.order_id}`}
                subtitle={`Tracking: ${shipment.tracking_number || "N/A"}`}
                status={shipment.shipment_status}
              >
                <div className="shipment-details">
                  <p>
                    <strong>Pickup Location:</strong>
                    {[
                      shipment.pickup_city,
                      shipment.pickup_state
                    ].filter(Boolean).join(", ")}
                  </p>
                  <p>
                    <strong>Origin Hub:</strong>
                    {shipment.origin_hub_name || "Not available"}
                  </p>
                  <p>
                    <strong>Assigned At:</strong>
                    {formatDate(shipment.assigned_at)}
                  </p>
                </div>

                {shipment.shipment_status === "Pickup Assigned" ? (
                  <button
                    className="shipment-action primary"
                    disabled={!!actionId}
                    onClick={() =>
                      performAction(
                        shipment.shipment_id,
                        "confirm-pickup",
                        `/shipments/${shipment.shipment_id}/confirm-pickup`,
                        "PUT"
                      )
                    }
                  >
                    {actionId === `confirm-pickup-${shipment.shipment_id}`
                      ? "Confirming..."
                      : "Confirm Pickup"}
                  </button>
                ) : (
                  <div className="shipment-waiting">
                    <strong>Pickup Confirmed</strong>
                    <span>
                      Waiting for the Dispatch Partner to receive this
                      parcel at the Origin Hub.
                    </span>
                  </div>
                )}
              </ShipmentCard>
            ))}
          </div>
        )}
      </section>

      {/* AVAILABLE LAST MILE */}
      <section className="shipment-section">
        <div className="shipment-section-title">
          <div>
            <h2>Available Last-Mile Deliveries</h2>
            <p>Accept parcels that have arrived at their destination hub.</p>
          </div>
          <span className="shipment-count">
            {availableLastMile.length}
          </span>
        </div>

        {availableLastMile.length === 0 ? (
          <div className="shipment-empty">
            <span>🏠</span>
            <h3>No last-mile shipments available</h3>
            <p>Destination hub arrivals will appear here.</p>
          </div>
        ) : (
          <div className="shipment-grid">
            {availableLastMile.map((shipment) => (
              <ShipmentCard
                key={shipment.shipment_id}
                title={`Order #${shipment.order_id}`}
                subtitle={`Tracking: ${shipment.tracking_number || "N/A"}`}
                status={shipment.shipment_status}
              >
                <div className="shipment-details">
                  <p>
                    <strong>Destination Hub:</strong>
                    {shipment.destination_hub_name || "Not available"}
                  </p>
                  <p>
                    <strong>Location:</strong>
                    {[
                      shipment.destination_city,
                      shipment.destination_state
                    ].filter(Boolean).join(", ")}
                  </p>
                </div>

                <button
                  className="shipment-action primary"
                  disabled={!!actionId}
                  onClick={() =>
                    performAction(
                      shipment.shipment_id,
                      "accept-last-mile",
                      `/shipments/${shipment.shipment_id}/accept-last-mile`,
                      "POST"
                    )
                  }
                >
                  {actionId === `accept-last-mile-${shipment.shipment_id}`
                    ? "Accepting..."
                    : "Accept Delivery"}
                </button>
              </ShipmentCard>
            ))}
          </div>
        )}
      </section>

      {/* MY LAST-MILE ASSIGNMENTS */}
      <section className="shipment-section">
        <div className="shipment-section-title">
          <div>
            <h2>My Last-Mile Deliveries</h2>
            <p>Complete deliveries assigned to you.</p>
          </div>
          <span className="shipment-count">
            {lastMileAssignments.length}
          </span>
        </div>

        {lastMileAssignments.length === 0 ? (
          <div className="shipment-empty">
            <span>🛵</span>
            <h3>No active last-mile deliveries</h3>
            <p>Your accepted destination deliveries will appear here.</p>
          </div>
        ) : (
          <div className="shipment-grid">
            {lastMileAssignments.map((shipment) => (
              <ShipmentCard
                key={shipment.shipment_id}
                title={`Order #${shipment.order_id}`}
                subtitle={`Tracking: ${shipment.tracking_number || "N/A"}`}
                status={shipment.shipment_status}
              >
                <div className="shipment-details">
                  <p>
                    <strong>Destination Hub:</strong>
                    {shipment.destination_hub_name || "Not available"}
                  </p>
                  <p>
                    <strong>Location:</strong>
                    {[
                      shipment.destination_hub_city,
                      shipment.destination_hub_state
                    ].filter(Boolean).join(", ")}
                  </p>
                  <p>
                    <strong>Assigned At:</strong>
                    {formatDate(shipment.assigned_at)}
                  </p>
                </div>

                {shipment.shipment_status === "Assigned for Last Mile" && (
                  <button
                    className="shipment-action primary"
                    disabled={!!actionId}
                    onClick={() =>
                      performAction(
                        shipment.shipment_id,
                        "out-for-delivery",
                        `/shipments/${shipment.shipment_id}/last-mile-status`,
                        "PUT",
                        { status: "Out for Delivery" }
                      )
                    }
                  >
                    {actionId === `out-for-delivery-${shipment.shipment_id}`
                      ? "Updating..."
                      : "Start Delivery"}
                  </button>
                )}

                {shipment.shipment_status === "Out for Delivery" && (
                  <button
                    className="shipment-action success"
                    disabled={!!actionId}
                    onClick={() =>
                      performAction(
                        shipment.shipment_id,
                        "delivered",
                        `/shipments/${shipment.shipment_id}/last-mile-status`,
                        "PUT",
                        { status: "Delivered" }
                      )
                    }
                  >
                    {actionId === `delivered-${shipment.shipment_id}`
                      ? "Updating..."
                      : "Mark Delivered"}
                  </button>
                )}
              </ShipmentCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}