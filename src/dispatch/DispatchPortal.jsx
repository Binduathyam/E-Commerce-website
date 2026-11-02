import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Warehouse,
  Package,
  Truck,
  MapPin,
  LogOut,
  Search,
  RefreshCw,
  Plus,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Boxes,
  ArrowRight,
} from "lucide-react";
import { API_BASE_URL } from "../api";
import "./DispatchPortal.css";

const API = `${API_BASE_URL}/api/dispatch`;

const SECTIONS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "hubs", label: "Hub Management", icon: Warehouse },
  { id: "inbound", label: "Inbound Shipments", icon: Package },
  { id: "intercity", label: "Intercity Dispatch", icon: Truck },
  { id: "arrival", label: "Destination Arrival", icon: MapPin },
];

async function dispatchRequest(path, options = {}) {
  const token = localStorage.getItem("dispatchToken");

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}

function getItems(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function StatusBadge({ status }) {
  const value = status || "Unknown";
  const className = value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <span className={`dispatch-status status-${className}`}>
      {value}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <article className="dispatch-stat-card">
      <div className="dispatch-stat-icon">
        <Icon size={22} />
      </div>
      <div>
        <p>{label}</p>
        <h2>{value}</h2>
        <small>{description}</small>
      </div>
    </article>
  );
}

