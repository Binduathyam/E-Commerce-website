
import React, { useState } from "react";
import { API_BASE_URL } from "../api";
import {
  Truck,
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import "./DispatchRegister.css";

export default function DispatchRegister({ onGoLogin, onBack }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
      `${API_BASE_URL}/api/auth/dispatch/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit registration request."
        );
      }

      setSuccess(
        data.message ||
          "Registration request submitted. Please wait for admin approval."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dispatch-register-page">
      <section className="dispatch-register-card">
        <button
          type="button"
          className="dispatch-register-back"
          onClick={onBack || (() => {
            window.location.href = "/shopease/";
          })}
        >
          <ArrowLeft size={18} />
          <span>Back to ShopEase</span>
        </button>

        <div className="dispatch-register-brand">
          <div className="dispatch-register-logo">
            <Truck size={27} strokeWidth={2.2} />
          </div>

          <div>
            <h1>SHOPEASE</h1>
            <p>LOGISTICS</p>
          </div>
        </div>

        <div className="dispatch-register-heading">
          <span className="dispatch-register-eyebrow">
            DISPATCH PORTAL
          </span>

          <h2>Create your account</h2>

          <p>
            Submit your details to request access to ShopEase Logistics.
          </p>
        </div>

        {error && (
          <div className="dispatch-register-alert error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="dispatch-register-alert success" role="status">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="dispatch-register-form">
          <div className="dispatch-register-field">
            <label htmlFor="dispatch-name">Full name</label>
            <div className="dispatch-register-input-wrap">
              <User size={19} />
              <input
                id="dispatch-name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                minLength={2}
                required
              />
            </div>
          </div>

          <div className="dispatch-register-field">
            <label htmlFor="dispatch-email">Email address</label>
            <div className="dispatch-register-input-wrap">
              <Mail size={19} />
              <input
                id="dispatch-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="dispatch-register-field">
            <label htmlFor="dispatch-phone">
              Phone number <span className="optional">(optional)</span>
            </label>
            <div className="dispatch-register-input-wrap">
              <Phone size={19} />
              <input
                id="dispatch-phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="dispatch-register-field">
            <label htmlFor="dispatch-password">Password</label>
            <div className="dispatch-register-input-wrap">
              <LockKeyhole size={19} />
              <input
                id="dispatch-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="dispatch-register-eye"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div className="dispatch-register-field">
            <label htmlFor="dispatch-confirm-password">
              Confirm password
            </label>
            <div className="dispatch-register-input-wrap">
              <LockKeyhole size={19} />
              <input
                id="dispatch-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="dispatch-register-eye"
                onClick={() =>
                  setShowConfirmPassword((value) => !value)
                }
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <p className="dispatch-register-note">
            Registration requests require administrator approval. Submitting
            this form does not automatically grant dispatch access.
          </p>

          <button
            type="submit"
            className="dispatch-register-submit"
            disabled={loading}
          >
            {loading ? "Submitting request..." : "Request Dispatch Access"}
          </button>
        </form>

        <div className="dispatch-register-footer">
          Already have an account?{" "}
          <button
            type="button"
            onClick={
              onGoLogin ||
              (() => {
                window.location.href = "/shopease/dispatch-login";
              })
            }
          >
            Sign in
          </button>
        </div>

        <p className="dispatch-register-copyright">
          © ShopEase Logistics. All rights reserved.
        </p>
      </section>
    </main>
  );
}

