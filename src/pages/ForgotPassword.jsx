import { useState } from "react";
import { API_BASE_URL } from "../api";
import "./ForgotPassword.css";

function ForgotPassword({ onBack, role }) {
  const [formData, setFormData] = useState({
  email: "",
  question: "",
  answer: "",
  newPassword: "",
  confirmPassword: "",
  userId: null,
  userType: "",
});

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const questions = [
    "What was the name of your first school?",
    "What was the name of your first pet?",
    "What is your childhood nickname?",
    "What is your favourite food?",
  ];

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

    setMessage("");
  };

  /* =========================================
     VERIFY EMAIL + SECURITY ANSWER
  ========================================= */

  const handleVerify = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.question) {
      newErrors.question =
        "Please select a security question";
    }

    if (!formData.answer.trim()) {
      newErrors.answer =
        "Answer is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setMessage("");

      /*
        Backend endpoint will be connected
        in the next step.
      */

      const response = await fetch(
        `${API_BASE_URL}/api/auth/forgot-password/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  email: formData.email
    .trim()
    .toLowerCase(),

  question:
    formData.question,

  answer:
    formData.answer.trim(),

  role: role,
}),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Incorrect security details"
        );
      }

   setStep(2);

setFormData((previous) => ({
  ...previous,
  userId: data.user_id,
  userType: data.user_type,
}));

setMessage(
  "Security details verified successfully."
);
    } catch (error) {
      console.error(
        "Forgot password verification error:",
        error
      );

      setErrors({
        general:
          error.message ||
          "Unable to verify details",
      });
    }
  };

  /* =========================================
     RESET PASSWORD
  ========================================= */

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword =
        "New password is required";
    }

    if (
      formData.newPassword.length < 6
    ) {
      newErrors.newPassword =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/api/auth/forgot-password/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
         body: JSON.stringify({
  user_id: formData.userId,
  user_type: formData.userType,
  new_password: formData.newPassword,
}),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to reset password"
        );
      }

      setMessage(
        "Password reset successfully!"
      );

      setTimeout(() => {
        if (onBack) {
          onBack();
        }
      }, 1500);
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      setErrors({
        general:
          error.message ||
          "Failed to reset password",
      });
    }
  };

  return (
    <div className="forgot-password-page">

      {/* =====================================
          LEFT BANNER
      ===================================== */}

      <div className="forgot-password-banner">

        <button
          type="button"
          className="forgot-back-button"
          onClick={onBack}
        >
          ← Back to Login
        </button>

        <div className="forgot-banner-content">

          <div className="forgot-brand">
            ShopEase
          </div>

          <h1>
            Reset your password,
            <br />
            securely.
          </h1>

          <p>
            Use your registered email and
            security question to reset your
            ShopEase password.
          </p>

          <div className="forgot-features">

            <div className="forgot-feature">
              <span>✓</span>
              <span>
                Secure Account Recovery
              </span>
            </div>

            <div className="forgot-feature">
              <span>✓</span>
              <span>
                No Email OTP Required
              </span>
            </div>

            <div className="forgot-feature">
              <span>✓</span>
              <span>
                Easy Password Reset
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          RIGHT SECTION
      ===================================== */}

      <div className="forgot-password-section">

        <div className="forgot-password-card">

          <div className="forgot-header">

            <div className="forgot-mobile-brand">
              ShopEase
            </div>

            {step === 1 ? (
              <>
                <h2>
                  Forgot Password?
                </h2>

                <p>
                  Verify your account to
                  reset your password.
                </p>
              </>
            ) : (
              <>
                <h2>
                  Create New Password
                </h2>

                <p>
                  Enter your new password
                  below.
                </p>
              </>
            )}

          </div>

          {/* =================================
              STEP 1
          ================================= */}

          {step === 1 && (
            <form
              className="forgot-form"
              onSubmit={handleVerify}
            >

              {/* EMAIL */}

              <div className="forgot-form-group">

                <label htmlFor="forgot-email">
                  Email Address
                </label>

                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your registered email"
                  autoComplete="email"
                />

                {errors.email && (
                  <span className="forgot-field-error">
                    {errors.email}
                  </span>
                )}

              </div>

              {/* QUESTION */}

              <div className="forgot-form-group">

                <label htmlFor="security-question">
                  Security Question
                </label>

                <select
                  id="security-question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                >
                  <option value="">
                    Select your security question
                  </option>

                  {questions.map(
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

                {errors.question && (
                  <span className="forgot-field-error">
                    {errors.question}
                  </span>
                )}

              </div>

              {/* ANSWER */}

              <div className="forgot-form-group">

                <label htmlFor="security-answer">
                  Your Answer
                </label>

                <input
                  id="security-answer"
                  type="text"
                  name="answer"
                  value={formData.answer}
                  onChange={handleChange}
                  placeholder="Enter your answer"
                  autoComplete="off"
                />

                {errors.answer && (
                  <span className="forgot-field-error">
                    {errors.answer}
                  </span>
                )}

              </div>

              {errors.general && (
                <div className="forgot-error">
                  {errors.general}
                </div>
              )}

              {message && (
                <div className="forgot-success">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="forgot-submit-button"
              >
                Verify & Continue
              </button>

            </form>
          )}

          {/* =================================
              STEP 2
          ================================= */}

          {step === 2 && (
            <form
              className="forgot-form"
              onSubmit={
                handleResetPassword
              }
            >

              {/* NEW PASSWORD */}

              <div className="forgot-form-group">

                <label htmlFor="new-password">
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  name="newPassword"
                  value={
                    formData.newPassword
                  }
                  onChange={handleChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />

                {errors.newPassword && (
                  <span className="forgot-field-error">
                    {errors.newPassword}
                  </span>
                )}

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="forgot-form-group">

                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />

                {errors.confirmPassword && (
                  <span className="forgot-field-error">
                    {errors.confirmPassword}
                  </span>
                )}

              </div>

              {errors.general && (
                <div className="forgot-error">
                  {errors.general}
                </div>
              )}

              {message && (
                <div className="forgot-success">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="forgot-submit-button"
              >
                Reset Password
              </button>

              <button
                type="button"
                className="forgot-cancel-button"
                onClick={() => {
                  setStep(1);
                  setMessage("");
                  setErrors({});
                }}
              >
                ← Back
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;