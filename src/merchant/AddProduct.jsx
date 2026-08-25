import React, { useState } from "react";
import "./AddProduct.css";
function AddProduct({
  merchant,
  onBack,
  onProductAdded,
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    stock: "",
    brand: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.stock ||
      !formData.image.trim()
    ) {
      setError(
        "Please fill all required fields."
      );
      return;
    }

    if (!merchant?.id) {
      setError(
        "Merchant information not found. Please login again."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            merchant_id: merchant.id,
            name: formData.name.trim(),
            category: formData.category,
            description:
              formData.description.trim(),
            price: Number(formData.price),
            original_price:
              formData.originalPrice
                ? Number(formData.originalPrice)
                : Number(formData.price),
            discount:
              formData.discount
                ? Number(formData.discount)
                : 0,
            stock: Number(formData.stock),
            brand: formData.brand.trim(),
            image: formData.image.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to add product"
        );
      }

      alert(
        "Product added successfully!"
      );

      if (onProductAdded) {
        onProductAdded(data.product);
      }

    } catch (error) {
      console.error(
        "Add product error:",
        error
      );

      setError(
        error.message ||
          "Unable to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="merchant-add-product-page">

      {/* HEADER */}

      <div className="merchant-add-header">

        <button
          type="button"
          className="merchant-back-button"
          onClick={onBack}
        >
          ←
        </button>

        <div>
          <p>
            MERCHANT
          </p>

          <h1>
            Add Product
          </h1>

          <span>
            Add a new product to your store
          </span>
        </div>

      </div>

      {/* FORM */}

      <form
        className="merchant-product-form"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}

        <div className="merchant-form-card">

          <div className="merchant-form-card-header">

            <div className="merchant-form-icon">
              1
            </div>

            <div>
              <h2>
                Product Information
              </h2>

              <p>
                Enter the basic details of
                your product.
              </p>
            </div>

          </div>

          <div className="merchant-form-grid">

            {/* PRODUCT NAME */}

            <div className="merchant-form-group full">

              <label>
                Product Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />

            </div>

            {/* CATEGORY */}

            <div className="merchant-form-group">

              <label>
                Category
                <span>*</span>
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option>
                  Electronics
                </option>

                <option>
                  Fashion
                </option>

                <option>
                  Home
                </option>

                <option>
                  Beauty
                </option>

                <option>
                  Sports
                </option>

                <option>
                  Accessories
                </option>
              </select>

            </div>

            {/* BRAND */}

            <div className="merchant-form-group">

              <label>
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="merchant-form-group full">

              <label>
                Description
                <span>*</span>
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                placeholder="Describe your product..."
                rows="5"
              />

            </div>

          </div>

        </div>

        {/* PRICE & STOCK */}

        <div className="merchant-form-card">

          <div className="merchant-form-card-header">

            <div className="merchant-form-icon">
              2
            </div>

            <div>
              <h2>
                Price & Inventory
              </h2>

              <p>
                Set your product pricing
                and available stock.
              </p>
            </div>

          </div>

          <div className="merchant-form-grid">

            {/* PRICE */}

            <div className="merchant-form-group">

              <label>
                Selling Price
                <span>*</span>
              </label>

              <div className="price-input">

                <span>
                  ₹
                </span>

                <input
                  type="number"
                  name="price"
                  min="0"
                  value={
                    formData.price
                  }
                  onChange={handleChange}
                  placeholder="0"
                />

              </div>

            </div>

            {/* ORIGINAL PRICE */}

            <div className="merchant-form-group">

              <label>
                Original Price
              </label>

              <div className="price-input">

                <span>
                  ₹
                </span>

                <input
                  type="number"
                  name="originalPrice"
                  min="0"
                  value={
                    formData.originalPrice
                  }
                  onChange={handleChange}
                  placeholder="0"
                />

              </div>

            </div>

            {/* DISCOUNT */}

            <div className="merchant-form-group">

              <label>
                Discount
              </label>

              <div className="price-input">

                <input
                  type="number"
                  name="discount"
                  min="0"
                  max="100"
                  value={
                    formData.discount
                  }
                  onChange={handleChange}
                  placeholder="0"
                />

                <span>
                  %
                </span>

              </div>

            </div>

            {/* STOCK */}

            <div className="merchant-form-group">

              <label>
                Stock Quantity
                <span>*</span>
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
              />

            </div>

          </div>

        </div>

        {/* IMAGE */}

        <div className="merchant-form-card">

          <div className="merchant-form-card-header">

            <div className="merchant-form-icon">
              3
            </div>

            <div>
              <h2>
                Product Image
              </h2>

              <p>
                Add the image URL of your
                product.
              </p>
            </div>

          </div>

          <div className="merchant-image-section">

            <div className="merchant-image-input">

              <label>
                Product Image URL
                <span>*</span>
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
              />

              <small>
                Use a publicly accessible
                image URL.
              </small>

            </div>

            {/* PREVIEW */}

            <div className="merchant-image-preview">

              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Product Preview"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div>
                  <span>
                    🖼️
                  </span>

                  <p>
                    Image Preview
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="merchant-form-error">
            ⚠️ {error}
          </div>
        )}

        {/* ACTIONS */}

        <div className="merchant-form-actions">

          <button
            type="button"
            className="merchant-cancel-button"
            onClick={onBack}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="merchant-save-button"
            disabled={loading}
          >
            {loading
              ? "Adding Product..."
              : "Add Product"}
          </button>

        </div>

      </form>

    </section>
  );
}

export default AddProduct;