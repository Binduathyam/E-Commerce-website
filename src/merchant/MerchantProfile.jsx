import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./MerchantProfile.css";

function MerchantProfile({
  merchant,
  onBack,
  onLogout,
  onProfileUpdated,
}) {
  const [formData, setFormData] = useState({
    name: "",
    business_name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!merchant?.id) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/auth/merchant/${merchant.id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load merchant profile"
          );
        }

        const user = data.user;

        setFormData({
          name: user.name || "",
          business_name:
            user.business_name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      } catch (error) {
        console.error(
          "Merchant profile error:",
          error
        );

        // Fallback to logged-in user data
        setFormData({
          name: merchant.name || "",
          business_name:
            merchant.business_name ||
            merchant.businessName ||
            "My Store",
          email: merchant.email || "",
          phone: merchant.phone || "",
        });

        setError(
          error.message ||
            "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [merchant]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.business_name.trim()) {
      setError(
        "Business name is required"
      );
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/api/auth/merchant/${merchant.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            business_name:
              formData.business_name.trim(),
            phone: formData.phone.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update profile"
        );
      }

      const updatedUser = {
        ...merchant,
        ...data.user,
        businessName:
          data.user.business_name,
      };

      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }

      setSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Update merchant profile error:",
        error
      );

      setError(
        error.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="merchant-profile-page">
        <div className="merchant-profile-loading">
          Loading merchant profile...
        </div>
      </section>
    );
  }

  return (
    <section className="merchant-profile-page">

      {/* HEADER */}

      <div className="merchant-profile-header">

        <button
          type="button"
          className="merchant-profile-back"
          onClick={onBack}
        >
          ←
        </button>

        <div>
          <p>MERCHANT</p>

          <h1>
            My Profile
          </h1>

          <span>
            Manage your store information
          </span>
        </div>

      </div>


      {/* PROFILE CARD */}

      <div className="merchant-profile-card">

        {/* STORE HEADER */}

        <div className="merchant-profile-store">

          <div className="merchant-profile-avatar">
            {formData.business_name
              ? formData.business_name
                  .charAt(0)
                  .toUpperCase()
              : "M"}
          </div>

          <div>
            <h2>
              {formData.business_name ||
                "My Store"}
            </h2>

            <p>
              Merchant Account
            </p>
          </div>

        </div>


        {/* FORM */}

        <form
          className="merchant-profile-form"
          onSubmit={handleSave}
        >

          {/* NAME */}

          <div className="merchant-profile-field">

            <label>
              Merchant Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

          </div>


          {/* BUSINESS NAME */}

          <div className="merchant-profile-field">

            <label>
              Business Name
            </label>

            <input
              type="text"
              name="business_name"
              value={
                formData.business_name
              }
              onChange={handleChange}
              placeholder="Enter business name"
            />

          </div>


          {/* EMAIL */}

          <div className="merchant-profile-field">

            <label>
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              disabled
            />

            <small>
              Email cannot be changed.
            </small>

          </div>


          {/* PHONE */}

          <div className="merchant-profile-field">

            <label>
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

          </div>


          {/* ACCOUNT TYPE */}

          <div className="merchant-profile-info">

            <div>
              <span>
                Account Type
              </span>

              <strong>
                Merchant
              </strong>
            </div>

            <div>
              <span>
                Merchant ID
              </span>

              <strong>
                #{merchant.id}
              </strong>
            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div className="merchant-profile-error">
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="merchant-profile-success">
              {success}
            </div>
          )}


          {/* ACTIONS */}

          <div className="merchant-profile-actions">

            <button
              type="submit"
              className="merchant-profile-save"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>


      {/* LOGOUT */}

      {onLogout && (
        <button
          type="button"
          className="merchant-profile-logout"
          onClick={onLogout}
        >
          Logout
        </button>
      )}

    </section>
  );
}

export default MerchantProfile;