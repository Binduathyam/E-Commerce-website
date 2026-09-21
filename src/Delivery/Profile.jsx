import React, { useEffect, useState } from "react";
import "./Profile.css";

const API_BASE_URL = "http://3.110.90.184";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    vehicle_type: "",
    vehicle_number: "",
    license_number: "",
  });

  // =====================================
  // LOAD PROFILE
  // =====================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser =
          localStorage.getItem("deliveryPartner");

        if (!storedUser) {
          console.error(
            "Delivery partner data not found"
          );
          return;
        }

        const deliveryPartner =
          JSON.parse(storedUser);

        const partnerId =
          deliveryPartner?.id;

        if (!partnerId) {
          console.error(
            "Delivery partner ID not found"
          );
          return;
        }

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/delivery/profile/${partnerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type":
                "application/json",

              "x-user-id":
                String(partnerId),

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

        const data =
          await response.json();

        console.log(
          "Delivery profile response:",
          data
        );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to load profile"
          );
        }

        const user =
          data.delivery_partner;

        if (!user) {
          throw new Error(
            "Delivery partner details not found"
          );
        }

        setProfile({
          id: user.id || null,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          vehicle_type:
            user.vehicle_type || "",
          vehicle_number:
            user.vehicle_number || "",
          license_number:
            user.license_number || "",
        });
      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================
  // CANCEL EDIT
  // =====================================

  const handleCancel = () => {
    window.location.reload();
  };

  // =====================================
  // SAVE PROFILE
  // =====================================

  const handleSave = async () => {
    try {
      if (!profile.id) {
        alert(
          "Delivery partner ID not found."
        );
        return;
      }

      setSaving(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/delivery/profile/${profile.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            "x-user-id":
              String(profile.id),

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            phone: profile.phone,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            vehicle_type:
              profile.vehicle_type,
            vehicle_number:
              profile.vehicle_number,
            license_number:
              profile.license_number,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Profile update response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update profile"
        );
      }

      setIsEditing(false);

      alert(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      alert(
        error.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          Loading profile...
        </div>
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="profile-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <section className="profile-header">

        <div className="profile-header-content">

          <p>
            ACCOUNT SETTINGS
          </p>

          <h1>
            My Profile
          </h1>

          <span>
            Manage your personal information
            and delivery details.
          </span>

        </div>

      </section>


      {/* =================================
          PROFILE CARD
      ================================= */}

      <section className="profile-card">

        <div className="profile-main-info">

          <div className="profile-avatar">
            {profile.name
              ? profile.name
                  .charAt(0)
                  .toUpperCase()
              : "D"}
          </div>

          <div>

            <h2>
              {profile.name ||
                "Delivery Partner"}
            </h2>

            <span>
              Delivery Partner
            </span>

            <div className="profile-status">

              <span className="profile-status-dot"></span>

              Active Partner

            </div>

          </div>

        </div>

      </section>


      {/* =================================
          PERSONAL INFORMATION
      ================================= */}

      <section className="profile-section">

        <div className="profile-section-heading">

          <div>

            <p>
              PERSONAL DETAILS
            </p>

            <h2>
              Personal Information
            </h2>

          </div>

          {/* EDIT BUTTON */}

          {!isEditing ? (

            <button
              type="button"
              className="profile-edit-button"
            onClick={() => {
  console.log("EDIT BUTTON CLICKED");
  setIsEditing(true);
}}
            >
              ✎ Edit Profile
            </button>

          ) : (

            <div className="profile-header-actions">

              <button
                type="button"
                className="profile-cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="profile-save-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          )}

        </div>


        <div className="profile-form-grid">

          {/* FULL NAME */}

          <div className="profile-field">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled
            />

          </div>


          {/* EMAIL */}

          <div className="profile-field">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
            />

          </div>


          {/* PHONE */}

          <div className="profile-field">

            <label>
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />

          </div>

        </div>

      </section>


      {/* =================================
          DELIVERY LOCATION
      ================================= */}

      <section className="profile-section">

        <div className="profile-section-heading">

          <div>

            <p>
              DELIVERY AREA
            </p>

            <h2>
              Assigned Location
            </h2>

          </div>

          <span className="profile-location-note">
            📍 Orders are assigned based
            on this location
          </span>

        </div>


        <div className="profile-form-grid">

          {/* CITY */}

          <div className="profile-field">

            <label>
              City / Delivery Area
            </label>

            <input
              type="text"
              name="city"
              value={profile.city}
              onChange={handleChange}
              disabled={!isEditing}
            />

          </div>


          {/* STATE */}

          <div className="profile-field">

            <label>
              State
            </label>

            <input
              type="text"
              name="state"
              value={profile.state}
              disabled
            />

          </div>

        </div>

      </section>


      {/* =================================
          VEHICLE DETAILS
      ================================= */}

      <section className="profile-section">

        <div className="profile-section-heading">

          <div>

            <p>
              DELIVERY VEHICLE
            </p>

            <h2>
              Vehicle Information
            </h2>

          </div>

        </div>


        <div className="profile-form-grid">

          {/* VEHICLE TYPE */}

          <div className="profile-field">

            <label>
              Vehicle Type
            </label>

            <input
              type="text"
              name="vehicle_type"
              value={
                profile.vehicle_type
              }
              onChange={handleChange}
              disabled={!isEditing}
            />

          </div>


          {/* VEHICLE NUMBER */}

          <div className="profile-field">

            <label>
              Vehicle Number
            </label>

            <input
              type="text"
              name="vehicle_number"
              value={
                profile.vehicle_number
              }
              onChange={handleChange}
              disabled={!isEditing}
            />

          </div>


          {/* LICENSE NUMBER */}

          <div className="profile-field">

            <label>
              License Number
            </label>

            <input
              type="text"
              name="license_number"
              value={
                profile.license_number
              }
              onChange={handleChange}
              disabled={!isEditing}
            />

          </div>

        </div>

      </section>


      {/* =================================
          ACCOUNT SUMMARY
      ================================= */}

      <section className="profile-summary-grid">

        <div className="profile-summary-card">

          <span>📦</span>

          <div>

            <small>
              Total Deliveries
            </small>

            <strong>
              248
            </strong>

          </div>

        </div>


        <div className="profile-summary-card">

          <span>⭐</span>

          <div>

            <small>
              Delivery Rating
            </small>

            <strong>
              4.8 / 5
            </strong>

          </div>

        </div>


        <div className="profile-summary-card">

          <span>📅</span>

          <div>

            <small>
              Account
            </small>

            <strong>
              Active
            </strong>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Profile;