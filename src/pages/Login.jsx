import { useState } from "react";

function Login({
  onBack,
  onRegister,
  onLoginSuccess,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleLogin = (e) => {
    e.preventDefault();

    const newErrors = {};

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
    }

    setErrors(newErrors);

    if (
      Object.keys(newErrors).length === 0
    ) {
      if (onLoginSuccess) {
        onLoginSuccess();
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

          <p>
            WELCOME BACK
          </p>

          <h1>
            Login
          </h1>

          <span>
            Login to continue shopping
          </span>

        </div>

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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />

            {errors.password && (
              <small>
                {errors.password}
              </small>
            )}

          </div>

          <button
            type="submit"
            className="auth-submit-button"
          >
            Login
          </button>

        </form>

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