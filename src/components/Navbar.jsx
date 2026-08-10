function Navbar({
  search,
  setSearch,
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick,
}) {
  return (
    <header className="navbar">
      <div className="logo">
        Shop<span>Ease</span>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          type="button"
          className="search-button"
        >
          🔍
        </button>
      </div>

      <div className="nav-actions">
        {/* Wishlist */}
        <button
          type="button"
          className="nav-action-button"
          onClick={onWishlistClick}
        >
          <span className="nav-icon">♡</span>

          <span>Wishlist</span>

          {wishlistCount > 0 && (
            <span className="nav-count">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Cart */}
        <button
          type="button"
          className="nav-action-button"
          onClick={onCartClick}
        >
          <span className="nav-icon">🛒</span>

          <span>Cart</span>

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