import { useState } from "react";
import { API_BASE_URL } from "../api";

function Checkout({
  cart,
  loggedInUser,
  onBack,
  onOrderPlaced,
}) {
  // =========================================
  // ADDRESS FORM
  // =========================================

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  // =========================================
  // PAYMENT
  // =========================================

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [upiApp, setUpiApp] = useState("");

  // =========================================
  // STATES
  // =========================================

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // =========================================
  // ORDER CALCULATION
  // =========================================

  const subtotal = (cart || []).reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const deliveryFee =
    subtotal >= 999 ? 0 : 40;

  const platformFee =
    subtotal > 0 ? 10 : 0;

  const total = Math.max(
    0,
    subtotal + deliveryFee + platformFee
  );

  // =========================================
  // ADDRESS INPUT
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
      general: "",
    }));
  };

  // =========================================
  // VALIDATION
  // =========================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    } else if (
      !/^[6-9]\d{9}$/.test(
        formData.phone.trim()
      )
    ) {
      newErrors.phone =
        "Enter a valid 10-digit phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city =
        "City is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode =
        "PIN code is required";
    } else if (
      !/^\d{6}$/.test(
        formData.pincode.trim()
      )
    ) {
      newErrors.pincode =
        "Enter a valid 6-digit PIN code";
    }

    // UPI app selection
    if (
      paymentMethod === "upi" &&
      !upiApp
    ) {
      newErrors.upiApp =
        "Please select a UPI app";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // =========================================
  // LOAD RAZORPAY SCRIPT
  // =========================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =========================================
  // PREPARE ORDER ITEMS
  // =========================================

  const prepareOrderItems = () => {
    return cart.map((item) => ({
      product_id:
        item.product_id || item.id,

      quantity:
        Number(item.quantity || 0),

      price:
        Number(item.price || 0),
    }));
  };

  // =========================================
  // SAVE ADDRESS
  // =========================================

  const saveAddress = async () => {
    const addressResponse =
      await fetch(
        `${API_BASE_URL}/api/addresses`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id:
              loggedInUser.id,

            full_name:
              formData.name.trim(),

            phone:
              formData.phone.trim(),

            address_line:
              formData.address.trim(),

            city:
              formData.city.trim(),

            state:
              "Tamil Nadu",

            pincode:
              formData.pincode.trim(),
          }),
        }
      );

    const addressData =
      await addressResponse.json();

    if (!addressResponse.ok) {
      throw new Error(
        addressData.message ||
          "Failed to save address."
      );
    }

    const addressId =
      addressData.address?.id;

    if (!addressId) {
      throw new Error(
        "Address was saved, but address ID was not returned."
      );
    }

    return addressId;
  };

  // =========================================
  // CREATE NORMAL COD ORDER
  // =========================================

  const createCODOrder = async (
    addressId,
    orderItems
  ) => {
    const orderResponse =
      await fetch(
        `${API_BASE_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
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

    const orderData =
      await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(
        orderData.message ||
          "Failed to create order."
      );
    }

    return orderData;
  };

  // =========================================
  // CREATE RAZORPAY TEST ORDER
  // =========================================

  const createRazorpayOrder =
    async () => {
      const response =
        await fetch(
          `${API_BASE_URL}/api/payment/create-order`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
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
      const response =
        await fetch(
          `${API_BASE_URL}/api/payment/verify`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
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
  // CREATE LOCAL ORDER OBJECT
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

      user_id:
        loggedInUser.id,

      customer: {
        ...formData,
      },

      userId:
        loggedInUser.id,

      addressId,

      paymentMethod:
        paymentName,

      payment_method:
        paymentName,

      paymentId,

      upiApp:
        paymentMethod === "upi"
          ? upiApp
          : null,

      items: cart,

      subtotal,

      deliveryFee,

      platformFee,

      total,

      total_amount:
        total,

      order_status:
        "Placed",

      payment_status:
        paymentStatus,

      orderStatus:
        "Placed",

      paymentStatus:
        paymentStatus,
    };
  };

  // =========================================
  // FINISH ORDER
  // =========================================

  const finishOrder = (order) => {
    console.log(
      "Order created:",
      order
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
      // ---------------------------------------
      // LOAD RAZORPAY
      // ---------------------------------------

      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error(
          "Unable to load Razorpay. Please check your internet connection."
        );
      }

      // ---------------------------------------
      // CREATE RAZORPAY SERVER ORDER
      // ---------------------------------------

      const paymentOrder =
        await createRazorpayOrder();

      // ---------------------------------------
      // RAZORPAY CHECKOUT OPTIONS
      // ---------------------------------------

      const options = {
        key:
          paymentOrder.key_id,

        amount:
          paymentOrder.amount,

        currency:
          paymentOrder.currency || "INR",

        name:
          "ShopEase",

        description:
          "ShopEase Order Payment",

        order_id:
          paymentOrder.razorpay_order_id,

        prefill: {
          name:
            formData.name.trim(),

          email:
            formData.email.trim(),

          contact:
            formData.phone.trim(),
        },

        notes: {
          user_id:
            String(loggedInUser.id),

          address_id:
            String(addressId),
        },

        theme: {
          color:
            "#7c3aed",
        },

        handler:
          async function (paymentResponse) {
            try {
              // Keep loading while verification
              setLoading(true);

              setErrors({});

              // --------------------------------
              // VERIFY PAYMENT ON BACKEND
              // --------------------------------

              const verified =
                await verifyRazorpayPayment({
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,

                  addressId,

                  orderItems,
                });

              // --------------------------------
              // BUILD ORDER
              // --------------------------------

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
                  "Payment verification failed. Please contact support if money was deducted.",
              });
            } finally {
              setLoading(false);
            }
          },

        modal: {
          ondismiss: function () {
            setLoading(false);

            setErrors({
              general:
                "Payment was cancelled. Your order was not placed.",
            });
          },
        },
      };

      // ---------------------------------------
      // OPEN RAZORPAY
      // ---------------------------------------

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setLoading(false);

          setErrors({
            general:
              response.error?.description ||
              "Payment failed. Please try again.",
          });
        }
      );

      razorpay.open();
    };

  // =========================================
  // PLACE ORDER
  // =========================================

  const handlePlaceOrder =
    async () => {
      if (!validateForm()) {
        return;
      }

      if (!loggedInUser?.id) {
        setErrors({
          general:
            "Please login before placing an order.",
        });

        return;
      }

      if (
        !cart ||
        cart.length === 0
      ) {
        setErrors({
          general:
            "Your cart is empty.",
        });

        return;
      }

      try {
        setLoading(true);
        setErrors({});

        // -------------------------------------
        // SAVE ADDRESS
        // -------------------------------------

        const addressId =
          await saveAddress();

        // -------------------------------------
        // PREPARE ITEMS
        // -------------------------------------

        const orderItems =
          prepareOrderItems();

        // -------------------------------------
        // COD
        // -------------------------------------

        if (
          paymentMethod === "cod"
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

        // -------------------------------------
        // ONLINE PAYMENT
        // -------------------------------------

        /*
          UPI + Card both go through
          Razorpay Sandbox.

          We DO NOT create our MySQL order
          before payment succeeds.
        */

        await startRazorpayPayment({
          addressId,

          orderItems,
        });

        /*
          Do not set loading false here.

          Razorpay handler will do it after:
          success / failure / dismiss.
        */
      } catch (error) {
        console.error(
          "Checkout error:",
          error
        );

        setErrors({
          general:
            error.message ||
            "Unable to connect to the server. Please try again.",
        });

        setLoading(false);
      }
    };

  // =========================================
  // EMPTY CART
  // =========================================

  if (
    !cart ||
    cart.length === 0
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

          <h1>
            Checkout
          </h1>

          <div></div>
        </div>

        <div className="checkout-empty">
          <div>
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
  // UI
  // =========================================

  return (
    <section className="checkout-page">

      {/* HEADER */}

      <div className="checkout-header">

        <button
          type="button"
          className="checkout-back-button"
          onClick={onBack}
          disabled={loading}
        >
          ←
        </button>

        <h1>
          Checkout
        </h1>

        <div></div>

      </div>

      <div className="checkout-container">

        {/* ===================================
            LEFT SIDE
        ==================================== */}

        <div className="checkout-left">

          {/* DELIVERY ADDRESS */}

          <div className="checkout-card">

            <h2>
              Delivery Address
            </h2>

            <div className="checkout-form">

              {/* NAME */}

              <div className="form-group">

                <label>
                  Full Name{" "}
                  <span className="required-star">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  disabled={loading}
                />

                {errors.name && (
                  <small>
                    {errors.name}
                  </small>
                )}

              </div>

              {/* PHONE + EMAIL */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Phone Number{" "}
                    <span className="required-star">
                      *
                    </span>
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    maxLength="10"
                    disabled={loading}
                  />

                  {errors.phone && (
                    <small>
                      {errors.phone}
                    </small>
                  )}

                </div>

                <div className="form-group">

                  <label>
                    Email{" "}
                    <span className="required-star">
                      *
                    </span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    disabled={loading}
                  />

                  {errors.email && (
                    <small>
                      {errors.email}
                    </small>
                  )}

                </div>

              </div>

              {/* ADDRESS */}

              <div className="form-group">

                <label>
                  Address{" "}
                  <span className="required-star">
                    *
                  </span>
                </label>

                <textarea
                  name="address"
                  placeholder="House No, Street, Area"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  rows="4"
                  disabled={loading}
                />

                {errors.address && (
                  <small>
                    {errors.address}
                  </small>
                )}

              </div>

              {/* CITY + PIN */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    City{" "}
                    <span className="required-star">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    disabled={loading}
                  />

                  {errors.city && (
                    <small>
                      {errors.city}
                    </small>
                  )}

                </div>

                <div className="form-group">

                  <label>
                    PIN Code{" "}
                    <span className="required-star">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    placeholder="6-digit PIN"
                    value={
                      formData.pincode
                    }
                    onChange={
                      handleChange
                    }
                    maxLength="6"
                    disabled={loading}
                  />

                  {errors.pincode && (
                    <small>
                      {errors.pincode}
                    </small>
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* =================================
              PAYMENT METHOD
          ================================== */}

          <div className="checkout-card">

            <h2>
              Payment Method
            </h2>

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
                    paymentMethod ===
                    "cod"
                  }
                  onChange={(e) => {
                    setPaymentMethod(
                      e.target.value
                    );

                    setErrors({});
                  }}
                  disabled={loading}
                />

                <div>

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order
                    arrives
                  </span>

                </div>

              </label>

              {/* ONLINE PAYMENT */}

              <label
                className={
                  paymentMethod ===
                    "online"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={
                    paymentMethod ===
                    "online"
                  }
                  onChange={(e) => {
                    setPaymentMethod(
                      e.target.value
                    );

                    setUpiApp("");

                    setErrors({});
                  }}
                  disabled={loading}
                />

                <div>

                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    UPI, Cards, Net Banking
                    and more
                  </span>

                </div>

              </label>

              {/* ONLINE PAYMENT INFORMATION */}

              {paymentMethod ===
                "online" && (
                <div className="upi-options">

                  <div className="upi-heading">

                    <strong>
                      Secure Online Payment
                    </strong>

                    <span>
                      Razorpay Sandbox /
                      Test Environment
                    </span>

                  </div>

                  <div
                    style={{
                      padding: "14px",
                      borderRadius: "10px",
                      background:
                        "#f7f5ff",
                      color:
                        "#5b21b6",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    Click{" "}
                    <strong>
                      Place Order
                    </strong>{" "}
                    to open the secure
                    Razorpay test checkout.
                    You can test UPI, card
                    and other supported
                    payment methods there.
                  </div>

                </div>
              )}

            </div>

          </div>

          {/* GENERAL ERROR */}

          {errors.general && (
            <div className="checkout-general-error">

              ⚠️{" "}

              {errors.general}

            </div>
          )}

        </div>

        {/* ===================================
            RIGHT SIDE
        ==================================== */}

        <div className="checkout-right">

          <div className="checkout-card order-summary">

            <h2>
              Order Summary
            </h2>

            {/* PRODUCTS */}

            <div className="checkout-products">

              {cart.map((item) => {

                const itemTotal =
                  Number(
                    item.price || 0
                  ) *
                  Number(
                    item.quantity || 0
                  );

                return (
                  <div
                    className="checkout-product"
                    key={item.id}
                  >

                    <img
                      src={item.image}
                      alt={
                        item.name ||
                        "Product"
                      }
                    />

                    <div>

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Qty:{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <strong>
                      ₹
                      {itemTotal.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>
                );
              })}

            </div>

            {/* DIVIDER */}

            <div className="checkout-divider"></div>

            {/* SUBTOTAL */}

            <div className="checkout-total-row">

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

            <div className="checkout-total-row">

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

            {/* PLATFORM FEE */}

            <div className="checkout-total-row">

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

            {/* FEE NOTE */}

            <div className="checkout-fee-note">

              <span>
                ℹ️
              </span>

              <p>
                Platform fee helps us maintain
                secure and reliable shopping
                services.
              </p>

            </div>

            {/* DIVIDER */}

            <div className="checkout-divider"></div>

            {/* FINAL TOTAL */}

            <div className="checkout-final-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* PRICE BREAKDOWN NOTE */}

            <div className="checkout-total-note">

              <span>
                {deliveryFee === 0
                  ? "Free delivery applied"
                  : `Delivery charge ₹${deliveryFee}`}
              </span>

            </div>

            {/* PLACE ORDER */}

            <button
              type="button"
              className="place-order-button"
              onClick={
                handlePlaceOrder
              }
              disabled={loading}
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

            {/* SECURITY */}

            <div className="checkout-security">

              <span>
                🔒
              </span>

              <p>
                Your payment is securely
                processed through Razorpay
                Test Environment.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Checkout;