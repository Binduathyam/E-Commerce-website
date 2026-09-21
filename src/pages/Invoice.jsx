import { useEffect } from "react";
import "./Invoice.css";

function Invoice({ order, onBack }) {

  useEffect(() => {
    if (!order) {
      return;
    }
  }, [order]);

  if (!order) {
    return null;
  }

  const totalAmount = Number(
    order.total_amount || 0
  );

  const paymentMethod = String(
    order.payment_method || "Cash on Delivery"
  );

  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleString(
        "en-IN"
      )
    : "Date unavailable";

  const handleDownload = () => {
    window.print();
  };

  return (
    <section className="invoice-page">

      {/* HEADER */}

      <div className="invoice-topbar">

        <button
          type="button"
          className="invoice-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <button
          type="button"
          className="invoice-download-button"
          onClick={handleDownload}
        >
          📄 Download Invoice
        </button>

      </div>


      {/* INVOICE */}

      <div className="invoice-container">

        <div className="invoice-header">

          <div>

            <h1>
              ShopEase
            </h1>

            <p>
              Your trusted online shopping platform
            </p>

          </div>

          <div className="invoice-title">

            <h2>
              INVOICE
            </h2>

            <p>
              Order #{order.id}
            </p>

          </div>

        </div>


        {/* ORDER INFO */}

        <div className="invoice-info-grid">

          <div>

            <p className="invoice-label">
              ORDER DATE
            </p>

            <strong>
              {orderDate}
            </strong>

          </div>


          <div>

            <p className="invoice-label">
              ORDER STATUS
            </p>

            <strong>
              {order.order_status || "Placed"}
            </strong>

          </div>


          <div>

            <p className="invoice-label">
              PAYMENT METHOD
            </p>

            <strong>
              {paymentMethod}
            </strong>

          </div>


          <div>

            <p className="invoice-label">
              PAYMENT STATUS
            </p>

            <strong>
              {order.payment_status || "Pending"}
            </strong>

          </div>

        </div>


        {/* BILL TO */}

        <div className="invoice-section">

          <h3>
            BILL TO
          </h3>

          <div className="invoice-address">

            <strong>
              {order.full_name || "Customer"}
            </strong>

            {order.phone && (
              <p>
                {order.phone}
              </p>
            )}

            {order.address_line && (
              <p>
                {order.address_line}
              </p>
            )}

            {(order.city ||
              order.state ||
              order.pincode) && (

              <p>

                {order.city || ""}

                {order.state
                  ? `, ${order.state}`
                  : ""}

                {order.pincode
                  ? ` - ${order.pincode}`
                  : ""}

              </p>

            )}

          </div>

        </div>


        {/* ORDER TOTAL */}

        <div className="invoice-total-section">

          <span>
            Total Amount
          </span>

          <strong>
            ₹{totalAmount.toLocaleString("en-IN")}
          </strong>

        </div>


        {/* FOOTER */}

        <div className="invoice-footer">

          <p>
            Thank you for shopping with ShopEase!
          </p>

          <span>
            This is a computer generated invoice.
          </span>

        </div>

      </div>

    </section>
  );
}

export default Invoice;