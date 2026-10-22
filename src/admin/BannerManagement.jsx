import React, { useState } from "react";

import "./BannerManagement.css";

import { API_BASE_URL } from "../api";

function BannerManagement({ onBack }) {

  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [buttonText, setButtonText] = useState("Shop Now");

  const [bannerImage, setBannerImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);


  /* =========================================
     IMAGE SELECT
  ========================================= */

  const handleImageChange = (event) => {

    const file = event.target.files?.[0];

    if (!file) return;


    // File type validation
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {

      alert(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }


    // 5 MB validation
    if (file.size > 5 * 1024 * 1024) {

      alert(
        "Image size must be less than 5 MB."
      );

      event.target.value = "";
      return;
    }


    setBannerImage(file);


    const imageUrl = URL.createObjectURL(file);

    setPreviewImage(imageUrl);
  };


  /* =========================================
     SAVE BANNER
  ========================================= */

  const handleSaveBanner = async () => {

    if (!bannerTitle.trim()) {

      alert("Please enter banner title.");

      return;
    }


    if (!bannerImage) {

      alert("Please select a banner image.");

      return;
    }


    try {

      setIsSaving(true);


      /* =====================================
         GET ADMIN TOKEN
      ===================================== */

      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("admin_token");


      if (!token) {

        alert(
          "Admin session expired. Please login again."
        );

        setIsSaving(false);

        return;
      }


      /* =====================================
         STEP 1
         UPLOAD IMAGE
      ===================================== */

      const imageFormData = new FormData();

      imageFormData.append(
        "image",
        bannerImage
      );


      const uploadResponse = await fetch(
        `${API_BASE_URL}/api/admin/banners/upload-image`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: imageFormData,
        }
      );


      const uploadData =
        await uploadResponse.json();


      if (!uploadResponse.ok || !uploadData.success) {

        throw new Error(
          uploadData.message ||
          "Failed to upload banner image."
        );
      }


      /* =====================================
         IMAGE PATH FROM BACKEND
      ===================================== */

      const imagePath =
        uploadData.image;


      console.log(
        "Uploaded banner image:",
        imagePath
      );


      /* =====================================
         STEP 2
         SAVE BANNER DETAILS
      ===================================== */

      const bannerResponse = await fetch(
        `${API_BASE_URL}/api/admin/banners`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({

            title: bannerTitle.trim(),

            description:
              bannerDescription.trim(),

            discount:
              discount.trim(),

            button_text:
              buttonText.trim() ||
              "Shop Now",

            image:
              imagePath,

            is_active:
              isActive,

          }),
        }
      );


      const bannerData =
        await bannerResponse.json();


      if (
        !bannerResponse.ok ||
        !bannerData.success
      ) {

        throw new Error(
          bannerData.message ||
          "Failed to save banner."
        );
      }


      /* =====================================
         SUCCESS
      ===================================== */

      alert(
        "Banner created successfully!"
      );


      console.log(
        "Banner saved successfully:",
        bannerData
      );


      /* =====================================
         RESET FORM
      ===================================== */

      setBannerTitle("");
      setBannerDescription("");
      setDiscount("");
      setButtonText("Shop Now");

      setBannerImage(null);
      setPreviewImage("");

      setIsActive(true);


    } catch (error) {

      console.error(
        "Save banner error:",
        error
      );


      alert(
        error.message ||
        "Something went wrong while saving the banner."
      );

    } finally {

      setIsSaving(false);

    }
  };


  return (

    <div className="banner-management-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="banner-management-header">

        <div>

          <p className="banner-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h1>
            Banner Management
          </h1>

          <span>
            Create and manage the promotional banner
            displayed on the ShopEase home page.
          </span>

        </div>


        <button
          type="button"
          className="banner-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>


      {/* =========================================
          FORM
      ========================================= */}

      <div className="banner-management-grid">


        {/* =======================================
            LEFT - FORM
        ======================================= */}

        <section className="banner-form-card">

          <div className="banner-card-title">

            <h2>
              Banner Details
            </h2>

            <p>
              Enter the information for your promotion.
            </p>

          </div>


          {/* TITLE */}

          <div className="banner-form-group">

            <label>
              Banner Title
            </label>

            <input
              type="text"
              value={bannerTitle}
              onChange={(e) =>
                setBannerTitle(e.target.value)
              }
              placeholder="Example: Summer Sale"
            />

          </div>


          {/* DESCRIPTION */}

          <div className="banner-form-group">

            <label>
              Description
            </label>

            <textarea
              value={bannerDescription}
              onChange={(e) =>
                setBannerDescription(e.target.value)
              }
              placeholder="Example: Everything you need at amazing prices"
              rows="4"
            />

          </div>


          {/* DISCOUNT */}

          <div className="banner-form-row">

            <div className="banner-form-group">

              <label>
                Discount
              </label>

              <input
                type="text"
                value={discount}
                onChange={(e) =>
                  setDiscount(e.target.value)
                }
                placeholder="50% OFF"
              />

            </div>


            <div className="banner-form-group">

              <label>
                Button Text
              </label>

              <input
                type="text"
                value={buttonText}
                onChange={(e) =>
                  setButtonText(e.target.value)
                }
                placeholder="Shop Now"
              />

            </div>

          </div>


          {/* STATUS */}

          <div className="banner-status-row">

            <div>

              <strong>
                Banner Status
              </strong>

              <span>
                {isActive
                  ? "Banner is visible to customers"
                  : "Banner is hidden from customers"}
              </span>

            </div>


            <button
              type="button"
              className={
                isActive
                  ? "banner-toggle active"
                  : "banner-toggle"
              }
              onClick={() =>
                setIsActive(!isActive)
              }
            >

              <span />

              {isActive
                ? "Active"
                : "Inactive"}

            </button>

          </div>


          {/* IMAGE */}

          <div className="banner-form-group">

            <label>
              Banner Image
            </label>

            <label className="banner-upload-box">

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
              />

              <span className="banner-upload-icon">
                🖼️
              </span>

              <strong>
                Choose Banner Image
              </strong>

              <small>
                PNG, JPG or WEBP • Max 5 MB
              </small>

            </label>

          </div>


          {/* SAVE */}

          <button
            type="button"
            className="banner-save-button"
            onClick={handleSaveBanner}
            disabled={isSaving}
          >

            {isSaving
              ? "Saving Banner..."
              : "Save Banner"}

          </button>

        </section>


        {/* =======================================
            RIGHT - PREVIEW
        ======================================= */}

        <section className="banner-preview-card">

          <div className="banner-card-title">

            <h2>
              Live Preview
            </h2>

            <p>
              Preview how the banner will appear.
            </p>

          </div>


          <div className="banner-preview">

            {previewImage ? (

              <img
                src={previewImage}
                alt="Banner Preview"
              />

            ) : (

              <div className="banner-preview-placeholder">

                <span>
                  🖼️
                </span>

                <strong>
                  Banner Preview
                </strong>

                <small>
                  Select an image to preview it here.
                </small>

              </div>

            )}


            <div className="banner-preview-overlay">

              <span className="preview-sale-label">
                {discount || "SPECIAL OFFER"}
              </span>

              <h2>
                {bannerTitle || "Your Banner Title"}
              </h2>

              <p>
                {bannerDescription ||
                  "Your banner description will appear here."}
              </p>

              <button
                type="button"
                disabled
              >
                {buttonText || "Shop Now"}
              </button>

            </div>

          </div>

        </section>

      </div>

    </div>

  );
}

export default BannerManagement;