import { useEffect, useState } from "react";

function OrderTracking({
  order,
  onBack,
  onCancel,
  onReturn,
}) {
  /* =========================================
     RETURN / CANCEL STATES
  ========================================= */

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  const [showReturnModal, setShowReturnModal] =
    useState(false);

  const [cancelReason, setCancelReason] =
    useState("");

  const [otherCancelReason, setOtherCancelReason] =
    useState("");

  const [returnReason, setReturnReason] =
    useState("");

  const [otherReturnReason, setOtherReturnReason] =
    useState("");

  const [loadingCancel, setLoadingCancel] =
    useState(false);

  const [loadingReturn, setLoadingReturn] =
    useState(false);

  /* =========================================
     FEEDBACK STATES
  ========================================= */

  const [showFeedbackModal, setShowFeedbackModal] =
    useState(false);

  const [feedbackProducts, setFeedbackProducts] =
    useState([]);

  const [feedbackProduct, setFeedbackProduct] =
    useState(null);

  const [feedbackRating, setFeedbackRating] =
    useState(0);

  const [feedbackText, setFeedbackText] =
    useState("");

  const [loadingFeedback, setLoadingFeedback] =
    useState(false);

  const [reviewedProducts, setReviewedProducts] =
    useState({});

  const [loadingReviewCheck, setLoadingReviewCheck] =
    useState(false);

  /* =========================================
     DATABASE STATUS
  ========================================= */

  const rawStatus = String(
    order?.order_status || "Placed"
  ).trim();

  const normalizedStatus =
    rawStatus.toLowerCase();

  /* =========================================
     STATUS FLAGS
  ========================================= */

  const isCancelled =
    normalizedStatus === "cancelled";

  const isDelivered =
    normalizedStatus === "delivered";

  const isShipped =
    normalizedStatus === "shipped";

  const isOutForDelivery =
    normalizedStatus === "out for delivery";

  /* =========================================
     RETURN STATUS
  ========================================= */

  const returnStatus = String(
    order?.return_status || ""
  ).trim();

  const normalizedReturnStatus =
    returnStatus.toLowerCase();

  const isReturnRequested =
    normalizedReturnStatus === "requested";

  const isReturnPickupScheduled =
    normalizedReturnStatus === "pickup scheduled";

  const isReturnPickedUp =
    normalizedReturnStatus === "picked up";

  const isReturnCompleted =
    normalizedReturnStatus === "return completed";

  /* =========================================
     CANCEL ALLOWED
  ========================================= */

  const canCancel =
    !isCancelled &&
    !isDelivered &&
    !isShipped &&
    !isOutForDelivery;

  /* =========================================
     RETURN ALLOWED
  ========================================= */

  const canReturn =
    isDelivered &&
    !isReturnRequested &&
    !isReturnPickupScheduled &&
    !isReturnPickedUp &&
    !isReturnCompleted;

  /* =========================================
     CHECK IF ALL PRODUCTS ARE REVIEWED
  ========================================= */

  const allProductsReviewed =
    feedbackProducts.length > 0 &&
    feedbackProducts.every(
      (product) =>
        reviewedProducts[product.product_id]
    );

  /* =========================================
     STATUS → STEP INDEX
  ========================================= */

  const statusMap = {
    placed: 0,
    confirmed: 1,
    shipped: 2,
    "out for delivery": 3,
    delivered: 4,
  };

  const currentIndex =
    statusMap[normalizedStatus] ?? 0;

  /* =========================================
     TRACKING STEPS
  ========================================= */

  const steps = [
    {
      title: "Order Placed",
      status: "Placed",
      description:
        "Your order has been placed successfully.",
      icon: "✓",
    },
    {
      title: "Confirmed",
      status: "Confirmed",
      description:
        "Your order has been confirmed.",
      icon: "✓",
    },
    {
      title: "Shipped",
      status: "Shipped",
      description:
        "Your order has been shipped.",
      icon: "📦",
    },
    {
      title: "Out for Delivery",
      status: "Out for Delivery",
      description:
        "Your order is out for delivery.",
      icon: "🚚",
    },
    {
      title: "Delivered",
      status: "Delivered",
      description:
        "Your order has been delivered successfully.",
      icon: "✓",
    },
  ];

  /* =========================================
     CANCEL REASONS
  ========================================= */

  const cancelReasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Found a better price",
    "Delivery is taking too long",
    "I want to change the order",
    "Other",
  ];

  /* =========================================
     RETURN REASONS
  ========================================= */

  const returnReasons = [
    "Received damaged product",
    "Wrong product received",
    "Product quality is not good",
    "Product does not match description",
    "Received incomplete product",
    "Other",
  ];

  /* =========================================
     GET ORDER PRODUCTS
  ========================================= */

  const getOrderProducts = () => {
    let items =
      order?.items ||
      order?.order_items ||
      order?.products ||
      [];

    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch (error) {
        console.error(
          "Failed to parse order items:",
          error
        );

        items = [];
      }
    }

    if (!Array.isArray(items)) {
      items = [];
    }

    return items;
  };

  /* =========================================
     PREPARE FEEDBACK PRODUCTS
  ========================================= */

  useEffect(() => {
    if (!isDelivered) {
      setFeedbackProducts([]);
      setReviewedProducts({});
      return;
    }

    const products = getOrderProducts();

    const normalizedProducts = products
      .map((item, index) => {
        const productId =
          item?.product_id ??
          item?.productId ??
          item?.id;

        if (!productId) {
          return null;
        }

        return {
          ...item,

          product_id: Number(productId),

          product_name:
            item?.product_name ||
            item?.productName ||
            item?.name ||
            `Product ${index + 1}`,

          product_image:
            item?.product_image ||
            item?.productImage ||
            item?.image ||
            "",
        };
      })
      .filter(Boolean);

    setFeedbackProducts(
      normalizedProducts
    );
  }, [order, isDelivered]);

  /* =========================================
     PAYMENT METHOD
  ========================================= */

  const paymentMethod = String(
    order?.payment_method ||
    order?.paymentMethod ||
    "cod"
  ).toLowerCase();

  let paymentText = "Cash on Delivery";

  if (
    paymentMethod === "razorpay" ||
    paymentMethod === "online" ||
    paymentMethod === "card" ||
    paymentMethod === "credit" ||
    paymentMethod === "debit"
  ) {
    paymentText = "Credit / Debit Card";
  }

  if (paymentMethod === "upi") {
    paymentText = "UPI";
  }

  if (
    paymentMethod === "cash on delivery" ||
    paymentMethod === "cod"
  ) {
    paymentText = "Cash on Delivery";
  }

  /* =========================================
     TOTAL AMOUNT
  ========================================= */

  const totalAmount = Number(
    order?.total_amount ??
    order?.total ??
    0
  );

  /* =========================================
     ADDRESS EXISTS
  ========================================= */

  const hasAddress =
    order?.full_name ||
    order?.address_line ||
    order?.city;

  /* =========================================
     CHECK EXISTING REVIEWS
  ========================================= */

  const checkExistingReviews = async () => {
    if (!isDelivered) {
      return;
    }

    if (!order?.id) {
      return;
    }

    const products = getOrderProducts();

    if (!products.length) {
      return;
    }

    const token =
      localStorage.getItem(
        "customer_token"
      );

    if (!token) {
      return;
    }

    try {
      setLoadingReviewCheck(true);

      const reviewStatus = {};

      for (const item of products) {
        const productId =
          item?.product_id ??
          item?.productId ??
          item?.id;

        if (!productId) {
          continue;
        }

        try {
          const response = await fetch(
            `http://3.110.90.184/api/reviews/check/${order.id}/${productId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          const data =
            await response.json();

          reviewStatus[Number(productId)] =
            Boolean(data?.reviewed);
        } catch (error) {
          console.error(
            "Review check failed:",
            error
          );

          reviewStatus[Number(productId)] =
            false;
        }
      }

      setReviewedProducts(
        reviewStatus
      );
    } catch (error) {
      console.error(
        "Review status error:",
        error
      );
    } finally {
      setLoadingReviewCheck(false);
    }
  };

  useEffect(() => {
    checkExistingReviews();
  }, [order, isDelivered]);

  /* =========================================
     OPEN FEEDBACK
  ========================================= */

  const openFeedback = () => {
    if (!feedbackProducts.length) {
      alert(
        "Product information is not available for this order."
      );
      return;
    }

    const availableProducts =
      feedbackProducts.filter(
        (product) =>
          !reviewedProducts[
            product.product_id
          ]
      );

    if (!availableProducts.length) {
      return;
    }

    setFeedbackProduct(
      availableProducts[0]
    );

    setFeedbackRating(0);
    setFeedbackText("");
    setShowFeedbackModal(true);
  };

  /* =========================================
     SELECT FEEDBACK PRODUCT
  ========================================= */

  const selectFeedbackProduct = (
    product
  ) => {
    if (
      reviewedProducts[
        product.product_id
      ]
    ) {
      return;
    }

    setFeedbackProduct(product);
    setFeedbackRating(0);
    setFeedbackText("");
  };

  /* =========================================
     SUBMIT FEEDBACK
  ========================================= */

  const handleSubmitFeedback =
    async () => {
      if (!feedbackProduct) {
        alert(
          "Please select a product"
        );
        return;
      }

      if (!feedbackRating) {
        alert(
          "Please select a rating"
        );
        return;
      }

      if (!feedbackText.trim()) {
        alert(
          "Please write your feedback"
        );
        return;
      }

      const token =
        localStorage.getItem(
          "customer_token"
        );

      if (!token) {
        alert(
          "Please login again to submit feedback."
        );
        return;
      }

      try {
        setLoadingFeedback(true);

        const response = await fetch(
          "http://3.110.90.184/api/reviews",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              product_id:
                feedbackProduct.product_id,

              order_id:
                order.id,

              rating:
                feedbackRating,

              feedback:
                feedbackText.trim(),
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
            "Failed to submit feedback"
          );
        }

        /* =================================
           MARK ONLY THIS PRODUCT REVIEWED
        ================================= */

        setReviewedProducts(
          (previous) => ({
            ...previous,

            [feedbackProduct.product_id]:
              true,
          })
        );

        /* =================================
           CLOSE CURRENT PRODUCT MODAL
        ================================= */

        setShowFeedbackModal(false);

        setFeedbackRating(0);
        setFeedbackText("");

        /*
          The feedback card will automatically
          disappear when all products are reviewed.
          Then the Thanks card will appear.
        */
      } catch (error) {
        console.error(
          "Feedback submission error:",
          error
        );

        alert(
          error?.message ||
          "Failed to submit feedback"
        );
      } finally {
        setLoadingFeedback(false);
      }
    };

  /* =========================================
     HANDLE CANCEL
  ========================================= */

  const handleCancelOrder =
    async () => {
      const finalCancelReason =
        cancelReason === "Other"
          ? otherCancelReason.trim()
          : cancelReason;

      if (!finalCancelReason) {
        alert(
          "Please select a cancellation reason"
        );
        return;
      }

      if (
        typeof onCancel !== "function"
      ) {
        alert(
          "Cancel function is not connected. Please connect onCancel in the parent component."
        );
        return;
      }

      try {
        setLoadingCancel(true);

        await onCancel(
          order.id,
          finalCancelReason
        );

        setShowCancelModal(false);
        setCancelReason("");
        setOtherCancelReason("");
      } catch (error) {
        console.error(
          "Cancel order failed:",
          error
        );

        alert(
          error?.message ||
          "Failed to cancel order"
        );
      } finally {
        setLoadingCancel(false);
      }
    };

  /* =========================================
     HANDLE RETURN
  ========================================= */

  const handleReturnOrder =
    async () => {
      const finalReturnReason =
        returnReason === "Other"
          ? otherReturnReason.trim()
          : returnReason;

      if (!finalReturnReason) {
        alert(
          "Please select a return reason"
        );
        return;
      }

      if (
        typeof onReturn !== "function"
      ) {
        alert(
          "Return function is not connected. Please connect onReturn in the parent component."
        );
        return;
      }

      try {
        setLoadingReturn(true);

        await onReturn(
          order.id,
          finalReturnReason
        );

        setShowReturnModal(false);
        setReturnReason("");
        setOtherReturnReason("");
      } catch (error) {
        console.error(
          "Return request failed:",
          error
        );

        alert(
          error?.message ||
          "Failed to submit return request"
        );
      } finally {
        setLoadingReturn(false);
      }
    };

  return (
    <section className="order-tracking-page">

      <div className="order-tracking-card">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="tracking-header">

          <button
            type="button"
            className="tracking-back-button"
            onClick={onBack}
          >
            ←
          </button>

          <div>

            <p className="tracking-label">
              ORDER TRACKING
            </p>

            <h1>
              Track Your Order
            </h1>

            {order?.id && (
              <p className="tracking-order-number">
                Order #{order.id}
              </p>
            )}

          </div>

        </div>

        {/* =====================================
            CANCELLED ORDER
        ====================================== */}

        {isCancelled ? (

          <div className="tracking-cancelled">

            <div className="tracking-cancelled-icon">
              ✕
            </div>

            <div>

              <p className="tracking-cancelled-label">
                ORDER CANCELLED
              </p>

              <h2>
                This order has been cancelled
              </h2>

              <p>
                Your order was cancelled successfully
                and will not be delivered.
              </p>

              {order?.cancellation_reason && (

                <div className="cancel-reason-display">

                  <span>
                    Cancellation Reason
                  </span>

                  <strong>
                    {order.cancellation_reason}
                  </strong>

                </div>

              )}

            </div>

          </div>

        ) : (

          <>

            {/* =================================
                ORDER SUMMARY
            ================================== */}

            <div className="tracking-summary">

              <div>
                <span>
                  Order Status
                </span>

                <strong>
                  {rawStatus}
                </strong>
              </div>

              <div>
                <span>
                  Payment Method
                </span>

                <strong>
                  {paymentText}
                </strong>
              </div>

              <div>
                <span>
                  Total Amount
                </span>

                <strong>
                  ₹
                  {totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

            </div>

            {/* =================================
                TRACKING TIMELINE
            ================================== */}

            <div className="tracking-timeline">

              {steps.map(
                (step, index) => {

                  const isCompleted =
                    index <= currentIndex;

                  const isCurrent =
                    index === currentIndex;

                  return (

                    <div
                      key={step.status}
                      className={
                        "tracking-step" +
                        (
                          isCompleted
                            ? " completed"
                            : ""
                        ) +
                        (
                          isCurrent
                            ? " current-step"
                            : ""
                        )
                      }
                    >

                      <div
                        className={
                          "tracking-step-icon" +
                          (
                            isCompleted
                              ? " completed-icon"
                              : ""
                          )
                        }
                      >
                        {isCompleted
                          ? "✓"
                          : step.icon}
                      </div>

                      <div className="tracking-step-content">

                        <h3>
                          {step.title}
                        </h3>

                        <p>
                          {isCurrent
                            ? step.description
                            : index < currentIndex
                              ? "Completed"
                              : "Pending"}
                        </p>

                        {isCurrent && (

                          <span className="tracking-current-label">
                            CURRENT STATUS
                          </span>

                        )}

                      </div>

                      {index <
                        steps.length - 1 && (

                        <div
                          className={
                            "tracking-line" +
                            (
                              index < currentIndex
                                ? " completed-line"
                                : ""
                            )
                          }
                        />

                      )}

                    </div>

                  );
                }
              )}

            </div>

            {/* =================================
                CANCEL OPTION
            ================================== */}

            {canCancel && (

              <div className="cancel-order-box">

                <div className="cancel-order-content">

                  <h2>
                    Want to cancel this order?
                  </h2>

                  <p>
                    You can cancel this order before
                    it is shipped.
                  </p>

                </div>

                <button
                  type="button"
                  className="open-cancel-button"
                  onClick={() =>
                    setShowCancelModal(true)
                  }
                >
                  Cancel Order
                </button>

              </div>

            )}

            {/* =================================
                SHIPPING NOTICE
            ================================== */}

            {(isShipped ||
              isOutForDelivery) && (

              <div className="shipping-notice">

                <span>
                  📦
                </span>

                <div>

                  <strong>
                    Order cancellation unavailable
                  </strong>

                  <p>
                    This order has already been shipped
                    and can no longer be cancelled.
                  </p>

                </div>

              </div>

            )}

            {/* =================================
                RETURN OPTION
            ================================== */}

            {canReturn && (

              <div className="return-card">

                <div className="return-card-left">

                  <div className="return-icon">
                    ↩
                  </div>

                  <div className="return-card-content">

                    <span className="return-small-label">
                      RETURN AVAILABLE
                    </span>

                    <h2>
                      Not happy with your order?
                    </h2>

                    <p>
                      You can request a return for this
                      delivered product. Select a reason
                      and submit your request.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  className="open-return-button"
                  onClick={() =>
                    setShowReturnModal(true)
                  }
                >
                  Request Return
                  <span>→</span>
                </button>

              </div>

            )}

            {/* =================================
                FEEDBACK OPTION
            ================================== */}

            {isDelivered &&
              !allProductsReviewed && (

              <div className="feedback-card">

                <div className="feedback-card-left">

                  <div className="feedback-icon">
                    ⭐
                  </div>

                  <div className="feedback-card-content">

                    <span className="feedback-small-label">
                      PRODUCT FEEDBACK
                    </span>

                    <h2>
                      How was your product?
                    </h2>

                    <p>
                      Share your rating and feedback
                      to help other customers.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  className="open-feedback-button"
                  onClick={openFeedback}
                  disabled={
                    loadingReviewCheck
                  }
                >
                  {loadingReviewCheck
                    ? "Checking..."
                    : "Give Feedback"}

                  <span>
                    →
                  </span>

                </button>

              </div>

            )}

            {/* =================================
                FEEDBACK THANK YOU
            ================================== */}

            {isDelivered &&
              allProductsReviewed && (

              <div className="feedback-thanks-card">

                <div className="feedback-thanks-icon">
                  ✓
                </div>

                <div className="feedback-thanks-content">

                  <span className="feedback-small-label">
                    PRODUCT FEEDBACK
                  </span>

                  <h2>
                    Thanks for your feedback!
                  </h2>

                  <p>
                    Your feedback has been submitted successfully.
                    We appreciate you taking the time to share your experience.
                  </p>

                </div>

              </div>

            )}

            {/* =================================
                RETURN STATUS
            ================================== */}

            {isDelivered &&
              returnStatus && (

              <div
                className={
                  isReturnCompleted
                    ? "return-status-card completed"
                    : "return-status-card"
                }
              >

                <div className="return-status-top">

                  <div
                    className={
                      isReturnCompleted
                        ? "return-status-icon completed-icon"
                        : "return-status-icon"
                    }
                  >
                    {isReturnCompleted
                      ? "✓"
                      : "↩"}
                  </div>

                  <div className="return-status-heading">

                    <span className="return-status-label">

                      {isReturnCompleted
                        ? "RETURN COMPLETED"
                        : "RETURN REQUEST"}

                    </span>

                    <h2>

                      {isReturnCompleted
                        ? "Order is Returned"
                        : "Return request submitted"}

                    </h2>

                  </div>

                  <span
                    className={
                      isReturnCompleted
                        ? "return-status-badge completed-badge"
                        : "return-status-badge"
                    }
                  >
                    {returnStatus}
                  </span>

                </div>

                <div className="return-status-message">

                  <p>

                    {isReturnCompleted
                      ? "Your product has been successfully returned."
                      : (
                        <>
                          Your return request is currently{" "}
                          <strong>
                            {returnStatus}
                          </strong>
                        </>
                      )}

                  </p>

                </div>

                {order?.return_reason && (

                  <div className="return-reason-box">

                    <span>
                      Return Reason
                    </span>

                    <strong>
                      {order.return_reason}
                    </strong>

                  </div>

                )}

              </div>

            )}

          </>

        )}

        {/* =====================================
            DELIVERY ADDRESS
        ====================================== */}

        {hasAddress && (

          <div className="tracking-delivery">

            <h2>
              Delivery Address
            </h2>

            {order.full_name && (

              <p>
                <strong>
                  {order.full_name}
                </strong>
              </p>

            )}

            {order.phone && (

              <p>
                {order.phone}
              </p>

            )}

            {order.address_line && (

              <p>
                {order.address_line}
              </p>

            )}

            <p>

              {order.city || ""}

              {order.state
                ? `, ${order.state}`
                : ""}

              {order.pincode
                ? ` - ${order.pincode}`
                : ""}

            </p>

          </div>

        )}

        {/* =====================================
            ORDER INFO
        ====================================== */}

        <div className="tracking-order-info">

          <div>

            <span>
              ORDER
            </span>

            <strong>
              #{order?.id || "—"}
            </strong>

          </div>

          <div>

            <span>
              PAYMENT
            </span>

            <strong>
              {paymentText}
            </strong>

          </div>

          <div>

            <span>
              TOTAL
            </span>

            <strong>
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

        <button
          type="button"
          className="continue-shopping-button"
          onClick={onBack}
        >
          ← Back to My Orders
        </button>

      </div>

      {/* =====================================
          CANCEL MODAL
      ====================================== */}

      {showCancelModal && (

        <div
          className="cancel-modal-overlay"
          onClick={() =>
            setShowCancelModal(false)
          }
        >

          <div
            className="cancel-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="cancel-modal-header">

              <div>

                <span>
                  CANCEL ORDER
                </span>

                <h2>
                  Why do you want to cancel?
                </h2>

              </div>

              <button
                type="button"
                className="cancel-close-button"
                onClick={() =>
                  setShowCancelModal(false)
                }
              >
                ×
              </button>

            </div>

            <p className="cancel-modal-description">
              Select the reason for cancelling this order.
            </p>

            <div className="cancel-reasons-list">

              {cancelReasons.map(
                (reason) => (

                  <button
                    key={reason}
                    type="button"
                    className={
                      "cancel-reason-option" +
                      (
                        cancelReason === reason
                          ? " selected"
                          : ""
                      )
                    }
                    onClick={() =>
                      setCancelReason(reason)
                    }
                  >

                    <span className="cancel-radio">

                      {cancelReason === reason
                        ? "✓"
                        : ""}

                    </span>

                    <span>
                      {reason}
                    </span>

                  </button>

                )
              )}

            </div>

            {cancelReason === "Other" && (

              <textarea
                className="cancel-other-input"
                placeholder="Please describe why you want to cancel..."
                value={otherCancelReason}
                onChange={(e) =>
                  setOtherCancelReason(
                    e.target.value
                  )
                }
              />

            )}

            <div className="cancel-modal-actions">

              <button
                type="button"
                className="keep-order-button"
                onClick={() =>
                  setShowCancelModal(false)
                }
              >
                Keep Order
              </button>

              <button
                type="button"
                className="submit-cancel-button"
                disabled={
                  loadingCancel ||
                  !cancelReason ||
                  (
                    cancelReason === "Other" &&
                    !otherCancelReason.trim()
                  )
                }
                onClick={handleCancelOrder}
              >

                {loadingCancel
                  ? "Cancelling..."
                  : "Cancel Order"}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================
          RETURN MODAL
      ====================================== */}

      {showReturnModal && (

        <div
          className="return-modal-overlay"
          onClick={() =>
            setShowReturnModal(false)
          }
        >

          <div
            className="return-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="return-modal-header">

              <div>

                <span>
                  RETURN ORDER
                </span>

                <h2>
                  Why do you want to return?
                </h2>

              </div>

              <button
                type="button"
                className="return-close-button"
                onClick={() =>
                  setShowReturnModal(false)
                }
              >
                ×
              </button>

            </div>

            <p className="return-modal-description">
              Select the reason for returning this order.
            </p>

            <div className="return-reasons-list">

              {returnReasons.map(
                (reason) => (

                  <button
                    key={reason}
                    type="button"
                    className={
                      "return-reason-option" +
                      (
                        returnReason === reason
                          ? " selected"
                          : ""
                      )
                    }
                    onClick={() =>
                      setReturnReason(reason)
                    }
                  >

                    <span className="reason-radio">

                      {returnReason === reason
                        ? "✓"
                        : ""}

                    </span>

                    <span>
                      {reason}
                    </span>

                  </button>

                )
              )}

            </div>

            {returnReason === "Other" && (

              <textarea
                className="return-other-input"
                placeholder="Please describe the reason..."
                value={otherReturnReason}
                onChange={(e) =>
                  setOtherReturnReason(
                    e.target.value
                  )
                }
              />

            )}

            <div className="return-modal-actions">

              <button
                type="button"
                className="keep-order-button"
                onClick={() =>
                  setShowReturnModal(false)
                }
              >
                Keep Order
              </button>

              <button
                type="button"
                className="submit-return-button"
                disabled={
                  loadingReturn ||
                  !returnReason ||
                  (
                    returnReason === "Other" &&
                    !otherReturnReason.trim()
                  )
                }
                onClick={handleReturnOrder}
              >

                {loadingReturn
                  ? "Submitting..."
                  : "Request Return"}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================
          FEEDBACK MODAL
      ====================================== */}

      {showFeedbackModal && (

        <div
          className="feedback-modal-overlay"
          onClick={() =>
            setShowFeedbackModal(false)
          }
        >

          <div
            className="feedback-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =================================
                FEEDBACK MODAL HEADER
            ================================== */}

            <div className="feedback-modal-header">

              <div>

                <span>
                  PRODUCT FEEDBACK
                </span>

                <h2>
                  Rate your product
                </h2>

              </div>

              <button
                type="button"
                className="feedback-close-button"
                onClick={() =>
                  setShowFeedbackModal(false)
                }
              >
                ×
              </button>

            </div>

            {/* =================================
                PRODUCT SELECTION
            ================================== */}

            {feedbackProducts.length > 1 && (

              <div className="feedback-product-list">

                <p className="feedback-section-label">
                  SELECT PRODUCT
                </p>

                {feedbackProducts.map(
                  (product) => {

                    const productId =
                      product.product_id;

                    const isReviewed =
                      Boolean(
                        reviewedProducts[
                          productId
                        ]
                      );

                    const isSelected =
                      feedbackProduct?.product_id ===
                      productId;

                    return (

                      <button
                        key={productId}
                        type="button"
                        className={
                          "feedback-product-option" +
                          (
                            isSelected
                              ? " selected"
                              : ""
                          ) +
                          (
                            isReviewed
                              ? " reviewed"
                              : ""
                          )
                        }
                        disabled={isReviewed}
                        onClick={() =>
                          selectFeedbackProduct(
                            product
                          )
                        }
                      >

                        {product.product_image && (

                          <img
                            src={
                              product.product_image
                            }
                            alt={
                              product.product_name
                            }
                          />

                        )}

                        <span>
                          {product.product_name}
                        </span>

                        {isReviewed && (

                          <strong>
                            ✓ Reviewed
                          </strong>

                        )}

                      </button>

                    );
                  }
                )}

              </div>

            )}

            {/* =================================
                SELECTED PRODUCT
            ================================== */}

            {feedbackProduct && (

              <div className="feedback-selected-product">

                {feedbackProduct.product_image && (

                  <img
                    src={
                      feedbackProduct.product_image
                    }
                    alt={
                      feedbackProduct.product_name
                    }
                  />

                )}

                <div>

                  <span>
                    PRODUCT
                  </span>

                  <strong>
                    {feedbackProduct.product_name}
                  </strong>

                </div>

              </div>

            )}

            {/* =================================
                STAR RATING
            ================================== */}

            <div className="feedback-rating-section">

              <p>
                How would you rate this product?
              </p>

              <div className="feedback-stars">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <button
                      key={star}
                      type="button"
                      className={
                        star <= feedbackRating
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setFeedbackRating(
                          star
                        )
                      }
                    >
                      ★
                    </button>

                  )
                )}

              </div>

              {feedbackRating > 0 && (

                <span className="feedback-rating-text">

                  {feedbackRating === 1 &&
                    "Poor"}

                  {feedbackRating === 2 &&
                    "Fair"}

                  {feedbackRating === 3 &&
                    "Good"}

                  {feedbackRating === 4 &&
                    "Very Good"}

                  {feedbackRating === 5 &&
                    "Excellent"}

                </span>

              )}

            </div>

            {/* =================================
                FEEDBACK TEXT
            ================================== */}

            <div className="feedback-text-section">

              <label>
                Your Feedback
              </label>

              <textarea
                placeholder="Tell us about your experience with this product..."
                value={feedbackText}
                onChange={(e) =>
                  setFeedbackText(
                    e.target.value
                  )
                }
                rows="5"
                maxLength="1000"
              />

              <span>
                {feedbackText.length}/1000
              </span>

            </div>

            {/* =================================
                ACTIONS
            ================================== */}

            <div className="feedback-modal-actions">

              <button
                type="button"
                className="feedback-cancel-button"
                onClick={() =>
                  setShowFeedbackModal(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="feedback-submit-button"
                disabled={
                  loadingFeedback ||
                  !feedbackProduct ||
                  !feedbackRating ||
                  !feedbackText.trim()
                }
                onClick={
                  handleSubmitFeedback
                }
              >

                {loadingFeedback
                  ? "Submitting..."
                  : "Submit Feedback"}

              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default OrderTracking;