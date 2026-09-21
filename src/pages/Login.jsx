import { useState } from "react";
import { API_BASE_URL } from "../api";
import "./Login.css";

function Login({
  onBack,
  onRegister,
  onMerchantRegister,
  onDeliveryLogin,
  onAdminLogin,
  onLoginSuccess,
}) {
  const [loginRole, setLoginRole] = useState("customer");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleRoleChange = (role) => {
    setLoginRole(role);
    setErrors({});
    setFormData({
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      general: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let loginURL = `${API_BASE_URL}/api/auth/login`;

      if (loginRole === "delivery_partner") {
        loginURL = `${API_BASE_URL}/api/delivery/login`;
      }

      if (loginRole === "merchant") {
        loginURL = `${API_BASE_URL}/api/auth/login`;
      }

      const response = await fetch(loginURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: loginRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token) {
        throw new Error("Login token not received");
      }

      /* ================================
         ROLE VALIDATION
      ================================= */

      if (
        loginRole === "delivery_partner" &&
        data.user.role !== "delivery"
      ) {
        throw new Error(
          "Invalid delivery partner account"
        );
      }

      if (
        loginRole !== "delivery_partner" &&
        data.user.role !== loginRole
      ) {
        throw new Error(
          `Please login using a ${loginRole} account`
        );
      }

      /* ================================
         LOGGED IN USER
      ================================= */

      const loggedInUser = {
        ...data.user,
        token: data.token,
        role:
          loginRole === "delivery_partner"
            ? "delivery_partner"
            : data.user.role,
      };

      /* ================================
         SAVE ROLE-SPECIFIC LOGIN SESSION
      ================================= */

      if (loginRole === "customer") {
        localStorage.setItem(
          "customer_token",
          data.token
        );

        localStorage.setItem(
          "customer_user",
          JSON.stringify(loggedInUser)
        );
      }

      if (loginRole === "merchant") {
        localStorage.setItem(
          "merchant_token",
          data.token
        );

        localStorage.setItem(
          "merchant_user",
          JSON.stringify(loggedInUser)
        );
      }

      /* =================================
         DELIVERY PARTNER LOGIN
      ================================= */

      if (loginRole === "delivery_partner") {
        localStorage.setItem(
          "delivery_token",
          data.token
        );

        localStorage.setItem(
          "delivery_user",
          JSON.stringify(loggedInUser)
        );

        /*
          IMPORTANT:
          Profile.jsx reads "deliveryPartner",
          so we also save the same logged-in
          delivery partner using this key.
        */

        localStorage.setItem(
          "deliveryPartner",
          JSON.stringify(loggedInUser)
        );
      }

      /* ================================
         DEBUG
      ================================= */

      console.log(
        "Logged in user:",
        loggedInUser
      );

      if (loginRole === "delivery_partner") {
        console.log(
          "Delivery partner saved:",
          localStorage.getItem(
            "deliveryPartner"
          )
        );
      }

      /* ================================
         LOGIN SUCCESS
      ================================= */

      if (onLoginSuccess) {
        onLoginSuccess(loggedInUser);
      }

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setErrors({
        general:
          error.message ||
          "Login failed",
      });
    }
  };

  /* ================================
     LOGIN TITLE
  ================================= */

  const getLoginTitle = () => {
    if (loginRole === "merchant") {
      return "Merchant Login";
    }

    if (loginRole === "delivery_partner") {
      return "Delivery Partner Login";
    }

    return "Welcome Back";
  };

  /* ================================
     LOGIN DESCRIPTION
  ================================= */

  const getLoginDescription = () => {
    if (loginRole === "merchant") {
      return "Login to manage your store";
    }

    if (loginRole === "delivery_partner") {
      return "Login to manage your deliveries";
    }

    return "Login to continue shopping with ShopEase";
  };

  /* ================================
     EMAIL PLACEHOLDER
  ================================= */

  const getEmailPlaceholder = () => {
    if (loginRole === "merchant") {
      return "Merchant email";
    }

    if (loginRole === "delivery_partner") {
      return "Delivery partner email";
    }

    return "Enter your email";
  };

  /* ================================
     BUTTON TEXT
  ================================= */

  const getButtonText = () => {
    if (loginRole === "merchant") {
      return "Login as Merchant";
    }

    if (loginRole === "delivery_partner") {
      return "Login as Delivery Partner";
    }

    return "Login";
  };

  return (
    <div className="login-page">

      {/* ================= LEFT BANNER ================= */}

      <div className="login-banner">

        <button
          type="button"
          className="login-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="login-banner-content">

          <div className="login-brand">
            ShopEase
          </div>

          <h1>
            Everything you need,
            <br />
            all in one place.
          </h1>

          <p>
            Discover products you love, manage your
            business, and enjoy a seamless shopping
            experience with ShopEase.
          </p>

          <div className="login-banner-features">

            <div className="banner-feature">
              <span>✓</span>
              <span>
                Easy & Secure Shopping
              </span>
            </div>

            <div className="banner-feature">
              <span>✓</span>
              <span>
                Fast & Reliable Delivery
              </span>
            </div>

            <div className="banner-feature">
              <span>✓</span>
              <span>
                Trusted Marketplace
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ================= RIGHT LOGIN ================= */}

      <div className="login-section">

        <div className="login-card">

          <div className="login-header">

            <div className="login-mobile-brand">
              ShopEase
            </div>

            <h2>
              {getLoginTitle()}
            </h2>

            <p>
              {getLoginDescription()}
            </p>

          </div>

          {/* ================= ROLE SELECT ================= */}

          <div className="login-role-section">

            <label className="login-label">
              Login as
            </label>

            <div className="login-role-buttons">

              <button
                type="button"
                className={`login-role-button ${
                  loginRole === "customer"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleRoleChange("customer")
                }
              >
                <span className="role-icon">
                  🛍️
                </span>

                <span>
                  Customer
                </span>
              </button>

              <button
                type="button"
                className={`login-role-button ${
                  loginRole === "merchant"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleRoleChange("merchant")
                }
              >
                <span className="role-icon">
                  🏪
                </span>

                <span>
                  Merchant
                </span>
              </button>

              <button
                type="button"
                className={`login-role-button ${
                  loginRole === "delivery_partner"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleRoleChange(
                    "delivery_partner"
                  )
                }
              >
                <span className="role-icon">
                  🚚
                </span>

                <span>
                  Delivery
                </span>
              </button>

            </div>

          </div>

          {/* ================= LOGIN FORM ================= */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={
                  getEmailPlaceholder()
                }
                autoComplete="email"
              />

              {errors.email && (
                <span className="field-error">
                  {errors.email}
                </span>
              )}

            </div>

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              {errors.password && (
                <span className="field-error">
                  {errors.password}
                </span>
              )}

            </div>

            {errors.general && (
              <div className="login-error">
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              className="login-submit-button"
            >
              {getButtonText()}
            </button>

          </form>

          {/* ================= REGISTER ================= */}

          <div className="login-register">

            {loginRole === "customer" && (
              <>
                <span>
                  Don't have an account?
                </span>

                <button
                  type="button"
                  onClick={onRegister}
                >
                  Create Account
                </button>
              </>
            )}

            {loginRole === "merchant" && (
              <>
                <span>
                  Want to sell on ShopEase?
                </span>

                <button
                  type="button"
                  onClick={onMerchantRegister}
                >
                  Register as Merchant
                </button>
              </>
            )}

            {loginRole === "delivery_partner" && (
              <>
                <span>
                  Are you a delivery partner?
                </span>

                <button
                  type="button"
                  onClick={onDeliveryLogin}
                >
                  Continue
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;