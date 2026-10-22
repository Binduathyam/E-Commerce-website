import { useEffect, useRef, useState } from "react";

function Navbar({
  search,
  setSearch,
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick,
  onLoginClick,
  loggedInUser,
  onOrders,
  onAddresses,
  onAccountSettings,
  onLogout,
}) {
  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const profileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleProfileClick = () => {
    if (!loggedInUser) {
      onLoginClick();
      return;
    }

    setShowProfileMenu(
      (current) => !current
    );
  };

  const handleMenuClick = (callback) => {
    setShowProfileMenu(false);

    if (callback) {
      callback();
    }
  };

  const userName =
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    "User";

  const userEmail =
    loggedInUser?.email ||
    "";

  const userInitial =
    userName.charAt(0).toUpperCase();

  return (
    <header className="navbar">

      {/* LOGO */}
      <div className="logo">
        Shop<span>Ease</span>
      </div>


      {/* SEARCH */}
      <div
        className="search-box"
        id="tour-search"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          type="button"
          className="search-button"
        >
          🔍
        </button>
      </div>


      {/* NAVIGATION ACTIONS */}
      <div className="nav-actions">

        {/* WISHLIST */}
        <button
          type="button"
          className="nav-action-button"
          id="tour-wishlist"
          onClick={onWishlistClick}
        >
          <span className="nav-icon">
            ♡
          </span>

          <span>
            Wishlist
          </span>

          {wishlistCount > 0 && (
            <span className="nav-count">
              {wishlistCount}
            </span>
          )}
        </button>


        {/* CART */}
        <button
          type="button"
          className="nav-action-button"
          id="tour-cart"
          onClick={onCartClick}
        >
          <span className="nav-icon">
            🛒
          </span>

          <span>
            Cart
          </span>

          {cartCount > 0 && (
            <span className="nav-count">
              {cartCount}
            </span>
          )}
        </button>


        {/* PROFILE */}
        <div
          className="navbar-profile-wrapper"
          ref={profileMenuRef}
        >
          <button
            type="button"
            className="nav-action-button"
            id="tour-profile"
            onClick={handleProfileClick}
          >
            <span className="nav-icon">
              👤
            </span>

            <span>
              {loggedInUser
                ? "Profile"
                : "Login"}
            </span>
          </button>


          {/* PROFILE DROPDOWN */}
          {loggedInUser &&
            showProfileMenu && (
              <div className="profile-dropdown">

                {/* USER HEADER */}
                <div className="profile-dropdown-user">

                  <div className="profile-dropdown-avatar">
                    {userInitial}
                  </div>

                  <div className="profile-dropdown-user-info">

                    <strong>
                      {userName}
                    </strong>

                    <span>
                      {userEmail}
                    </span>

                  </div>

                </div>


                {/* DIVIDER */}
                <div className="profile-dropdown-divider" />


                {/* MY ORDERS */}
                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={() =>
                    handleMenuClick(
                      onOrders
                    )
                  }
                >
                  <span className="profile-dropdown-item-icon">
                    📦
                  </span>

                  <span>
                    My Orders
                  </span>
                </button>


                {/* MY ADDRESSES */}
                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={() =>
                    handleMenuClick(
                      onAddresses
                    )
                  }
                >
                  <span className="profile-dropdown-item-icon">
                    📍
                  </span>

                  <span>
                    My Addresses
                  </span>
                </button>


                {/* ACCOUNT SETTINGS */}
                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={() =>
                    handleMenuClick(
                      onAccountSettings
                    )
                  }
                >
                  <span className="profile-dropdown-item-icon">
                    ⚙️
                  </span>

                  <span>
                    Account Settings
                  </span>
                </button>


                {/* DIVIDER */}
                <div className="profile-dropdown-divider" />


                {/* LOGOUT */}
                <button
                  type="button"
                  className="profile-dropdown-item profile-dropdown-logout"
                  onClick={() =>
                    handleMenuClick(
                      onLogout
                    )
                  }
                >
                  <span className="profile-dropdown-item-icon">
                    🚪
                  </span>

                  <span>
                    Logout
                  </span>
                </button>

              </div>
            )}
        </div>

      </div>

    </header>
  );
}

export default Navbar;