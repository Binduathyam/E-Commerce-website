import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./MerchantProducts.css";

function MerchantProducts({
  merchant,
  onBack,
  onAddProduct,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [editingProduct, setEditingProduct] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const token = localStorage.getItem("merchant_token");

  /* =====================================================
     CONSTANTS
  ===================================================== */

  const MAX_IMAGES = 6;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  /* =====================================================
     IMAGE URL HELPER
  ===================================================== */

  const resolveImageUrl = (url) => {
    if (!url) {
      return "";
    }

    if (typeof url !== "string") {
      return "";
    }

    const cleanUrl = url.trim();

    if (!cleanUrl) {
      return "";
    }

    /*
      Already complete URL
    */

    if (
      cleanUrl.startsWith("http://") ||
      cleanUrl.startsWith("https://") ||
      cleanUrl.startsWith("blob:") ||
      cleanUrl.startsWith("data:")
    ) {
      return cleanUrl;
    }

    /*
      If backend returns /uploads/...
      convert it to:
      http://backend-url/uploads/...
    */

    if (cleanUrl.startsWith("/")) {
      return `${API_BASE_URL}${cleanUrl}`;
    }

    /*
      If backend returns uploads/...
    */

    return `${API_BASE_URL}/${cleanUrl}`;
  };

  /* =====================================================
     NORMALIZE IMAGE VALUE
  ===================================================== */

  const normalizeImageValue = (value) => {
    if (!value) {
      return null;
    }

    /*
      If image is object
      Example:
      { url: "..." }
      { image: "..." }
      { image_url: "..." }
    */

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

  /* =====================================================
     GET ALL PRODUCT IMAGES
  ===================================================== */

  const getProductImages = (product) => {
    let images = [];

    /*
      product_images as array
    */

    if (Array.isArray(product.product_images)) {
      images = product.product_images;
    }

    /*
      product_images as JSON string
    */

    else if (
      typeof product.product_images === "string" &&
      product.product_images.trim()
    ) {
      const raw = product.product_images.trim();

      try {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          images = parsed;
        } else if (parsed) {
          images = [parsed];
        }
      } catch {
        /*
          Sometimes DB contains:
          image1,image2,image3
        */

        if (raw.includes(",")) {
          images = raw
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        } else {
          images = [raw];
        }
      }
    }

    /*
      Some APIs may return images
    */

    if (
      images.length === 0 &&
      Array.isArray(product.images)
    ) {
      images = product.images;
    }

    /*
      Some APIs return images as string
    */

    if (
      images.length === 0 &&
      typeof product.images === "string" &&
      product.images.trim()
    ) {
      try {
        const parsed = JSON.parse(product.images);

        if (Array.isArray(parsed)) {
          images = parsed;
        } else {
          images = [parsed];
        }
      } catch {
        images = [product.images];
      }
    }

    /*
      Main image fallback
    */

    if (images.length === 0) {
      const mainImage =
        product.image ||
        product.image_url ||
        product.imageUrl ||
        product.thumbnail ||
        product.thumbnail_url;

      if (mainImage) {
        images = [mainImage];
      }
    }

    /*
      Normalize objects + URLs
    */

    const normalizedImages = images
      .map((image) => normalizeImageValue(image))
      .filter(Boolean)
      .map((image) => resolveImageUrl(image))
      .filter(Boolean);

    /*
      Remove duplicates
    */

    return [...new Set(normalizedImages)];
  };

  /* =====================================================
     GET PRIMARY PRODUCT IMAGE
  ===================================================== */

  const getProductImage = (product) => {
    const images = getProductImages(product);

    if (images.length > 0) {
      return images[0];
    }

    return "https://via.placeholder.com/500x500?text=No+Image";
  };

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      if (!merchant?.id) {
        setError("Merchant information not found.");
        return;
      }

      if (!token) {
        setError("Authentication token is missing.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/products/merchant/${merchant.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": String(merchant.id),
          },
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        console.error(
          "Products API returned non-JSON:",
          text
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to load products (${response.status})`
        );
      }

      const productList =
        data.products ||
        data.data ||
        [];

      setProducts(
        Array.isArray(productList)
          ? productList
          : []
      );
    } catch (err) {
      console.error(
        "Fetch products error:",
        err
      );

      setError(
        err.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [merchant?.id]);

  /* =====================================================
     GET PRODUCT VARIANTS
  ===================================================== */

  const getProductVariants = (product) => {
    let variants =
      product.product_variants;

    /*
      Already array
    */

    if (Array.isArray(variants)) {
      return variants;
    }

    /*
      JSON string
    */

    if (
      typeof variants === "string" &&
      variants.trim()
    ) {
      try {
        const parsed = JSON.parse(variants);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (err) {
        console.error(
          "Unable to parse product variants:",
          err
        );
      }
    }

    return [];
  };

  /* =====================================================
     GET VARIANT SELLING PRICE
  ===================================================== */

  const getVariantSellingPrice = (variant) => {
    const discountPrice =
      Number(variant.discount_price);

    const discountPriceCamel =
      Number(variant.discountPrice);

    const variantPrice =
      Number(variant.price);

    /*
      Discount price should be shown
      when available and greater than 0.
    */

    if (
      Number.isFinite(discountPrice) &&
      discountPrice > 0
    ) {
      return discountPrice;
    }

    if (
      Number.isFinite(discountPriceCamel) &&
      discountPriceCamel > 0
    ) {
      return discountPriceCamel;
    }

    if (
      Number.isFinite(variantPrice) &&
      variantPrice > 0
    ) {
      return variantPrice;
    }

    return 0;
  };

  /* =====================================================
     GET PRODUCT PRICE
  ===================================================== */

  const getProductPrice = (product) => {
    const variants =
      getProductVariants(product);

    /*
      IMPORTANT:
      If product price is 0,
      check variant prices.
    */

    const variantPrices = variants
      .map((variant) =>
        getVariantSellingPrice(variant)
      )
      .filter(
        (price) =>
          Number.isFinite(price) &&
          price > 0
      );

    if (variantPrices.length > 0) {
      /*
        Lowest selling price is shown
        when multiple variants exist.
      */

      return Math.min(...variantPrices);
    }

    /*
      Product-level fallback
    */

    const productPrice =
      Number(product.price);

    if (
      Number.isFinite(productPrice) &&
      productPrice > 0
    ) {
      return productPrice;
    }

    return 0;
  };

  /* =====================================================
     GET ORIGINAL PRICE
  ===================================================== */

  const getOriginalPrice = (product) => {
    const variants =
      getProductVariants(product);

    const originalPrices = variants
      .map((variant) => {
        const original =
          Number(variant.price);

        const discount =
          Number(
            variant.discount_price
          );

        const discountCamel =
          Number(
            variant.discountPrice
          );

        const finalDiscount =
          discount > 0
            ? discount
            : discountCamel > 0
            ? discountCamel
            : 0;

        /*
          If variant price is original
          and discount price is lower,
          show variant price.
        */

        if (
          original > 0 &&
          finalDiscount > 0 &&
          original > finalDiscount
        ) {
          return original;
        }

        return 0;
      })
      .filter(
        (price) =>
          Number.isFinite(price) &&
          price > 0
      );

    if (originalPrices.length > 0) {
      /*
        Use the lowest original price
        corresponding to the displayed range.
      */

      return Math.min(...originalPrices);
    }

    const productOriginal =
      Number(
        product.original_price
      );

    if (
      Number.isFinite(productOriginal) &&
      productOriginal > 0
    ) {
      return productOriginal;
    }

    return null;
  };

  /* =====================================================
     GET DISCOUNT
  ===================================================== */

  const getDiscount = (product) => {
    const variants =
      getProductVariants(product);

    /*
      Check variant discount first
    */

    const variantDiscounts =
      variants
        .map((variant) => {
          const original =
            Number(variant.price);

          const discount =
            Number(
              variant.discount_price
            );

          const discountCamel =
            Number(
              variant.discountPrice
            );

          const finalDiscount =
            discount > 0
              ? discount
              : discountCamel > 0
              ? discountCamel
              : 0;

          if (
            original > 0 &&
            finalDiscount > 0 &&
            finalDiscount < original
          ) {
            return Math.round(
              ((original -
                finalDiscount) /
                original) *
                100
            );
          }

          return 0;
        })
        .filter(
          (value) =>
            Number.isFinite(value) &&
            value > 0
        );

    if (
      variantDiscounts.length > 0
    ) {
      /*
        Show highest available
        discount percentage.
      */

      return Math.max(
        ...variantDiscounts
      );
    }

    /*
      Product-level calculation
    */

    const price =
      Number(product.price);

    const originalPrice =
      Number(
        product.original_price
      );

    if (
      originalPrice > 0 &&
      price > 0 &&
      originalPrice > price
    ) {
      return Math.round(
        ((originalPrice - price) /
          originalPrice) *
          100
      );
    }

    /*
      Existing discount column
    */

    const directDiscount =
      Number(product.discount);

    if (
      Number.isFinite(
        directDiscount
      ) &&
      directDiscount > 0
    ) {
      return directDiscount;
    }

    return 0;
  };

  /* =====================================================
     FORMAT PRICE
  ===================================================== */

  const formatPrice = (price) => {
    const numericPrice =
      Number(price);

    if (
      !Number.isFinite(
        numericPrice
      )
    ) {
      return "₹0";
    }

    return `₹${numericPrice.toLocaleString(
      "en-IN"
    )}`;
  };

  /* =====================================================
     GET STOCK
  ===================================================== */

  const getStock = (product) => {
    const variants =
      getProductVariants(product);

    /*
      IMPORTANT:
      If product stock is 0,
      calculate from variants.
    */

    if (variants.length > 0) {
      const variantStock =
        variants.reduce(
          (total, variant) => {
            const stock =
              Number(
                variant.stock
              );

            if (
              Number.isFinite(stock) &&
              stock > 0
            ) {
              return total + stock;
            }

            return total;
          },
          0
        );

      return variantStock;
    }

    /*
      Product-level fallback
    */

    const productStock =
      Number(product.stock);

    if (
      Number.isFinite(productStock) &&
      productStock >= 0
    ) {
      return productStock;
    }

    return 0;
  };

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categories = [
    "All",
    ...new Set(
      products
        .map(
          (product) =>
            product.category
        )
        .filter(Boolean)
    ),
  ];

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts =
    products.filter((product) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        String(
          product.name || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          product.brand || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          product.product_type || ""
        )
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  /* =====================================================
   DELETE PRODUCT
===================================================== */

const handleDelete = async (product) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${product.name}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    setError("");

    const productId =
      product.id ||
      product.product_id;

    if (!productId) {
      throw new Error("Product ID not found.");
    }

    if (!merchant?.id) {
      throw new Error("Merchant ID not found.");
    }

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

   const response = await fetch(
  `${API_BASE_URL}/api/products/${productId}`,
  {
    method: "DELETE",

    headers: {
      "Content-Type": "application/json",

      Authorization:
        `Bearer ${token}`,

      "x-user-id":
        String(merchant.id),
    },

    body: JSON.stringify({
      merchant_id: Number(merchant.id),
    }),
  }
);

    const text = await response.text();

    let data = {};

    try {
      data = JSON.parse(text);
    } catch {
      console.error(
        "Delete API returned non-JSON:",
        text
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          `Failed to delete product (${response.status})`
      );
    }

    /*
     * Remove deleted product
     * immediately from UI.
     */
    setProducts((previous) =>
      previous.filter(
        (item) =>
          (item.id ||
            item.product_id) !==
          productId
      )
    );

    alert(
      "Product deleted successfully."
    );

  } catch (err) {
    console.error(
      "Delete product error:",
      err
    );

    setError(
      err.message ||
        "Unable to delete product."
    );
  }
};

  /* =====================================================
     EDIT PRODUCT
  ===================================================== */

  const handleEdit = (
    product
  ) => {
    setEditingProduct(product);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     UPDATE PRODUCT
  ===================================================== */

  const handleUpdateProduct =
    async (updatedData) => {
      try {
        setEditLoading(true);
        setError("");

        const productId =
          editingProduct.id ||
          editingProduct.product_id;

        if (!productId) {
          throw new Error(
            "Product ID not found."
          );
        }

        const response =
          await fetch(
            `${API_BASE_URL}/api/products/${productId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

                "x-user-id":
                  String(
                    merchant.id
                  ),
              },

              body: JSON.stringify(
                updatedData
              ),
            }
          );

        const text =
          await response.text();

        let data = {};

        try {
          data =
            JSON.parse(text);
        } catch {
          console.error(
            "Update API returned non-JSON:",
            text
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Failed to update product (${response.status})`
          );
        }

        const updatedProduct =
          data.product ||
          data.data ||
          data;

        setProducts(
          (previous) =>
            previous.map(
              (item) =>
                (item.id ||
                  item.product_id) ===
                productId
                  ? {
                      ...item,
                      ...updatedProduct,
                    }
                  : item
            )
        );

        setEditingProduct(null);

        alert(
          "Product updated successfully."
        );
      } catch (err) {
        console.error(
          "Update product error:",
          err
        );

        setError(
          err.message ||
            "Unable to update product."
        );
      } finally {
        setEditLoading(false);
      }
    };

  /* =====================================================
     SHOW EDIT PAGE
  ===================================================== */

  if (editingProduct) {
    return (
      <EditProductForm
        product={
          editingProduct
        }
        loading={
          editLoading
        }
        merchant={
          merchant
        }
        token={
          token
        }
        onCancel={() =>
          setEditingProduct(
            null
          )
        }
        onUpdate={
          handleUpdateProduct
        }
      />
    );
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="merchant-products-page">
        <div className="merchant-products-loading">
          <div className="merchant-products-spinner" />

          <p>
            Loading your products...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="merchant-products-page">

      {/* HEADER */}

      <div className="merchant-products-header">

        <div className="merchant-products-title-area">

          <button
            type="button"
            className="merchant-products-back"
            onClick={onBack}
          >
            ←
          </button>

          <div>

            <div className="merchant-products-label">
              MERCHANT
            </div>

            <h1>
              My Products
            </h1>

            <p>
              Manage products in your store
            </p>

          </div>

        </div>

        <button
          type="button"
          className="merchant-add-product-top-button"
          onClick={onAddProduct}
        >
          + Add Product
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="merchant-products-error">
          {error}
        </div>
      )}

      {/* STORE SUMMARY */}

      <div className="merchant-products-summary">

        <div>

          <h3>
            {merchant?.store_name ||
              merchant?.business_name ||
              merchant?.name ||
              "Your Store"}
          </h3>

          <p>
            {products.length}{" "}
            {products.length === 1
              ? "product"
              : "products"}{" "}
            in your store
          </p>

        </div>

        <button
          type="button"
          className="merchant-refresh-button"
          onClick={fetchProducts}
          disabled={loading}
        >
          ↻ Refresh
        </button>

      </div>

      {/* SEARCH / FILTER */}

      <div className="merchant-products-controls">

        <div className="merchant-product-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <div className="merchant-category-filter">

          <select
            value={
              categoryFilter
            }
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
          >

            {categories.map(
              (category) => (
                <option
                  key={
                    category
                  }
                  value={
                    category
                  }
                >
                  {category}
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* PRODUCT COUNT */}

      <div className="merchant-filter-result">

        Showing{" "}

        <strong>
          {
            filteredProducts.length
          }
        </strong>{" "}

        of{" "}

        <strong>
          {
            products.length
          }
        </strong>{" "}

        products

      </div>

      {/* PRODUCTS */}

      {filteredProducts.length ===
      0 ? (

        <div className="merchant-products-empty">

          <div className="merchant-empty-icon">
            📦
          </div>

          <h2>
            No products found
          </h2>

          <p>
            {products.length ===
            0
              ? "You haven't added any products yet."
              : "Try changing your search or category filter."}
          </p>

          {products.length ===
            0 && (
            <button
              type="button"
              onClick={
                onAddProduct
              }
              className="merchant-empty-add-button"
            >
              + Add Your First Product
            </button>
          )}

        </div>

      ) : (

        <div className="merchant-products-grid">

          {filteredProducts.map(
            (product) => {

              const price =
                getProductPrice(
                  product
                );

              const originalPrice =
                getOriginalPrice(
                  product
                );

              const discount =
                getDiscount(
                  product
                );

              const stock =
                getStock(
                  product
                );

              return (
                <div
                  className="merchant-product-card"
                  key={
                    product.id ||
                    product.product_id
                  }
                >

                  {/* IMAGE */}

                  <div className="merchant-product-card-image">

                    <img
                      src={
                        getProductImage(
                          product
                        )
                      }
                      alt={
                        product.name ||
                        "Product"
                      }
                      onError={(e) => {
                        if (
                          !e.currentTarget.dataset.errorHandled
                        ) {
                          e.currentTarget.dataset.errorHandled =
                            "true";

                          e.currentTarget.src =
                            "https://via.placeholder.com/500x500?text=No+Image";
                        }
                      }}
                    />

                    {discount > 0 && (
                      <span className="merchant-product-discount">
                        {discount}% OFF
                      </span>
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="merchant-product-card-content">

                    <div className="merchant-product-category">
                      {product.category ||
                        "PRODUCT"}
                    </div>

                    <h3
                      title={
                        product.name
                      }
                    >
                      {product.name ||
                        "Unnamed Product"}
                    </h3>

                    <p className="merchant-product-brand">
                      {product.brand ||
                        "No Brand"}
                    </p>

                    <div className="merchant-product-price-row">

                      <strong>
                        {formatPrice(
                          price
                        )}
                      </strong>

                      {originalPrice &&
                        originalPrice >
                          price && (
                          <span>
                            {formatPrice(
                              originalPrice
                            )}
                          </span>
                        )}

                    </div>

                    <div className="merchant-product-stock">

                      Stock:{" "}

                      <strong>
                        {stock}
                      </strong>

                    </div>

                    <div className="merchant-product-actions">

                      <button
                        type="button"
                        className="merchant-edit-button"
                        onClick={() =>
                          handleEdit(
                            product
                          )
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="merchant-delete-button"
                        onClick={() =>
                          handleDelete(
                            product
                          )
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

      )}

    </div>
  );
}


/* =========================================================
   EDIT PRODUCT FORM
========================================================= */

function EditProductForm({
  product,
  loading,
  merchant,
  token,
  onCancel,
  onUpdate,
}) {

  const MAX_IMAGES = 6;
  const MAX_IMAGE_SIZE =
    5 * 1024 * 1024;

  /* =====================================================
     IMAGE URL HELPER
  ===================================================== */

  const resolveImageUrl = (url) => {
    if (!url) {
      return "";
    }

    if (typeof url !== "string") {
      return "";
    }

    const cleanUrl = url.trim();

    if (!cleanUrl) {
      return "";
    }

    if (
      cleanUrl.startsWith("http://") ||
      cleanUrl.startsWith("https://") ||
      cleanUrl.startsWith("blob:") ||
      cleanUrl.startsWith("data:")
    ) {
      return cleanUrl;
    }

    if (cleanUrl.startsWith("/")) {
      return `${API_BASE_URL}${cleanUrl}`;
    }

    return `${API_BASE_URL}/${cleanUrl}`;
  };

  /* =====================================================
     NORMALIZE IMAGE
  ===================================================== */

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

  /* =====================================================
     FORM DATA
  ===================================================== */

  const [formData, setFormData] =
    useState({
      name:
        product.name || "",

      category:
        product.category ||
        "Electronics",

      productType:
        product.product_type ||
        "Smartphone",

      description:
        product.description ||
        "",

      sizeFit:
        product.size_fit ||
        "",

      materialCare:
        product.material_care ||
        "",

      brand:
        product.brand || "",

      gstRate:
        product.gst_rate ??
        "",
    });

  /* =====================================================
     PRODUCT DETAILS
  ===================================================== */

  const [productDetails, setProductDetails] =
    useState(
      product.product_details || {}
    );

  /* =====================================================
     VARIANTS
  ===================================================== */

  const getInitialVariants = () => {
    let variants =
      product.product_variants;

    if (Array.isArray(variants)) {
      return variants;
    }

    if (
      typeof variants === "string" &&
      variants.trim()
    ) {
      try {
        const parsed =
          JSON.parse(
            variants
          );

        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (err) {
        console.error(
          "Unable to parse variants:",
          err
        );
      }
    }

    return [];
  };

  const [variantSizes, setVariantSizes] =
    useState(
      getInitialVariants()
    );

  /* =====================================================
     PRODUCT IMAGES
  ===================================================== */

  const [images, setImages] =
    useState([]);

  const [newImages, setNewImages] =
    useState([]);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD EXISTING IMAGES
  ===================================================== */

  useEffect(() => {

    let existingImages = [];

    /*
      product_images ARRAY
    */

    if (
      Array.isArray(
        product.product_images
      )
    ) {

      existingImages =
        product.product_images;

    }

    /*
      product_images STRING
    */

    else if (
      typeof product.product_images ===
        "string" &&
      product.product_images.trim()
    ) {

      const raw =
        product.product_images.trim();

      try {

        const parsed =
          JSON.parse(raw);

        if (
          Array.isArray(parsed)
        ) {

          existingImages =
            parsed;

        } else if (parsed) {

          existingImages = [
            parsed,
          ];

        }

      } catch {

        if (
          raw.includes(",")
        ) {

          existingImages =
            raw
              .split(",")
              .map(
                (item) =>
                  item.trim()
              )
              .filter(Boolean);

        } else {

          existingImages = [
            raw,
          ];

        }

      }

    }

    /*
      images ARRAY fallback
    */

    if (
      existingImages.length ===
        0 &&
      Array.isArray(
        product.images
      )
    ) {

      existingImages =
        product.images;

    }

    /*
      images STRING fallback
    */

    if (
      existingImages.length ===
        0 &&
      typeof product.images ===
        "string" &&
      product.images.trim()
    ) {

      try {

        const parsed =
          JSON.parse(
            product.images
          );

        if (
          Array.isArray(parsed)
        ) {

          existingImages =
            parsed;

        } else {

          existingImages = [
            parsed,
          ];

        }

      } catch {

        existingImages = [
          product.images,
        ];

      }

    }

    /*
      MAIN IMAGE FALLBACK
    */

    if (
      existingImages.length ===
        0
    ) {

      const mainImage =
        product.image ||
        product.image_url ||
        product.imageUrl ||
        product.thumbnail ||
        product.thumbnail_url;

      if (mainImage) {

        existingImages = [
          mainImage,
        ];

      }

    }

    /*
      Normalize all image values
    */

    existingImages =
      existingImages
        .map(
          (image) =>
            normalizeImageValue(
              image
            )
        )
        .filter(Boolean)
        .map(
          (image) =>
            resolveImageUrl(
              image
            )
        )
        .filter(Boolean);

    /*
      Remove duplicates
    */

    existingImages = [
      ...new Set(
        existingImages
      ),
    ];

    /*
      IMPORTANT:
      Set images so edit page
      immediately shows them.
    */

    setImages(
      existingImages.map(
        (url, index) => ({
          id:
            `existing-${index}-${Date.now()}`,
          url,
          existing: true,
        })
      )
    );

  }, [product]);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (
    e
  ) => {

    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  };

  /* =====================================================
     PRODUCT DETAIL CHANGE
  ===================================================== */

  const handleProductDetailChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setProductDetails(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );

    };

  /* =====================================================
     ADD NEW PRODUCT IMAGES
  ===================================================== */

  const handleAddImages = (
    e
  ) => {

    const selectedFiles =
      Array.from(
        e.target.files || []
      );

    if (
      selectedFiles.length ===
      0
    ) {
      return;
    }

    setError("");

    const totalCurrent =
      images.length +
      newImages.length;

    if (
      totalCurrent >=
      MAX_IMAGES
    ) {

      setError(
        `Maximum ${MAX_IMAGES} product images are allowed.`
      );

      e.target.value = "";

      return;
    }

    const remaining =
      MAX_IMAGES -
      totalCurrent;

    const filesToAdd =
      selectedFiles.slice(
        0,
        remaining
      );

    const validFiles = [];

    for (
      const file of filesToAdd
    ) {

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        setError(
          `${file.name} is not a valid image file.`
        );

        continue;
      }

      if (
        file.size >
        MAX_IMAGE_SIZE
      ) {

        setError(
          `${file.name} is larger than 5MB.`
        );

        continue;
      }

      validFiles.push({
        file,

        preview:
          URL.createObjectURL(
            file
          ),
      });

    }

    setNewImages(
      (previous) => [
        ...previous,
        ...validFiles,
      ]
    );

    e.target.value = "";
  };

  /* =====================================================
     REMOVE EXISTING IMAGE
  ===================================================== */

  const handleRemoveExistingImage =
    (index) => {

      setImages(
        (previous) =>
          previous.filter(
            (_, imageIndex) =>
              imageIndex !==
              index
          )
      );

    };

  /* =====================================================
     REMOVE NEW IMAGE
  ===================================================== */

  const handleRemoveNewImage =
    (index) => {

      setNewImages(
        (previous) => {

          const image =
            previous[index];

          if (
            image?.preview
          ) {

            URL.revokeObjectURL(
              image.preview
            );

          }

          return previous.filter(
            (_, imageIndex) =>
              imageIndex !==
              index
          );

        }
      );

    };

  /* =====================================================
     MAKE PRIMARY IMAGE
  ===================================================== */

  const makePrimaryImage = (
    index
  ) => {

    setImages(
      (previous) => {

        if (
          index === 0
        ) {
          return previous;
        }

        const copy = [
          ...previous,
        ];

        const selected =
          copy.splice(
            index,
            1
          )[0];

        copy.unshift(
          selected
        );

        return copy;

      }
    );

  };

  /* =====================================================
     UPLOAD NEW IMAGES
  ===================================================== */

  const uploadNewImages =
    async () => {

      const uploadedUrls = [];

      for (
        let index = 0;
        index <
        newImages.length;
        index++
      ) {

        const image =
          newImages[index];

        const imageFormData =
          new FormData();

        imageFormData.append(
          "image",
          image.file
        );

        const response =
          await fetch(
            `${API_BASE_URL}/api/products/upload-image`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "x-user-id":
                  String(
                    merchant.id
                  ),
              },

              body:
                imageFormData,
            }
          );

        const text =
          await response.text();

        let data = {};

        try {

          data =
            JSON.parse(
              text
            );

        } catch {

          console.error(
            "Image upload returned non-JSON:",
            text
          );

        }

        if (
          !response.ok
        ) {

          throw new Error(
            data.message ||
              `Image ${
                index + 1
              } upload failed (${response.status})`
          );

        }

        if (
          data.success === false
        ) {

          throw new Error(
            data.message ||
              `Image ${
                index + 1
              } upload failed.`
          );

        }

        const uploadedUrl =
          data.image ||
          data.imageUrl ||
          data.url ||
          data.path;

        if (
          !uploadedUrl
        ) {

          throw new Error(
            `Image ${
              index + 1
            } uploaded but server did not return an image URL.`
          );

        }

        uploadedUrls.push(
          uploadedUrl
        );

      }

      return uploadedUrls;
    };

  /* =====================================================
     UPDATE VARIANT
  ===================================================== */

  const updateVariant = (
    index,
    field,
    value
  ) => {

    setVariantSizes(
      (previous) =>
        previous.map(
          (
            item,
            itemIndex
          ) =>
            itemIndex ===
            index
              ? {
                  ...item,
                  [field]:
                    value,
                }
              : item
        )
    );

  };

  /* =====================================================
     UPDATE VARIANT ATTRIBUTE
  ===================================================== */

  const updateVariantAttribute =
    (
      index,
      key,
      value
    ) => {

      setVariantSizes(
        (previous) =>
          previous.map(
            (
              item,
              itemIndex
            ) =>
              itemIndex ===
              index
                ? {
                    ...item,

                    attributes: {
                      ...(item.attributes ||
                        {}),
                      [key]:
                        value,
                    },
                  }
                : item
          )
      );

    };

  /* =====================================================
     SUBMIT EDIT
  ===================================================== */

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    setError("");

    /* BASIC VALIDATION */

    if (
      !formData.name.trim()
    ) {

      setError(
        "Product name is required."
      );

      return;
    }

    if (
      !formData.description.trim()
    ) {

      setError(
        "Product description is required."
      );

      return;
    }

    if (
      !formData.sizeFit.trim()
    ) {

      setError(
        "Size & Fit information is required."
      );

      return;
    }

    if (
      !formData.materialCare.trim()
    ) {

      setError(
        "Material & Care information is required."
      );

      return;
    }

    if (
      images.length === 0 &&
      newImages.length === 0
    ) {

      setError(
        "Please keep at least one product image."
      );

      return;
    }

    if (
      images.length +
        newImages.length >
      MAX_IMAGES
    ) {

      setError(
        `Maximum ${MAX_IMAGES} product images are allowed.`
      );

      return;
    }

    try {

      /*
        Upload new images
      */

      let uploadedNewUrls = [];

      if (
        newImages.length >
        0
      ) {

        uploadedNewUrls =
          await uploadNewImages();

      }

      /*
        Existing + new images
      */

      const finalImageUrls = [
        ...images.map(
          (image) =>
            image.url
        ),
        ...uploadedNewUrls.map(
          (url) =>
            resolveImageUrl(url)
        ),
      ].filter(Boolean);

      if (
        finalImageUrls.length ===
        0
      ) {

        throw new Error(
          "No product images available."
        );

      }

      /*
        First image = primary
      */

      const primaryImage =
        finalImageUrls[0];

      /* =================================================
         PREPARE VARIANTS
      ================================================= */

      const productVariants =
        variantSizes.map(
          (variant) => {

            const variantPrice =
              Number(
                variant.price
              );

            const discountPrice =
              Number(
                variant.discount_price ??
                  variant.discountPrice
              );

            const variantStock =
              Number(
                variant.stock
              );

            return {

              ...variant,

              attributes:
                variant.attributes ||
                {},

              price:
                Number.isFinite(
                  variantPrice
                )
                  ? variantPrice
                  : 0,

              discount_price:
                Number.isFinite(
                  discountPrice
                ) &&
                discountPrice > 0
                  ? discountPrice
                  : null,

              stock:
                Number.isFinite(
                  variantStock
                )
                  ? variantStock
                  : 0,

              sku:
                variant.sku
                  ? String(
                      variant.sku
                    ).trim()
                  : null,

              available:
                variant.available !==
                undefined
                  ? Boolean(
                      variant.available
                    )
                  : true,
            };
          }
        );

      /* =================================================
         UPDATE
      ================================================= */

      await onUpdate({

        merchant_id:
          Number(
            merchant.id
          ),

        name:
          formData.name.trim(),

        category:
          formData.category,

        product_type:
          formData.productType,

        description:
          formData.description.trim(),

        size_fit:
          formData.sizeFit.trim(),

        material_care:
          formData.materialCare.trim(),

        brand:
          formData.brand.trim(),

        gst_rate:
          Number(
            formData.gstRate || 0
          ),

        image:
          primaryImage,

        product_images:
          finalImageUrls,

        product_details:
          productDetails,

        product_variants:
          productVariants,
      });

    } catch (err) {

      console.error(
        "Edit product error:",
        err
      );

      setError(
        err.message ||
          "Unable to update product."
      );

    }

  };

  /* =====================================================
     EDIT PAGE
  ===================================================== */

  return (
    <div className="merchant-edit-product-page">

      {/* HEADER */}

      <div className="merchant-edit-header">

        <button
          type="button"
          className="merchant-edit-back"
          onClick={onCancel}
          disabled={loading}
        >
          ←
        </button>

        <div>

          <div className="merchant-products-label">
            MERCHANT
          </div>

          <h1>
            Edit Product
          </h1>

          <p>
            Update product information,
            specifications and images.
          </p>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="merchant-products-error">
          {error}
        </div>
      )}

      <form
        className="merchant-edit-form"
        onSubmit={
          handleSubmit
        }
      >

        {/* =================================================
            PRODUCT INFORMATION
        ================================================= */}

        <div className="merchant-edit-section">

          <div className="merchant-edit-section-heading">

            <h2>
              Product Information
            </h2>

            <p>
              Update the basic information
              about your product.
            </p>

          </div>

          <div className="merchant-edit-grid">

            {/* PRODUCT NAME */}

            <div className="merchant-edit-group full">

              <label>
                Product Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                placeholder="Enter product name"
                disabled={loading}
              />

            </div>

            {/* DESCRIPTION */}

            <div className="merchant-edit-group full">

              <label>
                Product Description
                <span>*</span>
              </label>

              <textarea
                name="description"
                rows="5"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Enter detailed product description..."
                disabled={loading}
              />

            </div>

            {/* CATEGORY */}

            <div className="merchant-edit-group">

              <label>
                Category
                <span>*</span>
              </label>

              <input
                type="text"
                name="category"
                value={
                  formData.category
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              />

            </div>

            {/* PRODUCT TYPE */}

            <div className="merchant-edit-group">

              <label>
                Product Type
                <span>*</span>
              </label>

              <input
                type="text"
                name="productType"
                value={
                  formData.productType
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              />

            </div>

            {/* BRAND */}

            <div className="merchant-edit-group">

              <label>
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={
                  formData.brand
                }
                onChange={
                  handleChange
                }
                placeholder="Enter brand name"
                disabled={loading}
              />

            </div>

            {/* GST */}

            <div className="merchant-edit-group">

              <label>
                GST Rate (%)
              </label>

              <input
                type="number"
                name="gstRate"
                value={
                  formData.gstRate
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              />

            </div>

            {/* SIZE FIT */}

            <div className="merchant-edit-group">

              <label>
                Size & Fit
                <span>*</span>
              </label>

              <input
                type="text"
                name="sizeFit"
                value={
                  formData.sizeFit
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. Regular fit, M/L/XL"
                disabled={loading}
              />

            </div>

            {/* MATERIAL CARE */}

            <div className="merchant-edit-group full">

              <label>
                Material & Care
                <span>*</span>
              </label>

              <textarea
                name="materialCare"
                rows="4"
                value={
                  formData.materialCare
                }
                onChange={
                  handleChange
                }
                placeholder="Enter material and care instructions..."
                disabled={loading}
              />

            </div>

          </div>

        </div>

        {/* =================================================
            PRODUCT SPECIFIC DETAILS
        ================================================= */}

        {Object.keys(
          productDetails
        ).length > 0 && (

          <div className="merchant-edit-section">

            <div className="merchant-edit-section-heading">

              <h2>
                {formData.productType} Details
              </h2>

              <p>
                Update product-specific
                specifications.
              </p>

            </div>

            <div className="merchant-edit-grid">

              {Object.entries(
                productDetails
              ).map(
                ([key, value]) => (

                  <div
                    className="merchant-edit-group"
                    key={key}
                  >

                    <label>
                      {key
                        .replace(
                          /_/g,
                          " "
                        )
                        .replace(
                          /\b\w/g,
                          (letter) =>
                            letter.toUpperCase()
                        )}
                    </label>

                    <input
                      type="text"
                      name={key}
                      value={
                        value ?? ""
                      }
                      onChange={
                        handleProductDetailChange
                      }
                      disabled={loading}
                    />

                  </div>

                )
              )}

            </div>

          </div>

        )}

        {/* =================================================
            PRODUCT IMAGES
        ================================================= */}

        <div className="merchant-edit-section">

          <div className="merchant-edit-section-heading">

            <h2>
              Product Images
            </h2>

            <p>
              Manage your product images.
              The first image will be the
              primary product image.
            </p>

          </div>

          <div className="merchant-edit-image-area">

            {/* UPLOAD */}

            <label className="merchant-edit-upload-box">

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                hidden
                onChange={
                  handleAddImages
                }
                disabled={
                  loading ||
                  images.length +
                    newImages.length >=
                    MAX_IMAGES
                }
              />

              <div className="merchant-edit-upload-icon">
                +
              </div>

              <strong>
                {images.length +
                  newImages.length >=
                MAX_IMAGES
                  ? "Maximum Images Added"
                  : "Add Product Images"}
              </strong>

              <span>
                JPG, PNG, WEBP up to 5MB
              </span>

              <small>
                {images.length +
                  newImages.length}
                /{MAX_IMAGES} images
              </small>

            </label>

            {/* IMAGE GRID */}

            {(images.length > 0 ||
              newImages.length >
                0) && (

              <div className="merchant-edit-image-grid">

                {/* EXISTING IMAGES */}

                {images.map(
                  (
                    image,
                    index
                  ) => (

                    <div
                      className={`merchant-edit-image-card ${
                        index === 0
                          ? "primary-image"
                          : ""
                      }`}
                      key={
                        image.id
                      }
                    >

                      <img
                        src={
                          image.url
                        }
                        alt={`Product ${
                          index + 1
                        }`}
                        onError={(e) => {

                          if (
                            !e.currentTarget
                              .dataset
                              .errorHandled
                          ) {

                            e.currentTarget.dataset.errorHandled =
                              "true";

                            e.currentTarget.src =
                              "https://via.placeholder.com/500x500?text=No+Image";
                          }

                        }}
                      />

                      {index === 0 && (
                        <span className="merchant-edit-primary-badge">
                          Primary
                        </span>
                      )}

                      {index !== 0 && (
                        <button
                          type="button"
                          className="merchant-make-primary-button"
                          onClick={() =>
                            makePrimaryImage(
                              index
                            )
                          }
                          disabled={loading}
                        >
                          Make Primary
                        </button>
                      )}

                      <button
                        type="button"
                        className="merchant-edit-remove-image"
                        onClick={() =>
                          handleRemoveExistingImage(
                            index
                          )
                        }
                        disabled={loading}
                        title="Remove image"
                      >
                        ×
                      </button>

                      <div className="merchant-edit-image-number">
                        Product Image{" "}
                        {index + 1}
                      </div>

                    </div>

                  )
                )}

                {/* NEW IMAGES */}

                {newImages.map(
                  (
                    image,
                    index
                  ) => {

                    const finalIndex =
                      images.length +
                      index;

                    return (
                      <div
                        className={`merchant-edit-image-card ${
                          finalIndex === 0
                            ? "primary-image"
                            : ""
                        }`}
                        key={
                          `new-${index}`
                        }
                      >

                        <img
                          src={
                            image.preview
                          }
                          alt={`New Product ${
                            index + 1
                          }`}
                        />

                        {finalIndex ===
                          0 && (
                          <span className="merchant-edit-primary-badge">
                            Primary
                          </span>
                        )}

                        <button
                          type="button"
                          className="merchant-edit-remove-image"
                          onClick={() =>
                            handleRemoveNewImage(
                              index
                            )
                          }
                          disabled={loading}
                          title="Remove image"
                        >
                          ×
                        </button>

                        <div className="merchant-edit-image-number">
                          New Image{" "}
                          {index + 1}
                        </div>

                      </div>
                    );

                  }
                )}

              </div>

            )}

          </div>

        </div>

        {/* =================================================
            PRODUCT VARIANTS
        ================================================= */}

        {variantSizes.length >
          0 && (

          <div className="merchant-edit-section">

            <div className="merchant-edit-section-heading">

              <h2>
                Product Variants
              </h2>

              <p>
                Update your existing
                product variants.
              </p>

            </div>

            <div className="merchant-edit-variants">

              {variantSizes.map(
                (
                  variant,
                  index
                ) => (

                  <div
                    className="merchant-edit-variant-card"
                    key={index}
                  >

                    <div className="merchant-edit-variant-header">

                      <h3>
                        Variant{" "}
                        {index + 1}
                      </h3>

                    </div>

                    <div className="merchant-edit-variant-grid">

                      {/* ATTRIBUTES */}

                      {Object.entries(
                        variant.attributes ||
                          {}
                      ).map(
                        (
                          [
                            key,
                            value,
                          ]
                        ) => (

                          <div
                            key={
                              key
                            }
                            className="merchant-edit-group"
                          >

                            <label>
                              {key
                                .replace(
                                  /_/g,
                                  " "
                                )
                                .replace(
                                  /\b\w/g,
                                  (
                                    letter
                                  ) =>
                                    letter.toUpperCase()
                                )}
                            </label>

                            <input
                              type="text"
                              value={
                                value ??
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                updateVariantAttribute(
                                  index,
                                  key,
                                  e
                                    .target
                                    .value
                                )
                              }
                              disabled={
                                loading
                              }
                            />

                          </div>

                        )
                      )}

                      {/* VARIANT PRICE */}

                      <div className="merchant-edit-group">

                        <label>
                          Variant Price
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            variant.price ??
                            ""
                          }
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "price",
                              e.target.value
                            )
                          }
                          disabled={
                            loading
                          }
                        />

                      </div>

                      {/* DISCOUNT PRICE */}

                      <div className="merchant-edit-group">

                        <label>
                          Discount Price
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            variant.discount_price ??
                            variant.discountPrice ??
                            ""
                          }
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "discount_price",
                              e.target.value
                            )
                          }
                          disabled={
                            loading
                          }
                        />

                      </div>

                      {/* STOCK */}

                      <div className="merchant-edit-group">

                        <label>
                          Variant Stock
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={
                            variant.stock ??
                            ""
                          }
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "stock",
                              e.target.value
                            )
                          }
                          disabled={
                            loading
                          }
                        />

                      </div>

                      {/* SKU - SMARTPHONE ONLY */}

{formData.productType === "Smartphone" && (

  <div className="merchant-edit-group">

    <label>
      SKU
    </label>

    <input
      type="text"
      value={variant.sku ?? ""}
      onChange={(e) =>
        updateVariant(
          index,
          "sku",
          e.target.value
        )
      }
      disabled={loading}
    />

  </div>

)}

                      {/* AVAILABLE */}

                      <div className="merchant-edit-available">

                        <label>

                          <input
                            type="checkbox"
                            checked={
                              Boolean(
                                variant.available
                              )
                            }
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "available",
                                e.target.checked
                              )
                            }
                            disabled={
                              loading
                            }
                          />

                          Available for sale

                        </label>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="merchant-edit-actions">

          <button
            type="button"
            className="merchant-edit-cancel"
            onClick={
              onCancel
            }
            disabled={
              loading
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="merchant-edit-update"
            disabled={
              loading
            }
          >
            {loading
              ? "Updating Product..."
              : "Update Product"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default MerchantProducts;