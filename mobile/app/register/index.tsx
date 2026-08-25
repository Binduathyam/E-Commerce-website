import { useState } from "react";
import { API_BASE_URL } from "../api";

function Login({
  onBack,
  onRegister,
  onLoginSuccess,
}) {
  const [loginRole, setLoginRole] =
    useState("customer");

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

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};

    /* =========================
       EMAIL VALIDATION
    ========================= */

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

    /* =========================
       PASSWORD VALIDATION
    ========================= */

    if (!formData.password) {
      newErrors.password =
        "Password is required";
    }

    setErrors(newErrors);

    if (
      Object.keys(newErrors).length > 0
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: formData.email
              .trim()
              .toLowerCase(),

            password:
              formData.password,

            role: loginRole,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Login response:",
        data
      );

      /* =========================
         BACKEND ERROR
      ========================= */

      if (!response.ok) {
        setErrors({
          general:
            data.message ||
            "Invalid email or password",
        });

        return;
      }

      /* =========================
         USER DATA CHECK
      ========================= */

      if (!data.user) {
        setErrors({
          general:
            "Login successful, but user details were not received.",
        });

        return;
      }

      /* =========================
         ROLE CHECK
      ========================= */

      if (
        data.user.role !==
        loginRole
      ) {
        setErrors({
          general:
            "This account does not belong to the selected login type.",
        });

        return;
      }

      /* =========================
         LOGIN SUCCESS
      ========================= */

      console.log(
        "Login successful:",
        data.user
      );

      console.log(
        "Logged-in User ID:",
        data.user.id
      );

      console.log(
        "Logged-in User Role:",
        data.user.role
      );

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setErrors({
        general:
          "Unable to connect to the server.",
      });
    }
  };

  return (
    <section className="auth-page">

      <div className="auth-card">

        {/* =========================
            BACK
        ========================= */}

        <button
          type="button"
          className="auth-back-button"
          onClick={onBack}
        >
          ←
        </button>

        {/* =========================
            HEADER
        ========================= */}

        <div className="auth-header">

          <p>
            WELCOME BACK
          </p>

          <h1>
            {loginRole === "merchant"
              ? "Merchant Login"
              : "Login"}
          </h1>

          <span>
            {loginRole === "merchant"
              ? "Login to manage your ShopEase store"
              : "Login to continue shopping"}
          </span>

        </div>

        {/* =========================
            LOGIN TYPE
        ========================= */}

        <div className="login-role-section">

          <label>
            Login as
          </label>

          <div className="login-role-buttons">

            <button
              type="button"
              className={
                loginRole === "customer"
                  ? "login-role-button active"
                  : "login-role-button"
              }
              onClick={() =>
                handleRoleChange(
                  "customer"
                )
              }
            >
              <span className="role-icon">
                👤
              </span>

              <span>
                Customer
              </span>
            </button>

            <button
              type="button"
              className={
                loginRole === "merchant"
                  ? "login-role-button active"
                  : "login-role-button"
              }
              onClick={() =>
                handleRoleChange(
                  "merchant"
                )
              }
            >
              <span className="role-icon">
                🏪
              </span>

              <span>
                Merchant
              </span>
            </button>

          </div>

        </div>

        {/* =========================
            FORM
        ========================= */}

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email
              <span className="required-star">
                *
              </span>
            </label>

            <input
              type="email"
              name="email"
              placeholder={
                loginRole === "merchant"
                  ? "Enter merchant email"
                  : "Enter your email"
              }
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

            {errors.email && (
              <small>
                {errors.email}
              </small>
            )}

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
              <span className="required-star">
                *
              </span>
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            {errors.password && (
              <small>
                {errors.password}
              </small>
            )}

          </div>

          {/* BACKEND ERROR */}

          {errors.general && (
            <small className="login-general-error">
              {errors.general}
            </small>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-submit-button"
          >
            {loginRole === "merchant"
              ? "Login as Merchant"
              : "Login"}
          </button>

        </form>

        {/* =========================
            REGISTER
        ========================= */}

        <div className="auth-switch">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={onRegister}
          >
            Create Account
          </button>

        </div>

      </div>

    </section>
  );
}

export default Login;