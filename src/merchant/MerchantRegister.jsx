
import React, { useState } from "react";
import { API_BASE_URL } from "../api";
import "./MerchantRegister.css";

const INITIAL_FORM = {
  name: "",
  businessName: "",
  businessAddress: "",
  city: "",
  state: "",
  pincode: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  securityQuestion: "",
  securityAnswer: "",
};

function MerchantRegister({ onBack, onLogin, onRegistered }) {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);

  const securityQuestions = [
    "What was the name of your first school?",
    "What was the name of your first pet?",
    "What is your childhood nickname?",
    "What is your favourite food?",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

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
    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;']/.test(password)) {
      return "Password must contain at least one special character.";
    }

    return "";
  };

  const validateForm = () => {
    const {
      name,
      businessName,
      businessAddress,
      city,
      state,
      pincode,
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

    if (!businessAddress.trim()) {
      return "Please enter your business street address.";
    }

    if (!city.trim()) {
      return "Please enter your city.";
    }

    if (!state.trim()) {
      return "Please enter your state.";
    }

    if (!/^[0-9]{6}$/.test(pincode.trim())) {
      return "Pincode must contain exactly 6 digits.";
    }

    if (!email.trim()) {
      return "Please enter your email.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      return "Phone number must contain exactly 10 digits.";
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return passwordError;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const uploadData = new FormData();

      uploadData.append("name", formData.name.trim());
      uploadData.append("businessName", formData.businessName.trim());
      uploadData.append("businessAddress", formData.businessAddress.trim());
      uploadData.append("city", formData.city.trim());
      uploadData.append("state", formData.state.trim());
      uploadData.append("pincode", formData.pincode.trim());
      uploadData.append("email", formData.email.trim().toLowerCase());
      uploadData.append("phone", formData.phone.trim());
      uploadData.append("password", formData.password);
      uploadData.append("security_question", formData.securityQuestion);
      uploadData.append("security_answer", formData.securityAnswer.trim());

      if (aadhaarImage) {
        uploadData.append("aadhaar", aadhaarImage);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/auth/merchant/register`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Merchant registration failed."
        );
      }

      setSuccess(
        "Registration submitted successfully! Your account is pending admin approval."
      );

      if (onRegistered) {
        onRegistered(data.user);
      }

      setFormData({ ...INITIAL_FORM });
      setAadhaarImage(null);

      const fileInput = document.getElementById("merchant-aadhaar");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Merchant registration error:", err);
      setError(err.message || "Unable to register merchant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="merchant-register-page">
      <header className="merchant-register-header">
        <button
          type="button"
          className="merchant-register-back"
          onClick={onBack}
          aria-label="Go back"
        >
          ←
        </button>

        <div>
          <p>MERCHANT</p>
          <h1>Create Merchant Account</h1>
          <span>Start selling your products on ShopEase</span>
        </div>
      </header>

      <main className="merchant-register-card">
        <div className="merchant-register-icon">🏪</div>

        <div className="merchant-register-title">
          <h2>Register Your Store</h2>
          <p>Enter your details to create a merchant account.</p>
        </div>

        {error && (
          <div className="merchant-register-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="merchant-register-success" role="status">
            ✓ {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="merchant-register-form"
        >
          <div className="merchant-register-section">
            <h3>Personal & Business Details</h3>
            <p>Your store information for orders and pickups.</p>
          </div>

          <div className="merchant-register-field">
            <label htmlFor="merchant-name">Full Name</label>
            <input
              id="merchant-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={loading}
              required
            />
          </div>

          <div className="merchant-register-field">
            <label htmlFor="merchant-business">Business Name</label>
            <input
              id="merchant-business"
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter your store name"
              disabled={loading}
              required
            />
          </div>

          <div className="merchant-register-field">
            <label htmlFor="merchant-phone">Phone Number</label>
            <input
              id="merchant-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
              disabled={loading}
              required
            />
          </div>

          <div className="merchant-register-section">
            <h3>Business Pickup Address</h3>
            <p>
              This address helps pickup partners find your store.
              It will be used as the shipment pickup location.
            </p>
          </div>

          <div className="merchant-register-field">
            <label htmlFor="merchant-address">Street Address</label>
            <textarea
              id="merchant-address"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Door number, street, area, landmark"
              rows={3}
              autoComplete="street-address"
              disabled={loading}
              required
            />
          </div>

          <div className="merchant-register-address-grid">
            <div className="merchant-register-field">
              <label htmlFor="merchant-city">City</label>
              <input
                id="merchant-city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Chennai"
                autoComplete="address-level2"
                disabled={loading}
                required
              />
            </div>

            <div className="merchant-register-field">
              <label htmlFor="merchant-state">State</label>
              <input
                id="merchant-state"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Tamil Nadu"
                autoComplete="address-level1"
                disabled={loading}
                required
              />
            </div>

            <div className="merchant-register-field">
              <label htmlFor="merchant-pincode">Pincode</label>
              <input
                id="merchant-pincode"
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={(e) => {
                  const digits = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  setFormData((current) => ({
                    ...current,
                    pincode: digits,
                  }));

                  setError("");
                  setSuccess("");
                }}
                placeholder="6 digits"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="merchant-register-section">
            <h3>Login & Security</h3>
            <p>Use these details to access your merchant account.</p>
          </div>

          <div className="merchant-register-field">
            <label htmlFor="merchant-email">Email Address</label>
            <input
              id="merchant-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="merchant@example.com"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className="merchant-register-field">
            <label htmlFor="merchant-password">Password</label>

            <input
              id="merchant-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              disabled={loading}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              required
            />

            {passwordFocused && (
              <div className="merchant-password-rules">
                <p>Password must contain:</p>
                <span>• At least 8 characters</span>
                <span>• At least one uppercase letter</span>
                <span>• At least one lowercase letter</span>
                <span>• At least one number</span>
                <span>• At least one special character</span>
              </div>
            )}
          </div>

          <div className="merchant-register-field">
            <label htmlFor="merchant-confirm-password">
              Confirm Password
            </label>
            <input
              id="merchant-confirm-password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </div>

          <div className="merchant-register-field">
            <label htmlFor="merchant-security-question">
              Security Question
            </label>
            <select
              id="merchant-security-question"
              name="securityQuestion"
              value={formData.securityQuestion}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Select a security question</option>
              {securityQuestions.map((question) => (
                <option key={question} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </div>

          <div className="merchant-register-field">
            <label htmlFor="merchant-security-answer">
              Security Answer
            </label>
            <input
              id="merchant-security-answer"
              type="text"
              name="securityAnswer"
              value={formData.securityAnswer}
              onChange={handleChange}
              placeholder="Enter your answer"
              autoComplete="off"
              disabled={loading}
              required
            />
          </div>

          <div className="merchant-register-section">
            <h3>Identity Verification</h3>
            <p>Upload the document required for admin verification.</p>
          </div>

          <div className="merchant-register-field">
            <label htmlFor="merchant-aadhaar">Aadhaar Card Image</label>
            <input
              id="merchant-aadhaar"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setAadhaarImage(e.target.files?.[0] || null);
                setError("");
                setSuccess("");
              }}
              disabled={loading}
            />
            <small>
              Upload only if required by your application's verification
              process. Handle identity documents securely.
            </small>
          </div>

          <button
            type="submit"
            className="merchant-register-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register as Merchant"}
          </button>
        </form>

        <div className="merchant-register-login">
          <span>Already have a merchant account?</span>
          <button
            type="button"
            onClick={onLogin}
            disabled={loading}
          >
            Login
          </button>
        </div>
      </main>
    </section>
  );
}

export default MerchantRegister;
