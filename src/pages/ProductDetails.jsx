function ProductDetails({ product, onBack, onAddToCart }) {
  if (!product) {
    return (
      <div className="product-details-empty">
        <h2>Product not found</h2>
        <button onClick={onBack}>Go Back</button>
      </div>
    );
  }

  return (
    <section className="product-details">
      <button className="back-button" onClick={onBack}>
        ← Back to Products
      </button>

      <div className="product-details-content">
        <div className="details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-info">
          <p className="product-category">{product.category}</p>

          <h1>{product.name}</h1>

          <div className="rating">
            ⭐⭐⭐⭐⭐ <span>4.8 (120 reviews)</span>
          </div>

          <h2>₹{product.price.toLocaleString("en-IN")}</h2>

          <p className="details-description">
            Experience quality and convenience with this product.
            Designed to provide excellent value, reliability and
            everyday usability.
          </p>

          <div className="details-actions">
            <button
              className="details-cart-button"
              onClick={() => onAddToCart(product)}
            >
              🛒 Add to Cart
            </button>

            <button className="details-wishlist-button">
              ♡ Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;