import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AccountSettings.css";

function AccountSettings({
  loggedInUser,
  onBack,
  onUpdated,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================
  // LOAD USER
  // =========================================

  useEffect(() => {
    const fetchProfile = async () => {
      if (!loggedInUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/auth/user/${loggedInUser.id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load profile"
          );
        }

        const user = data.user;

        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      } catch (err) {
        console.error(
          "Account settings error:",
          err
        );

        setError(
          "Unable to load account details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [loggedInUser]);

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // =========================================
  // SAVE
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!loggedInUser?.id) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/auth/user/${loggedInUser.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update profile"
        );
      }

      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
      });

      setMessage(
        "Account details updated successfully."
      );

      if (onUpdated) {
        onUpdated(data.user);
      }
    } catch (err) {
      console.error(
        "Update profile error:",
        err
      );

      setError(
        err.message ||
          "Failed to update account details."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <section className="account-settings-page">
        <div className="account-settings-container">

          <div className="account-settings-loading">
            👤
            <h2>
              Loading account details...
            </h2>
            <p>
              Please wait.
            </p>
          </div>

        </div>
      </section>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <section className="account-settings-page">

      <div className="account-settings-container">

        {/* HEADER */}

        <div className="account-settings-header">

          <button
            type="button"
            className="account-settings-back"
            onClick={onBack}
          >
            ← My Profile
          </button>

          <div>
            <p>
              ACCOUNT
            </p>

            <h1>
              Account Settings
            </h1>

            <span>
              Manage your account information
            </span>
          </div>

          <div />

        </div>


        {/* FORM CARD */}

        <form
          className="account-settings-card"
          onSubmit={handleSubmit}
        >

          <div className="account-settings-card-header">

            <div className="account-settings-avatar">
              {form.name
                ? form.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>

              <p>
                PERSONAL INFORMATION
              </p>

              <h2>
                Your Details
              </h2>

            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div className="account-settings-error">
              ⚠️ {error}
            </div>
          )}


          {/* SUCCESS */}

          {message && (
            <div className="account-settings-success">
              ✓ {message}
            </div>
          )}


          {/* NAME */}

          <div className="account-settings-field">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

          </div>


          {/* EMAIL */}

          <div className="account-settings-field">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              disabled
            />

            <small>
              Email address cannot be changed
              here.
            </small>

          </div>


          {/* PHONE */}

          <div className="account-settings-field">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />

          </div>


          {/* BUTTONS */}

          <div className="account-settings-actions">

            <button
              type="button"
              className="account-settings-cancel"
              onClick={onBack}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="account-settings-save"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </section>
  );
}

export default AccountSettings;