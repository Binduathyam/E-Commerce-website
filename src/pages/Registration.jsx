import { useState } from "react";
import { API_BASE_URL } from "../api";

function Registration({
  onBack,
  onLogin,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  const [errors, setErrors] = useState({});

  const [passwordFocused, setPasswordFocused] =
    useState(false);

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

    setErrors((current) => ({
      ...current,
      [name]: "",
      general: "",
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName =
        "Full Name is required";
    } else if (
      formData.fullName.trim().length < 3
    ) {
      newErrors.fullName =
        "Full Name must be at least 3 characters";
    }

    // Email validation
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

    // Strong Password validation
    const password =
      formData.password;

    if (!password) {
      newErrors.password =
        "Password is required";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least 1 uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least 1 lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password =
        "Password must contain at least 1 number";
    } else if (
      !/[^A-Za-z0-9]/.test(password)
    ) {
      newErrors.password =
        "Password must contain at least 1 special symbol";
    }

    // Confirm Password validation
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

    // Security Question
    if (!formData.securityQuestion) {
      newErrors.securityQuestion =
        "Please select a security question";
    }

    // Security Answer
    if (!formData.securityAnswer.trim()) {
      newErrors.securityAnswer =
        "Security answer is required";
    }

    setErrors(newErrors);

    // Stop if validation errors exist
    if (
      Object.keys(newErrors).length > 0
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name:
              formData.fullName.trim(),

            email:
              formData.email
                .trim()
                .toLowerCase(),

            password:
              formData.password,

            security_question:
              formData.securityQuestion,

            security_answer:
              formData.securityAnswer.trim(),
          }),
        }
      );

      const data =
        await response.json();

      // Backend returned an error
      if (!response.ok) {
        setErrors({
          general:
            data.message ||
            "Registration failed",
        });

        return;
      }

      // Registration successful
      alert(
        data.message ||
          "Registration successful!"
      );

      // Go to Login
      if (onLogin) {
        onLogin();
      }

    } catch (error) {
      console.error(
        "Registration error:",
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

          {/* FULL NAME */}

          <div className="form-group">

            <label>
              Full Name
              <span className="required-star">
                *
              </span>
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={
                formData.fullName
              }
              onChange={handleChange}
            />

            {errors.fullName && (
              <small>
                {errors.fullName}
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
              value={
                formData.email
              }
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

            <div
              style={{
                position: "relative",
              }}
            >

              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={
                  formData.password
                }
                onChange={handleChange}
                onFocus={() =>
                  setPasswordFocused(true)
                }
                onBlur={() =>
                  setPasswordFocused(false)
                }
              />

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
                    zIndex: 20,
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
                    • 1 uppercase letter (A-Z)
                  </div>

                  <div>
                    • 1 lowercase letter (a-z)
                  </div>

                  <div>
                    • 1 number (0-9)
                  </div>

                  <div>
                    • 1 special symbol (! @ # $ % etc.)
                  </div>

                </div>
              )}

            </div>

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

          {/* SECURITY QUESTION */}

          <div className="form-group">

            <label>
              Security Question
              <span className="required-star">
                *
              </span>
            </label>

            <select
              name="securityQuestion"
              value={
                formData.securityQuestion
              }
              onChange={handleChange}
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

            {errors.securityQuestion && (
              <small>
                {
                  errors.securityQuestion
                }
              </small>
            )}

          </div>

          {/* SECURITY ANSWER */}

          <div className="form-group">

            <label>
              Security Answer
              <span className="required-star">
                *
              </span>
            </label>

            <input
              type="text"
              name="securityAnswer"
              placeholder="Enter your answer"
              value={
                formData.securityAnswer
              }
              onChange={handleChange}
              autoComplete="off"
            />

            {errors.securityAnswer && (
              <small>
                {
                  errors.securityAnswer
                }
              </small>
            )}

          </div>

          {/* BACKEND ERROR */}

          {errors.general && (
            <small>
              {errors.general}
            </small>
          )}

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