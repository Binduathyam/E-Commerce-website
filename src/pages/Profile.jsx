import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";

function Profile({
  loggedInUser,
  onBack,
  onLogin,
  onRegister,
  onOrders,
  onAddresses,
  onLogout,
}) {
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!loggedInUser?.id) {
        setAddresses([]);
        return;
      }

      try {
        setAddressLoading(true);
        setAddressError("");

        const response = await fetch(
          `${API_BASE_URL}/api/addresses/${loggedInUser.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch addresses"
          );
        }

        setAddresses(data.addresses || []);
      } catch (error) {
        console.error("Profile address error:", error);
        setAddressError(
          "Unable to load saved addresses."
        );
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAddresses();
  }, [loggedInUser]);

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!loggedInUser) {
    return (
      <section className="profile-page">
        <div className="profile-container">

          <button
            type="button"
            className="profile-back-button"
            onClick={onBack}
          >
            ← Back
          </button>

          <div className="profile-welcome-card">

            <div className="profile-avatar">
              👤
            </div>

            <p className="profile-eyebrow">
              WELCOME TO SHOPEASE
            </p>

            <h1>
              Your account,
              <br />
              all in one place.
            </h1>

            <p className="profile-description">
              Login to manage your orders,
              addresses and account details.
            </p>

            <div className="profile-auth-buttons">

              <button
                type="button"
                className="profile-login-button"
                onClick={onLogin}
              >
                Login
              </button>

              <button
                type="button"
                className="profile-register-button"
                onClick={onRegister}
              >
                Create Account
              </button>

            </div>

          </div>
        </div>
      </section>
    );
  }

  // =========================
  // USER DATA
  // =========================

  const userName =
    loggedInUser.name ||
    loggedInUser.full_name ||
    "ShopEase User";

  const userEmail =
    loggedInUser.email ||
    "Email not available";

  const userPhone =
    loggedInUser.phone || "";

  // =========================
  // LOGGED-IN PROFILE
  // =========================

  return (
    <section className="profile-page">

      <div className="profile-container">

        {/* HEADER */}

        <div className="profile-topbar">

          <button
            type="button"
            className="profile-back-button"
            onClick={onBack}
          >
            ← Back
          </button>

          <h1>
            My Profile
          </h1>

          <div className="profile-topbar-space" />

        </div>


        {/* USER CARD */}

        <div className="profile-main-card">

          <div className="profile-avatar-large">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="profile-user-details">

            <p className="profile-eyebrow">
              MY ACCOUNT
            </p>

            <h2>
              {userName}
            </h2>

            <p>
              {userEmail}
            </p>

            {userPhone && (
              <p>
                {userPhone}
              </p>
            )}

          </div>

        </div>


        {/* ACCOUNT */}

        <div className="profile-section">

          <p className="profile-section-title">
            ACCOUNT
          </p>


          {/* MY ORDERS */}

          <button
            type="button"
            className="profile-menu-item"
            onClick={onOrders}
          >

            <div className="profile-menu-icon">
              📦
            </div>

            <div className="profile-menu-text">

              <h3>
                My Orders
              </h3>

              <p>
                View order history,
                details and tracking
              </p>

            </div>

            <span className="profile-menu-arrow">
              →
            </span>

          </button>


          {/* MY ADDRESSES */}

          <div className="profile-address-section">

            <div className="profile-address-heading">

              <h3>
                📍 My Addresses
              </h3>

              <p>
                Saved delivery addresses
              </p>

            </div>


            {/* LOADING */}

            {addressLoading && (
              <div className="profile-address-message">
                Loading saved addresses...
              </div>
            )}


            {/* ERROR */}

            {!addressLoading &&
              addressError && (
                <div className="profile-address-message error">
                  {addressError}
                </div>
              )}


            {/* EMPTY */}

            {!addressLoading &&
              !addressError &&
              addresses.length === 0 && (
                <div className="profile-address-empty">

                  <span>
                    📍
                  </span>

                  <p>
                    No saved addresses yet.
                  </p>

                  <small>
                    Your address will appear here
                    after checkout.
                  </small>

                </div>
              )}


            {/* SAVED ADDRESSES */}

            {!addressLoading &&
              !addressError &&
              addresses.length > 0 && (

                <div className="profile-address-list">

                  {addresses.map((address) => (

                    <div
                      className="profile-address-card"
                      key={address.id}
                    >

                      <div className="profile-address-card-top">

                        <div className="profile-address-icon">
                          📍
                        </div>

                        <div>

                          <h4>
                            {address.full_name}
                          </h4>

                          <p>
                            {address.phone}
                          </p>

                        </div>

                      </div>

                      <div className="profile-address-details">

                        <p>
                          {address.address_line}
                        </p>

                        <p>
                          {address.city}
                          {address.state
                            ? `, ${address.state}`
                            : ""}
                        </p>

                        <p>
                          {address.pincode}
                        </p>

                      </div>

                      <span className="saved-address-label">
                        SAVED ADDRESS
                      </span>

                    </div>

                  ))}

                </div>
              )}

          </div>


          {/* ACCOUNT SETTINGS */}

          <button
            type="button"
            className="profile-menu-item"
            onClick={() => {
              alert(
                "Account settings will be added next."
              );
            }}
          >

            <div className="profile-menu-icon">
              ⚙️
            </div>

            <div className="profile-menu-text">

              <h3>
                Account Settings
              </h3>

              <p>
                Manage your account information
              </p>

            </div>

            <span className="profile-menu-arrow">
              →
            </span>

          </button>

        </div>


        {/* LOGOUT */}

        <div className="profile-logout-section">

          <button
            type="button"
            className="profile-logout-button"
            onClick={onLogout}
          >

            <span>
              🚪
            </span>

            Logout

          </button>

        </div>

      </div>

    </section>
  );
}

export default Profile;