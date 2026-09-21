import React, {
  useEffect,
  useState,
} from "react";

import { API_BASE_URL } from "../api";

import "./AdminProducts.css";


function AdminProducts({ onBack, admin }) {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(null);


  // =========================================
  // FEEDBACK STATES
  // =========================================

  const [feedbackProduct, setFeedbackProduct] =
    useState(null);

  const [feedbackData, setFeedbackData] =
    useState(null);

  const [feedbackLoading, setFeedbackLoading] =
    useState(false);

  const [feedbackError, setFeedbackError] =
    useState("");

  const [adminRating, setAdminRating] =
    useState(0);

  const [ratingSaving, setRatingSaving] =
    useState(false);


  // =========================================
  // GET ADMIN TOKEN
  // =========================================

  const getAdminToken = () => {

    return (
      admin?.token ||
      localStorage.getItem("adminToken")
    );

  };


  // =========================================
  // FETCH PRODUCTS
  // =========================================

  const fetchProducts = async () => {

    try {

      setLoading(true);

      setError("");


      const token =
        getAdminToken();


      console.log(
        "ADMIN PRODUCTS TOKEN:",
        token
          ? "Token found"
          : "Token missing"
      );


      if (!token) {

        throw new Error(
          "Admin session not found. Please login again."
        );

      }


      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/products`,
          {

            method: "GET",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

          }
        );


      const data =
        await response.json();


      console.log(
        "Admin products response:",
        data
      );


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to load products"
        );

      }


      setProducts(
        Array.isArray(
          data.products
        )
          ? data.products
          : []
      );


    } catch (error) {

      console.error(
        "Admin products error:",
        error
      );


      setError(
        error.message ||
        "Unable to load products"
      );


    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // APPROVE PRODUCT
  // =========================================

  const approveProduct = async (
    productId
  ) => {

    try {

      setActionLoading(
        productId
      );


      const token =
        getAdminToken();


      if (!token) {

        throw new Error(
          "Admin session not found. Please login again."
        );

      }


      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/products/${productId}/approve`,
          {

            method: "PUT",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

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
          "Failed to approve product"
        );

      }


      // UPDATE PRODUCT STATUS

      setProducts(
        (previousProducts) =>
          previousProducts.map(
            (product) =>
              product.id === productId
                ? {
                    ...product,
                    status:
                      "approved",
                  }
                : product
          )
      );


      alert(
        "Product approved successfully!"
      );


    } catch (error) {

      console.error(
        "Approve product error:",
        error
      );


      alert(
        error.message ||
        "Failed to approve product"
      );


    } finally {

      setActionLoading(
        null
      );

    }

  };


  // =========================================
  // REJECT PRODUCT
  // =========================================

  const rejectProduct = async (
    productId
  ) => {

    try {

      const confirmed =
        window.confirm(
          "Are you sure you want to reject this product?"
        );


      if (!confirmed) {

        return;

      }


      setActionLoading(
        productId
      );


      const token =
        getAdminToken();


      if (!token) {

        throw new Error(
          "Admin session not found. Please login again."
        );

      }


      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/products/${productId}/reject`,
          {

            method: "PUT",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

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
          "Failed to reject product"
        );

      }


      // UPDATE PRODUCT STATUS

      setProducts(
        (previousProducts) =>
          previousProducts.map(
            (product) =>
              product.id === productId
                ? {
                    ...product,
                    status:
                      "rejected",
                  }
                : product
          )
      );


      alert(
        "Product rejected successfully!"
      );


    } catch (error) {

      console.error(
        "Reject product error:",
        error
      );


      alert(
        error.message ||
        "Failed to reject product"
      );


    } finally {

      setActionLoading(
        null
      );

    }

  };


  // =========================================
  // DELETE PRODUCT
  // =========================================

  const deleteProduct = async (
    productId
  ) => {

    try {

      const confirmed =
        window.confirm(
          "Are you sure you want to permanently delete this product?"
        );


      if (!confirmed) {

        return;

      }


      setActionLoading(
        productId
      );


      const token =
        getAdminToken();


      if (!token) {

        throw new Error(
          "Admin session not found. Please login again."
        );

      }


      console.log(
        "Deleting product:",
        productId
      );


      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/products/${productId}`,
          {

            method: "DELETE",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

          }
        );


      const data =
        await response.json();


      console.log(
        "DELETE PRODUCT RESPONSE:",
        data
      );


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to delete product"
        );

      }


      // REMOVE PRODUCT FROM UI

      setProducts(
        (previousProducts) =>
          previousProducts.filter(
            (product) =>
              product.id !== productId
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

      setActionLoading(
        null
      );

    }

  };


  // =========================================
  // OPEN PRODUCT FEEDBACK
  // =========================================

  const openFeedback = async (
    product
  ) => {

    try {

      setFeedbackProduct(
        product
      );

      setFeedbackData(
        null
      );

      setFeedbackError(
        ""
      );

      setFeedbackLoading(
        true
      );

      setAdminRating(
        0
      );


      const token =
        getAdminToken();


      if (!token) {

        throw new Error(
          "Admin session not found. Please login again."
        );

      }


      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/products/${product.id}/feedback`,
          {

            method: "GET",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

          }
        );


      const data =
        await response.json();


      console.log(
        "PRODUCT FEEDBACK:",
        data
      );


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to load product feedback"
        );

      }


      setFeedbackData(
        data
      );


      setAdminRating(
        data.adminRating
          ? Number(data.adminRating)
          : 0
      );


    } catch (error) {

      console.error(
        "Feedback error:",
        error
      );


      setFeedbackError(
        error.message ||
        "Failed to load feedback"
      );


    } finally {

      setFeedbackLoading(
        false
      );

    }

  };


  // =========================================
  // CLOSE FEEDBACK POPUP
  // =========================================

  const closeFeedback = () => {

    setFeedbackProduct(
      null
    );

    setFeedbackData(
      null
    );

    setFeedbackError(
      ""
    );

    setAdminRating(
      0
    );

  };


  // =========================================
  // SAVE ADMIN RATING
  // =========================================

  const saveAdminRating = async () => {

    if (
      !feedbackProduct
    ) {

      return;

    }


    if (
      !adminRating
    ) {

      alert(
        "Please select an admin rating."
      );

      return;

    }


    try {

      setRatingSaving(
        true
      );


      const token =
        getAdminToken();


      if (!token) {

        throw new Error(
          "Admin session not found. Please login again."
        );

      }


      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/products/${feedbackProduct.id}/admin-rating`,
          {

            method: "PUT",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

            body:
              JSON.stringify({
                rating:
                  adminRating,
              }),

          }
        );


      const data =
        await response.json();


      console.log(
        "ADMIN RATING RESPONSE:",
        data
      );


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to save admin rating"
        );

      }


      setFeedbackData(
        (previousData) => ({
          ...previousData,
          adminRating:
            adminRating,
        })
      );


      alert(
        "Admin rating saved successfully! ⭐"
      );


    } catch (error) {

      console.error(
        "Admin rating error:",
        error
      );


      alert(
        error.message ||
        "Failed to save admin rating"
      );


    } finally {

      setRatingSaving(
        false
      );

    }

  };


  // =========================================
  // LOAD PRODUCTS
  // =========================================

  useEffect(() => {

    fetchProducts();

  }, []);


  // =========================================
  // STOCK STATUS
  // =========================================

  const getStockStatus = (
    stock
  ) => {

    const stockNumber =
      Number(stock || 0);


    if (
      stockNumber <= 0
    ) {

      return {

        text:
          "Out of Stock",

        className:
          "stock-out",

      };

    }


    if (
      stockNumber <= 5
    ) {

      return {

        text:
          "Low Stock",

        className:
          "stock-low",

      };

    }


    return {

      text:
        "In Stock",

      className:
        "stock-good",

    };

  };


  // =========================================
  // PRODUCT STATUS
  // =========================================

  const getProductStatus = (
    status
  ) => {

    return String(
      status || "pending"
    )
      .trim()
      .toLowerCase();

  };


  // =========================================
  // COMPONENT
  // =========================================

  return (

    <section
      className="admin-products-page"
    >


      {/* =====================================
          HEADER
      ===================================== */}

      <header
        className="admin-products-header"
      >

        <button
          type="button"
          className="admin-products-back"
          onClick={onBack}
        >

          ← Back

        </button>


        <div>

          <p>
            ADMIN
          </p>


          <h1>
            Products
          </h1>


          <span>
            Manage and approve merchant products
          </span>

        </div>

      </header>



      {/* =====================================
          CONTENT
      ===================================== */}

      <main
        className="admin-products-content"
      >


        {/* ===================================
            SUMMARY
        =================================== */}

        <div
          className="admin-products-summary"
        >


          {/* TOTAL */}

          <div
            className="products-summary-card"
          >

            <div
              className="products-summary-icon"
            >

              📦

            </div>


            <div>

              <p>
                Total Products
              </p>


              <h2>

                {
                  products.length
                }

              </h2>

            </div>

          </div>



          {/* PENDING */}

          <div
            className="products-summary-card"
          >

            <div
              className="products-summary-icon"
            >

              ⏳

            </div>


            <div>

              <p>
                Pending Approval
              </p>


              <h2>

                {

                  products.filter(
                    (product) =>
                      getProductStatus(
                        product.status
                      ) === "pending"
                  ).length

                }

              </h2>

            </div>

          </div>



          {/* APPROVED */}

          <div
            className="products-summary-card"
          >

            <div
              className="products-summary-icon"
            >

              ✅

            </div>


            <div>

              <p>
                Approved
              </p>


              <h2>

                {

                  products.filter(
                    (product) =>
                      getProductStatus(
                        product.status
                      ) === "approved"
                  ).length

                }

              </h2>

            </div>

          </div>


        </div>



        {/* ===================================
            LOADING
        =================================== */}

        {loading && (

          <div
            className="admin-products-message"
          >

            Loading products...

          </div>

        )}



        {/* ===================================
            ERROR
        =================================== */}

        {!loading &&
          error && (

          <div
            className="admin-products-error"
          >

            <h3>
              Unable to load products
            </h3>


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



        {/* ===================================
            EMPTY
        =================================== */}

        {!loading &&
          !error &&
          products.length === 0 && (

          <div
            className="admin-products-message"
          >

            No products found.

          </div>

        )}



        {/* ===================================
            PRODUCTS TABLE
        =================================== */}

        {!loading &&
          !error &&
          products.length > 0 && (

          <div
            className="admin-products-table-wrapper"
          >

            <table
              className="admin-products-table"
            >

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Merchant
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Discount
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Added
                  </th>

                  <th>
                    Action
                  </th>

                  <th>
                    Feedback
                  </th>

                </tr>

              </thead>



              <tbody>

                {products.map(
                  (product) => {

                    const stockStatus =
                      getStockStatus(
                        product.stock
                      );


                    const productStatus =
                      getProductStatus(
                        product.status
                      );


                    return (

                      <tr
                        key={product.id}
                      >


                        {/* PRODUCT */}

                        <td>

                          <div
                            className="admin-product-info"
                          >

                            <div
                              className="admin-product-image"
                            >

                              {product.image ? (

                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name ||
                                    "Product"
                                  }
                                  onError={
                                    (e) => {
                                      e.currentTarget.style.display =
                                        "none";
                                    }
                                  }
                                />

                              ) : (

                                <span>
                                  📦
                                </span>

                              )}

                            </div>


                            <div>

                              <strong>
                                {
                                  product.name ||
                                  "Unnamed Product"
                                }
                              </strong>


                              <small>
                                ID #{product.id}
                              </small>


                              {product.brand && (

                                <small>
                                  {
                                    product.brand
                                  }
                                </small>

                              )}

                            </div>

                          </div>

                        </td>



                        {/* CATEGORY */}

                        <td>

                          {
                            product.category ||
                            "Uncategorized"
                          }

                        </td>



                        {/* MERCHANT */}

                        <td>

                          <div
                            className="admin-product-merchant"
                          >

                            <strong>
                              {
                                product.business_name ||
                                "Unknown Store"
                              }
                            </strong>


                            <small>
                              {
                                product.merchant_name ||
                                "Unknown Merchant"
                              }
                            </small>

                          </div>

                        </td>



                        {/* PRICE */}

                        <td>

                          <strong>

                            ₹
                            {
                              Number(
                                product.price ||
                                0
                              ).toLocaleString(
                                "en-IN"
                              )
                            }

                          </strong>

                        </td>



                        {/* DISCOUNT */}

                        <td>

                          {Number(
                            product.discount ||
                            0
                          ) > 0 ? (

                            <span
                              className="discount-badge"
                            >

                              {
                                Number(
                                  product.discount
                                )
                              }

                              % OFF

                            </span>

                          ) : (

                            <span
                              className="no-discount"
                            >

                              No Discount

                            </span>

                          )}

                        </td>



                        {/* STOCK */}

                        <td>

                          <div>

                            <strong>
                              {
                                Number(
                                  product.stock ||
                                  0
                                )
                              }
                            </strong>

                            <small
                              className={
                                stockStatus.className
                              }
                            >
                              {
                                stockStatus.text
                              }
                            </small>

                          </div>

                        </td>



                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              `product-status ${productStatus}`
                            }
                          >

                            {
                              productStatus
                            }

                          </span>

                        </td>



                        {/* ADDED DATE */}

                        <td>

                          {product.created_at
                            ? new Date(
                                product.created_at
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}

                        </td>



                        {/* ACTION */}

                        <td>

                          <div
                            className="product-actions"
                          >


                            {/* APPROVE + REJECT */}

                            {productStatus ===
                              "pending" && (

                              <div
                                className="product-decision-buttons"
                              >

                                <button
                                  type="button"
                                  className="product-accept-btn"
                                  disabled={
                                    actionLoading ===
                                    product.id
                                  }
                                  onClick={() =>
                                    approveProduct(
                                      product.id
                                    )
                                  }
                                >

                                  {
                                    actionLoading ===
                                    product.id
                                      ? "..."
                                      : "✓ Accept"
                                  }

                                </button>


                                <button
                                  type="button"
                                  className="product-reject-btn"
                                  disabled={
                                    actionLoading ===
                                    product.id
                                  }
                                  onClick={() =>
                                    rejectProduct(
                                      product.id
                                    )
                                  }
                                >

                                  {
                                    actionLoading ===
                                    product.id
                                      ? "..."
                                      : "✕ Reject"
                                  }

                                </button>

                              </div>

                            )}



                            {/* APPROVED */}

                            {productStatus ===
                              "approved" && (

                              <span>
                                ✅ Approved
                              </span>

                            )}



                            {/* REJECTED */}

                            {productStatus ===
                              "rejected" && (

                              <span>
                                ❌ Rejected
                              </span>

                            )}

                          </div>

                        </td>



                        {/* =================================
                            FEEDBACK COLUMN
                        ================================= */}

                        <td>

                          <button
                            type="button"
                            className="feedback-btn"
                            onClick={() =>
                              openFeedback(
                                product
                              )
                            }
                          >

                            💬 Feedback

                          </button>

                        </td>


                      </tr>

                    );

                  }

                )}

              </tbody>

            </table>

          </div>

        )}



      </main>



      {/* =========================================
          FEEDBACK MODAL
      ========================================= */}

      {feedbackProduct && (

        <div
          className="feedback-modal-overlay"
          onClick={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {

              closeFeedback();

            }

          }}
        >

          <div
            className="feedback-modal"
          >


            {/* MODAL HEADER */}

            <div
              className="feedback-modal-header"
            >

              <div>

                <h2>
                  Product Feedback
                </h2>

                <p>
                  {
                    feedbackProduct.name
                  }
                </p>

              </div>


              <button
                type="button"
                className="feedback-close-btn"
                onClick={
                  closeFeedback
                }
              >

                ✕

              </button>

            </div>



            {/* PRODUCT INFO */}

            <div
              className="feedback-product-info"
            >

              <div
                className="feedback-product-image"
              >

                {feedbackProduct.image ? (

                  <img
                    src={
                      feedbackProduct.image
                    }
                    alt={
                      feedbackProduct.name
                    }
                  />

                ) : (

                  <span>
                    📦
                  </span>

                )}

              </div>


              <div>

                <h3>
                  {
                    feedbackProduct.name
                  }
                </h3>

                <p>
                  Product ID #{feedbackProduct.id}
                </p>

              </div>

            </div>



            {/* LOADING */}

            {feedbackLoading && (

              <div
                className="feedback-loading"
              >

                Loading customer feedback...

              </div>

            )}



            {/* ERROR */}

            {!feedbackLoading &&
              feedbackError && (

              <div
                className="feedback-error"
              >

                {feedbackError}

              </div>

            )}



            {/* FEEDBACK DATA */}

            {!feedbackLoading &&
              !feedbackError &&
              feedbackData && (

              <>

                {/* CUSTOMER SUMMARY */}

                <div
                  className="feedback-summary"
                >


                  <div
                    className="feedback-stat"
                  >

                    <strong>

                      {
                        feedbackData.averageRating ||
                        0
                      }

                      ⭐

                    </strong>

                    <span>
                      Customer Rating
                    </span>

                  </div>



                  <div
                    className="feedback-stat"
                  >

                    <strong>

                      {
                        feedbackData.totalReviews ||
                        0
                      }

                    </strong>

                    <span>
                      Total Reviews
                    </span>

                  </div>


                </div>



                {/* ADMIN RATING */}

                <div
                  className="admin-rating-section"
                >

                  <h3>
                    Admin Rating
                  </h3>


                  <p>
                    Give your rating for this product
                  </p>


                  <div
                    className="admin-stars"
                  >

                    {[1, 2, 3, 4, 5].map(
                      (star) => (

                        <button
                          key={star}
                          type="button"
                          className={
                            star <=
                            adminRating
                              ? "admin-star active"
                              : "admin-star"
                          }
                          onClick={() =>
                            setAdminRating(
                              star
                            )
                          }
                          aria-label={
                            `Rate ${star} out of 5`
                          }
                        >

                          ★

                        </button>

                      )
                    )}

                  </div>


                  <div
                    className="admin-rating-actions"
                  >

                    <span>

                      {adminRating
                        ? `${adminRating}/5`
                        : "Not rated"}

                    </span>


                    <button
                      type="button"
                      className="save-rating-btn"
                      onClick={
                        saveAdminRating
                      }
                      disabled={
                        ratingSaving ||
                        !adminRating
                      }
                    >

                      {ratingSaving
                        ? "Saving..."
                        : "Save Rating"}

                    </button>

                  </div>

                </div>



                {/* CUSTOMER FEEDBACK */}

                <div
                  className="customer-feedback-section"
                >

                  <div
                    className="feedback-section-title"
                  >

                    <h3>
                      Customer Feedback
                    </h3>

                    <span>
                      {
                        feedbackData.totalReviews ||
                        0
                      } Reviews
                    </span>

                  </div>



                  {feedbackData.reviews &&
                  feedbackData.reviews.length >
                    0 ? (

                    <div
                      className="feedback-list"
                    >

                      {feedbackData.reviews.map(
                        (review) => (

                          <div
                            className="feedback-item"
                            key={review.id}
                          >


                            <div
                              className="feedback-item-top"
                            >

                              <div>

                                <strong>
                                  {
                                    review.customer_name ||
                                    "Customer"
                                  }
                                </strong>

                                <small>
                                  Order #
                                  {
                                    review.order_id
                                  }
                                </small>

                              </div>


                              <span
                                className="review-stars"
                              >

                                {"★".repeat(
                                  Number(
                                    review.rating
                                  )
                                )}

                                {"☆".repeat(
                                  5 -
                                  Number(
                                    review.rating
                                  )
                                )}

                              </span>

                            </div>



                            <p>
                              {
                                review.feedback
                              }
                            </p>



                            <small
                              className="feedback-date"
                            >

                              {review.created_at
                                ? new Date(
                                    review.created_at
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )
                                : "-"}

                            </small>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <div
                      className="no-feedback"
                    >

                      <div>
                        💬
                      </div>

                      <h4>
                        No customer feedback yet
                      </h4>

                      <p>
                        Customers can submit feedback
                        after their order is delivered.
                      </p>

                    </div>

                  )}

                </div>



                {/* DELETE PRODUCT */}

                <div
                  className="feedback-delete-section"
                >

                  <button
                    type="button"
                    className="delete-product-btn"
                    disabled={
                      actionLoading ===
                      feedbackProduct.id
                    }
                    onClick={() => {

                      const confirmed =
                        window.confirm(
                          `Are you sure you want to permanently delete "${feedbackProduct.name}"?`
                        );


                      if (
                        confirmed
                      ) {

                        deleteProduct(
                          feedbackProduct.id
                        );

                        closeFeedback();

                      }

                    }}
                  >

                    {actionLoading ===
                    feedbackProduct.id
                      ? "Deleting..."
                      : "🗑️ Delete Product"}

                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </section>

  );

}


export default AdminProducts;