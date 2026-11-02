import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../api";

/* =========================================================
   ORDER DETAILS  (Order Details + Order Tracking in ONE page)
   Put this file at: src/pages/OrderDetails.jsx
   All styles are inside this file (classes start with od-)
========================================================= */

const STEPS = [
  { status: "Placed", title: "Order placed", text: "Your order has been placed successfully." },
  { status: "Confirmed", title: "Confirmed", text: "Your order has been confirmed." },
  { status: "Shipped", title: "Shipped", text: "Your order has been shipped." },
  { status: "Out for Delivery", title: "Out for delivery", text: "Your order is out for delivery." },
  { status: "Delivered", title: "Delivered", text: "Your order has been delivered." },
];

const CANCEL_REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a better price",
  "Delivery is taking too long",
  "I want to change the order",
  "Other",
];

const RETURN_REASONS = [
  "Received damaged product",
  "Wrong product received",
  "Product quality is not good",
  "Product does not match description",
  "Received incomplete product",
  "Other",
];

const RATING_TEXT = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const imageUrl = (image) => {
  if (!image) return "";
  const text = String(image).trim();
  if (/^(https?:|data:|blob:)/i.test(text)) return text;
  if (text.startsWith("/")) return `${API_BASE_URL}${text}`;
  return `${API_BASE_URL}/uploads/${text}`;
};

