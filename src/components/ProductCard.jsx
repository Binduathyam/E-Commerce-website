function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onViewDetails,
}) {
  return (
    <div
      className="product-card"
      onClick={() => onViewDetails(product)}
    >
      <div className="product-image">
        <img src={product.image} alt={product.name} />

        <button
          className={`wishlist-button ${
            isWishlisted ? "wishlisted" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <h3>{product.name}</h3>

        <div className="product-bottom">
          <strong>
            ₹{product.price.toLocaleString("en-IN")}
          </strong>

          <button
            className="add-button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            + Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;