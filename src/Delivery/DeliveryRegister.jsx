import React, { useState } from "react";
import { API_BASE_URL } from "../api";
import "./DeliveryRegister.css";

const DeliveryRegister = ({
  onBack,
  onLogin,
  onRegistered,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setMessage("");
  };

  /* =========================
     PASSWORD VALIDATION
  ========================= */

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }

    if (
      !/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;' ]/.test(
        password
      )
    ) {
      return "Password must contain at least one special character.";
    }

    return "";
  };

  /* =========================
     REGISTER DELIVERY PARTNER
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    /* =========================
       PASSWORD RULES
    ========================= */

    const passwordError =
      validatePassword(formData.password);

    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    /* =========================
       CONFIRM PASSWORD
    ========================= */

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setMessage("Passwords do not match.");
      return;
    }

    /* =========================
       VEHICLE VALIDATION
    ========================= */

    if (!formData.vehicleType) {
      setMessage(
        "Please select a vehicle type."
      );
      return;
    }

    /* =========================
       CITY VALIDATION
    ========================= */

    if (!formData.city.trim()) {
      setMessage("Please enter your city.");
      return;
    }

    /* =========================
       STATE VALIDATION
    ========================= */

    if (!formData.state.trim()) {
      setMessage("Please enter your state.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/delivery/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            address: formData.address,

            city: formData.city.trim(),

            state: formData.state.trim(),

            vehicle_type:
              formData.vehicleType,

            vehicle_number:
              formData.vehicleNumber,

            license_number:
              formData.licenseNumber,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Delivery partner registration failed."
        );

        return;
      }

      setMessage(
        "Registration successful! Please login."
      );

      console.log(
        "Delivery Partner Registered:",
        data.deliveryPartner
      );

      setTimeout(() => {
        onRegistered(
          data.deliveryPartner
        );
      }, 1500);

    } catch (error) {
      console.error(
        "Delivery registration error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    }
  };

  return (
    <div className="delivery-register-page">

      <div className="delivery-register-card">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <button
          type="button"
          className="delivery-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        {/* =========================
            HEADER
        ========================= */}

        <div className="delivery-register-header">

          <div className="delivery-register-icon">
            🚚
          </div>

          <h1>
            Become a Delivery Partner
          </h1>

          <p>
            Register and start delivering orders.
          </p>

        </div>

        {/* =========================
            REGISTRATION FORM
        ========================= */}

        <form onSubmit={handleSubmit}>

          <div className="delivery-form-grid">

            {/* FULL NAME */}

            <div className="delivery-form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

            {/* PHONE */}

            <div className="delivery-form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
              />

            </div>

            {/* EMAIL */}

            <div className="delivery-form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            {/* VEHICLE TYPE */}

            <div className="delivery-form-group">

              <label>
                Vehicle Type
              </label>

              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select vehicle
                </option>

                <option value="Bike">
                  Bike
                </option>

                <option value="Scooter">
                  Scooter
                </option>

                <option value="Car">
                  Car
                </option>

                <option value="Van">
                  Van
                </option>

              </select>

            </div>

            {/* VEHICLE NUMBER */}

            <div className="delivery-form-group">

              <label>
                Vehicle Number
              </label>

              <input
                type="text"
                name="vehicleNumber"
                placeholder="Example: TN 01 AB 1234"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />

            </div>

            {/* LICENSE NUMBER */}

            <div className="delivery-form-group">

              <label>
                Driving License Number
              </label>

              <input
                type="text"
                name="licenseNumber"
                placeholder="Enter license number"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* =========================
              ADDRESS
          ========================= */}

          <div className="delivery-form-group full-width">

            <label>
              Address
            </label>

            <textarea
              name="address"
              placeholder="Enter your complete address"
              value={formData.address}
              onChange={handleChange}
              required
            />

          </div>

          {/* =========================
              CITY
          ========================= */}

          <div className="delivery-form-group full-width">

            <label>
              City
            </label>

            <input
              type="text"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
              required
            />

          </div>

          {/* =========================
              STATE
          ========================= */}

          <div className="delivery-form-group full-width">

            <label>
              State
            </label>

            <input
              type="text"
              name="state"
              placeholder="Enter your state"
              value={formData.state}
              onChange={handleChange}
              required
            />

          </div>

          {/* =========================
              PASSWORD
          ========================= */}

          <div className="delivery-form-grid">

            {/* PASSWORD */}

            <div className="delivery-form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="delivery-form-group">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* =========================
              PASSWORD REQUIREMENTS
          ========================= */}

          <div className="delivery-password-rules">

            <p>
              Password must contain:
            </p>

            <span>
              • At least 8 characters
            </span>

            <span>
              • At least one uppercase letter
            </span>

            <span>
              • At least one lowercase letter
            </span>

            <span>
              • At least one number
            </span>

            <span>
              • At least one special character
            </span>

          </div>

          {/* =========================
              MESSAGE
          ========================= */}

          {message && (
            <div className="delivery-register-message">
              {message}
            </div>
          )}

          {/* =========================
              REGISTER BUTTON
          ========================= */}

          <button
            type="submit"
            className="delivery-register-button"
          >
            Register as Delivery Partner
          </button>

        </form>

        {/* =========================
            LOGIN LINK
        ========================= */}

        <div className="delivery-login-link">

          <span>
            Already registered?
          </span>

          <button
            type="button"
            onClick={onLogin}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeliveryRegister;