import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";

function Checkout({
  cart,
  loggedInUser,
  onBack,
  onOrderPlaced,
  onManageAddresses,
}) {
  // =========================================
  // STATES
  // =========================================

  const [defaultAddress, setDefaultAddress] =
    useState(null);

  const [addressLoading, setAddressLoading] =
    useState(true);

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [email, setEmail] = useState(
    loggedInUser?.email || ""
  );

  // =========================================
  // SAFE CART
  // =========================================

  const safeCart =
    Array.isArray(cart) ? cart : [];

  // =========================================
  // TOTALS
  // =========================================

  const subtotal = safeCart.reduce(
    (total, item) => {
      const price =
        Number(item?.price || 0);

      const quantity =
        Number(item?.quantity || 1);

      return total + price * quantity;
    },
    0
  );

  // =========================================
  // GST
  // =========================================

  const gstAmount = safeCart.reduce(
    (total, item) => {
      const itemPrice =
        Number(item?.price || 0);

      const quantity =
        Number(item?.quantity || 1);

      const itemTotal =
        itemPrice * quantity;

      const gstRate =
        Number(
          item?.gst_rate ??
            item?.gstRate ??
            0
        );

      return (
        total +
        (itemTotal * gstRate) / 100
      );
    },
    0
  );

  // =========================================
  // DELIVERY
  // =========================================

  const deliveryFee =
    subtotal >= 999 ? 0 : 40;

  // =========================================
  // PLATFORM FEE
  // =========================================

  const platformFee =
    subtotal > 0 ? 10 : 0;

  // =========================================
  // FINAL TOTAL
  // =========================================

  const total = Math.max(
    0,
    subtotal +
      gstAmount +
      deliveryFee +
      platformFee
  );

  // =========================================
  // FETCH DEFAULT ADDRESS
  // =========================================

  const fetchDefaultAddress =
    async () => {
      if (!loggedInUser?.id) {
        setDefaultAddress(null);
        setAddressLoading(false);
        return;
      }

      try {
        setAddressLoading(true);

        setErrors({});

        const response =
          await fetch(
            `${API_BASE_URL}/api/addresses/${loggedInUser.id}/default`
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to load address"
          );
        }

        setDefaultAddress(
          data.address || null
        );

        setEmail(
          loggedInUser?.email || ""
        );
      } catch (error) {
        console.error(
          "Default address error:",
          error
        );

        setDefaultAddress(null);

        setErrors({
          general:
            "Unable to load your default address.",
        });
      } finally {
        setAddressLoading(false);
      }
    };

  useEffect(() => {
    fetchDefaultAddress();
  }, [loggedInUser?.id]);

  // =========================================
  // RAZORPAY SCRIPT
  // =========================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

      if (existingScript) {
        existingScript.addEventListener(
          "load",
          () => resolve(true)
        );

        existingScript.addEventListener(
          "error",
          () => resolve(false)
        );

        return;
      }

      const script =
        document.createElement(
          "script"
        );

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () =>
        resolve(true);

      script.onerror = () =>
        resolve(false);

      document.body.appendChild(
        script
      );
    });
  };

  // =========================================
  // PREPARE ORDER ITEMS
  // =========================================

  const prepareOrderItems = () => {
    const orderItems =
      safeCart.map((item) => {
        const productId = Number(
          item?.product_id ??
            item?.productId ??
            item?.id ??
            0
        );

        const variantId =
          item?.variant_id ??
          item?.variantId ??
          item?.variant?.id ??
          null;

        const quantity = Number(
          item?.quantity || 1
        );

        const price = Number(
          item?.price || 0
        );

        const gstRate = Number(
          item?.gst_rate ??
            item?.gstRate ??
            0
        );

        return {
          product_id: productId,

          variant_id:
            variantId !== null &&
            variantId !== undefined &&
            variantId !== ""
              ? Number(variantId)
              : null,

          quantity,

          price,

          gst_rate: gstRate,
        };
      });

    // IMPORTANT:
    // Check exactly what is being sent
    // to backend.

    console.log(
      "================================="
    );

    console.log(
      "CHECKOUT ORDER ITEMS"
    );

    console.table(
      orderItems
    );

    console.log(
      "================================="
    );

    return orderItems;
  };

  // =========================================
  // COD ORDER
  // =========================================

  const createCODOrder =
    async (
      addressId,
      orderItems
    ) => {
      const token =
        localStorage.getItem(
          "customer_token"
        );

      const response =
        await fetch(
          `${API_BASE_URL}/api/orders`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              user_id:
                loggedInUser.id,

              address_id:
                addressId,

              total_amount:
                total,

              payment_method:
                "Cash on Delivery",

              items:
                orderItems,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create order."
        );
      }

      return data;
    };

  // =========================================
  // RAZORPAY CREATE ORDER
  // =========================================

  const createRazorpayOrder =
    async () => {
      const token =
        localStorage.getItem(
          "customer_token"
        );

      const response =
        await fetch(
          `${API_BASE_URL}/api/payment/create-order`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

              "x-user-id":
                String(
                  loggedInUser?.id || ""
                ),
            },

            body: JSON.stringify({
              user_id:
                loggedInUser.id,

              total_amount:
                total,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create payment order."
        );
      }

      return data;
    };

  // =========================================
  // VERIFY RAZORPAY PAYMENT
  // =========================================

  const verifyRazorpayPayment =
    async ({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId,
      orderItems,
    }) => {
      const token =
        localStorage.getItem(
          "customer_token"
        );

      const response =
        await fetch(
          `${API_BASE_URL}/api/payment/verify`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

              "x-user-id":
                String(
                  loggedInUser?.id || ""
                ),
            },

            body: JSON.stringify({
              razorpay_order_id,

              razorpay_payment_id,

              razorpay_signature,

              user_id:
                loggedInUser.id,

              address_id:
                addressId,

              total_amount:
                total,

              items:
                orderItems,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Payment verification failed."
        );
      }

      return data;
    };

  // =========================================
  // BUILD FRONTEND ORDER OBJECT
  // =========================================

  const buildOrderObject = ({
    orderId,
    addressId,
    paymentStatus,
    paymentName,
    paymentId = null,
  }) => {
    return {
      id: orderId,

      order_id: orderId,

      user_id:
        loggedInUser.id,

      userId:
        loggedInUser.id,

      customer: {
        name:
          defaultAddress?.full_name ||
          "",

        phone:
          defaultAddress?.phone ||
          "",

        email,

        address:
          defaultAddress?.address_line ||
          "",

        city:
          defaultAddress?.city ||
          "",

        state:
          defaultAddress?.state ||
          "",

        pincode:
          defaultAddress?.pincode ||
          "",
      },

      addressId,

      address_id:
        addressId,

      paymentMethod:
        paymentName,

      payment_method:
        paymentName,

      paymentId,

      payment_id:
        paymentId,

      items: safeCart,

      subtotal,

      gstAmount,

      gst_amount:
        gstAmount,

      deliveryFee,

      delivery_fee:
        deliveryFee,

      platformFee,

      platform_fee:
        platformFee,

      total,

      total_amount:
        total,

      order_status:
        "Placed",

      orderStatus:
        "Placed",

      payment_status:
        paymentStatus,

      paymentStatus:
        paymentStatus,
    };
  };

  // =========================================
  // FINISH ORDER
  // =========================================

  const finishOrder = (
    order
  ) => {
    console.log(
      "================================="
    );

    console.log(
      "ORDER CREATED SUCCESSFULLY"
    );

    console.log(order);

    console.log(
      "================================="
    );

    if (onOrderPlaced) {
      onOrderPlaced(order);
    }
  };

  // =========================================
  // RAZORPAY PAYMENT
  // =========================================

  const startRazorpayPayment =
    async ({
      addressId,
      orderItems,
    }) => {
      const loaded =
        await loadRazorpay();

      if (!loaded) {
        throw new Error(
          "Unable to load Razorpay. Please check your internet connection."
        );
      }

      const paymentOrder =
        await createRazorpayOrder();

      console.log(
        "Razorpay order:",
        paymentOrder
      );

      const options = {
        key:
          paymentOrder.key_id,

        amount:
          paymentOrder.amount,

        currency:
          paymentOrder.currency ||
          "INR",

        name:
          "ShopEase",

        description:
          "ShopEase Order Payment",

        order_id:
          paymentOrder.razorpay_order_id,

        prefill: {
          name:
            defaultAddress?.full_name ||
            "",

          email:
            email.trim(),

          contact:
            defaultAddress?.phone ||
            "",
        },

        notes: {
          user_id:
            String(
              loggedInUser.id
            ),

          address_id:
            String(addressId),
        },

        theme: {
          color:
            "#6f38dc",
        },

        handler:
          async function (
            paymentResponse
          ) {
            try {
              setLoading(true);

              setErrors({});

              const verified =
                await verifyRazorpayPayment(
                  {
                    razorpay_order_id:
                      paymentResponse.razorpay_order_id,

                    razorpay_payment_id:
                      paymentResponse.razorpay_payment_id,

                    razorpay_signature:
                      paymentResponse.razorpay_signature,

                    addressId,

                    orderItems,
                  }
                );

              const order =
                buildOrderObject({
                  orderId:
                    verified.order_id,

                  addressId,

                  paymentStatus:
                    "Paid",

                  paymentName:
                    "Razorpay",

                  paymentId:
                    paymentResponse.razorpay_payment_id,
                });

              finishOrder(order);
            } catch (error) {
              console.error(
                "Payment verification error:",
                error
              );

              setErrors({
                general:
                  error.message ||
                  "Payment verification failed.",
              });
            } finally {
              setLoading(false);
            }
          },

        modal: {
          ondismiss:
            function () {
              setLoading(false);

              setErrors({
                general:
                  "Payment was cancelled. Your order was not placed.",
              });
            },
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        function (
          response
        ) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setLoading(false);

          setErrors({
            general:
              response.error
                ?.description ||
              "Payment failed. Please try again.",
          });
        }
      );

      razorpay.open();
    };

  // =========================================
  // VALIDATE ORDER
  // =========================================

  const validateCheckout =
    () => {
      const newErrors = {};

      if (!loggedInUser?.id) {
        newErrors.general =
          "Please login before placing an order.";

        setErrors(newErrors);

        return false;
      }

      if (!defaultAddress) {
        newErrors.general =
          "Please add a delivery address before placing your order.";

        setErrors(newErrors);

        return false;
      }

      if (!email.trim()) {
        newErrors.email =
          "Email is required.";

        setErrors(newErrors);

        return false;
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email.trim()
        )
      ) {
        newErrors.email =
          "Enter a valid email address.";

        setErrors(newErrors);

        return false;
      }

      if (
        !safeCart ||
        safeCart.length === 0
      ) {
        newErrors.general =
          "Your cart is empty.";

        setErrors(newErrors);

        return false;
      }

      for (
        const item of safeCart
      ) {
        const quantity =
          Number(
            item?.quantity || 0
          );

        if (
          quantity <= 0
        ) {
          newErrors.general =
            "Invalid product quantity.";

          setErrors(newErrors);

          return false;
        }

        const productId =
          Number(
            item?.product_id ??
              item?.productId ??
              item?.id ??
              0
          );

        if (
          productId <= 0
        ) {
          newErrors.general =
            "Invalid product information. Please remove the item and add it again.";

          setErrors(newErrors);

          return false;
        }
      }

      setErrors({});

      return true;
    };

  // =========================================
  // PLACE ORDER
  // =========================================

  const handlePlaceOrder =
    async () => {
      if (
        loading
      ) {
        return;
      }

      const valid =
        validateCheckout();

      if (!valid) {
        return;
      }

      try {
        setLoading(true);

        setErrors({});

        const addressId =
          defaultAddress.id;

        const orderItems =
          prepareOrderItems();

        console.log(
          "Sending order:",
          {
            user_id:
              loggedInUser.id,

            address_id:
              addressId,

            total_amount:
              total,

            payment_method:
              paymentMethod,

            items:
              orderItems,
          }
        );

        // =====================================
        // COD
        // =====================================

        if (
          paymentMethod ===
          "cod"
        ) {
          const orderData =
            await createCODOrder(
              addressId,
              orderItems
            );

          const order =
            buildOrderObject({
              orderId:
                orderData.order_id,

              addressId,

              paymentStatus:
                "Pending",

              paymentName:
                "Cash on Delivery",
            });

          finishOrder(order);

          setLoading(false);

          return;
        }

        // =====================================
        // ONLINE PAYMENT
        // =====================================

        await startRazorpayPayment(
          {
            addressId,

            orderItems,
          }
        );
      } catch (error) {
        console.error(
          "Checkout error:",
          error
        );

        setErrors({
          general:
            error.message ||
            "Unable to place order. Please try again.",
        });

        setLoading(false);
      }
    };

  // =========================================
  // EMPTY CART
  // =========================================

  if (
    safeCart.length === 0
  ) {
    return (
      <section className="checkout-page">

        <div className="checkout-header">

          <button
            type="button"
            className="checkout-back-button"
            onClick={onBack}
          >
            ←
          </button>

          <div>
            <h1>
              Checkout
            </h1>

            <p>
              Review your order and
              complete your purchase
            </p>
          </div>

        </div>

        <div className="checkout-empty">

          <div className="checkout-empty-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some products before
            proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={onBack}
          >
            Continue Shopping
          </button>

        </div>

      </section>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <section className="checkout-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="checkout-header">

        <button
          type="button"
          className="checkout-back-button"
          onClick={onBack}
          disabled={loading}
        >
          ←
        </button>

        <div>
          <h1>
            Checkout
          </h1>

          <p>
            Review your order and
            complete your purchase
          </p>
        </div>

      </div>

      <div className="checkout-container">

        {/* ===================================
            LEFT SIDE
        =================================== */}

        <div className="checkout-left">

          {/* =================================
              DELIVERY ADDRESS
          ================================= */}

          <div className="checkout-card">

            <div className="checkout-card-title">

              <div>
                <span className="checkout-section-label">
                  DELIVERY
                </span>

                <h2>
                  Delivery Address
                </h2>
              </div>

              {defaultAddress && (
                <span className="checkout-default-badge">
                  ⭐ Default
                </span>
              )}

            </div>

            {addressLoading ? (

              <div className="checkout-address-loading">

                <span>
                  📍
                </span>

                <p>
                  Loading your saved address...
                </p>

              </div>

            ) : defaultAddress ? (

              <div className="selected-address-card">

                <div className="selected-address-top">

                  <div className="selected-address-icon">
                    🏠
                  </div>

                  <div>

                    <h3>
                      {
                        defaultAddress.full_name
                      }
                    </h3>

                    <p>
                      ☎{" "}
                      {
                        defaultAddress.phone
                      }
                    </p>

                  </div>

                </div>

                <div className="selected-address-line">

                  <span>
                    📍
                  </span>

                  <p>
                    {
                      defaultAddress.address_line
                    }
                  </p>

                </div>

                <div className="selected-address-tags">

                  <span>
                    🏙{" "}
                    {
                      defaultAddress.city
                    }
                  </span>

                  <span>
                    🗺{" "}
                    {
                      defaultAddress.state
                    }
                  </span>

                  <span>
                    📌{" "}
                    {
                      defaultAddress.pincode
                    }
                  </span>

                </div>

                <div className="address-management">

                  <div>

                    <strong>
                      ⭐ Default delivery
                      address
                    </strong>

                    <p>
                      This address will be
                      used for your order.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      onManageAddresses
                    }
                    disabled={loading}
                  >
                    Manage Addresses →
                  </button>

                </div>

              </div>

            ) : (

              <div className="no-address-card">

                <div>
                  📍
                </div>

                <h3>
                  No default address
                </h3>

                <p>
                  Add a delivery address
                  before placing your order.
                </p>

                <button
                  type="button"
                  onClick={
                    onManageAddresses
                  }
                  disabled={loading}
                >
                  + Add Address
                </button>

              </div>

            )}

            {/* EMAIL */}

            <div className="checkout-email">

              <label>
                Email Address
                <span>*</span>
              </label>

              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => {

                  setEmail(
                    e.target.value
                  );

                  setErrors(
                    (previous) => ({
                      ...previous,
                      email: "",
                      general: "",
                    })
                  );

                }}
                disabled={loading}
              />

              {errors.email && (
                <small>
                  {errors.email}
                </small>
              )}

            </div>

          </div>

          {/* =================================
              PAYMENT
          ================================= */}

          <div className="checkout-card">

            <div className="checkout-card-title">

              <div>

                <span className="checkout-section-label">
                  PAYMENT
                </span>

                <h2>
                  Payment Method
                </h2>

              </div>

            </div>

            <div className="payment-options">

              {/* COD */}

              <label
                className={
                  paymentMethod === "cod"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={
                    paymentMethod === "cod"
                  }
                  onChange={(e) => {

                    setPaymentMethod(
                      e.target.value
                    );

                    setErrors({});

                  }}
                  disabled={loading}
                />

                <div className="payment-icon">
                  💵
                </div>

                <div className="payment-info">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order
                    arrives
                  </span>

                </div>

              </label>

              {/* ONLINE */}

              <label
                className={
                  paymentMethod === "online"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={
                    paymentMethod === "online"
                  }
                  onChange={(e) => {

                    setPaymentMethod(
                      e.target.value
                    );

                    setErrors({});

                  }}
                  disabled={loading}
                />

                <div className="payment-icon">
                  💳
                </div>

                <div className="payment-info">

                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    UPI, Cards, Net Banking
                    and more
                  </span>

                </div>

              </label>

            </div>

          </div>

          {/* =================================
              ERROR
          ================================= */}

          {errors.general && (

            <div className="checkout-general-error">

              ⚠️

              <span>
                {errors.general}
              </span>

            </div>

          )}

        </div>

        {/* ===================================
            RIGHT SIDE
        =================================== */}

        <div className="checkout-right">

          <div className="checkout-card order-summary">

            <div className="summary-heading">

              <div>

                <span>
                  YOUR ORDER
                </span>

                <h2>
                  Order Summary
                </h2>

              </div>

              <span className="item-count">

                {safeCart.length}{" "}

                {safeCart.length === 1
                  ? "item"
                  : "items"}

              </span>

            </div>

            {/* PRODUCTS */}

            <div className="checkout-products">

              {safeCart.map(
                (item, index) => {

                  const itemTotal =
                    Number(
                      item?.price || 0
                    ) *
                    Number(
                      item?.quantity || 1
                    );

                  return (

                    <div
                      className="checkout-product"
                      key={
                        item?.id ||
                        item?.product_id ||
                        index
                      }
                    >

                      <img
                        src={
                          item?.image ||
                          item?.product_image ||
                          ""
                        }
                        alt={
                          item?.name ||
                          "Product"
                        }
                      />

                      <div className="checkout-product-info">

                        <h3>
                          {
                            item?.name ||
                            "Product"
                          }
                        </h3>

                        {item?.selected_size && (
                          <p>
                            Size:{" "}
                            {
                              item.selected_size
                            }
                          </p>
                        )}

                        <p>
                          Qty:{" "}
                          {
                            item?.quantity ||
                            1
                          }
                        </p>

                        {item?.variant_id && (
                          <small>
                            Variant ID:{" "}
                            {
                              item.variant_id
                            }
                          </small>
                        )}

                      </div>

                      <strong>
                        ₹
                        {itemTotal.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  );
                }
              )}

            </div>

            <div className="checkout-divider" />

            {/* SUBTOTAL */}

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* DELIVERY */}

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <strong
                className={
                  deliveryFee === 0
                    ? "free-text"
                    : ""
                }
              >
                {deliveryFee === 0
                  ? "FREE"
                  : `₹${deliveryFee}`}
              </strong>

            </div>

            {/* GST */}

            <div className="summary-row">

              <span>
                GST
              </span>

              <strong>
                ₹
                {gstAmount.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>

            {/* PLATFORM FEE */}

            <div className="summary-row">

              <span>
                Platform Fee
              </span>

              <strong>
                ₹
                {platformFee.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="fee-note">

              ℹ️ Platform fee helps us
              maintain secure and reliable
              shopping services.

            </div>

            <div className="checkout-divider" />

            {/* TOTAL */}

            <div className="final-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>

            {/* PLACE ORDER */}

            <button
              type="button"
              className="place-order-button"
              onClick={
                handlePlaceOrder
              }
              disabled={
                loading ||
                addressLoading ||
                !defaultAddress
              }
            >

              {loading
                ? paymentMethod ===
                  "online"
                  ? "Opening Payment..."
                  : "Placing Order..."
                : paymentMethod ===
                  "online"
                ? "Pay Securely"
                : "Place Order"}

            </button>

            <div className="checkout-security">

              <span>
                🔒
              </span>

              <p>
                Secure payment powered by
                Razorpay Test Environment.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Checkout;