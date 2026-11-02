
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
    business_address: "",
    business_city: "",
    business_state: "",
    business_pincode: "",
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
            data.message || "Failed to load merchant profile"
          );
        }

        const user = data.user;

        setFormData({
          name: user.name || "",
          business_name:
            user.business_name || user.businessName || "",
          email: user.email || "",
          phone: user.phone || "",
          business_address: user.business_address || "",
          business_city: user.business_city || "",
          business_state: user.business_state || "",
          business_pincode: user.business_pincode || "",
        });
      } catch (error) {
        console.error("Merchant profile error:", error);

        setFormData({
          name: merchant.name || "",
          business_name:
            merchant.business_name ||
            merchant.businessName ||
            "",
          email: merchant.email || "",
          phone: merchant.phone || "",
          business_address: merchant.business_address || "",
          business_city: merchant.business_city || "",
          business_state: merchant.business_state || "",
          business_pincode: merchant.business_pincode || "",
        });

        setError(
          error.message || "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [merchant?.id]);

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
      setError("Business name is required");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }

    if (
      !formData.business_address.trim() ||
      !formData.business_city.trim() ||
      !formData.business_state.trim() ||
      !formData.business_pincode.trim()
    ) {
      setError("Please enter your complete business address.");
      return;
    }

    if (!/^\d{6}$/.test(formData.business_pincode.trim())) {
      setError("Pincode must contain exactly 6 digits.");
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            business_name: formData.business_name.trim(),
            phone: formData.phone.trim(),
            businessAddress: formData.business_address.trim(),
            city: formData.business_city.trim(),
            state: formData.business_state.trim(),
            pincode: formData.business_pincode.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      const updatedUser = {
        ...merchant,
        ...data.user,
        businessName: data.user.business_name,
      };

      setFormData((current) => ({
        ...current,
        name: data.user.name ?? current.name,
        business_name:
          data.user.business_name ?? current.business_name,
        email: data.user.email ?? current.email,
        phone: data.user.phone ?? current.phone,
        business_address:
          data.user.business_address ?? current.business_address,
        business_city:
          data.user.business_city ?? current.business_city,
        business_state:
          data.user.business_state ?? current.business_state,
        business_pincode:
          data.user.business_pincode ?? current.business_pincode,
      }));

      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }

      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Update merchant profile error:", error);

      setError(
        error.message || "Unable to update profile."
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
          <h1>My Profile</h1>
          <span>Manage your store information</span>
        </div>
      </div>

      <div className="merchant-profile-card">
        <div className="merchant-profile-store">
          <div className="merchant-profile-avatar">
            {formData.business_name
              ? formData.business_name.charAt(0).toUpperCase()
              : "M"}
          </div>

          <div>
            <h2>{formData.business_name || "My Store"}</h2>
            <p>Merchant Account</p>
          </div>
        </div>

        <form
          className="merchant-profile-form"
          onSubmit={handleSave}
        >
          <div className="merchant-profile-field">
            <label htmlFor="merchant-name">Merchant Name</label>
            <input
              id="merchant-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="merchant-profile-field">
            <label htmlFor="merchant-business-name">Business Name</label>
            <input
              id="merchant-business-name"
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              placeholder="Enter business name"
              required
            />
          </div>

          <div className="merchant-profile-field">
            <label htmlFor="merchant-email">Email</label>
            <input
              id="merchant-email"
              type="email"
              value={formData.email}
              disabled
            />
            <small>Email cannot be changed.</small>
          </div>

          <div className="merchant-profile-field">
            <label htmlFor="merchant-phone">Phone</label>
            <input
              id="merchant-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="merchant-profile-field">
            <label htmlFor="business-address">
              Business / Pickup Address
            </label>
            <textarea
              id="business-address"
              name="business_address"
              value={formData.business_address}
              onChange={handleChange}
              placeholder="Door number, street, area, landmark"
              rows={3}
              required
            />
            <small>
              Pickup partners will use this address to collect parcels.
            </small>
          </div>

          <div className="merchant-profile-address-grid">
            <div className="merchant-profile-field">
              <label htmlFor="business-city">City</label>
              <input
                id="business-city"
                type="text"
                name="business_city"
                value={formData.business_city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>

            <div className="merchant-profile-field">
              <label htmlFor="business-state">State</label>
              <input
                id="business-state"
                type="text"
                name="business_state"
                value={formData.business_state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            </div>

            <div className="merchant-profile-field">
              <label htmlFor="business-pincode">Pincode</label>
              <input
                id="business-pincode"
                type="text"
                name="business_pincode"
                value={formData.business_pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                inputMode="numeric"
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
            </div>
          </div>

          <div className="merchant-profile-info">
            <div>
              <span>Account Type</span>
              <strong>Merchant</strong>
            </div>

            <div>
              <span>Merchant ID</span>
              <strong>#{merchant.id}</strong>
            </div>
          </div>

          {error && (
            <div className="merchant-profile-error">
              {error}
            </div>
          )}

          {success && (
            <div className="merchant-profile-success">
              {success}
            </div>
          )}

          <div className="merchant-profile-actions">
            <button
              type="submit"
              className="merchant-profile-save"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

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

