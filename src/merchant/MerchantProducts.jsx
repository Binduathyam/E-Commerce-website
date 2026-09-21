import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./MerchantProducts.css";

function MerchantProducts({
  merchant,
  onBack,
  onAddProduct,
}) {
  // =====================================================
  // STATES
  // =====================================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [editLoading, setEditLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    price: "",
    original_price: "",
    discount: "",
    stock: "",
    brand: "",
    description: "",
    image: "",
  });


  // =====================================================
  // GET AUTH HEADERS
  // =====================================================

  const getAuthHeaders = () => {
    const token = localStorage.getItem("merchant_token");

    return {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(merchant?.id
        ? {
            "x-user-id": merchant.id,
          }
        : {}),
    };
  };


  // =====================================================
  // FETCH PRODUCTS
  // =====================================================
const fetchProducts = async () => {
  if (!merchant?.id) {
    setProducts([]);
    setLoading(false);
    setError("Merchant information is missing.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("merchant_token");

    if (!token) {
      throw new Error("Merchant authentication token is missing.");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/products/merchant/${merchant.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("Merchant products response:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to fetch products"
      );
    }

    setProducts(
      Array.isArray(data.products)
        ? data.products
        : []
    );

  } catch (error) {
    console.error(
      "Merchant products error:",
      error
    );

    setError(
      error.message ||
        "Unable to load products."
    );

  } finally {
    setLoading(false);
  }
};

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, [merchant?.id]);


  // =====================================================
  // START EDIT
  // =====================================================

  const handleEditClick = (product) => {
    setEditingProduct(product);

    setEditForm({
      name: product.name || "",

      category:
        product.category || "",

      price:
        product.price ?? "",

      original_price:
        product.original_price ?? "",

      discount:
        product.discount ?? "",

      stock:
        product.stock ?? "",

      brand:
        product.brand || "",

      description:
        product.description || "",

      image:
        product.image || "",
    });
  };


  // =====================================================
  // EDIT INPUT CHANGE
  // =====================================================

  const handleEditChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  };


  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!editingProduct) {
      return;
    }

    if (!editForm.name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!editForm.category.trim()) {
      alert("Category is required");
      return;
    }

    if (
      editForm.price === "" ||
      Number(editForm.price) < 0
    ) {
      alert("Enter a valid price");
      return;
    }

    if (
      editForm.stock === "" ||
      Number(editForm.stock) < 0
    ) {
      alert("Enter valid stock");
      return;
    }

    try {
      setEditLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/products/${editingProduct.id}`,
        {
          method: "PUT",

          headers: getAuthHeaders(),

          body: JSON.stringify({
            merchant_id: merchant.id,

            name:
              editForm.name.trim(),

            category:
              editForm.category.trim(),

            price:
              Number(editForm.price),

            original_price:
              editForm.original_price !== ""
                ? Number(
                    editForm.original_price
                  )
                : Number(editForm.price),

            discount:
              editForm.discount !== ""
                ? Number(
                    editForm.discount
                  )
                : 0,

            stock:
              Number(editForm.stock),

            brand:
              editForm.brand.trim(),

            description:
              editForm.description.trim(),

            image:
              editForm.image.trim(),
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Update product response:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update product"
        );
      }

      // Refresh products from backend
      await fetchProducts();

      setEditingProduct(null);

      alert(
        "Product updated successfully!"
      );

    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      alert(
        error.message ||
          "Failed to update product"
      );

    } finally {
      setEditLoading(false);
    }
  };


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDeleteProduct = async (
    product
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(product.id);

      const response = await fetch(
        `${API_BASE_URL}/api/products/${product.id}`,
        {
          method: "DELETE",

          headers: getAuthHeaders(),

          body: JSON.stringify({
            merchant_id: merchant.id,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Delete product response:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete product"
        );
      }

      // Remove immediately
      setProducts((current) =>
        current.filter(
          (item) =>
            item.id !== product.id
        )
      );

      alert(
        "Product deleted successfully!"
      );

    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete product"
      );

    } finally {
      setDeleteLoading(null);
    }
  };


  // =====================================================
  // FIX IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    // Already complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Backend relative image path
    return `${API_BASE_URL}${image}`;
  };


  // =====================================================
  // EDIT PRODUCT PAGE
  // =====================================================

  if (editingProduct) {
    return (
      <section className="merchant-products-page">

        <div className="merchant-products-header">

          <div className="merchant-products-heading">

            <button
              type="button"
              className="merchant-products-back"
              onClick={() =>
                setEditingProduct(null)
              }
            >
              ←
            </button>

            <div>

              <p>
                MERCHANT
              </p>

              <h1>
                Edit Product
              </h1>

              <span>
                Update your product details
              </span>

            </div>

          </div>

        </div>


        <div className="merchant-edit-card">

          <form
            onSubmit={
              handleUpdateProduct
            }
          >

            <div className="merchant-edit-grid">

              {/* PRODUCT NAME */}

              <div className="merchant-edit-group">

                <label>
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    editForm.name
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>


              {/* CATEGORY */}

              <div className="merchant-edit-group">

                <label>
                  Category *
                </label>

                <input
                  type="text"
                  name="category"
                  value={
                    editForm.category
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>


              {/* SELLING PRICE */}

              <div className="merchant-edit-group">

                <label>
                  Selling Price *
                </label>

                <input
                  type="number"
                  name="price"
                  min="0"
                  value={
                    editForm.price
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>


              {/* ORIGINAL PRICE */}

              <div className="merchant-edit-group">

                <label>
                  Original Price
                </label>

                <input
                  type="number"
                  name="original_price"
                  min="0"
                  value={
                    editForm.original_price
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>


              {/* DISCOUNT */}

              <div className="merchant-edit-group">

                <label>
                  Discount (%)
                </label>

                <input
                  type="number"
                  name="discount"
                  min="0"
                  max="100"
                  value={
                    editForm.discount
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>


              {/* STOCK */}

              <div className="merchant-edit-group">

                <label>
                  Stock *
                </label>

                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={
                    editForm.stock
                  }
                  onChange={
                    handleEditChange
                  }
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
                    editForm.brand
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>


              {/* IMAGE */}

              <div className="merchant-edit-group">

                <label>
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={
                    editForm.image
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="merchant-edit-group merchant-edit-full">

              <label>
                Description
              </label>

              <textarea
                name="description"
                rows="5"
                value={
                  editForm.description
                }
                onChange={
                  handleEditChange
                }
              />

            </div>


            {/* BUTTONS */}

            <div className="merchant-edit-actions">

              <button
                type="button"
                className="merchant-edit-cancel"
                onClick={() =>
                  setEditingProduct(null)
                }
                disabled={editLoading}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="merchant-edit-save"
                disabled={editLoading}
              >
                {editLoading
                  ? "Updating..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </section>
    );
  }


  // =====================================================
  // MAIN PRODUCTS PAGE
  // =====================================================

  return (
    <section className="merchant-products-page">

      {/* HEADER */}

      <div className="merchant-products-header">

        <div className="merchant-products-heading">

          <button
            type="button"
            className="merchant-products-back"
            onClick={onBack}
          >
            ←
          </button>


          <div>

            <p>
              MERCHANT
            </p>

            <h1>
              My Products
            </h1>

            <span>
              Manage products in your store
            </span>

          </div>

        </div>


        <button
          type="button"
          className="merchant-products-add"
          onClick={onAddProduct}
        >
          + Add Product
        </button>

      </div>


      {/* STORE SUMMARY */}

      <div className="merchant-products-summary">

        <div>

          <strong>
            {merchant?.businessName ||
              merchant?.business_name ||
              "My Store"}
          </strong>

          <span>
            {products.length} product
            {products.length !== 1
              ? "s"
              : ""}{" "}
            in your store
          </span>

        </div>


        <button
          type="button"
          onClick={fetchProducts}
        >
          ↻ Refresh
        </button>

      </div>


      {/* LOADING */}

      {loading && (

        <div className="merchant-products-message">
          Loading products...
        </div>

      )}


      {/* ERROR */}

      {!loading && error && (

        <div className="merchant-products-error">

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchProducts}
          >
            Try Again
          </button>

        </div>

      )}


      {/* EMPTY */}

      {!loading &&
        !error &&
        products.length === 0 && (

          <div className="merchant-products-empty">

            <div className="empty-product-icon">
              📦
            </div>

            <h2>
              No Products Yet
            </h2>

            <p>
              Add your first product to
              start selling on ShopEase.
            </p>

            <button
              type="button"
              onClick={onAddProduct}
            >
              + Add Your First Product
            </button>

          </div>

        )}


      {/* PRODUCTS GRID */}

      {!loading &&
        !error &&
        products.length > 0 && (

          <div className="merchant-products-grid">

            {products.map(
              (product) => (

                <div
                  className="merchant-product-card"
                  key={product.id}
                >

                  {/* IMAGE */}

                  <div className="merchant-product-image">

                    {product.image ? (

                      <img
                        src={
                          getImageUrl(
                            product.image
                          )
                        }
                        alt={
                          product.name ||
                          "Product"
                        }
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <span>
                        📦
                      </span>

                    )}

                  </div>


                  {/* DETAILS */}

                  <div className="merchant-product-details">

                    <span className="merchant-product-category">

                      {product.category ||
                        "Product"}

                    </span>


                    <h2>
                      {product.name}
                    </h2>


                    <p className="merchant-product-brand">

                      {product.brand ||
                        "No brand"}

                    </p>


                    {/* PRICE */}

                    <div className="merchant-product-price-row">

                      <strong>

                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </strong>


                      {product.original_price &&
                        Number(
                          product.original_price
                        ) >
                          Number(
                            product.price
                          ) && (

                          <del>

                            ₹
                            {Number(
                              product.original_price
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </del>

                        )}

                    </div>


                    {/* STOCK */}

                    <div className="merchant-product-bottom">

                      <span
                        className={
                          Number(
                            product.stock || 0
                          ) <= 5
                            ? "stock-low"
                            : "stock-good"
                        }
                      >

                        Stock:{" "}
                        {product.stock ?? 0}

                      </span>


                      {Number(
                        product.discount || 0
                      ) > 0 && (

                        <span className="product-discount">

                          {product.discount}%
                          {" "}
                          OFF

                        </span>

                      )}

                    </div>


                    {/* ACTIONS */}

                    <div className="merchant-product-actions">

                      <button
                        type="button"
                        className="merchant-edit-button"
                        onClick={() =>
                          handleEditClick(
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
                          handleDeleteProduct(
                            product
                          )
                        }
                        disabled={
                          deleteLoading ===
                          product.id
                        }
                      >

                        {deleteLoading ===
                        product.id
                          ? "Deleting..."
                          : "🗑️ Delete"}

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

    </section>
  );
}

export default MerchantProducts;