export function DispatchLogin({ onBack, onLoginSuccess, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role: "dispatch",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to sign in.");
      }

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;

      if (!token) {
        throw new Error("Login response lo token dorakaledu.");
      }

      localStorage.setItem("dispatchToken", token);
      localStorage.setItem(
        "dispatchUser",
        JSON.stringify(data.user || data.data?.user || {})
      );

      onLoginSuccess?.();
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="dispatch-login-page">
      <section className="dispatch-login-card">
        <div className="dispatch-brand-mark">
          <Truck size={28} />
        </div>

        <p className="dispatch-eyebrow">SHOPEASE LOGISTICS</p>
        <h1>Dispatch Portal</h1>
        <p className="dispatch-muted">
          Sign in to manage hubs and shipment movement.
        </p>

        {error && (
          <div className="dispatch-alert dispatch-alert-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="dispatch-login-form">
          <label htmlFor="dispatch-email">Email address</label>
          <input
            id="dispatch-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your dispatch email"
            required
          />

          <label htmlFor="dispatch-password">Password</label>
          <input
            id="dispatch-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <button
            className="dispatch-primary-btn"
            type="submit"
            disabled={busy}
          >
            {busy ? "Signing in..." : "Sign in to Dispatch"}
          </button>
        </form>

        {onRegister && (
          <p className="dispatch-register-prompt">
            New dispatcher?{" "}
            <button type="button" onClick={onRegister}>
              Request an account
            </button>
          </p>
        )}

        <button className="dispatch-back-btn" onClick={onBack} type="button">
          ← Back to ShopEase
        </button>
      </section>
    </main>
  );
}

export function DispatchDashboard({ onLogout }) {
  const [section, setSection] = useState("overview");
  const [hubs, setHubs] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [transportRefs, setTransportRefs] = useState({});
  const [hubForm, setHubForm] = useState({
    hub_code: "",
    hub_name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const loadData = useCallback(async () => {
    setError("");

    try {
      const [hubResponse, shipmentResponse] = await Promise.all([
        dispatchRequest("/hubs"),
        dispatchRequest("/shipments"),
      ]);

      setHubs(getItems(hubResponse, "hubs"));
      setShipments(getItems(shipmentResponse, "shipments"));
    } catch (err) {
      setError(err.message || "Unable to load dispatch data.");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const counts = useMemo(() => {
    const activeHubs = hubs.filter(
      (hub) =>
        hub.is_active === 1 ||
        hub.is_active === true ||
        hub.status === "Active"
    ).length;

    return {
      hubs: activeHubs,
      total: shipments.length,
      inbound: shipments.filter((s) =>
        ["Picked Up", "Ready for Pickup"].includes(s.shipment_status)
      ).length,
      intercity: shipments.filter(
        (s) => s.shipment_status === "Received at Origin Hub"
      ).length,
      arrival: shipments.filter(
        (s) => s.shipment_status === "In Transit"
      ).length,
    };
  }, [hubs, shipments]);

  const visibleShipments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const status = shipment.shipment_status || "";
      const matchesFilter = !filter || status === filter;

      const searchableText = [
        shipment.id,
        shipment.order_id,
        shipment.tracking_number,
        shipment.origin_hub_name,
        shipment.destination_hub_name,
        shipment.shipment_status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesFilter && searchableText.includes(query);
    });
  }, [shipments, searchQuery, filter]);

  async function perform(path, body, successMessage) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await dispatchRequest(path, {
        method: "POST",
        body: JSON.stringify(body || {}),
      });

      setMessage(successMessage);
      await loadData();
    } catch (err) {
      setError(err.message || "Action failed.");
    } finally {
      setBusy(false);
    }
  }

  async function createHub(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await dispatchRequest("/hubs", {
        method: "POST",
        body: JSON.stringify(hubForm),
      });

      setHubForm({
        hub_code: "",
        hub_name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });

      setMessage("Hub created successfully.");
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to create hub.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleHub(hub) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const active =
        hub.is_active === 1 ||
        hub.is_active === true ||
        hub.status === "Active";

      await dispatchRequest(`/hubs/${hub.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !active }),
      });

      setMessage("Hub status updated.");
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to update hub status.");
    } finally {
      setBusy(false);
    }
  }

  function shipmentTable(items, mode) {
    if (!items.length) {
      return (
        <div className="dispatch-empty">
          <Package size={30} />
          <h3>No shipments found</h3>
          <p>Shipments matching this section will appear here.</p>
        </div>
      );
    }

    return (
      <div className="dispatch-table-wrap">
        <table className="dispatch-table">
          <thead>
            <tr>
              <th>Shipment</th>
              <th>Origin Hub</th>
              <th>Destination Hub</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((shipment) => {
              const status = shipment.shipment_status;
              let action = null;

              if (
                mode === "inbound" &&
                ["Picked Up", "Ready for Pickup"].includes(status)
              ) {
                action = (
                  <button
                    disabled={busy || !shipment.origin_hub_id}
                    className="dispatch-action-btn"
                    onClick={() =>
                      perform(
                        `/hubs/${shipment.origin_hub_id}/shipments/${shipment.id}/receive`,
                        {},
                        "Shipment received at origin hub."
                      )
                    }
                  >
                    <CheckCircle size={15} /> Receive
                  </button>
                );
              } else if (
                mode === "intercity" &&
                status === "Received at Origin Hub"
              ) {
                action = (
                  <div className="dispatch-action-group">
                    <input
                      aria-label="Transport reference"
                      placeholder="Transport ref"
                      value={transportRefs[shipment.id] || ""}
                      onChange={(e) =>
                        setTransportRefs((current) => ({
                          ...current,
                          [shipment.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      disabled={busy}
                      className="dispatch-action-btn"
                      onClick={() =>
                        perform(
                          `/shipments/${shipment.id}/dispatch`,
                          {
                            transport_reference:
                              transportRefs[shipment.id] || "",
                          },
                          "Shipment dispatched to destination hub."
                        )
                      }
                    >
                      <Truck size={15} /> Dispatch
                    </button>
                  </div>
                );
              } else if (
                mode === "arrival" &&
                status === "In Transit" &&
                shipment.transfer_id
              ) {
                action = (
                  <button
                    disabled={busy}
                    className="dispatch-action-btn"
                    onClick={() =>
                      perform(
                        `/hub-transfers/${shipment.transfer_id}/arrive`,
                        {},
                        "Shipment arrival recorded."
                      )
                    }
                  >
                    <MapPin size={15} /> Mark Arrived
                  </button>
                );
              } else {
                action = <span className="dispatch-muted">No action</span>;
              }

              return (
                <tr key={shipment.id}>
                  <td>
                    <strong>#{shipment.id}</strong>
                    <small>
                      {shipment.tracking_number ||
                        (shipment.order_id
                          ? `Order #${shipment.order_id}`
                          : "Shipment")}
                    </small>
                  </td>
                  <td>{shipment.origin_hub_name || "—"}</td>
                  <td>{shipment.destination_hub_name || "—"}</td>
                  <td>
                    <StatusBadge status={status} />
                  </td>
                  <td>{action}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  const activeSection = SECTIONS.find((item) => item.id === section);

  return (
    <div className="dispatch-app">
      {mobileNavOpen && (
        <button
          className="dispatch-mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside className={`dispatch-sidebar ${mobileNavOpen ? "open" : ""}`}>
        <div className="dispatch-sidebar-brand">
          <div className="dispatch-brand-mark">
            <Truck size={23} />
          </div>
          <div>
            <strong>SHOPEASE</strong>
            <span>LOGISTICS</span>
          </div>
          <button
            className="dispatch-mobile-close"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <p className="dispatch-nav-heading">WORKSPACE</p>

        <nav className="dispatch-nav">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={section === id ? "active" : ""}
              onClick={() => {
                setSection(id);
                setFilter("");
                setSearchQuery("");
                setMobileNavOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {section === id && <ArrowRight size={16} />}
            </button>
          ))}
        </nav>

        <div className="dispatch-sidebar-bottom">
          <div className="dispatch-online-indicator">
            <span />
            Dispatch system
            <small>Connected</small>
          </div>
          <button
            className="dispatch-logout-btn"
            onClick={onLogout}
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      <main className="dispatch-main">
        <header className="dispatch-topbar">
          <button
            className="dispatch-mobile-menu"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="dispatch-eyebrow">OPERATIONS / DISPATCH</p>
            <h1>{activeSection?.label || "Overview"}</h1>
          </div>

          <button
            className="dispatch-refresh-btn"
            onClick={loadData}
            title="Refresh data"
          >
            <RefreshCw size={17} />
            <span>Refresh</span>
          </button>
        </header>

        {(message || error) && (
          <div
            className={`dispatch-alert ${
              error ? "dispatch-alert-error" : "dispatch-alert-success"
            }`}
          >
            {error ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span>{error || message}</span>
            <button
              onClick={() => {
                setError("");
                setMessage("");
              }}
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {section === "overview" && (
          <>
            <div className="dispatch-welcome">
              <div>
                <span className="dispatch-welcome-label">
                  OPERATIONS OVERVIEW
                </span>
                <h2>Keep every shipment moving.</h2>
                <p>
                  Manage hub operations and track shipment movement from origin
                  to destination.
                </p>
              </div>
              <div className="dispatch-welcome-icon">
                <Boxes size={54} />
              </div>
            </div>

            <div className="dispatch-stats-grid">
              <StatCard
                icon={Warehouse}
                label="Active Hubs"
                value={counts.hubs}
                description="Operational locations"
              />
              <StatCard
                icon={Package}
                label="Total Shipments"
                value={counts.total}
                description="Shipments in the system"
              />
              <StatCard
                icon={Boxes}
                label="Inbound"
                value={counts.inbound}
                description="Awaiting hub receipt"
              />
              <StatCard
                icon={Truck}
                label="Ready to Dispatch"
                value={counts.intercity}
                description="Received at origin hub"
              />
              <StatCard
                icon={MapPin}
                label="In Transit"
                value={counts.arrival}
                description="Moving between hubs"
              />
            </div>

            <section className="dispatch-panel">
              <div className="dispatch-panel-heading">
                <div>
                  <h2>Recent Shipments</h2>
                  <p>Latest shipment activity from the database</p>
                </div>
                <button
                  className="dispatch-text-btn"
                  onClick={() => setSection("inbound")}
                >
                  View operations <ArrowRight size={15} />
                </button>
              </div>
              {shipmentTable(shipments.slice(0, 8), "overview")}
            </section>
          </>
        )}

        {section === "hubs" && (
          <>
            <section className="dispatch-panel">
              <div className="dispatch-panel-heading">
                <div>
                  <h2>Create a hub</h2>
                  <p>Add a logistics location to the hub network.</p>
                </div>
              </div>

              <form className="dispatch-hub-form" onSubmit={createHub}>
                <input
                  placeholder="Hub code"
                  value={hubForm.hub_code}
                  onChange={(e) =>
                    setHubForm({ ...hubForm, hub_code: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="Hub name"
                  value={hubForm.hub_name}
                  onChange={(e) =>
                    setHubForm({ ...hubForm, hub_name: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="Address"
                  value={hubForm.address}
                  onChange={(e) =>
                    setHubForm({ ...hubForm, address: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="City"
                  value={hubForm.city}
                  onChange={(e) =>
                    setHubForm({ ...hubForm, city: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="State"
                  value={hubForm.state}
                  onChange={(e) =>
                    setHubForm({ ...hubForm, state: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="Pincode"
                  value={hubForm.pincode}
                  onChange={(e) =>
                    setHubForm({ ...hubForm, pincode: e.target.value })
                  }
                  required
                />
                <button
                  className="dispatch-primary-btn"
                  type="submit"
                  disabled={busy}
                >
                  <Plus size={17} />
                  {busy ? "Saving..." : "Create Hub"}
                </button>
              </form>
            </section>

            <section className="dispatch-panel">
              <div className="dispatch-panel-heading">
                <div>
                  <h2>Hub Directory</h2>
                  <p>{hubs.length} hub(s) returned by the server</p>
                </div>
              </div>

              {hubs.length === 0 ? (
                <div className="dispatch-empty">
                  <Warehouse size={30} />
                  <h3>No hubs available</h3>
                  <p>Create a hub to get started.</p>
                </div>
              ) : (
                <div className="dispatch-hub-grid">
                  {hubs.map((hub) => {
                    const active =
                      hub.is_active === 1 ||
                      hub.is_active === true ||
                      hub.status === "Active";

                    return (
                      <article className="dispatch-hub-card" key={hub.id}>
                        <div className="dispatch-hub-card-top">
                          <div className="dispatch-hub-icon">
                            <Warehouse size={23} />
                          </div>
                          <StatusBadge status={active ? "Active" : "Inactive"} />
                        </div>
                        <h3>{hub.hub_name}</h3>
                        <p className="dispatch-hub-code">{hub.hub_code}</p>
                        <p>
                          {hub.city}, {hub.state}
                        </p>
                        <p>{hub.address}</p>
                        <p>{hub.pincode}</p>
                        <button
                          className="dispatch-secondary-btn"
                          disabled={busy}
                          onClick={() => toggleHub(hub)}
                        >
                          {active ? "Deactivate hub" : "Activate hub"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {["inbound", "intercity", "arrival"].includes(section) && (
          <section className="dispatch-panel">
            <div className="dispatch-panel-heading">
              <div>
                <h2>
                  {section === "inbound"
                    ? "Inbound Shipments"
                    : section === "intercity"
                    ? "Intercity Dispatch"
                    : "Destination Arrival"}
                </h2>
                <p>
                  {section === "inbound"
                    ? "Receive shipments at the origin hub."
                    : section === "intercity"
                    ? "Record dispatch between logistics hubs."
                    : "Record arrival at the destination hub."}
                </p>
              </div>
            </div>

            <div className="dispatch-filter-bar">
              <div className="dispatch-search">
                <Search size={18} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shipment, tracking, order or hub..."
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All statuses</option>
                {[...new Set(shipments.map((s) => s.shipment_status).filter(Boolean))]
                  .sort()
                  .map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
              </select>

              <button
                className="dispatch-secondary-btn"
                onClick={() => {
                  setFilter("");
                  setSearchQuery("");
                }}
              >
                Clear filters
              </button>
            </div>

            {shipmentTable(
              visibleShipments.filter((s) => {
                if (section === "inbound") {
                  return ["Ready for Pickup", "Picked Up"].includes(
                    s.shipment_status
                  );
                }
                if (section === "intercity") {
                  return s.shipment_status === "Received at Origin Hub";
                }
                return s.shipment_status === "In Transit";
              }),
              section
            )}
          </section>
        )}

        <footer className="dispatch-footer">
          <span>ShopEase Logistics</span>
          <span>Dispatch operations • Live database data</span>
        </footer>
      </main>
    </div>
  );
}