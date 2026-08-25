import { useEffect, useState } from "react";

function Profile({
  loggedInUser,
  onBack,
  onLogin,
  onRegister,
  onOrders,
  onAddresses,
  onLogout,
  onAccountSettings,
}) {
  // =========================================
  // NOT LOGGED IN
  // =========================================

  if (!loggedInUser) {
    return (
      <section className="profile-page">
        <div className="profile-container">

          {/* BACK */}

          <button
            type="button"
            className="profile-back-button"
            onClick={onBack}
          >
            ← Back
          </button>


          {/* WELCOME CARD */}

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


            {/* AUTH BUTTONS */}

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


  // =========================================
  // USER DATA
  // =========================================

  const userName =
    loggedInUser.name ||
    loggedInUser.full_name ||
    "ShopEase User";

  const userEmail =
    loggedInUser.email ||
    "Email not available";

  const userPhone =
    loggedInUser.phone || "";


  // =========================================
  // LOGGED-IN PROFILE
  // =========================================

  return (
    <section className="profile-page">

      <div className="profile-container">


        {/* =====================================
            HEADER
        ====================================== */}

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


        {/* =====================================
            USER CARD
        ====================================== */}

        <div className="profile-main-card">

          <div className="profile-avatar-large">
            {userName
              .charAt(0)
              .toUpperCase()}
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


        {/* =====================================
            ACCOUNT SECTION
        ====================================== */}

        <div className="profile-section">

          <p className="profile-section-title">
            ACCOUNT
          </p>


          {/* ===================================
              MY ORDERS
          ==================================== */}

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


          {/* ===================================
              MY ADDRESSES
          ==================================== */}

          <button
            type="button"
            className="profile-menu-item"
            onClick={onAddresses}
          >

            <div className="profile-menu-icon">
              📍
            </div>


            <div className="profile-menu-text">

              <h3>
                My Addresses
              </h3>

              <p>
                Manage your saved
                delivery addresses
              </p>

            </div>


            <span className="profile-menu-arrow">
              →
            </span>

          </button>


          {/* ===================================
              ACCOUNT SETTINGS
          ==================================== */}

          <button
            type="button"
            className="profile-menu-item"
            onClick={onAccountSettings}
          >

            <div className="profile-menu-icon">
              ⚙️
            </div>


            <div className="profile-menu-text">

              <h3>
                Account Settings
              </h3>

              <p>
                Manage your account
                information
              </p>

            </div>


            <span className="profile-menu-arrow">
              →
            </span>

          </button>

        </div>


        {/* =====================================
            LOGOUT
        ====================================== */}

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