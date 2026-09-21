import React, {
  useEffect,
  useState,
} from "react";

import { API_BASE_URL } from "../api";



function ProductDetails({
  product,
  onBack,
  onAddToCart,
}) {

  // =========================================
  // REVIEW STATES
  // =========================================

  const [reviews, setReviews] =
    useState([]);

  const [averageRating, setAverageRating] =
    useState(0);

  const [totalReviews, setTotalReviews] =
    useState(0);

  const [adminRating, setAdminRating] =
    useState(null);

  const [reviewsLoading, setReviewsLoading] =
    useState(false);


  // =========================================
  // FETCH CUSTOMER REVIEWS + ADMIN RATING
  // =========================================

  useEffect(() => {

    if (!product?.id) {
      return;
    }


    const fetchReviews =
      async () => {

        try {

          setReviewsLoading(true);


          const response =
            await fetch(
              `${API_BASE_URL}/api/reviews/product/${product.id}`
            );


          const data =
            await response.json();


          console.log(
            "PRODUCT REVIEW DATA:",
            data
          );


          if (
            !response.ok ||
            !data.success
          ) {

            throw new Error(
              data.message ||
              "Failed to load product reviews"
            );

          }


          // ---------------------------------
          // CUSTOMER REVIEWS
          // ---------------------------------

          setReviews(
            Array.isArray(
              data.reviews
            )
              ? data.reviews
              : []
          );


          // ---------------------------------
          // CUSTOMER AVERAGE RATING
          // ---------------------------------

          setAverageRating(
            Number(
              data.averageRating || 0
            )
          );


          // ---------------------------------
          // TOTAL CUSTOMER REVIEWS
          // ---------------------------------

          setTotalReviews(
            Number(
              data.totalReviews || 0
            )
          );


          // ---------------------------------
          // ADMIN RATING
          // ---------------------------------

          setAdminRating(
            data.adminRating !== null &&
            data.adminRating !== undefined
              ? Number(
                  data.adminRating
                )
              : null
          );


        } catch (error) {

          console.error(
            "Product review error:",
            error
          );


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
  // PRODUCT NOT FOUND
  // =========================================

  if (!product) {

    return (

      <div
        className="product-details-empty"
      >

        <h2>
          Product not found
        </h2>


        <button
          type="button"
          onClick={onBack}
        >

          Go Back

        </button>

      </div>

    );

  }


  // =========================================
  // PRICE
  // =========================================

  const price =
    Number(product.price) || 0;


  // =========================================
  // RENDER STARS
  // =========================================

  const renderStars = (
    rating
  ) => {

    const numericRating =
      Number(rating) || 0;


    return (

      <span
        className="product-stars"
      >

        {[1, 2, 3, 4, 5].map(
          (star) => (

            <span
              key={star}
              className={
                star <= numericRating
                  ? "filled-star"
                  : "empty-star"
              }
            >

              ★

            </span>

          )
        )}

      </span>

    );

  };


  // =========================================
  // ADMIN RATING SECTION
  // =========================================

  const renderAdminRating =
    () => {

      if (!adminRating) {

        return (

          <div
            className="admin-rating-display"
          >

            <span className="admin-rating-title">
              Rating
            </span>


            <span className="admin-no-rating">
              Not rated yet
            </span>

          </div>

        );

      }


      return (

        <div
          className="admin-rating-display"
        >

          <span
            className="admin-rating-title"
          >

            Rating

          </span>


          <div
            className="admin-rating-value"
          >

            {renderStars(
              adminRating
            )}


           <strong>
  {Number(adminRating).toFixed(1)}
</strong>

          </div>

        </div>

      );

    };


  // =========================================
  // CUSTOMER RATING SECTION
  // =========================================

  const renderCustomerRating =
    () => {

      if (
        totalReviews === 0
      ) {

        return (

          <div
            className="customer-rating-summary"
          >

            <span
              className="customer-rating-title"
            >

              Customer Rating

            </span>


            <span
              className="customer-no-rating"
            >

              No reviews yet

            </span>

          </div>

        );

      }


      return (

        <div
          className="customer-rating-summary"
        >

          <span
            className="customer-rating-title"
          >

            Customer Rating

          </span>


          <div
            className="customer-rating-value"
          >

            {renderStars(
              averageRating
            )}


            <strong>
              {averageRating}
            </strong>


            <span>
              ({totalReviews}{" "}
              {totalReviews === 1
                ? "Review"
                : "Reviews"})
            </span>

          </div>

        </div>

      );

    };


  // =========================================
  // MAIN UI
  // =========================================

  return (

    <section
      className="product-details"
    >


      {/* =====================================
          BACK BUTTON
      ===================================== */}

      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >

        ← Back to Products

      </button>



      {/* =====================================
          MAIN PRODUCT SECTION
      ===================================== */}

      <div
        className="product-details-content"
      >


        {/* ===================================
            PRODUCT IMAGE
        =================================== */}

        <div
          className="details-image"
        >

          <img
            src={product.image}
            alt={
              product.name ||
              "Product"
            }
          />

        </div>



        {/* ===================================
            PRODUCT INFORMATION
        =================================== */}

        <div
          className="details-info"
        >


          {/* CATEGORY */}

          <p
            className="product-category"
          >

            {product.category}

          </p>



          {/* PRODUCT NAME */}

          <h1>

            {product.name}

          </h1>



          {/* =================================
              ADMIN RATING
          ================================= */}

          {renderAdminRating()}



          {/* =================================
              CUSTOMER RATING
          ================================= */}

          {renderCustomerRating()}



          {/* =================================
              PRICE
          ================================= */}

          <div
            className="price-details"
          >

            <h2>

              ₹
              {price.toLocaleString(
                "en-IN"
              )}

            </h2>


            <span
              className="tax-text"
            >

              inclusive of all taxes

            </span>

          </div>



          {/* =================================
              PRODUCT DESCRIPTION
          ================================= */}

          <div
            className="product-description-section"
          >

            <h3>
              Product Details
            </h3>


            <p
              className="details-description"
            >

              {product.description ||
                "No product description available."}

            </p>

          </div>



          {/* =================================
              SELECT SIZE
          ================================= */}

          <div
            className="size-section"
          >

            <h3>
              SELECT SIZE
            </h3>


            <button
              type="button"
              className="size-option active-size"
            >

              Onesize

            </button>

          </div>



          {/* =================================
              ACTION BUTTONS
          ================================= */}

          <div
            className="details-actions"
          >

            <button
              type="button"
              className="details-cart-button"
              onClick={() =>
                onAddToCart(product)
              }
            >

              🛒 ADD TO BAG

            </button>


            <button
              type="button"
              className="details-wishlist-button"
            >

              ♡ WISHLIST

            </button>

          </div>



          {/* =================================
              ASSURANCE
          ================================= */}

          <div
            className="product-assurance"
          >

            <span>
              ✓
            </span>


            <strong>
              100% Original Products
            </strong>

          </div>


        </div>

      </div>



      {/* =====================================
          FULL PRODUCT INFORMATION
      ===================================== */}

      <div
        className="product-information"
      >


        {/* ===================================
            DESCRIPTION
        =================================== */}

        <div
          className="information-section"
        >

          <h2>
            Product Description
          </h2>


          <p>

            {product.description ||
              "No product description available."}

          </p>

        </div>



        {/* ===================================
            SIZE & FIT
        =================================== */}

        <div
          className="information-section"
        >

          <h2>
            Size & Fit
          </h2>


          <p>

            {product.size_fit ||
              "Size and fit information is not available."}

          </p>

        </div>



        {/* ===================================
            MATERIAL & CARE
        =================================== */}

        <div
          className="information-section"
        >

          <h2>
            Material & Care
          </h2>


          <p>

            {product.material_care ||
              "Material and care information is not available."}

          </p>

        </div>



        {/* ===================================
            SPECIFICATIONS
        =================================== */}

        <div
          className="information-section"
        >

          <h2>
            Specifications
          </h2>


          <div
            className="specifications-grid"
          >

            <div
              className="specification-row"
            >

              <span>
                Category
              </span>


              <strong>
                {product.category ||
                  "—"}
              </strong>

            </div>


            <div
              className="specification-row"
            >

              <span>
                Product Type
              </span>


              <strong>
                {product.category ||
                  "—"}
              </strong>

            </div>


            <div
              className="specification-row"
            >

              <span>
                Brand
              </span>


              <strong>
                {product.brand ||
                  "—"}
              </strong>

            </div>


            <div
              className="specification-row"
            >

              <span>
                Availability
              </span>


              <strong>

                {Number(
                  product.stock
                ) > 0
                  ? "In Stock"
                  : "Out of Stock"}

              </strong>

            </div>

          </div>

        </div>



        {/* =====================================
            CUSTOMER REVIEWS
        ===================================== */}

        <div
          className="information-section product-reviews-section"
        >


          <div
            className="reviews-header"
          >

            <div>

              <h2>
                Customer Reviews
              </h2>


              {totalReviews > 0 && (

                <p>

                  {averageRating} out of 5 ·{" "}

                  {totalReviews}{" "}

                  {totalReviews === 1
                    ? "Review"
                    : "Reviews"}

                </p>

              )}

            </div>

          </div>



          {/* LOADING */}

          {reviewsLoading && (

            <div
              className="reviews-loading"
            >

              Loading customer reviews...

            </div>

          )}



          {/* NO REVIEWS */}

          {!reviewsLoading &&
            reviews.length === 0 && (

            <div
              className="no-product-reviews"
            >

              <div>
                💬
              </div>


              <h3>
                No customer reviews yet
              </h3>


              <p>
                Be the first customer to
                review this product.
              </p>

            </div>

          )}



          {/* REVIEWS */}

          {!reviewsLoading &&
            reviews.length > 0 && (

            <div
              className="product-review-list"
            >

              {reviews.map(
                (review) => (

                  <div
                    className="product-review-card"
                    key={review.id}
                  >


                    {/* REVIEW HEADER */}

                    <div
                      className="product-review-top"
                    >

                      <div>

                        <strong>

                          {
                            review.customer_name ||
                            "Customer"
                          }

                        </strong>


                        <small>
                          Verified Purchase
                        </small>

                      </div>


                      {renderStars(
                        review.rating
                      )}

                    </div>



                    {/* FEEDBACK TEXT */}

                    <p>

                      {
                        review.feedback
                      }

                    </p>



                    {/* DATE */}

                    <small
                      className="product-review-date"
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

          )}

        </div>


      </div>

    </section>

  );

}


export default ProductDetails; 