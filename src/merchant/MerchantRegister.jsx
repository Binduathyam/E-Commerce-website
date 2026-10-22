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
    securityQuestion: "",
    securityAnswer: "",
  });

  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password popup state
  const [passwordFocused, setPasswordFocused] =
    useState(false);

  const securityQuestions = [
    "What was the name of your first school?",
    "What was the name of your first pet?",
    "What is your childhood nickname?",
    "What is your favourite food?",
  ];

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
      !/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;']/.test(
        password
      )
    ) {
      return "Password must contain at least one special character.";
    }

    return "";
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
      securityQuestion,
      securityAnswer,
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

    const passwordError =
      validatePassword(password);

    if (passwordError) {
      return passwordError;
    }

    if (!confirmPassword) {
      return "Please confirm your password.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    if (!securityQuestion) {
      return "Please select a security question.";
    }

    if (!securityAnswer.trim()) {
      return "Please enter your security answer.";
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

      const uploadData = new FormData();

      uploadData.append(
        "name",
        formData.name.trim()
      );

      uploadData.append(
        "businessName",
        formData.businessName.trim()
      );

      uploadData.append(
        "email",
        formData.email.trim().toLowerCase()
      );

      uploadData.append(
        "phone",
        formData.phone.trim()
      );

      uploadData.append(
        "password",
        formData.password
      );

      uploadData.append(
        "security_question",
        formData.securityQuestion
      );

      uploadData.append(
        "security_answer",
        formData.securityAnswer.trim()
      );

      if (aadhaarImage) {
        uploadData.append(
          "aadhaar",
          aadhaarImage
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/auth/merchant/register`,
        {
          method: "POST",
          body: uploadData,
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
        "Registration submitted successfully! Your account is pending admin approval."
      );

      if (onRegistered) {
        onRegistered(data.user);
      }

      setFormData({
        name: "",
        businessName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: "",
      });

      setAadhaarImage(null);

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

        {/* ERROR */}

        {error && (
          <div className="merchant-register-error">
            ⚠️ {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="merchant-register-success">
            ✓ {success}
          </div>
        )}

        {/* FORM */}

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

            <div
              style={{
                position: "relative",
              }}
            >

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                disabled={loading}
                onFocus={() =>
                  setPasswordFocused(true)
                }
                onBlur={() =>
                  setPasswordFocused(false)
                }
              />

              {/* PASSWORD POPUP */}

              {passwordFocused && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: "0",
                    width: "100%",
                    padding: "10px 12px",
                    background: "#ffffff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.12)",
                    fontSize: "11px",
                    lineHeight: "1.6",
                    color: "#666",
                    zIndex: 50,
                    boxSizing: "border-box",
                  }}
                >

                  <strong
                    style={{
                      color: "#333",
                    }}
                  >
                    Password must contain:
                  </strong>

                  <div>
                    • At least 8 characters
                  </div>

                  <div>
                    • At least one uppercase letter
                  </div>

                  <div>
                    • At least one lowercase letter
                  </div>

                  <div>
                    • At least one number
                  </div>

                  <div>
                    • At least one special character
                  </div>

                </div>
              )}

            </div>

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

          {/* SECURITY QUESTION */}

          <div className="merchant-register-field">

            <label>
              Security Question
            </label>

            <select
              name="securityQuestion"
              value={
                formData.securityQuestion
              }
              onChange={handleChange}
              disabled={loading}
            >

              <option value="">
                Select a security question
              </option>

              {securityQuestions.map(
                (question, index) => (
                  <option
                    key={index}
                    value={question}
                  >
                    {question}
                  </option>
                )
              )}

            </select>

          </div>

          {/* SECURITY ANSWER */}

          <div className="merchant-register-field">

            <label>
              Security Answer
            </label>

            <input
              type="text"
              name="securityAnswer"
              value={
                formData.securityAnswer
              }
              onChange={handleChange}
              placeholder="Enter your answer"
              autoComplete="off"
              disabled={loading}
            />

          </div>

          {/* AADHAAR DOCUMENT */}

          <div className="merchant-register-field">

            <label>
              Aadhaar Card
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files?.[0] ||
                  null;

                setAadhaarImage(file);
                setError("");
                setSuccess("");
              }}
              disabled={loading}
            />

            <small>
              Upload your Aadhaar card image
              for admin verification.
            </small>

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

        {/* LOGIN */}

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