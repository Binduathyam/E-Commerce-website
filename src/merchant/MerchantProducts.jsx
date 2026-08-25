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

  // =========================
  // EDIT STATE
  // =========================

  const [editingProduct, setEditingProduct] =
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

  const [editLoading, setEditLoading] =
    useState(false);

  // =========================
  // DELETE STATE
  // =========================

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/products/merchant/${merchant.id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch products"
        );
      }

      setProducts(data.products || []);
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

  useEffect(() => {
    if (merchant?.id) {
      fetchProducts();
    }
  }, [merchant?.id]);

  // =========================
  // START EDIT
  // =========================

  const handleEditClick = (product) => {
    setEditingProduct(product);

    setEditForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
      original_price:
        product.original_price || "",
      discount:
        product.discount || "",
      stock: product.stock ?? "",
      brand: product.brand || "",
      description:
        product.description || "",
      image: product.image || "",
    });
  };

  // =========================
  // EDIT INPUT
  // =========================

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

  // =========================
  // UPDATE PRODUCT
  // =========================

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

    if (!editForm.price) {
      alert("Price is required");
      return;
    }

    if (
      editForm.stock === "" ||
      editForm.stock === null
    ) {
      alert("Stock is required");
      return;
    }

    try {
      setEditLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/products/${editingProduct.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            merchant_id:
              merchant.id,

            name:
              editForm.name.trim(),

            category:
              editForm.category.trim(),

            price:
              Number(editForm.price),

            original_price:
              editForm.original_price
                ? Number(
                    editForm.original_price
                  )
                : Number(
                    editForm.price
                  ),

            discount:
              editForm.discount
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

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update product"
        );
      }

      // Update product immediately
      setProducts((current) =>
        current.map((product) =>
          product.id ===
          editingProduct.id
            ? data.product
            : product
        )
      );

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

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDeleteProduct = async (
    product
  ) => {
    const confirmed =
      window.confirm(
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

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            merchant_id:
              merchant.id,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete product"
        );
      }

      // Remove immediately from screen
      setProducts((current) =>
        current.filter(
          (item) =>
            item.id !== product.id
        )
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

  // =========================
  // EDIT MODAL
  // =========================

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
              <p>MERCHANT</p>

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

              {/* NAME */}

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

              {/* PRICE */}

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
                  type="url"
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

            {/* ACTIONS */}

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

  // =========================
  // MAIN PRODUCTS PAGE
  // =========================

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

      {/* STORE INFO */}

      <div className="merchant-products-summary">

        <div>

          <strong>
            {merchant?.businessName ||
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

      {!loading &&
        error && (
          <div className="merchant-products-error">

            {error}

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

      {/* PRODUCTS */}

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
                          product.image
                        }
                        alt={
                          product.name
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

                    <div className="merchant-product-price-row">

                      <strong>
                        ₹
                        {Number(
                          product.price
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

                    <div className="merchant-product-bottom">

                      <span
                        className={
                          Number(
                            product.stock
                          ) <= 5
                            ? "stock-low"
                            : "stock-good"
                        }
                      >
                        Stock:{" "}
                        {product.stock}
                      </span>

                      {Number(
                        product.discount
                      ) > 0 && (
                        <span className="product-discount">
                          {product.discount}%
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