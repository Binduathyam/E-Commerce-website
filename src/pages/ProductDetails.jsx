import React, { useEffect, useMemo, useState } from "react";

import { API_BASE_URL } from "../api";

// =========================================
// HELPERS
// =========================================

const parseVariantAttributes = (attributes) => {
  if (!attributes) {
    return {};
  }

  if (typeof attributes === "object") {
    return attributes;
  }

  try {
    return JSON.parse(attributes);
  } catch (error) {
    console.error("Variant attributes JSON error:", error);
    return {};
  }
};

// Order used for the variant button name (mobiles / laptops)
// e.g. "Ocean Blue / 8GB / 128GB"
const LABEL_ORDER = ["color", "ram", "storage", "processor"];

// Name shown on the option button.
// - clothes: the size (M, L, XL)
// - mobiles etc.: all attribute values joined (Ocean Blue / 8GB / 128GB)
// - nothing available: variant name, or Onesize / Option N
const getVariantLabel = (variant, index = 0, total = 1) => {
  const attributes = parseVariantAttributes(variant?.attributes);

  if (attributes.size) {
    return String(attributes.size);
  }

  const keys = Object.keys(attributes);

  const orderedKeys = [
    ...LABEL_ORDER.filter((key) => keys.includes(key)),
    ...keys.filter((key) => !LABEL_ORDER.includes(key)),
  ];

  const values = orderedKeys
    .map((key) => String(attributes[key] ?? "").trim())
    .filter(Boolean);

  if (values.length > 0) {
    return values.join(" / ");
  }

  const name = variant?.variant_name || variant?.name || variant?.sku;

  if (name) {
    return String(name);
  }

  return total === 1 ? "Onesize" : `Option ${index + 1}`;
};

// ---------- IMAGE HELPERS ----------

const resolveImageUrl = (url) => {
  if (!url || typeof url !== "string") {
    return "";
  }

  const clean = url.trim();

  if (!clean) {
    return "";
  }

  if (/^(https?:|blob:|data:)/i.test(clean)) {
    return clean;
  }

  return clean.startsWith("/")
    ? `${API_BASE_URL}${clean}`
    : `${API_BASE_URL}/${clean}`;
};

const normalizeImageValue = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "object") {
    return (
      value.url ||
      value.image ||
      value.image_url ||
      value.imageUrl ||
      value.path ||
      value.src ||
      null
    );
  }

  return String(value).trim();
};

// Images saved inside ONE variant (Smartphone / Laptop)
const getVariantImages = (variant) => {
  if (!variant) {
    return [];
  }

  let raw = variant.images ?? variant.variant_images ?? variant.image_urls;

  if (typeof raw === "string") {
    const text = raw.trim();

    if (!text) {
      raw = [];
    } else {
      try {
        const parsed = JSON.parse(text);
        raw = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        raw = text.includes(",") ? text.split(",") : [text];
      }
    }
  }

  if (!Array.isArray(raw)) {
    raw = [];
  }

  if (raw.length === 0 && variant.image) {
    raw = [variant.image];
  }

  const images = raw
    .map(normalizeImageValue)
    .filter(Boolean)
    .map(resolveImageUrl)
    .filter(Boolean);

  return [...new Set(images)].slice(0, 6);
};

