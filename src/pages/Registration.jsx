import { useState } from "react";

function Registration({
  onBack,
  onLogin,
}) {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

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

  const handleRegister = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName =
        "Business Name is required";
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

    if (!formData.password) {
      newErrors.password =
        "Password is required";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Confirm Password is required";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    if (
      Object.keys(newErrors).length === 0
    ) {
      alert(
        "Registration successful!"
      );

      if (onLogin) {
        onLogin();
      }
    }
  };

  return (
    <section className="auth-page">

      <div className="auth-card">

        <button
          type="button"
          className="auth-back-button"
          onClick={onBack}
        >
          ←
        </button>

        <div className="auth-header">
          <p>CREATE ACCOUNT</p>

          <h1>
            Create Your Account
          </h1>

          <span>
            Register to start shopping
          </span>
        </div>

        <form
          className="auth-form"
          onSubmit={handleRegister}
        >

          {/* BUSINESS NAME */}

          <div className="form-group">

            <label>
              Business Name
              <span className="required-star">
                *
              </span>
            </label>

            <input
              type="text"
              name="businessName"
              placeholder="Enter business name"
              value={
                formData.businessName
              }
              onChange={handleChange}
            />

            {errors.businessName && (
              <small>
                {errors.businessName}
              </small>
            )}

          </div>

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
              placeholder="Create a password"
              value={
                formData.password
              }
              onChange={handleChange}
            />

            {errors.password && (
              <small>
                {errors.password}
              </small>
            )}

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label>
              Confirm Password
              <span className="required-star">
                *
              </span>
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
            />

            {errors.confirmPassword && (
              <small>
                {errors.confirmPassword}
              </small>
            )}

          </div>

          <button
            type="submit"
            className="auth-submit-button"
          >
            Create Account
          </button>

        </form>

        <div className="auth-switch">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={onLogin}
          >
            Login
          </button>

        </div>

      </div>

    </section>
  );
}

export default Registration;