import { useState } from "react";

function Cart({
  cart,
  onBack,
  onRemove,
  onUpdateQuantity,
  onWishlistClick,
  onCheckout,
}) {
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] =
    useState(false);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  const deliveryFee =
    subtotal >= 999 ? 0 : 40;

  const platformFee =
    subtotal > 0 ? 10 : 0;

  const couponDiscount =
    couponApplied ? 100 : 0;

  const savings =
    couponDiscount +
    (subtotal >= 999 ? 40 : 0);

  const amountPayable = Math.max(
    0,
    subtotal +
      deliveryFee +
      platformFee -
      couponDiscount
  );

  const applyCoupon = () => {
    if (coupon.trim() !== "") {
      setCouponApplied(true);
    }
  };

  /* =========================
     EMPTY CART
  ========================= */

  if (cart.length === 0) {
    return (
      <section className="cart-page">

        <div className="cart-header">

          <button
            type="button"
            className="cart-back-button"
            onClick={onBack}
            title="Back"
          >
            ←
          </button>

          <h1>Cart</h1>

          <button
            type="button"
            className="cart-heart"
            onClick={onWishlistClick}
            title="Wishlist"
          >
            ♡
          </button>

        </div>

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add products to your cart
            and they will appear here.
          </p>

          <button
            type="button"
            className="continue-shopping-button"
            onClick={onBack}
          >
            Continue Shopping
          </button>

        </div>

      </section>
    );
  }

  /* =========================
     CART PAGE
  ========================= */

  return (
    <section className="cart-page">

      {/* HEADER */}

      <div className="cart-header">

        <button
          type="button"
          className="cart-back-button"
          onClick={onBack}
          title="Back"
        >
          ←
        </button>

        <h1>Cart</h1>

        <button
          type="button"
          className="cart-heart"
          onClick={onWishlistClick}
          title="Wishlist"
        >
          ♡
        </button>

      </div>

      {/* CART PRODUCTS */}

      <div className="cart-items-container">

        {cart.map((item) => (

          <div
            className="cart-product-card"
            key={item.id}
          >

            {/* IMAGE */}

            <div className="cart-product-image">

              <img
                src={item.image}
                alt={item.name}
              />

            </div>

            {/* PRODUCT DETAILS */}

            <div className="cart-product-info">

              <p className="cart-category">
                {item.category}
              </p>

              <h2>
                {item.name}
              </h2>

              <p className="cart-price">
                ₹
                {Number(item.price).toLocaleString(
                  "en-IN"
                )}
              </p>

              {/* QUANTITY */}

              <div className="cart-quantity">

                <button
                  type="button"
                  onClick={() =>
                    onUpdateQuantity(
                      item.id,
                      -1
                    )
                  }
                >
                  −
                </button>

                <span>
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateQuantity(
                      item.id,
                      1
                    )
                  }
                >
                  +
                </button>

              </div>

            </div>

            {/* PRICE + REMOVE */}

            <div className="cart-product-actions">

              <strong>
                ₹
                {(
                  Number(item.price) *
                  item.quantity
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

              <button
                type="button"
                className="remove-cart-button"
                onClick={() =>
                  onRemove(item.id)
                }
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* COUPON */}

      <div className="coupon-section">

        <div className="coupon-icon">
          %
        </div>

        <div className="coupon-content">

          <h3>
            Apply Coupon
          </h3>

          <p>
            Save more with available
            coupons
          </p>

        </div>

        <div className="coupon-action">

          <input
            type="text"
            placeholder="Enter coupon"
            value={coupon}
            onChange={(e) =>
              setCoupon(e.target.value)
            }
          />

          <button
            type="button"
            onClick={applyCoupon}
          >
            {couponApplied
              ? "Applied"
              : "Apply"}
          </button>

        </div>

      </div>

      {/* ORDER DETAILS */}

      <div className="order-details">

        <h2>
          Order Details
        </h2>

        <div className="order-row">

          <span>
            Total ({totalItems} items)
          </span>

          <strong>
            ₹
            {subtotal.toLocaleString(
              "en-IN"
            )}
          </strong>

        </div>

        <div className="order-row saving-row">

          <span>
            Savings
          </span>

          <strong>
            ₹
            {savings.toLocaleString(
              "en-IN"
            )}
          </strong>

        </div>

        <div className="order-row">

          <span>
            Coupon Savings
          </span>

          <strong className="green-text">
            ₹
            {couponDiscount.toLocaleString(
              "en-IN"
            )}
          </strong>

        </div>

        <div className="order-row">

          <span>
            Delivery Fee
          </span>

          <strong className="green-text">
            {deliveryFee === 0
              ? "FREE"
              : `₹${deliveryFee}`}
          </strong>

        </div>

        <div className="order-row">

          <span>
            Platform Fee
          </span>

          <strong>
            ₹{platformFee}
          </strong>

        </div>

        <div className="order-divider"></div>

        <div className="amount-payable">

          <span>
            Amount Payable
          </span>

          <strong>
            ₹
            {amountPayable.toLocaleString(
              "en-IN"
            )}
          </strong>

        </div>

        {/* RETURN POLICY */}

        <div className="return-policy">

          <strong>
            Return Policy / Refund
          </strong>

          <button type="button">
            Read more
          </button>

        </div>

      </div>

      {/* BOTTOM PAY BAR */}

      <div className="cart-pay-bar">

        <div className="pay-total">

          <span>
            Total Amount
          </span>

          <strong>
            ₹
            {amountPayable.toLocaleString(
              "en-IN"
            )}
          </strong>

        </div>

        <button
          type="button"
          className="pay-now-button"
          onClick={onCheckout}
        >
          Pay Now →
        </button>

      </div>

    </section>
  );
}

export default Cart;