const getToken = () =>
  localStorage.getItem("customer_token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("token");

const parseItems = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

function OrderDetails({ order, onBack, onCancel, onDownloadInvoice }) {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState(null); // "cancel" | "return" | "feedback"
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null); // { type, text }

  const [reviewed, setReviewed] = useState({});
  const [feedbackItem, setFeedbackItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  /* ---------- keep in sync with the order passed in ---------- */
  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  /* ---------- fetch the complete order ---------- */
  useEffect(() => {
    const load = async () => {
      if (!order?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token = getToken();
        const userId = order.user_id || order.customer_id || order.userId || "";

        const response = await fetch(`${API_BASE_URL}/api/orders/${order.id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(userId ? { "x-user-id": String(userId) } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || data?.error || "Failed to fetch order details.");
        }

        const fetched = data?.order || data?.data || data;

        setCurrentOrder((previous) => ({ ...previous, ...fetched }));
        setItems(parseItems(fetched?.items || fetched?.order_items || fetched?.products));
      } catch (err) {
        console.error("Order details error:", err);
        setItems(parseItems(order?.items));
        setError(err?.message || "Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [order?.id]);

  /* ---------- status ---------- */
  const rawStatus = String(
    currentOrder?.order_status || currentOrder?.status || "Placed"
  ).trim();
  const status = rawStatus.toLowerCase();

  const isCancelled = status === "cancelled";
  const isDelivered = status === "delivered";
  const isShipped = status === "shipped";
  const isOut = status === "out for delivery";

  const returnStatus = String(currentOrder?.return_status || "").trim();
  const returnKey = returnStatus.toLowerCase();
  const returnDone = returnKey === "return completed";

  const canCancel = !isCancelled && !isDelivered && !isShipped && !isOut;
  const canReturn = isDelivered && !returnStatus;

  const stepIndex = STEPS.findIndex((s) => s.status.toLowerCase() === status);
  const currentIndex = stepIndex >= 0 ? stepIndex : 0;

  /* ---------- reviews (only after delivery) ---------- */
  const reviewItems = useMemo(
    () =>
      items
        .map((item, index) => {
          const productId = item?.product_id ?? item?.productId ?? item?.id;
          if (!productId) return null;
          return {
            product_id: Number(productId),
            name: item.product_name || item.productName || item.name || `Product ${index + 1}`,
            image: item.product_image || item.productImage || item.image || "",
          };
        })
        .filter(Boolean),
    [items]
  );

  useEffect(() => {
    if (!isDelivered || !currentOrder?.id || reviewItems.length === 0) return;

    const token = getToken();
    if (!token) return;

    let cancelled = false;

    const check = async () => {
      const result = {};

      for (const item of reviewItems) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/reviews/check/${currentOrder.id}/${item.product_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await response.json();
          result[item.product_id] = Boolean(data?.reviewed);
        } catch {
          result[item.product_id] = false;
        }
      }

      if (!cancelled) setReviewed(result);
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [isDelivered, currentOrder?.id, reviewItems]);

  const allReviewed =
    reviewItems.length > 0 && reviewItems.every((item) => reviewed[item.product_id]);

  /* ---------- payment ---------- */
  const methodKey = String(
    currentOrder?.payment_method || currentOrder?.paymentMethod || "cod"
  )
    .trim()
    .toLowerCase();

  let paymentText = currentOrder?.payment_method || currentOrder?.paymentMethod || "Payment";
  if (methodKey === "cod" || methodKey === "cash on delivery") paymentText = "Cash on Delivery";
  else if (methodKey === "upi") paymentText = "UPI";
  else if (methodKey === "razorpay") paymentText = "Razorpay";
  else if (["card", "credit", "debit", "online", "credit/debit card"].includes(methodKey))
    paymentText = "Credit / Debit Card";

  const total = Number(currentOrder?.total_amount ?? currentOrder?.total ?? 0);
  const paymentStatus = currentOrder?.payment_status || "Pending";

  /* ---------- address (supports both shapes) ---------- */
  let ship = currentOrder?.shipping_address || {};
  if (typeof ship === "string") {
    try {
      ship = JSON.parse(ship);
    } catch {
      ship = {};
    }
  }

  const address = {
    name: ship.full_name || ship.name || currentOrder?.full_name || currentOrder?.customer_name || "",
    phone: ship.phone || ship.mobile || currentOrder?.phone || currentOrder?.customer_phone || "",
    line: ship.address_line || ship.address || currentOrder?.address_line || currentOrder?.address || "",
    city: ship.city || currentOrder?.city || "",
    state: ship.state || currentOrder?.state || "",
    pincode: ship.pincode || ship.zipcode || ship.postal_code || currentOrder?.pincode || "",
  };

  const hasAddress = Object.values(address).some(Boolean);

  /* ---------- actions ---------- */
  const openModal = (name) => {
    setReason("");
    setOtherReason("");
    setNotice(null);
    setModal(name);
  };

  const closeModal = () => {
    setModal(null);
    setFeedbackItem(null);
  };

  const finalReason = reason === "Other" ? otherReason.trim() : reason;

  const sendStatusRequest = async (path, body) => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/api/orders/${currentOrder.id}/${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || data?.success === false) {
      throw new Error(data?.message || data?.error || "Request failed");
    }

    return data;
  };

  const submitCancel = async () => {
    if (!finalReason) return;

    try {
      setBusy(true);
      await sendStatusRequest("cancel", { cancellation_reason: finalReason });

      const updated = {
        ...currentOrder,
        order_status: "Cancelled",
        cancellation_reason: finalReason,
      };

      setCurrentOrder(updated);
      setNotice({ type: "ok", text: "Order cancelled successfully." });
      closeModal();
      if (onCancel) onCancel(updated);
    } catch (err) {
      setNotice({ type: "error", text: err?.message || "Failed to cancel order." });
      closeModal();
    } finally {
      setBusy(false);
    }
  };

  const submitReturn = async () => {
    if (!finalReason) return;

    try {
      setBusy(true);
      await sendStatusRequest("return", { return_reason: finalReason });

      setCurrentOrder({
        ...currentOrder,
        return_status: "Requested",
        return_reason: finalReason,
      });
      setNotice({ type: "ok", text: "Return request submitted." });
      closeModal();
    } catch (err) {
      setNotice({ type: "error", text: err?.message || "Failed to submit return request." });
      closeModal();
    } finally {
      setBusy(false);
    }
  };

  const openFeedback = (item) => {
    setFeedbackItem(item);
    setRating(0);
    setFeedbackText("");
    setNotice(null);
    setModal("feedback");
  };

  const openFirstFeedback = () => {
    const first = reviewItems.find((r) => !reviewed[r.product_id]);
    if (first) openFeedback(first);
  };

  const submitFeedback = async () => {
    const token = getToken();

    if (!token) {
      setNotice({ type: "error", text: "Please login again to submit feedback." });
      closeModal();
      return;
    }

    try {
      setBusy(true);

      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: feedbackItem.product_id,
          order_id: currentOrder.id,
          rating,
          feedback: feedbackText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      setReviewed((previous) => ({ ...previous, [feedbackItem.product_id]: true }));
      closeModal();
    } catch (err) {
      setNotice({ type: "error", text: err?.message || "Failed to submit feedback" });
      closeModal();
    } finally {
      setBusy(false);
    }
  };

  /* ---------- invoice (used when no invoice page is connected) ---------- */
  const printInvoice = () => {
    const win = window.open("", "_blank");

    if (!win) {
      alert("Please allow pop-ups to generate the invoice.");
      return;
    }

    const rows = items
      .map((item, i) => {
        const name = item.product_name || item.name || item.title || `Product ${i + 1}`;
        const qty = Number(item.quantity || 1);
        const price = Number(item.price ?? item.unit_price ?? 0);
        const line = Number(item.total_price ?? item.subtotal ?? price * qty);

        return `<tr><td>${i + 1}</td><td>${escapeHtml(name)}</td><td>${qty}</td><td>${money(price)}</td><td>${money(line)}</td></tr>`;
      })
      .join("");

    const date = currentOrder.created_at
      ? new Date(currentOrder.created_at).toLocaleString("en-IN")
      : "-";

    win.document.write(`<!DOCTYPE html><html><head><title>Invoice - Order #${escapeHtml(currentOrder.id)}</title>
<style>
body{font-family:Arial,sans-serif;max-width:900px;margin:auto;padding:36px;color:#222}
.top{display:flex;justify-content:space-between;border-bottom:2px solid #222;padding-bottom:16px;margin-bottom:24px}
h1{margin:0;font-size:28px}table{width:100%;border-collapse:collapse;margin-top:10px}
th,td{border:1px solid #ddd;padding:10px;text-align:left;font-size:13px}th{background:#f5f5f5}
.sum{margin:24px 0 0 auto;width:300px}.sum div{display:flex;justify-content:space-between;padding:6px 0}
.grand{border-top:2px solid #222;font-size:18px;font-weight:700;margin-top:8px;padding-top:10px}
button{background:#171717;color:#fff;border:0;padding:10px 18px;border-radius:6px;cursor:pointer;margin:0 8px 20px 0}
@media print{button{display:none}}
</style></head><body>
<button onclick="window.close()">← Back</button><button onclick="window.print()">Print / Save PDF</button>
<div class="top"><div><h1>ShopEase</h1><div style="color:#777">Order Invoice</div></div>
<div style="text-align:right"><strong>Order #${escapeHtml(currentOrder.id)}</strong><br>${escapeHtml(date)}</div></div>
<p><strong>${escapeHtml(address.name || "Customer")}</strong><br>${escapeHtml(address.phone)}<br>${escapeHtml(address.line)}<br>
${escapeHtml(address.city)}${address.state ? ", " + escapeHtml(address.state) : ""}${address.pincode ? " - " + escapeHtml(address.pincode) : ""}</p>
<table><thead><tr><th>#</th><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
<tbody>${rows || '<tr><td colspan="5">No product details available.</td></tr>'}</tbody></table>
<div class="sum"><div><span>Payment</span><strong>${escapeHtml(paymentText)}</strong></div>
<div><span>Payment status</span><strong>${escapeHtml(paymentStatus)}</strong></div>
<div class="grand"><span>Order total</span><strong>${money(total)}</strong></div></div>
<p style="text-align:center;color:#777;margin-top:48px">Thank you for shopping with ShopEase.</p>
</body></html>`);

    win.document.close();
  };

  const handleInvoice = () => {
    if (onDownloadInvoice) onDownloadInvoice(currentOrder);
    else printInvoice();
  };

  /* ---------- not found ---------- */
  if (!currentOrder) {
    return (
      <section className="od">
        <style>{OD_CSS}</style>
        <div className="od-wrap">
          <div className="od-card od-center">
            <div className="od-big">📦</div>
            <h2>Order not found</h2>
            <p>We couldn't find this order.</p>
            <button type="button" className="od-btn od-btn-primary" onClick={onBack}>
              ← Back to My Orders
            </button>
          </div>
        </div>
      </section>
    );
  }

  const date = currentOrder.created_at
    ? new Date(currentOrder.created_at).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  const statusTone = isCancelled ? "red" : isDelivered ? "green" : "purple";

  /* =========================================================
     UI
  ========================================================= */

  return (
    <section className="od">
      <style>{OD_CSS}</style>

      <div className="od-wrap">
        {/* ---------- header ---------- */}
        <header className="od-head">
          <button type="button" className="od-back" onClick={onBack} aria-label="Back">
            ←
          </button>

          <div className="od-head-text">
            <span>ORDER DETAILS</span>
            <h1>Order #{currentOrder.id}</h1>
            <small>Placed on {date}</small>
          </div>

          <span className={`od-badge od-${statusTone}`}>{rawStatus}</span>
        </header>

        {notice && (
          <div className={`od-notice od-notice-${notice.type}`}>
            {notice.type === "ok" ? "✓ " : "⚠️ "}
            {notice.text}
          </div>
        )}

        {/* ---------- tracking ---------- */}
        <div className="od-card">
          <h2 className="od-title">Order tracking</h2>

          {isCancelled ? (
            <div className="od-cancelled">
              <div className="od-cancelled-icon">✕</div>
              <div>
                <strong>This order has been cancelled</strong>
                <p>It was cancelled successfully and will not be delivered.</p>
                {currentOrder.cancellation_reason && (
                  <p className="od-reason">
                    Reason: <b>{currentOrder.cancellation_reason}</b>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <ol className="od-steps">
              {STEPS.map((step, index) => {
                const done = index <= currentIndex;
                const current = index === currentIndex;

                return (
                  <li
                    key={step.status}
                    className={`od-step ${done ? "is-done" : ""} ${current ? "is-current" : ""}`}
                  >
                    <span className="od-dot">{done ? "✓" : index + 1}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{current ? step.text : done ? "Completed" : "Pending"}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* ---------- cancel / return / feedback cards ---------- */}
        {canCancel && (
          <div className="od-card od-cta">
            <div className="od-cta-icon od-cta-red">✕</div>
            <div className="od-cta-text">
              <span>CANCEL ORDER</span>
              <h2>Want to cancel this order?</h2>
              <p>You can cancel this order before it is shipped.</p>
            </div>
            <button type="button" className="od-btn od-btn-danger" onClick={() => openModal("cancel")}>
              Cancel order
            </button>
          </div>
        )}

        {(isShipped || isOut) && (
          <div className="od-card od-cta od-cta-note">
            <div className="od-cta-icon">📦</div>
            <div className="od-cta-text">
              <h2>Order cancellation unavailable</h2>
              <p>This order has already been shipped and can no longer be cancelled.</p>
            </div>
          </div>
        )}

        {canReturn && (
          <div className="od-card od-cta">
            <div className="od-cta-icon">↩</div>
            <div className="od-cta-text">
              <span>RETURN AVAILABLE</span>
              <h2>Not happy with your order?</h2>
              <p>You can request a return for this delivered order. Select a reason and submit your request.</p>
            </div>
            <button type="button" className="od-btn od-btn-primary" onClick={() => openModal("return")}>
              Request return →
            </button>
          </div>
        )}

        {isDelivered && reviewItems.length > 0 && !allReviewed && (
          <div className="od-card od-cta">
            <div className="od-cta-icon od-cta-star">⭐</div>
            <div className="od-cta-text">
              <span>PRODUCT FEEDBACK</span>
              <h2>How was your product?</h2>
              <p>Share your rating and feedback to help other customers.</p>
            </div>
            <button type="button" className="od-btn od-btn-primary" onClick={openFirstFeedback}>
              Give feedback →
            </button>
          </div>
        )}

        {isDelivered && allReviewed && (
          <div className="od-card od-cta od-cta-note">
            <div className="od-cta-icon od-cta-green">✓</div>
            <div className="od-cta-text">
              <span>PRODUCT FEEDBACK</span>
              <h2>Thanks for your feedback!</h2>
              <p>Your feedback has been submitted. We appreciate you sharing your experience.</p>
            </div>
          </div>
        )}

        {/* ---------- items ---------- */}
        <div className="od-card">
          <div className="od-title-row">
            <h2 className="od-title">Ordered items</h2>
            <span className="od-count">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          {loading && <p className="od-muted">Loading your order...</p>}

          {!loading && error && items.length === 0 && <p className="od-error">{error}</p>}

          {!loading && !error && items.length === 0 && (
            <p className="od-muted">No items found for this order.</p>
          )}

          {items.length > 0 && (
            <div className="od-items">
              {items.map((item, index) => {
                const price = Number(item.price ?? item.unit_price ?? 0);
                const qty = Number(item.quantity ?? 1);
                const line = Number(item.total_price ?? item.subtotal ?? price * qty);
                const name = item.product_name || item.name || item.title || `Product ${index + 1}`;
                const image = item.product_image || item.image || item.image_url || "";
                const productId = Number(item?.product_id ?? item?.productId ?? item?.id);
                const reviewItem = reviewItems.find((r) => r.product_id === productId);

                return (
                  <div className="od-item" key={item.id || item.product_id || index}>
                    <div className="od-thumb">
                      {image ? <img src={imageUrl(image)} alt={name} /> : <span>🛍️</span>}
                    </div>

                    <div className="od-item-info">
                      <small>{item.category || item.brand || "Product"}</small>
                      <h3>{name}</h3>
                      <span>
                        Qty {qty} × {money(price)}
                      </span>

                      {isDelivered && reviewItem && (
                        <div className="od-item-review">
                          {reviewed[productId] ? (
                            <em>✓ Thanks for your feedback</em>
                          ) : (
                            <button type="button" onClick={() => openFeedback(reviewItem)}>
                              ★ Rate this product
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <strong className="od-line">{money(line)}</strong>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ---------- return status ---------- */}
        {isDelivered && returnStatus && (
          <div className={`od-card od-return ${returnDone ? "is-done" : ""}`}>
            <div className="od-return-top">
              <div>
                <span>{returnDone ? "RETURN COMPLETED" : "RETURN REQUEST"}</span>
                <h2>{returnDone ? "Order returned" : "Return request submitted"}</h2>
              </div>
              <span className={`od-badge ${returnDone ? "od-green" : "od-purple"}`}>
                {returnStatus}
              </span>
            </div>

            {currentOrder.return_reason && (
              <p className="od-reason">
                Reason: <b>{currentOrder.return_reason}</b>
              </p>
            )}
          </div>
        )}

        {/* ---------- delivery + payment ---------- */}
        <div className="od-two">
          <div className="od-card">
            <h2 className="od-title">📍 Delivery address</h2>

            {hasAddress ? (
              <div className="od-address">
                {address.name && <strong>{address.name}</strong>}
                {address.phone && <p>{address.phone}</p>}
                {address.line && <p>{address.line}</p>}
                <p>
                  {address.city}
                  {address.state ? `, ${address.state}` : ""}
                  {address.pincode ? ` - ${address.pincode}` : ""}
                </p>
              </div>
            ) : (
              <p className="od-muted">Delivery address not available.</p>
            )}
          </div>

          <div className="od-card">
            <h2 className="od-title">💳 Payment</h2>

            <dl className="od-pay">
              <div>
                <dt>Method</dt>
                <dd>{paymentText}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{paymentStatus}</dd>
              </div>
              <div className="od-pay-total">
                <dt>Order total</dt>
                <dd>{money(total)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* ---------- actions ---------- */}
        <div className="od-card od-actions">
          <div>
            <strong>Order #{currentOrder.id}</strong>
            <p>
              {isCancelled
                ? "This order has been cancelled."
                : "Need a copy for your records? Download your invoice."}
            </p>
          </div>

          <div className="od-btns">
            <button type="button" className="od-btn od-btn-line" onClick={handleInvoice}>
              📄 Invoice
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MODALS
      ===================================================== */}

      {(modal === "cancel" || modal === "return") && (
        <div className="od-overlay" onClick={closeModal}>
          <div className="od-modal" onClick={(e) => e.stopPropagation()}>
            <div className="od-modal-head">
              <div>
                <span>{modal === "cancel" ? "CANCEL ORDER" : "RETURN ORDER"}</span>
                <h2>
                  {modal === "cancel"
                    ? "Why do you want to cancel?"
                    : "Why do you want to return?"}
                </h2>
              </div>
              <button type="button" onClick={closeModal} aria-label="Close">
                ×
              </button>
            </div>

            <div className="od-reasons">
              {(modal === "cancel" ? CANCEL_REASONS : RETURN_REASONS).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`od-reason-opt ${reason === item ? "is-on" : ""}`}
                  onClick={() => setReason(item)}
                >
                  <span className="od-radio">{reason === item ? "✓" : ""}</span>
                  {item}
                </button>
              ))}
            </div>

            {reason === "Other" && (
              <textarea
                className="od-textarea"
                placeholder="Please tell us the reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            )}

            <div className="od-modal-actions">
              <button type="button" className="od-btn od-btn-line" onClick={closeModal}>
                {modal === "cancel" ? "Keep order" : "Close"}
              </button>

              <button
                type="button"
                className={`od-btn ${modal === "cancel" ? "od-btn-danger-solid" : "od-btn-primary"}`}
                disabled={busy || !finalReason}
                onClick={modal === "cancel" ? submitCancel : submitReturn}
              >
                {busy
                  ? "Please wait..."
                  : modal === "cancel"
                  ? "Cancel order"
                  : "Request return"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "feedback" && feedbackItem && (
        <div className="od-overlay" onClick={closeModal}>
          <div className="od-modal" onClick={(e) => e.stopPropagation()}>
            <div className="od-modal-head">
              <div>
                <span>PRODUCT FEEDBACK</span>
                <h2>Rate your product</h2>
              </div>
              <button type="button" onClick={closeModal} aria-label="Close">
                ×
              </button>
            </div>

            {reviewItems.filter((r) => !reviewed[r.product_id]).length > 1 && (
              <div className="od-fb-switch">
                {reviewItems
                  .filter((r) => !reviewed[r.product_id])
                  .map((r) => (
                    <button
                      type="button"
                      key={r.product_id}
                      className={feedbackItem.product_id === r.product_id ? "is-on" : ""}
                      onClick={() => {
                        setFeedbackItem(r);
                        setRating(0);
                        setFeedbackText("");
                      }}
                    >
                      {r.name}
                    </button>
                  ))}
              </div>
            )}

            <div className="od-fb-product">
              {feedbackItem.image && <img src={imageUrl(feedbackItem.image)} alt={feedbackItem.name} />}
              <strong>{feedbackItem.name}</strong>
            </div>

            <div className="od-stars" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={star <= rating ? "is-on" : ""}
                  onClick={() => setRating(star)}
                  aria-label={`${star} star`}
                >
                  ★
                </button>
              ))}
              {rating > 0 && <em>{RATING_TEXT[rating]}</em>}
            </div>

            <textarea
              className="od-textarea"
              rows="4"
              maxLength="1000"
              placeholder="Tell us about your experience with this product..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
            <small className="od-muted">{feedbackText.length}/1000</small>

            <div className="od-modal-actions">
              <button type="button" className="od-btn od-btn-line" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className="od-btn od-btn-primary"
                disabled={busy || !rating || !feedbackText.trim()}
                onClick={submitFeedback}
              >
                {busy ? "Submitting..." : "Submit feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default OrderDetails;

/* =========================================================
   STYLES (only used by this page)
========================================================= */

const OD_CSS = `
.od {
  --od-brand: #6d28d9;
  --od-brand-dark: #5b21b6;
  --od-soft: #ede9fe;
  --od-mist: #f5f2fd;
  --od-line: #e6e0f6;
  --od-ink: #17132b;
  --od-muted: #6b6785;
  --od-red: #dc2626;
  --od-green: #15803d;
  min-height: 100vh;
  background: var(--od-mist);
  padding: 24px 16px 56px;
  color: var(--od-ink);
  font-family: "DM Sans", system-ui, sans-serif;
  text-align: left;
  box-sizing: border-box;
}
.od *, .od *::before, .od *::after { box-sizing: border-box; }
.od h1, .od h2, .od h3, .od p { margin: 0; text-align: left; letter-spacing: 0; color: inherit; }
.od-wrap { max-width: 920px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }

.od-card { background: #fff; border: 1px solid var(--od-line); border-radius: 18px; padding: 22px; }
.od-center { text-align: center; padding: 48px 24px; }
.od-center h2, .od-center p { text-align: center; }
.od-big { font-size: 44px; margin-bottom: 8px; }
.od-title { font-size: 18px; font-weight: 800; margin-bottom: 16px; }
.od-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.od-title-row .od-title { margin: 0; }
.od-count { background: var(--od-soft); color: var(--od-brand-dark); font-weight: 700; font-size: 13px; padding: 6px 12px; border-radius: 999px; }
.od-muted { color: var(--od-muted); font-size: 14px; }
.od-error { color: var(--od-red); font-size: 14px; }

/* header */
.od-head { display: flex; align-items: center; gap: 14px; }
.od-back { width: 42px; height: 42px; flex: none; border-radius: 50%; border: 1px solid var(--od-line); background: #fff; color: var(--od-ink); font-size: 20px; cursor: pointer; }
.od-head-text { flex: 1; min-width: 0; }
.od-head-text span { font-size: 11px; font-weight: 700; letter-spacing: .12em; color: var(--od-muted); }
.od-head-text h1 { font-size: 26px; font-weight: 800; line-height: 1.15; }
.od-head-text small { color: var(--od-muted); font-size: 13px; }
.od-badge { padding: 7px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; white-space: nowrap; }
.od-purple { background: var(--od-soft); color: var(--od-brand-dark); }
.od-green { background: #e7f6ec; color: var(--od-green); }
.od-red { background: #fee2e2; color: var(--od-red); }

.od-notice { padding: 12px 16px; border-radius: 12px; font-size: 14px; font-weight: 600; }
.od-notice-ok { background: #e7f6ec; color: var(--od-green); }
.od-notice-error { background: #fee2e2; color: var(--od-red); }

/* tracking */
.od-steps { list-style: none; margin: 0; padding: 0; display: flex; }
.od-step { flex: 1; position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
.od-step::before { content: ""; position: absolute; top: 17px; left: -50%; width: 100%; height: 3px; background: var(--od-line); z-index: 0; }
.od-step:first-child::before { display: none; }
.od-step.is-done::before { background: var(--od-brand); }
.od-dot { position: relative; z-index: 1; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: #fff; border: 3px solid var(--od-line); color: var(--od-muted); font-weight: 700; font-size: 14px; }
.od-step.is-done .od-dot { background: var(--od-brand); border-color: var(--od-brand); color: #fff; }
.od-step.is-current .od-dot { box-shadow: 0 0 0 6px var(--od-soft); }
.od-step strong { font-size: 14px; display: block; }
.od-step p { font-size: 12px; color: var(--od-muted); margin-top: 2px; text-align: center; max-width: 130px; }
.od-step.is-current strong { color: var(--od-brand); }

.od-cancelled { display: flex; gap: 14px; align-items: flex-start; }
.od-cancelled-icon { width: 44px; height: 44px; flex: none; border-radius: 50%; background: #fee2e2; color: var(--od-red); display: grid; place-items: center; font-weight: 800; }
.od-cancelled p { color: var(--od-muted); font-size: 14px; margin-top: 4px; }
.od-reason { margin-top: 10px; font-size: 14px; color: var(--od-muted); }
.od-reason b { color: var(--od-ink); }

/* items */
.od-items { display: flex; flex-direction: column; }
.od-item { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-top: 1px solid var(--od-line); }
.od-item:first-child { border-top: 0; padding-top: 0; }
.od-thumb { width: 84px; height: 84px; flex: none; border: 1px solid var(--od-line); border-radius: 14px; background: #fff; display: grid; place-items: center; overflow: hidden; font-size: 28px; }
.od-thumb img { width: 100%; height: 100%; object-fit: contain; padding: 6px; }
.od-item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.od-item-info small { color: var(--od-brand); font-weight: 700; font-size: 12px; text-transform: capitalize; }
.od-item-info h3 { font-size: 16px; font-weight: 700; line-height: 1.3; }
.od-item-info > span { color: var(--od-muted); font-size: 13px; }
.od-line { font-size: 17px; font-weight: 800; white-space: nowrap; }
.od-item-review { margin-top: 6px; }
.od-item-review button { border: 0; background: var(--od-soft); color: var(--od-brand-dark); font: 700 13px "DM Sans", sans-serif; padding: 7px 14px; border-radius: 999px; cursor: pointer; }
.od-item-review em { font-style: normal; font-size: 13px; color: var(--od-green); font-weight: 600; }

/* return */
.od-return.is-done { border-color: #bbe5c8; }
.od-return-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.od-return-top span:first-child { font-size: 11px; font-weight: 700; letter-spacing: .12em; color: var(--od-muted); }
.od-return-top h2 { font-size: 18px; font-weight: 800; margin-top: 2px; }

/* two columns */
.od-two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.od-address strong { display: block; margin-bottom: 4px; font-size: 16px; }
.od-address p { color: var(--od-muted); font-size: 14px; line-height: 1.6; }
.od-pay { margin: 0; display: flex; flex-direction: column; gap: 10px; }
.od-pay div { display: flex; justify-content: space-between; font-size: 14px; }
.od-pay dt { color: var(--od-muted); }
.od-pay dd { margin: 0; font-weight: 700; }
.od-pay-total { border-top: 1px solid var(--od-line); padding-top: 12px; font-size: 18px !important; }
.od-pay-total dd { color: var(--od-brand); }

/* actions */
.od-actions { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.od-actions p { color: var(--od-muted); font-size: 14px; margin-top: 3px; }
.od-btns { display: flex; gap: 10px; flex-wrap: wrap; }

.od-btn { border: 0; border-radius: 12px; padding: 12px 20px; font: 700 14px "DM Sans", sans-serif; cursor: pointer; transition: background .15s ease; }
.od-btn:disabled { opacity: .5; cursor: not-allowed; }
.od-btn-primary { background: var(--od-brand); color: #fff; }
.od-btn-primary:hover:not(:disabled) { background: var(--od-brand-dark); }
.od-btn-line { background: #fff; color: var(--od-brand); box-shadow: inset 0 0 0 1.5px var(--od-brand); }
.od-btn-line:hover { background: var(--od-soft); }
.od-btn-danger { background: #fff; color: var(--od-red); box-shadow: inset 0 0 0 1.5px var(--od-red); }
.od-btn-danger:hover { background: #fee2e2; }
.od-btn-danger-solid { background: var(--od-red); color: #fff; }

/* modals */
.od-overlay { position: fixed; inset: 0; z-index: 3000; background: rgba(23,19,43,.55); display: grid; place-items: center; padding: 16px; }
.od-modal { width: min(480px, 100%); max-height: 92vh; overflow-y: auto; background: #fff; border-radius: 20px; padding: 24px; }
.od-modal-head { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.od-modal-head span { font-size: 11px; font-weight: 700; letter-spacing: .12em; color: var(--od-muted); }
.od-modal-head h2 { font-size: 22px; font-weight: 800; margin-top: 2px; }
.od-modal-head button { width: 36px; height: 36px; flex: none; border: 0; border-radius: 50%; background: var(--od-mist); font-size: 22px; cursor: pointer; color: var(--od-ink); }
.od-reasons { display: flex; flex-direction: column; gap: 8px; }
.od-reason-opt { display: flex; align-items: center; gap: 12px; text-align: left; border: 1.5px solid var(--od-line); background: #fff; color: var(--od-ink); border-radius: 12px; padding: 12px 14px; font: 500 15px "DM Sans", sans-serif; cursor: pointer; }
.od-reason-opt.is-on { border-color: var(--od-brand); background: var(--od-soft); }
.od-radio { width: 22px; height: 22px; flex: none; border-radius: 50%; border: 2px solid var(--od-line); display: grid; place-items: center; font-size: 12px; color: #fff; }
.od-reason-opt.is-on .od-radio { background: var(--od-brand); border-color: var(--od-brand); }
.od-textarea { width: 100%; margin-top: 12px; border: 1.5px solid var(--od-line); border-radius: 12px; padding: 12px; font: 400 14px "DM Sans", sans-serif; min-height: 90px; resize: vertical; color: var(--od-ink); }
.od-modal-actions { display: flex; gap: 10px; margin-top: 18px; }
.od-modal-actions .od-btn { flex: 1; }

.od-fb-product { display: flex; align-items: center; gap: 12px; background: var(--od-mist); border-radius: 14px; padding: 10px; margin-bottom: 14px; }
.od-fb-product img { width: 52px; height: 52px; object-fit: contain; background: #fff; border-radius: 10px; }
.od-stars { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
.od-stars button { border: 0; background: transparent; font-size: 34px; line-height: 1; color: #d6d0ea; cursor: pointer; padding: 0 2px; }
.od-stars button.is-on { color: #f5a524; }
.od-stars em { margin-left: 8px; font-style: normal; font-weight: 700; color: var(--od-brand); }


/* call-to-action cards */
.od-cta { display: flex; align-items: center; gap: 16px; }
.od-cta-icon { width: 52px; height: 52px; flex: none; border-radius: 16px; background: var(--od-soft); color: var(--od-brand); display: grid; place-items: center; font-size: 24px; font-weight: 800; }
.od-cta-red { background: #fee2e2; color: var(--od-red); }
.od-cta-star { background: #fef3c7; }
.od-cta-green { background: #e7f6ec; color: var(--od-green); }
.od-cta-text { flex: 1; min-width: 0; }
.od-cta-text span { font-size: 11px; font-weight: 700; letter-spacing: .12em; color: var(--od-muted); }
.od-cta-text h2 { font-size: 18px; font-weight: 800; margin-top: 2px; }
.od-cta-text p { color: var(--od-muted); font-size: 14px; margin-top: 4px; }
.od-cta-note { background: var(--od-mist); }
.od-fb-switch { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.od-fb-switch button { border: 1.5px solid var(--od-line); background: #fff; color: var(--od-ink); border-radius: 999px; padding: 7px 14px; font: 600 13px "DM Sans", sans-serif; cursor: pointer; }
.od-fb-switch button.is-on { background: var(--od-brand); border-color: var(--od-brand); color: #fff; }

@media (max-width: 720px) {
  .od-cta { flex-wrap: wrap; }
  .od-cta .od-btn { width: 100%; }
  .od-two { grid-template-columns: 1fr; }
  .od-steps { flex-direction: column; gap: 0; }
  .od-step { flex-direction: row; text-align: left; align-items: flex-start; gap: 14px; padding-bottom: 20px; }
  .od-step::before { top: -50%; left: 17px; width: 3px; height: 100%; }
  .od-step p { text-align: left; max-width: none; }
  .od-head-text h1 { font-size: 21px; }
  .od-item { flex-wrap: wrap; }
  .od-line { width: 100%; text-align: right; }
  .od-btns, .od-btns .od-btn { width: 100%; }
}
`;
