import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
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
    sizeFit: "",
    materialCare: "",
    price: "",
    originalPrice: "",
    discount: "",
    stock: "",
    brand: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     CLEAN IMAGE PREVIEW
  ========================================= */

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  /* =========================================
     IMAGE SELECT
  ========================================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5 MB."
      );

      e.target.value = "";
      return;
    }

    setImageFile(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /* =========================================
     SUBMIT PRODUCT
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ================================
       VALIDATION
    ================================= */

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!formData.sizeFit.trim()) {
      setError("Size & Fit information is required.");
      return;
    }

    if (!formData.materialCare.trim()) {
      setError("Material & Care information is required.");
      return;
    }

    if (!formData.price) {
      setError("Selling price is required.");
      return;
    }

    if (
      formData.stock === "" ||
      formData.stock === null
    ) {
      setError("Stock quantity is required.");
      return;
    }

    if (!imageFile) {
      setError(
        "Please select a product image."
      );
      return;
    }

    /* ================================
       MERCHANT CHECK
    ================================= */

    if (!merchant?.id) {
      setError(
        "Merchant information not found. Please login again."
      );
      return;
    }

    /* ================================
       TOKEN CHECK
    ================================= */

    const token =
      localStorage.getItem("merchant_token");

    if (!token) {
      setError(
        "Authentication token is missing. Please login again."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log(
        "Merchant ID:",
        merchant.id
      );

      console.log(
        "Token exists:",
        !!token
      );

      /* =====================================
         STEP 1: UPLOAD IMAGE
      ====================================== */

      const imageFormData =
        new FormData();

      imageFormData.append(
        "image",
        imageFile
      );

      console.log(
        "Uploading image..."
      );

      const uploadResponse =
        await fetch(
          `${API_BASE_URL}/api/products/upload-image`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "x-user-id":
                String(merchant.id),
            },

            body: imageFormData,
          }
        );

      /* =====================================
         READ UPLOAD RESPONSE SAFELY
      ====================================== */

      const uploadText =
        await uploadResponse.text();

      let uploadData = {};

      try {
        uploadData =
          JSON.parse(uploadText);
      } catch {
        console.error(
          "Upload returned non-JSON:",
          uploadText
        );
      }

      console.log(
        "Image upload response:",
        uploadData
      );

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.message ||
          `Image upload failed (${uploadResponse.status})`
        );
      }

      if (!uploadData.success) {
        throw new Error(
          uploadData.message ||
          "Image upload failed"
        );
      }

      /* =====================================
         GET IMAGE URL
      ====================================== */

      const uploadedImageUrl =
        uploadData.image ||
        uploadData.imageUrl ||
        uploadData.url;

      if (!uploadedImageUrl) {
        console.error(
          "Upload response:",
          uploadData
        );

        throw new Error(
          "Image uploaded but server did not return image URL."
        );
      }

      console.log(
        "Uploaded image:",
        uploadedImageUrl
      );

      /* =====================================
         STEP 2: ADD PRODUCT
      ====================================== */

      console.log(
        "Adding product..."
      );

      const response =
        await fetch(
          `${API_BASE_URL}/api/products`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

              "x-user-id":
                String(merchant.id),
            },

            body: JSON.stringify({
              merchant_id:
                Number(merchant.id),

              name:
                formData.name.trim(),

              category:
                formData.category,

              description:
                formData.description.trim(),

              size_fit:
                formData.sizeFit.trim(),

              material_care:
                formData.materialCare.trim(),

              price:
                Number(formData.price),

              original_price:
                formData.originalPrice
                  ? Number(
                      formData.originalPrice
                    )
                  : Number(
                      formData.price
                    ),

              discount:
                formData.discount
                  ? Number(
                      formData.discount
                    )
                  : 0,

              stock:
                Number(formData.stock),

              brand:
                formData.brand.trim(),

              image:
                uploadedImageUrl,
            }),
          }
        );

      /* =====================================
         READ PRODUCT RESPONSE SAFELY
      ====================================== */

      const responseText =
        await response.text();

      let data = {};

      try {
        data =
          JSON.parse(responseText);
      } catch {
        console.error(
          "Product API returned non-JSON:",
          responseText
        );
      }

      console.log(
        "Add product response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
          `Failed to add product (${response.status})`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
          "Failed to add product"
        );
      }

      /* =====================================
         SUCCESS
      ====================================== */

      alert(
        "Product added successfully!"
      );

      /* Reset form */

      setFormData({
        name: "",
        category: "Electronics",
        description: "",
        sizeFit: "",
        materialCare: "",
        price: "",
        originalPrice: "",
        discount: "",
        stock: "",
        brand: "",
      });

      setImageFile(null);

      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview
        );
      }

      setImagePreview("");

      /* Go back / refresh products */

      if (onProductAdded) {
        onProductAdded(
          data.product || data
        );
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

  /* =========================================
     UI
  ========================================= */

  return (
    <section className="merchant-add-product-page">

      {/* HEADER */}

      <div className="merchant-add-header">

        <button
          type="button"
          className="merchant-back-button"
          onClick={onBack}
          disabled={loading}
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

        {/* =====================================
            PRODUCT INFORMATION
        ====================================== */}

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
                Enter the basic details of your
                product.
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
                disabled={loading}
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
                disabled={loading}
              >

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Fashion">
                  Fashion
                </option>

                <option value="Home">
                  Home
                </option>

                <option value="Beauty">
                  Beauty
                </option>

                <option value="Sports">
                  Sports
                </option>

                <option value="Accessories">
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
                disabled={loading}
              />

            </div>

            {/* DESCRIPTION */}

            <div className="merchant-form-group full">

              <label>
                Product Description
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
                disabled={loading}
              />

            </div>

            {/* SIZE & FIT */}

            <div className="merchant-form-group full">

              <label>
                Size & Fit
                <span>*</span>
              </label>

              <textarea
                name="sizeFit"
                value={formData.sizeFit}
                onChange={handleChange}
                placeholder="Enter size and fit information..."
                rows="4"
                disabled={loading}
              />

            </div>

            {/* MATERIAL & CARE */}

            <div className="merchant-form-group full">

              <label>
                Material & Care
                <span>*</span>
              </label>

              <textarea
                name="materialCare"
                value={formData.materialCare}
                onChange={handleChange}
                placeholder="Enter material and care instructions..."
                rows="4"
                disabled={loading}
              />

            </div>

          </div>

        </div>

        {/* =====================================
            PRICE & STOCK
        ====================================== */}

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
                Set your product pricing and
                available stock.
              </p>

            </div>

          </div>

          <div className="merchant-form-grid">

            {/* SELLING PRICE */}

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
                  step="0.01"
                  value={
                    formData.price
                  }
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
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
                  step="0.01"
                  value={
                    formData.originalPrice
                  }
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
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
                  disabled={loading}
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
                value={
                  formData.stock
                }
                onChange={handleChange}
                placeholder="Enter stock quantity"
                disabled={loading}
              />

            </div>

          </div>

        </div>

        {/* =====================================
            PRODUCT IMAGE
        ====================================== */}

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
                Select an image from your
                computer or mobile device.
              </p>

            </div>

          </div>

          <div className="merchant-image-section">

            {/* IMAGE INPUT */}

            <div className="merchant-image-input">

              <label>
                Product Image
                <span>*</span>
              </label>

              <input
                type="file"
                name="image"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={loading}
              />

              <small>
                JPG, JPEG, PNG or WEBP.
                Maximum size 5 MB.
              </small>

              {imageFile && (

                <small>

                  Selected:{" "}

                  <strong>
                    {imageFile.name}
                  </strong>

                </small>

              )}

            </div>

            {/* PREVIEW */}

            <div className="merchant-image-preview">

              {imagePreview ? (

                <img
                  src={imagePreview}
                  alt="Product Preview"
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
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="merchant-save-button"
            disabled={loading}
          >

            {loading
              ? "Uploading & Adding..."
              : "Add Product"}

          </button>

        </div>

      </form>

    </section>
  );
}

export default AddProduct;