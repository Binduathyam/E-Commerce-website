function Wishlist({
  wishlist,
  onBack,
  onRemove,
  onAddToCart,
  onCartClick,
}) {
  return (
    <section className="wishlist-page">

      <div className="wishlist-header">

        <button
          className="wishlist-back-button"
          onClick={onBack}
        >
          ←
        </button>

        <div className="wishlist-title">
          <h1>My Wishlist</h1>
          <span>{wishlist.length} items</span>
        </div>

        <button
          className="wishlist-cart-button"
          onClick={onCartClick}
          title="Cart"
        >
          🛒
        </button>

      </div>

      {wishlist.length === 0 ? (

        <div className="empty-wishlist">

          <div className="empty-wishlist-icon">
            ♡
          </div>

          <h2>Your Wishlist is Empty</h2>

          <p>
            Save the products you love
            and find them here later.
          </p>

          <button
            className="continue-wishlist-button"
            onClick={onBack}
          >
            Continue Shopping
          </button>

        </div>

      ) : (

        <div className="wishlist-items">

          {wishlist.map((product) => (

            <div
              className="wishlist-product-card"
              key={product.id}
            >

              <div className="wishlist-product-image">

                <img
                  src={product.image}
                  alt={product.name}
                />

                <button
                  className="wishlist-remove-button"
                  onClick={() =>
                    onRemove(product.id)
                  }
                  title="Remove"
                >
                  ×
                </button>

              </div>

              <div className="wishlist-product-info">

                <p className="wishlist-category">
                  {product.category}
                </p>

                <h2>
                  {product.name}
                </h2>

                <p className="wishlist-price">
                  ₹
                  {product.price.toLocaleString("en-IN")}
                </p>

                <button
                  className="wishlist-add-cart"
                  onClick={() =>
                    onAddToCart(product)
                  }
                >
                  MOVE TO CART
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}

export default Wishlist;