function ProductDetails({
  product,
  products,
  onBack,
  onAddToCart,
  onBuyNow,
  onProductSelect,
  onToggleWishlist,
  isWishlisted = false,
}) {
  // =========================================
  // STATES
  // =========================================

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [adminRating, setAdminRating] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  // selected option (size / variant label)
  const [selectedSize, setSelectedSize] = useState(null);

  // =========================================
  // PRODUCT IMAGES (main product images)
  // =========================================

  const productImages = useMemo(() => {
    if (!product) {
      return [];
    }

    let images = [];

    if (Array.isArray(product.product_images)) {
      images = product.product_images
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item?.image_url || item?.image || item?.url || null;
        })
        .filter(Boolean);
    }

    if (product.image && !images.includes(product.image)) {
      images.unshift(product.image);
    }

    return images.slice(0, 6);
  }, [product]);

  // =========================================
  // VARIANTS
  // =========================================

  const productVariants = useMemo(() => {
    return Array.isArray(product?.product_variants)
      ? product.product_variants
      : [];
  }, [product]);

  // helps to check what the backend sends for variants
  useEffect(() => {
    console.log("PRODUCT VARIANTS:", productVariants);
  }, [productVariants]);

  const findVariantByLabel = (label) =>
    productVariants.find(
      (variant, index) =>
        getVariantLabel(variant, index, productVariants.length) ===
        String(label)
    );

  // FIRST AVAILABLE OPTION AUTO SELECT
  useEffect(() => {
    if (!productVariants.length) {
      setSelectedSize(null);
      return;
    }

    const firstAvailableIndex = productVariants.findIndex(
      (variant) => Number(variant.stock || 0) > 0
    );

    if (firstAvailableIndex >= 0) {
      setSelectedSize(
        getVariantLabel(
          productVariants[firstAvailableIndex],
          firstAvailableIndex,
          productVariants.length
        )
      );
    } else {
      setSelectedSize(null);
    }
  }, [product?.id, productVariants]);

  // =========================================
  // GALLERY IMAGES
  // selected variant images, or main product images
  // =========================================

  const galleryImages = useMemo(() => {
    if (!product) {
      return [];
    }

    if (selectedSize) {
      const variantIndex = productVariants.findIndex(
        (variant, index) =>
          getVariantLabel(variant, index, productVariants.length) ===
          String(selectedSize)
      );

      if (variantIndex >= 0) {
        const variantImages = getVariantImages(productVariants[variantIndex]);

        if (variantImages.length > 0) {
          return variantImages;
        }
      }
    }

    return productImages;
  }, [product, productVariants, selectedSize, productImages]);

  // first image is shown whenever the gallery changes
  useEffect(() => {
    setSelectedImage(galleryImages.length > 0 ? galleryImages[0] : null);
  }, [galleryImages]);

  // =========================================
  // FETCH REVIEWS
  // =========================================

  useEffect(() => {
    if (!product?.id) {
      return;
    }

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/reviews/product/${product.id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load product reviews");
        }

        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        setAverageRating(Number(data.averageRating || 0));
        setTotalReviews(Number(data.totalReviews || 0));

        setAdminRating(
          data.adminRating !== null && data.adminRating !== undefined
            ? Number(data.adminRating)
            : null
        );
      } catch (error) {
        console.error("Product review error:", error);

        setReviews([]);
        setAverageRating(0);
        setTotalReviews(0);
        setAdminRating(null);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product?.id]);

  // =========================================
  // RELATED PRODUCTS
  // (kept ABOVE the early return so hooks always run in the same order)
  // =========================================

  const relatedProducts = useMemo(() => {
    if (!product || !Array.isArray(products)) {
      return [];
    }

    const currentProductId = String(product.id);

    const sameField = (field) =>
      products.filter((item) => {
        if (!item || String(item.id) === currentProductId) {
          return false;
        }

        if (!product[field] || !item[field]) {
          return false;
        }

        return (
          String(item[field]).trim().toLowerCase() ===
          String(product[field]).trim().toLowerCase()
        );
      });

    const combined = [...sameField("brand"), ...sameField("category")];

    const uniqueProducts = [];
    const seenIds = new Set();

    combined.forEach((item) => {
      const id = String(item.id);

      if (!seenIds.has(id)) {
        seenIds.add(id);
        uniqueProducts.push(item);
      }
    });

    return uniqueProducts.slice(0, 8);
  }, [product, products]);

  // =========================================
  // PRODUCT NOT FOUND
  // =========================================

  if (!product) {
    return (
      <div className="product-details-empty">
        <h2>Product not found</h2>

        <button type="button" onClick={onBack}>
          Go Back
        </button>
      </div>
    );
  }

  // =========================================
  // FORMAT KEY
  // =========================================

  const formatDisplayKey = (key) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
  };

  // =========================================
  // OPTIONS (sizes / variants)
  // =========================================

  const availableSizes = [];

  productVariants.forEach((variant, index) => {
    const label = getVariantLabel(variant, index, productVariants.length);

    if (!availableSizes.includes(label)) {
      availableSizes.push(label);
    }
  });

  // clothes have a size, mobiles etc. have other attributes
  const hasSizeAttribute = productVariants.some(
    (variant) => parseVariantAttributes(variant.attributes).size
  );

  const optionHeading = hasSizeAttribute ? "Select Size" : "Select Variant";

  // =========================================
  // PRICE
  // =========================================

  const variantPrices = productVariants
    .map((variant) => Number(variant.discount_price ?? variant.price ?? 0))
    .filter((value) => value > 0);

  const defaultPrice =
    variantPrices.length > 0
      ? Math.min(...variantPrices)
      : Number(product.price) || 0;

  const variantOriginalPrices = productVariants
    .map((variant) => Number(variant.price) || 0)
    .filter((value) => value > 0);

  const defaultOriginalPrice =
    variantOriginalPrices.length > 0
      ? Math.min(...variantOriginalPrices)
      : Number(
          product.original_price ||
            product.originalPrice ||
            product.mrp ||
            product.old_price ||
            0
        );

  // =========================================
  // SELECTED VARIANT
  // =========================================

  const selectedVariant = selectedSize ? findVariantByLabel(selectedSize) : null;

  const price = selectedVariant
    ? Number(
        selectedVariant.discount_price ?? selectedVariant.price ?? defaultPrice
      )
    : defaultPrice;

  const originalPrice = selectedVariant
    ? Number(selectedVariant.price || defaultOriginalPrice)
    : defaultOriginalPrice;

  const discountPercentage =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : Number(
          product.discount_percentage ||
            product.discountPercentage ||
            product.discount ||
            0
        );

  // =========================================
  // STOCK
  // =========================================

  const totalAvailableStock =
    productVariants.length > 0
      ? productVariants.reduce(
          (total, variant) => total + Number(variant.stock || 0),
          0
        )
      : Number(product.stock || 0);

  const selectedStock = selectedVariant
    ? Number(selectedVariant.stock || 0)
    : totalAvailableStock;

  // =========================================
  // DYNAMIC PRODUCT DETAILS
  // =========================================

  let dynamicDetails = {};

  if (product.product_details) {
    if (typeof product.product_details === "object") {
      dynamicDetails = product.product_details;
    } else {
      try {
        dynamicDetails = JSON.parse(product.product_details);
      } catch (error) {
        console.error("Product details JSON error:", error);
        dynamicDetails = {};
      }
    }
  }

  // =========================================
  // RATING
  // =========================================

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;

    return (
      <span className="product-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= numericRating ? "filled-star" : "empty-star"}
          >
            ★
          </span>
        ))}
      </span>
    );
  };

  const displayRating = totalReviews > 0 ? averageRating : adminRating;

  // =========================================
  // RELATED PRODUCT IMAGE
  // =========================================

  const getRelatedProductImage = (relatedProduct) => {
    if (
      Array.isArray(relatedProduct.product_images) &&
      relatedProduct.product_images.length > 0
    ) {
      const firstImage = relatedProduct.product_images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      return firstImage?.image_url || firstImage?.image || firstImage?.url || null;
    }

    return relatedProduct.image || null;
  };

  // =========================================
  // CART PRODUCT
  // =========================================

  const createCartProduct = () => {
    const cartProduct = {
      ...product,

      price: Number(price),
      original_price: Number(originalPrice),

      gst_rate: Number(product.gst_rate ?? product.gstRate ?? 0),

      // selected size / variant name
      selected_size: selectedSize,

      variant_id: selectedVariant ? Number(selectedVariant.id) : null,
      variantId: selectedVariant ? Number(selectedVariant.id) : null,

      stock: Number(selectedStock),

      selectedVariant: selectedVariant || null,

      quantity: 1,
    };

    console.log("PRODUCT DETAILS → CART PRODUCT:", cartProduct);

    return cartProduct;
  };

  const canAddToCart =
    totalAvailableStock > 0 &&
    !(
      productVariants.length > 0 &&
      availableSizes.length > 0 &&
      !selectedSize
    ) &&
    !(selectedVariant && selectedStock <= 0);

  const canBuyNow = canAddToCart;

  // =========================================
  // HANDLERS
  // =========================================

  const handleAddToCart = () => {
    if (!canAddToCart) {
      return;
    }

    const cartProduct = createCartProduct();

    if (onAddToCart) {
      onAddToCart(cartProduct);
    } else {
      console.error("onAddToCart is not connected in App.jsx");
    }
  };

  const handleBuyNow = () => {
    if (!canBuyNow) {
      return;
    }

    const buyNowProduct = createCartProduct();

    console.log("BUY NOW PRODUCT:", buyNowProduct);

    if (onBuyNow) {
      onBuyNow(buyNowProduct);
    } else {
      console.error("onBuyNow is not connected in App.jsx");
    }
  };

  // WISHLIST (heart)
  const handleWishlist = () => {
    if (onToggleWishlist) {
      onToggleWishlist(product);
    } else {
      console.error("onToggleWishlist is not connected in App.jsx");
    }
  };

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <section className="product-details">
      {/* BACK */}

      <div className="product-details-back">
        
      </div>

      {/* MAIN PRODUCT AREA */}

      <div className="product-details-content">
        {/* IMAGE SECTION */}

        <div className="details-image-gallery">
          {galleryImages.length > 1 && (
            <div className="product-image-thumbnails">
              {galleryImages.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={
                    selectedImage === image
                      ? "product-thumbnail active-thumbnail"
                      : "product-thumbnail"
                  }
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${product.name || "Product"} ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}

          <div className="details-image">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name || "Product"} />
            ) : (
              <div className="no-product-image">No Image Available</div>
            )}

            {/* WISHLIST HEART */}

            <button
              type="button"
              className={
                isWishlisted
                  ? "details-wishlist-button wishlisted"
                  : "details-wishlist-button"
              }
              onClick={handleWishlist}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              {isWishlisted ? "♥" : "♡"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="details-info">
          <p className="product-category">{product.category || "Product"}</p>

          <h1>{product.name}</h1>

          {/* RATING */}

          <div className="product-rating-area">
            {displayRating ? (
              <>
                <div className="flip-rating-badge">
                  <span>{Number(displayRating).toFixed(1)}</span>
                  <span>★</span>
                </div>

                <span className="rating-count">
                  {totalReviews > 0
                    ? `${totalReviews} ${
                        totalReviews === 1 ? "Review" : "Reviews"
                      }`
                    : "Seller Rated"}
                </span>
              </>
            ) : (
              <span className="rating-count">No reviews yet</span>
            )}
          </div>

          {/* PRICE */}

          <div className="price-details">
            <div className="price-label">Special Price</div>

            <div className="price-row">
              <h2>₹{price.toLocaleString("en-IN")}</h2>

              {originalPrice > price && (
                <span className="original-price">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}

              {discountPercentage > 0 && (
                <span className="discount-badge">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            <span className="tax-text">Inclusive of all taxes</span>
          </div>

          {/* SIZE / VARIANT */}

          <div className="size-section">
            <div className="size-heading-row">
              <h3>{optionHeading}</h3>

              {hasSizeAttribute && <span>Size Guide</span>}
            </div>

            {availableSizes.length > 0 ? (
              <div className="available-size-options">
                {availableSizes.map((size) => {
                  const variant = findVariantByLabel(size);

                  const outOfStock = !variant || Number(variant.stock) <= 0;

                  return (
                    <button
                      type="button"
                      key={size}
                      disabled={outOfStock}
                      onClick={() => {
                        if (!outOfStock) {
                          setSelectedSize(size);
                        }
                      }}
                      className={
                        outOfStock
                          ? "size-option size-disabled"
                          : selectedSize === size
                          ? "size-option active-size"
                          : "size-option"
                      }
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            ) : (
              <button type="button" className="size-option active-size">
                Onesize
              </button>
            )}

            {selectedVariant && (
              <div className="selected-variant-stock">
                ✓ {selectedStock} items available
              </div>
            )}

            {!selectedVariant && productVariants.length > 0 && (
              <div className="total-stock-info">
                ✓ {totalAvailableStock} items available
              </div>
            )}
          </div>

          {/* OFFERS */}

          <div className="product-offers-box">
            <h3>Available Offers</h3>

            <div className="offer-row">
              <span>✓</span>
              <p>Special price available</p>
            </div>

            <div className="offer-row">
              <span>✓</span>
              <p>100% Original Product</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}

          <div className="details-actions">
            <button
              type="button"
              className="details-cart-button"
              disabled={!canAddToCart}
              onClick={handleAddToCart}
            >
              🛒 ADD TO CART
            </button>

            <button
              type="button"
              className="details-buy-button"
              disabled={!canBuyNow}
              onClick={handleBuyNow}
            >
              ⚡ BUY NOW
            </button>
          </div>

          {/* DESCRIPTION */}

          <div className="product-description-section">
            <h3>Product Description</h3>

            <p className="details-description">
              {product.description || "No product description available."}
            </p>
          </div>

          {/* ASSURANCE */}

          <div className="product-assurance">
            <div>
              <span>✓</span>
              <strong>100% Original</strong>
            </div>

            <div>
              <span>✓</span>
              <strong>Secure Payment</strong>
            </div>

            <div>
              <span>✓</span>
              <strong>Easy Returns</strong>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER TWO COLUMN INFORMATION */}

      <div className="product-lower-information">
        {/* PRODUCT INFORMATION */}

        <div className="information-section">
          <h2>Product Information</h2>

          <div className="compact-product-info">
            <div className="compact-info-row">
              <span>Size & Fit</span>
              <strong>{product.size_fit || "Not available"}</strong>
            </div>

            <div className="compact-info-row">
              <span>Material & Care</span>
              <strong>{product.material_care || "Not available"}</strong>
            </div>

            <div className="compact-info-row">
              <span>Category</span>
              <strong>{product.category || "—"}</strong>
            </div>

            <div className="compact-info-row">
              <span>Product Type</span>
              <strong>{product.product_type || "—"}</strong>
            </div>

            <div className="compact-info-row">
              <span>Brand</span>
              <strong>{product.brand || "—"}</strong>
            </div>

            <div className="compact-info-row">
              <span>Availability</span>

              <strong
                className={
                  totalAvailableStock > 0
                    ? "availability-in-stock"
                    : "availability-out-stock"
                }
              >
                {totalAvailableStock > 0 ? "In Stock" : "Out of Stock"}
              </strong>
            </div>
          </div>
        </div>

        {/* PRODUCT DETAILS */}

        <div className="information-section">
          <h2>Product Details</h2>

          <div className="compact-product-info">
            {dynamicDetails && Object.keys(dynamicDetails).length > 0 ? (
              Object.entries(dynamicDetails).map(([key, value]) => {
                if (
                  value === null ||
                  value === undefined ||
                  String(value).trim() === ""
                ) {
                  return null;
                }

                return (
                  <div className="compact-info-row" key={key}>
                    <span>{formatDisplayKey(key)}</span>
                    <strong>{String(value)}</strong>
                  </div>
                );
              })
            ) : (
              <div className="no-product-details">
                No additional product details available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}

      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <div className="related-products-header">
            <h2>Related Products</h2>
            <p>Products you may also like</p>
          </div>

          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => {
              const relatedImage = getRelatedProductImage(relatedProduct);

              const relatedVariants = Array.isArray(
                relatedProduct.product_variants
              )
                ? relatedProduct.product_variants
                : [];

              const relatedVariant =
                relatedVariants.find(
                  (variant) => Number(variant.stock || 0) > 0
                ) ||
                relatedVariants[0] ||
                null;

              const relatedPrice = relatedVariant
                ? Number(
                    relatedVariant.discount_price ??
                      relatedVariant.price ??
                      relatedProduct.discount_price ??
                      relatedProduct.price ??
                      0
                  )
                : Number(
                    relatedProduct.discount_price ??
                      relatedProduct.price ??
                      relatedProduct.discountPrice ??
                      0
                  );

              const relatedOriginalPrice = relatedVariant
                ? Number(
                    relatedVariant.price ??
                      relatedProduct.original_price ??
                      relatedProduct.originalPrice ??
                      relatedProduct.mrp ??
                      relatedProduct.old_price ??
                      0
                  )
                : Number(
                    relatedProduct.original_price ??
                      relatedProduct.originalPrice ??
                      relatedProduct.mrp ??
                      relatedProduct.old_price ??
                      0
                  );

              return (
                <div
                  className="related-product-card"
                  key={relatedProduct.id}
                  onClick={() => {
                    if (onProductSelect) {
                      onProductSelect(relatedProduct);
                    }
                  }}
                >
                  <div className="related-product-image">
                    {relatedImage ? (
                      <img
                        src={relatedImage}
                        alt={relatedProduct.name || "Related Product"}
                      />
                    ) : (
                      <div className="related-no-image">No Image</div>
                    )}
                  </div>

                  <div className="related-product-info">
                    <div className="related-product-category">
                      {relatedProduct.category || "Product"}
                    </div>

                    <h3>{relatedProduct.name || "Product"}</h3>

                    {relatedProduct.brand && (
                      <p className="related-product-brand">
                        {relatedProduct.brand}
                      </p>
                    )}

                    <div className="related-product-price">
                      <strong>₹{relatedPrice.toLocaleString("en-IN")}</strong>

                      {relatedOriginalPrice > relatedPrice && (
                        <span>
                          ₹{relatedOriginalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REVIEWS */}

      <div className="information-section product-reviews-section">
        <div className="reviews-header">
          <div>
            <h2>Ratings & Reviews</h2>

            {totalReviews > 0 && (
              <p>
                {Number(averageRating).toFixed(1)} out of 5 · {totalReviews}{" "}
                {totalReviews === 1 ? "Review" : "Reviews"}
              </p>
            )}
          </div>
        </div>

        {reviewsLoading && (
          <div className="reviews-loading">Loading customer reviews...</div>
        )}

        {!reviewsLoading && reviews.length === 0 && (
          <div className="no-product-reviews">
            <div className="no-review-icon">💬</div>

            <h3>No customer reviews yet</h3>

            <p>Be the first customer to review this product.</p>
          </div>
        )}

        {!reviewsLoading && reviews.length > 0 && (
          <div className="product-review-list">
            {reviews.map((review) => (
              <div className="product-review-card" key={review.id}>
                <div className="product-review-top">
                  <div className="review-customer-info">
                    <strong>{review.customer_name || "Customer"}</strong>
                    <small>✓ Verified Purchase</small>
                  </div>

                  {renderStars(review.rating)}
                </div>

                <p className="review-feedback">{review.feedback}</p>

                <small className="product-review-date">
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString("en-IN")
                    : "-"}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDetails;