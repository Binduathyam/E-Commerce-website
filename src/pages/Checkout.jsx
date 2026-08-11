import { useState } from "react";

function Checkout({
  cart,
  onBack,
  onOrderPlaced,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [upiApp, setUpiApp] = useState("");

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
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

  /* =========================
     ADDRESS FORM
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  /* =========================
     CARD FORM
  ========================= */

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    setCardData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  /* =========================
     VALIDATION
  ========================= */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    } else if (
      !/^[6-9]\d{9}$/.test(formData.phone)
    ) {
      newErrors.phone =
        "Enter a valid 10-digit phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
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
      !/^\d{6}$/.test(formData.pincode)
    ) {
      newErrors.pincode =
        "Enter a valid 6-digit PIN code";
    }

    /* UPI */

    if (
      paymentMethod === "upi" &&
      !upiApp
    ) {
      newErrors.upiApp =
        "Please select a UPI app";
    }

    /* CARD */

    if (paymentMethod === "card") {
      const cleanCardNumber =
        cardData.cardNumber.replace(/\s/g, "");

      if (!/^\d{16}$/.test(cleanCardNumber)) {
        newErrors.cardNumber =
          "Enter a valid 16-digit card number";
      }

      if (!cardData.cardName.trim()) {
        newErrors.cardName =
          "Card holder name is required";
      }

      if (
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
          cardData.expiry
        )
      ) {
        newErrors.expiry =
          "Use MM/YY format";
      }

      if (!/^\d{3,4}$/.test(cardData.cvv)) {
        newErrors.cvv =
          "Enter a valid CVV";
      }
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /* =========================
     PLACE ORDER
  ========================= */

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return;
    }

    const order = {
      customer: formData,
      paymentMethod,
      upiApp:
        paymentMethod === "upi"
          ? upiApp
          : null,
      card:
        paymentMethod === "card"
          ? {
              cardName: cardData.cardName,
              lastFour:
                cardData.cardNumber
                  .replace(/\s/g, "")
                  .slice(-4),
            }
          : null,
      total,
    };

    if (onOrderPlaced) {
      onOrderPlaced(order);
    }
  };

  return (
    <section className="checkout-page">

      {/* HEADER */}

      <div className="checkout-header">

        <button
          className="checkout-back-button"
          onClick={onBack}
        >
          ←
        </button>

        <h1>Checkout</h1>

        <div></div>

      </div>


      <div className="checkout-container">

        {/* =========================
            LEFT SIDE
        ========================= */}

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
                  Full Name <span className="required-star">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
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
                    Phone Number <span className="required-star">*</span>
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                  />

                  {errors.phone && (
                    <small>
                      {errors.phone}
                    </small>
                  )}

                </div>


                <div className="form-group">

                  <label>
                    Email <span className="required-star">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
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
                  Address <span className="required-star">*</span>
                </label>

                <textarea
                  name="address"
                  placeholder="House No, Street, Area"
                  value={formData.address}
                  onChange={handleChange}
                  rows="4"
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
                    City <span className="required-star">*</span>
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                  />

                  {errors.city && (
                    <small>
                      {errors.city}
                    </small>
                  )}

                </div>


                <div className="form-group">

                  <label>
                    PIN Code <span className="required-star">*</span>
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    placeholder="6-digit PIN"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength="6"
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


          {/* =========================
              PAYMENT METHOD
          ========================= */}

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
                    paymentMethod === "cod"
                  }
                  onChange={(e) => {
                    setPaymentMethod(
                      e.target.value
                    );
                    setErrors({});
                  }}
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


              {/* UPI */}

              <label
                className={
                  paymentMethod === "upi"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={
                    paymentMethod === "upi"
                  }
                  onChange={(e) => {
                    setPaymentMethod(
                      e.target.value
                    );
                    setErrors({});
                  }}
                />

                <div>

                  <strong>
                    UPI
                  </strong>

                  <span>
                    Google Pay, PhonePe,
                    Paytm and more
                  </span>

                </div>

              </label>


              {/* UPI APPS */}

              {paymentMethod === "upi" && (

                <div className="upi-options">

  <div className="upi-heading">
    <strong>Choose UPI App</strong>
    <span>Select an app to continue</span>
  </div>

  <div className="upi-app-grid">

                    <button
                      type="button"
                      className={
                        upiApp === "Google Pay"
                          ? "upi-app selected"
                          : "upi-app"
                      }
                      onClick={() =>
                        setUpiApp(
                          "Google Pay"
                        )
                      }
                    >
                      <span>G</span>
                      Google Pay
                    </button>


                    <button
                      type="button"
                      className={
                        upiApp === "PhonePe"
                          ? "upi-app selected"
                          : "upi-app"
                      }
                      onClick={() =>
                        setUpiApp("PhonePe")
                      }
                    >
                      <span>पे</span>
                      PhonePe
                    </button>


                    <button
                      type="button"
                      className={
                        upiApp === "Paytm"
                          ? "upi-app selected"
                          : "upi-app"
                      }
                      onClick={() =>
                        setUpiApp("Paytm")
                      }
                    >
                      <span>P</span>
                      Paytm
                    </button>

                  </div>

                  {errors.upiApp && (
                    <small>
                      {errors.upiApp}
                    </small>
                  )}

                </div>

              )}


              {/* CARD */}

              <label
                className={
                  paymentMethod === "card"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={
                    paymentMethod === "card"
                  }
                  onChange={(e) => {
                    setPaymentMethod(
                      e.target.value
                    );
                    setErrors({});
                  }}
                />

                <div>

                  <strong>
                    Credit / Debit Card
                  </strong>

                  <span>
                    Secure card payment
                  </span>

                </div>

              </label>


              {/* CARD DETAILS */}

              {paymentMethod === "card" && (

                <div className="card-payment-form">

                  <div className="form-group">

                    <label>
                      Card Number
                    </label>

                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={
                        cardData.cardNumber
                      }
                      onChange={handleCardChange}
                      maxLength="19"
                    />

                    {errors.cardNumber && (
                      <small>
                        {errors.cardNumber}
                      </small>
                    )}

                  </div>


                  <div className="form-group">

                    <label>
                      Card Holder Name
                    </label>

                    <input
                      type="text"
                      name="cardName"
                      placeholder="Name on card"
                      value={
                        cardData.cardName
                      }
                      onChange={handleCardChange}
                    />

                    {errors.cardName && (
                      <small>
                        {errors.cardName}
                      </small>
                    )}

                  </div>


                  <div className="form-row">

                    <div className="form-group">

                      <label>
                        Expiry Date
                      </label>

                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={
                          cardData.expiry
                        }
                        onChange={
                          handleCardChange
                        }
                        maxLength="5"
                      />

                      {errors.expiry && (
                        <small>
                          {errors.expiry}
                        </small>
                      )}

                    </div>


                    <div className="form-group">

                      <label>
                        CVV
                      </label>

                      <input
                        type="password"
                        name="cvv"
                        placeholder="•••"
                        value={
                          cardData.cvv
                        }
                        onChange={
                          handleCardChange
                        }
                        maxLength="4"
                      />

                      {errors.cvv && (
                        <small>
                          {errors.cvv}
                        </small>
                      )}

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="checkout-right">

          <div className="checkout-card order-summary">

            <h2>
              Order Summary
            </h2>


            <div className="checkout-products">

              {cart.map((item) => (

                <div
                  className="checkout-product"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      Qty: {item.quantity}
                    </p>

                  </div>

                  <strong>
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              ))}

            </div>


            <div className="checkout-divider"></div>


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


            <div className="checkout-total-row">

              <span>
                Delivery
              </span>

              <strong className="free-text">
                {deliveryFee === 0
                  ? "FREE"
                  : `₹${deliveryFee}`}
              </strong>

            </div>


            <div className="checkout-total-row">

              <span>
                Platform Fee
              </span>

              <strong>
                ₹{platformFee}
              </strong>

            </div>


            <div className="checkout-divider"></div>


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


            <button
              className="place-order-button"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Checkout;