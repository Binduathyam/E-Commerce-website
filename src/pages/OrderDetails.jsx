import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";

function OrderDetails({
  order,
  onBack,
  onTrack,
  onCancel,
  onDownloadInvoice,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // ORDER STATUS
  // =========================================

  const [currentOrder, setCurrentOrder] =
    useState(order);

  const [cancelling, setCancelling] =
    useState(false);

  const [cancelMessage, setCancelMessage] =
    useState("");

  // =========================================
  // GET CUSTOMER TOKEN
  // =========================================

  const getToken = () => {
    return (
      localStorage.getItem("customer_token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("token")
    );
  };

  // =========================================
  // FETCH COMPLETE ORDER DETAILS
  // =========================================

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!currentOrder?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token = getToken();

        const userId =
          currentOrder?.user_id ||
          currentOrder?.customer_id ||
          currentOrder?.userId ||
          "";

        const response = await fetch(
          `${API_BASE_URL}/api/orders/${currentOrder.id}`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",

              ...(userId
                ? {
                    "x-user-id": String(userId),
                  }
                : {}),

              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

        const data = await response.json();

        console.log(
          "ORDER DETAILS RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Failed to fetch order details."
          );
        }

        // =====================================
        // SAME RESPONSE FORMAT AS MOBILE APP
        // =====================================

        const fetchedOrder =
          data?.order ||
          data?.data ||
          data;

        console.log(
          "FETCHED ORDER:",
          fetchedOrder
        );

        // =====================================
        // UPDATE COMPLETE ORDER
        // =====================================

        setCurrentOrder((previous) => ({
          ...previous,
          ...fetchedOrder,
        }));

        // =====================================
        // GET PRODUCTS
        // =====================================

        let orderItems = [];

        if (
          Array.isArray(
            fetchedOrder?.items
          )
        ) {
          orderItems =
            fetchedOrder.items;
        } else if (
          typeof fetchedOrder?.items ===
          "string"
        ) {
          try {
            const parsedItems =
              JSON.parse(
                fetchedOrder.items
              );

            if (
              Array.isArray(
                parsedItems
              )
            ) {
              orderItems =
                parsedItems;
            }
          } catch (parseError) {
            console.error(
              "Items JSON parse error:",
              parseError
            );
          }
        }

        console.log(
          "ORDER ITEMS:",
          orderItems
        );

        setItems(orderItems);

      } catch (err) {
        console.error(
          "Order details error:",
          err
        );

        setItems([]);

        setError(
          err?.message ||
            "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [currentOrder?.id]);

  // =========================================
  // UPDATE WHEN ORDER PROP CHANGES
  // =========================================

  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  // =========================================
  // ORDER NOT FOUND
  // =========================================

  if (!currentOrder) {
    return (
      <section className="order-details-page">

        <div className="order-details-empty">

          <div className="order-details-empty-icon">
            📦
          </div>

          <h2>
            Order not found
          </h2>

          <p>
            We couldn't find this order.
          </p>

          <button
            type="button"
            onClick={onBack}
          >
            ← Back to My Orders
          </button>

        </div>

      </section>
    );
  }

  // =========================================
  // PAYMENT METHOD
  // =========================================

  const paymentMethod =
    String(
      currentOrder.payment_method ||
        currentOrder.paymentMethod ||
        "cod"
    )
      .trim()
      .toLowerCase();

  let paymentText = "Payment";

  if (
    paymentMethod === "cod" ||
    paymentMethod ===
      "cash on delivery"
  ) {
    paymentText =
      "Cash on Delivery";
  } else if (
    paymentMethod === "upi"
  ) {
    paymentText = "UPI";
  } else if (
    paymentMethod === "razorpay"
  ) {
    paymentText = "Razorpay";
  } else if (
    paymentMethod === "card" ||
    paymentMethod === "credit" ||
    paymentMethod === "debit" ||
    paymentMethod ===
      "credit/debit card"
  ) {
    paymentText =
      "Credit / Debit Card";
  } else {
    paymentText =
      currentOrder.payment_method ||
      currentOrder.paymentMethod ||
      "Payment";
  }

  // =========================================
  // TOTAL
  // =========================================

  const totalAmount =
    Number(
      currentOrder.total_amount ||
        currentOrder.total ||
        0
    );

  // =========================================
  // ORDER STATUS
  // =========================================

  const orderStatus =
    currentOrder.order_status ||
    currentOrder.status ||
    "Placed";

  const normalizedStatus =
    String(orderStatus).toLowerCase();

  // =========================================
  // CANCEL ALLOWED?
  // =========================================

  const canCancel =
    normalizedStatus === "placed" ||
    normalizedStatus === "confirmed";

  // =========================================
  // SHIPPING ADDRESS
  // =========================================

  let shippingAddress =
    currentOrder.shipping_address ||
    {};

  if (
    typeof shippingAddress ===
    "string"
  ) {
    try {
      shippingAddress =
        JSON.parse(
          shippingAddress
        );
    } catch {
      shippingAddress = {};
    }
  }

  const addressName =
    shippingAddress.full_name ||
    shippingAddress.name ||
    shippingAddress.address_name ||
    currentOrder.customer_name ||
    currentOrder.full_name ||
    currentOrder.address_name ||
    "";

  const addressPhone =
    shippingAddress.phone ||
    shippingAddress.mobile ||
    shippingAddress.address_phone ||
    currentOrder.customer_phone ||
    currentOrder.phone ||
    currentOrder.address_phone ||
    "";

  const addressLine =
    shippingAddress.address_line ||
    shippingAddress.address ||
    currentOrder.address_line ||
    currentOrder.address ||
    "";

  const addressCity =
    shippingAddress.city ||
    currentOrder.city ||
    "";

  const addressState =
    shippingAddress.state ||
    currentOrder.state ||
    "";

  const addressPincode =
    shippingAddress.pincode ||
    shippingAddress.zipcode ||
    shippingAddress.postal_code ||
    currentOrder.pincode ||
    currentOrder.postal_code ||
    "";

  // =========================================
  // PRODUCT IMAGE URL
  // =========================================

  const getProductImage = (
    image
  ) => {
    if (!image) {
      return "";
    }

    const imageString =
      String(image).trim();

    if (
      imageString.startsWith(
        "http://"
      ) ||
      imageString.startsWith(
        "https://"
      )
    ) {
      return imageString;
    }

    if (
      imageString.startsWith("/")
    ) {
      return `${API_BASE_URL}${imageString}`;
    }

    return `${API_BASE_URL}/uploads/${imageString}`;
  };

  // =========================================
  // DOWNLOAD / PRINT INVOICE
  // =========================================

  const handleDownloadInvoice = () => {
    if (!currentOrder?.id) {
      return;
    }

    const invoiceWindow =
      window.open(
        "",
        "_blank"
      );

    if (!invoiceWindow) {
      alert(
        "Please allow pop-ups to generate the invoice."
      );
      return;
    }

    const invoiceDate =
      currentOrder.created_at
        ? new Date(
            currentOrder.created_at
          ).toLocaleString(
            "en-IN"
          )
        : "—";

    const productRows =
      items
        .map(
          (
            item,
            index
          ) => {
            const name =
              item.product_name ||
              item.name ||
              item.title ||
              `Product ${
                index + 1
              }`;

            const quantity =
              Number(
                item.quantity || 1
              );

            const price =
              Number(
                item.price ??
                  item.unit_price ??
                  0
              );

            const itemTotal =
              Number(
                item.total_price ??
                  item.subtotal ??
                  price *
                    quantity
              );

            return `
              <tr>
                <td>${index + 1}</td>
                <td>${name}</td>
                <td>${quantity}</td>
                <td>
                  ₹${price.toLocaleString(
                    "en-IN"
                  )}
                </td>
                <td>
                  ₹${itemTotal.toLocaleString(
                    "en-IN"
                  )}
                </td>
              </tr>
            `;
          }
        )
        .join("");

    invoiceWindow.document.write(`
      <!DOCTYPE html>

      <html>

      <head>

        <title>
          Invoice - Order #${currentOrder.id}
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            font-family:
              Arial,
              Helvetica,
              sans-serif;

            padding: 40px;

            color: #222;

            max-width: 1000px;

            margin: auto;
          }

          .top {
            display: flex;

            justify-content:
              space-between;

            align-items:
              flex-start;

            border-bottom:
              2px solid #222;

            padding-bottom:
              18px;

            margin-bottom:
              25px;
          }

          .shop-name {
            font-size: 28px;

            font-weight: 700;

            margin: 0;
          }

          .invoice-title {
            margin-top: 5px;

            color: #777;

            font-size: 14px;
          }

          .order-info {
            text-align: right;

            line-height: 1.6;
          }

          .section {
            margin-bottom: 25px;
          }

          .section-title {
            font-size: 16px;

            font-weight: 700;

            margin-bottom: 10px;
          }

          .address {
            line-height: 1.7;

            color: #555;
          }

          table {
            width: 100%;

            border-collapse:
              collapse;

            margin-top: 10px;
          }

          th,
          td {
            border:
              1px solid #ddd;

            padding: 10px;

            text-align: left;

            font-size: 13px;
          }

          th {
            background:
              #f5f5f5;

            font-weight: 700;
          }

          .summary {
            margin-top: 25px;

            margin-left: auto;

            width: 300px;
          }

          .summary-row {
            display: flex;

            justify-content:
              space-between;

            padding: 7px 0;

            font-size: 14px;
          }

          .grand-total {
            border-top:
              2px solid #222;

            margin-top: 8px;

            padding-top: 10px;

            font-size: 18px;

            font-weight: 700;
          }

          .footer {
            margin-top: 50px;

            padding-top: 20px;

            border-top:
              1px solid #ddd;

            text-align: center;

            color: #777;

            font-size: 13px;
          }

          .print-button {
            background: #171717;

            color: white;

            border: none;

            padding: 10px 18px;

            border-radius: 6px;

            cursor: pointer;

            margin-bottom: 25px;

            font-size: 13px;
          }

          @media print {

            body {
              padding: 10px;
            }

            .print-button {
              display: none;
            }
              .back-button {
  padding: 9px 16px;
  background: #fff;
  color: #222;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 13px;
}

          }

        </style>

      </head>

      <body>
<button
  class="back-button"
  onclick="window.close()"
>
  ← Back
</button>
        <button
          class="print-button"
          onclick="window.print()"
        >
          Print / Save PDF
        </button>


        <div class="top">

          <div>

            <h1 class="shop-name">
              ShopEase
            </h1>

            <div class="invoice-title">
              Order Invoice
            </div>

          </div>


          <div class="order-info">

            <strong>
              Order #${currentOrder.id}
            </strong>

            <br />

            ${invoiceDate}

          </div>

        </div>


        <div class="section">

          <div class="section-title">
            Delivery Address
          </div>

          <div class="address">

            <strong>
              ${addressName || "Customer"}
            </strong>

            <br />

            ${
              addressPhone
                ? addressPhone
                : ""
            }

            ${
              addressPhone
                ? "<br />"
                : ""
            }

            ${
              addressLine
                ? addressLine
                : ""
            }

            ${
              addressLine
                ? "<br />"
                : ""
            }

            ${
              addressCity
                ? addressCity
                : ""
            }

            ${
              addressState
                ? `, ${addressState}`
                : ""
            }

            ${
              addressPincode
                ? ` - ${addressPincode}`
                : ""
            }

          </div>

        </div>


        <div class="section">

          <div class="section-title">
            Ordered Items
          </div>

          <table>

            <thead>

              <tr>

                <th>
                  #
                </th>

                <th>
                  Product
                </th>

                <th>
                  Quantity
                </th>

                <th>
                  Price
                </th>

                <th>
                  Total
                </th>

              </tr>

            </thead>


            <tbody>

              ${
                productRows ||
                `
                  <tr>
                    <td colspan="5">
                      No product details available.
                    </td>
                  </tr>
                `
              }

            </tbody>

          </table>

        </div>


        <div class="summary">

          <div class="summary-row">

            <span>
              Payment Method
            </span>

            <strong>
              ${paymentText}
            </strong>

          </div>


          <div class="summary-row">

            <span>
              Payment Status
            </span>

            <strong>
              ${
                currentOrder.payment_status ||
                "Pending"
              }
            </strong>

          </div>


          <div class="summary-row grand-total">

            <span>
              Order Total
            </span>

            <strong>
              ₹${totalAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>


        <div class="footer">

          Thank you for shopping with
          ShopEase.

        </div>

      </body>

      </html>
    `);

    invoiceWindow.document.close();
  };

  // =========================================
  // CANCEL ORDER
  // =========================================

  const handleCancelOrder =
    async () => {
      if (!currentOrder?.id) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this order?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setCancelling(true);
        setCancelMessage("");

        const token =
          getToken();

        const response =
          await fetch(
            `${API_BASE_URL}/api/orders/${currentOrder.id}/cancel`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                ...(token
                  ? {
                      Authorization:
                        `Bearer ${token}`,
                    }
                  : {}),
              },

              body:
                JSON.stringify({}),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Failed to cancel order"
          );
        }

        const updatedOrder = {
          ...currentOrder,

          order_status:
            data.order_status ||
            "Cancelled",
        };

        setCurrentOrder(
          updatedOrder
        );

        setCancelMessage(
          "Order cancelled successfully."
        );

        if (onCancel) {
          onCancel(
            updatedOrder
          );
        }

      } catch (error) {
        console.error(
          "Cancel order error:",
          error
        );

        setCancelMessage(
          error?.message ||
            "Failed to cancel order."
        );

      } finally {
        setCancelling(false);
      }
    };

  // =========================================
  // STATUS CLASS
  // =========================================

  let statusClass =
    "order-status-badge";

  if (
    normalizedStatus ===
    "delivered"
  ) {
    statusClass +=
      " delivered";
  }

  if (
    normalizedStatus ===
    "cancelled"
  ) {
    statusClass +=
      " cancelled";
  }

  if (
    normalizedStatus ===
    "shipped"
  ) {
    statusClass +=
      " shipped";
  }

  if (
    normalizedStatus ===
    "confirmed"
  ) {
    statusClass +=
      " confirmed";
  }

  // =========================================
  // RETURN UI
  // =========================================

  return (
    <section className="order-details-page">

      {/* =====================================
          TOP HEADER
      ====================================== */}

      <header className="order-details-topbar">

        <button
          type="button"
          className="order-details-back"
          onClick={onBack}
        >
          ← My Orders
        </button>

        <div className="order-details-heading">

          <p>
            ORDER DETAILS
          </p>

          <h1>
            Order #{currentOrder.id}
          </h1>

        </div>

        <div className="order-details-topbar-right">

          <span
            className={statusClass}
          >
            {orderStatus}
          </span>

        </div>

      </header>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="order-details-content">

        {/* ===================================
            CANCEL MESSAGE
        ==================================== */}

        {cancelMessage && (
          <div
            className={
              normalizedStatus ===
              "cancelled"
                ? "order-cancel-success"
                : "order-cancel-error"
            }
          >

            {normalizedStatus ===
            "cancelled"
              ? "✓ "
              : "⚠️ "}

            {cancelMessage}

          </div>
        )}


        {/* ===================================
            ORDER META
        ==================================== */}

        <div className="order-details-meta">

          <div>

            <span>
              ORDER NUMBER
            </span>

            <strong>
              #{currentOrder.id}
            </strong>

          </div>


          <div>

            <span>
              ORDER DATE
            </span>

            <strong>
              {currentOrder.created_at
                ? new Date(
                    currentOrder.created_at
                  ).toLocaleString(
                    "en-IN"
                  )
                : "—"}
            </strong>

          </div>


          <div>

            <span>
              PAYMENT
            </span>

            <strong>
              {paymentText}
            </strong>

          </div>


          <div>

            <span>
              TOTAL
            </span>

            <strong>
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>


        {/* ===================================
            ORDERED ITEMS
        ==================================== */}

        <div className="order-details-products-section">

          <div className="order-details-section-title">

            <div>

              <p>
                YOUR PURCHASE
              </p>

              <h2>
                Ordered Items
              </h2>

            </div>

            <span>
              {items.length}{" "}
              {items.length === 1
                ? "item"
                : "items"}
            </span>

          </div>


          {/* LOADING */}

          {loading && (
            <div className="order-details-state">

              <div>
                📦
              </div>

              <p>
                Loading your order...
              </p>

            </div>
          )}


          {/* ERROR */}

          {!loading &&
            error && (
              <div className="order-details-state error">

                <div>
                  ⚠️
                </div>

                <p>
                  {error}
                </p>

              </div>
            )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            items.length === 0 && (
              <div className="order-details-state">

                <div>
                  📦
                </div>

                <p>
                  No items found for
                  this order.
                </p>

              </div>
            )}


          {/* PRODUCTS */}

          {!loading &&
            !error &&
            items.length > 0 && (

              <div className="order-details-items">

                {items.map(
                  (
                    item,
                    index
                  ) => {

                    const price =
                      Number(
                        item.price ??
                          item.unit_price ??
                          0
                      );

                    const quantity =
                      Number(
                        item.quantity ??
                          1
                      );

                    const itemTotal =
                      Number(
                        item.total_price ??
                          item.subtotal ??
                          price *
                            quantity
                      );

                    const productName =
                      item.product_name ||
                      item.name ||
                      item.title ||
                      `Product ${
                        index + 1
                      }`;

                    const image =
                      item.product_image ||
                      item.image ||
                      item.image_url ||
                      "";

                    return (

                      <div
                        className="order-details-product-row"
                        key={
                          item.id ||
                          item.product_id ||
                          index
                        }
                      >

                        {/* PRODUCT IMAGE */}

                        <div className="order-details-product-image">

                          {image ? (

                            <img
                              src={getProductImage(
                                image
                              )}
                              alt={
                                productName
                              }
                            />

                          ) : (

                            <span>
                              🛍️
                            </span>

                          )}

                        </div>


                        {/* PRODUCT INFO */}

                        <div className="order-details-product-info">

                          <p>
                            {item.category ||
                              item.brand ||
                              "PRODUCT"}
                          </p>

                          <h3>
                            {productName}
                          </h3>

                          <span>
                            Quantity{" "}
                            <strong>
                              {quantity}
                            </strong>
                          </span>

                        </div>


                        {/* UNIT PRICE */}

                        <div className="order-details-unit-price">

                          <span>
                            Price
                          </span>

                          <strong>
                            ₹
                            {price.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>


                        {/* TOTAL */}

                        <div className="order-details-product-total">

                          <span>
                            Total
                          </span>

                          <strong>
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

        </div>


        {/* ===================================
            DELIVERY + PAYMENT
        ==================================== */}

        <div className="order-details-lower">


          {/* DELIVERY ADDRESS */}

          <div className="order-details-info-section">

            <div className="order-details-info-title">

              <span>
                📍
              </span>

              <div>

                <p>
                  DELIVERY
                </p>

                <h2>
                  Delivery Address
                </h2>

              </div>

            </div>


            <div className="order-details-address">

              {addressName && (
                <strong>
                  {addressName}
                </strong>
              )}

              {addressPhone && (
                <p>
                  {addressPhone}
                </p>
              )}

              {addressLine && (
                <p>
                  {addressLine}
                </p>
              )}

              {(addressCity ||
                addressState ||
                addressPincode) && (

                <p>

                  {addressCity}

                  {addressState
                    ? `, ${addressState}`
                    : ""}

                  {addressPincode
                    ? ` - ${addressPincode}`
                    : ""}

                </p>
              )}

              {!addressName &&
                !addressPhone &&
                !addressLine &&
                !addressCity &&
                !addressState &&
                !addressPincode && (

                  <p>
                    Delivery address
                    not available.
                  </p>

              )}

            </div>

          </div>


          {/* PAYMENT DETAILS */}

          <div className="order-details-info-section">

            <div className="order-details-info-title">

              <span>
                💳
              </span>

              <div>

                <p>
                  PAYMENT
                </p>

                <h2>
                  Payment Details
                </h2>

              </div>

            </div>


            <div className="order-details-payment">

              <div>

                <span>
                  Method
                </span>

                <strong>
                  {paymentText}
                </strong>

              </div>


              <div>

                <span>
                  Status
                </span>

                <strong>
                  {currentOrder.payment_status ||
                    "Pending"}
                </strong>

              </div>


              <div className="payment-total">

                <span>
                  Order Total
                </span>

                <strong>
                  ₹
                  {totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================
            BOTTOM ACTIONS
        ==================================== */}

        <div className="order-details-bottom">

          <div>

            <p>
              Order #{currentOrder.id}
            </p>

            <span>
              {normalizedStatus ===
              "cancelled"
                ? "This order has been cancelled."
                : "Need help with this order? Track your delivery or download your invoice."}
            </span>

          </div>


          <div className="order-details-buttons">

            {/* TRACK ORDER */}

            {normalizedStatus !==
              "cancelled" && (

              <button
                type="button"
                className="order-details-track-button"
                onClick={() => {

                  if (onTrack) {
                    onTrack(
                      currentOrder
                    );
                  }

                }}
              >
                🚚 Track Order
              </button>

            )}


            {/* INVOICE */}

            <button
              type="button"
              className="order-details-invoice-button"
              onClick={() => {

                // Use parent invoice function
                // if available

                if (
                  onDownloadInvoice
                ) {
                  onDownloadInvoice(
                    currentOrder
                  );
                  return;
                }

                // Otherwise generate
                // invoice directly

                handleDownloadInvoice();

              }}
            >
              📄 Invoice
            </button>


            {/* CANCEL ORDER */}

            {canCancel &&
              !cancelling && (

                <button
                  type="button"
                  className="order-details-cancel-button"
                  onClick={
                    handleCancelOrder
                  }
                >
                  Cancel Order
                </button>

            )}


            {/* CANCELLING */}

            {canCancel &&
              cancelling && (

                <button
                  type="button"
                  className="order-details-cancel-button"
                  disabled
                >
                  Cancelling...
                </button>

            )}

          </div>

        </div>

      </div>

    </section>
  );
}

export default OrderDetails;