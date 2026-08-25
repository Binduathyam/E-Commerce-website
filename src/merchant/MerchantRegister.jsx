import React, { useState } from "react";
import { API_BASE_URL } from "../api";
import "./MerchantRegister.css";

function MerchantRegister({
  onBack,
  onLogin,
  onRegistered,
}) {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =========================
     VALIDATION
  ========================= */

  const validateForm = () => {
    const {
      name,
      businessName,
      email,
      phone,
      password,
      confirmPassword,
    } = formData;

    if (!name.trim()) {
      return "Please enter your full name.";
    }

    if (!businessName.trim()) {
      return "Please enter your business name.";
    }

    if (!email.trim()) {
      return "Please enter your email.";
    }

    if (!email.includes("@")) {
      return "Please enter a valid email address.";
    }

    if (!phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      return "Phone number must contain 10 digits.";
    }

    if (!password) {
      return "Please enter a password.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      return "Please confirm your password.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  /* =========================
     REGISTER MERCHANT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/merchant/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name:
              formData.name.trim(),

            businessName:
              formData.businessName.trim(),

            email:
              formData.email.trim(),

            phone:
              formData.phone.trim(),

            password:
              formData.password,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Merchant registration failed."
        );
      }

      console.log(
        "Merchant registered:",
        data.user
      );

      setSuccess(
        "Merchant registration successful!"
      );

      /*
        Send registered merchant
        data to parent if required.
      */

      if (onRegistered) {
        onRegistered(data.user);
      }

      /*
        Clear form
      */

      setFormData({
        name: "",
        businessName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error) {
      console.error(
        "Merchant registration error:",
        error
      );

      setError(
        error.message ||
          "Unable to register merchant."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="merchant-register-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="merchant-register-header">

        <button
          type="button"
          className="merchant-register-back"
          onClick={onBack}
        >
          ←
        </button>

        <div>
          <p>
            MERCHANT
          </p>

          <h1>
            Create Merchant Account
          </h1>

          <span>
            Start selling your products
            on ShopEase
          </span>
        </div>

      </div>


      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="merchant-register-card">

        {/* STORE ICON */}

        <div className="merchant-register-icon">
          🏪
        </div>

        <div className="merchant-register-title">
          <h2>
            Register Your Store
          </h2>

          <p>
            Enter your details to create
            a merchant account.
          </p>
        </div>


        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="merchant-register-error">
            ⚠️ {error}
          </div>
        )}


        {/* =========================
            SUCCESS
        ========================= */}

        {success && (
          <div className="merchant-register-success">
            ✓ {success}
          </div>
        )}


        {/* =========================
            FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="merchant-register-form"
        >

          {/* FULL NAME */}

          <div className="merchant-register-field">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
            />

          </div>


          {/* BUSINESS NAME */}

          <div className="merchant-register-field">

            <label>
              Business Name
            </label>

            <input
              type="text"
              name="businessName"
              value={
                formData.businessName
              }
              onChange={handleChange}
              placeholder="Enter your store name"
              disabled={loading}
            />

          </div>


          {/* EMAIL */}

          <div className="merchant-register-field">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="merchant@example.com"
              disabled={loading}
            />

          </div>


          {/* PHONE */}

          <div className="merchant-register-field">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10 digit mobile number"
              maxLength={10}
              disabled={loading}
            />

          </div>


          {/* PASSWORD */}

          <div className="merchant-register-field">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              disabled={loading}
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="merchant-register-field">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
              placeholder="Re-enter your password"
              disabled={loading}
            />

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="merchant-register-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register as Merchant"}
          </button>

        </form>


        {/* =========================
            LOGIN
        ========================= */}

        <div className="merchant-register-login">

          <span>
            Already have a merchant
            account?
          </span>

          <button
            type="button"
            onClick={onLogin}
            disabled={loading}
          >
            Login
          </button>

        </div>

      </div>

    </section>
  );
}

export default MerchantRegister;