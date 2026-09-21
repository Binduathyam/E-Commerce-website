function Navbar({
  search,
  setSearch,
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick,
  onLoginClick,
  loggedInUser,
}) {
  return (
    <header className="navbar">

      {/* LOGO */}
      <div className="logo">
        Shop<span>Ease</span>
      </div>


      {/* SEARCH */}
      <div className="search-box" id="tour-search">

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

        {/* LOGIN / PROFILE */}
        <button
          type="button"
          className="nav-action-button"
          id="tour-profile"
          onClick={onLoginClick}
        >
          <span className="nav-icon">
            👤
          </span>

          <span>
            {loggedInUser ? "Profile" : "Login"}
          </span>
        </button>


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

      </div>

    </header>
  );
}

export default Navbar;