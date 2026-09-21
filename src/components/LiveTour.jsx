import React, { useEffect, useState } from "react";

function LiveTour({ role = "customer", onFinish }) {
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState(null);

  // =========================================================
  // TOUR DATA
  // =========================================================

  const customerSteps = [
    {
      title: "👋 Welcome to ShopEase!",
      text: "Welcome to ShopEase. Let us quickly show you the main features of the website.",
      target: null,
    },
    {
      title: "🔍 Search Products",
      text: "Use this search bar to quickly find the products you are looking for.",
      target: "tour-search",
    },
    {
      title: "👤 Profile",
      text: "Click here to view and manage your profile, orders and account settings.",
      target: "tour-profile",
    },
    {
      title: "♡ Wishlist",
      text: "Save your favourite products here so you can easily find them later.",
      target: "tour-wishlist",
    },
    {
      title: "🛒 Cart",
      text: "Products you add to your cart will appear here. Review your products and continue to checkout.",
      target: "tour-cart",
    },
    {
      title: "🎉 You're Ready!",
      text: "That's all! You now know the main features of ShopEase. Happy shopping!",
      target: null,
    },
  ];

  const merchantSteps = [
    {
      title: "👋 Welcome Merchant!",
      text: "Welcome to the ShopEase Merchant Dashboard. Let us quickly show you the important sections.",
      target: null,
    },
    {
      title: "📦 My Products",
      text: "Use My Products to add, edit and manage the products you sell on ShopEase.",
      target: "tour-merchant-products",
    },
    {
      title: "🛍️ Orders",
      text: "Check customer orders here and manage the order processing status.",
      target: "tour-merchant-orders",
    },
    {
      title: "📊 Inventory",
      text: "Manage your product stock and keep track of available inventory here.",
      target: "tour-merchant-inventory",
    },
    {
      title: "💰 Sales",
      text: "View your sales information and monitor your business performance here.",
      target: "tour-merchant-sales",
    },
   {
  title: "👤 Profile",
  text: "Manage your merchant profile and account information from here.",
  target: "tour-merchant-profile-top",
},
    {
      title: "➕ Add Product",
      text: "Use this option to quickly add a new product to your ShopEase store.",
      target: "tour-merchant-add-product",
    },
    {
      title: "🎉 You're Ready!",
      text: "You now know the main sections of the Merchant Dashboard. Start managing your store!",
      target: null,
    },
  ];

  const deliverySteps = [
    {
      title: "👋 Welcome Delivery Partner!",
      text: "Welcome to the ShopEase Delivery Dashboard. Let us quickly show you the important sections.",
      target: null,
    },
    {
      title: "🚚 My Deliveries",
      text: "View and manage the deliveries assigned to you from this section.",
      target: "tour-delivery-my-deliveries",
    },
    {
      title: "📦 Assigned Orders",
      text: "Check orders that have been assigned to you and accept them for delivery.",
      target: "tour-delivery-assigned-orders",
    },
    {
      title: "↩️ Returns",
      text: "Manage customer return requests and update the return status from here.",
      target: "tour-delivery-returns",
    },
    {
      title: "🕘 Delivery History",
      text: "View your previously completed deliveries and delivery history here.",
      target: "tour-delivery-history",
    },
    {
      title: "💰 Earnings",
      text: "Check your delivery earnings and payment information from this section.",
      target: "tour-delivery-earnings",
    },
    {
      title: "👤 Profile",
      text: "Manage your delivery partner profile and account information here.",
      target: "tour-delivery-profile",
    },
    {
      title: "🎉 You're Ready!",
      text: "You now know the main sections of the Delivery Dashboard. Happy delivering!",
      target: null,
    },
  ];

  // =========================================================
  // SELECT TOUR BASED ON ROLE
  // =========================================================

  let steps = customerSteps;

  if (role === "merchant") {
    steps = merchantSteps;
  } else if (role === "delivery" || role === "delivery_partner") {
    steps = deliverySteps;
  }

  const currentStep = steps[step];

  // =========================================================
  // FIND TARGET ELEMENT POSITION
  // =========================================================

  const updatePosition = () => {
    if (!currentStep?.target) {
      setPosition(null);
      return;
    }

    const element = document.getElementById(currentStep.target);

    if (!element) {
      setPosition(null);
      return;
    }

    const rect = element.getBoundingClientRect();

    setPosition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  };

  // =========================================================
  // UPDATE POSITION WHEN STEP CHANGES
  // =========================================================

  useEffect(() => {
    updatePosition();

    const timer = setTimeout(() => {
      updatePosition();
    }, 100);

    const timer2 = setTimeout(() => {
      updatePosition();
    }, 500);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);

      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [step, currentStep?.target]);

  // =========================================================
  // NEXT
  // =========================================================

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep((previousStep) => previousStep + 1);
    } else {
      finishTour();
    }
  };

  // =========================================================
  // PREVIOUS
  // =========================================================

  const previousStep = () => {
    if (step > 0) {
      setStep((previousStep) => previousStep - 1);
    }
  };

  // =========================================================
  // FINISH TOUR
  // =========================================================

  const finishTour = () => {
    let storageKey = "shopease_customer_tour_completed";

    if (role === "merchant") {
      storageKey = "shopease_merchant_tour_completed";
    } else if (
      role === "delivery" ||
      role === "delivery_partner"
    ) {
      storageKey = "shopease_delivery_tour_completed";
    }

    localStorage.setItem(storageKey, "true");

    setPosition(null);

    if (onFinish) {
      onFinish();
    }
  };

  // =========================================================
  // ESC KEY TO CLOSE TOUR
  // =========================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        finishTour();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [role]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="live-tour-container">

      {/* DARK OVERLAY */}
      <div className="live-tour-overlay"></div>

      {/* HIGHLIGHT TARGET */}
      {position && (
        <div
          className="live-tour-spotlight"
          style={{
            top: `${position.top - 8}px`,
            left: `${position.left - 8}px`,
            width: `${position.width + 16}px`,
            height: `${position.height + 16}px`,
          }}
        />
      )}

      {/* =====================================================
          CENTER BOX
          Used for Welcome and Finish
      ===================================================== */}

      {!currentStep?.target && (
        <div className="live-tour-center-box">

          <div className="live-tour-step">
            Step {step + 1} of {steps.length}
          </div>

          <h2>{currentStep?.title}</h2>

          <p>{currentStep?.text}</p>

          <div className="live-tour-buttons">

            {step > 0 && (
              <button
                type="button"
                onClick={previousStep}
                className="live-tour-back-button"
              >
                ← Back
              </button>
            )}

            <button
              type="button"
              onClick={finishTour}
              className="live-tour-skip-button"
            >
              {step === steps.length - 1
                ? "Close"
                : "Skip Tour"}
            </button>

            <button
              type="button"
              onClick={nextStep}
              className="live-tour-next-button"
            >
              {step === steps.length - 1
                ? "Finish ✓"
                : "Next →"}
            </button>

          </div>
        </div>
      )}

      {/* =====================================================
          TARGET TOOLTIP
      ===================================================== */}

      {currentStep?.target && position && (
        <div
          className="live-tour-tooltip"
          style={{
            top: `${Math.min(
              position.top + position.height + 18,
              window.innerHeight - 250
            )}px`,

            left: `${Math.max(
              15,
              Math.min(
                position.left,
                window.innerWidth - 375
              )
            )}px`,
          }}
        >

          <div className="live-tour-step">
            Step {step + 1} of {steps.length}
          </div>

          <h2>{currentStep.title}</h2>

          <p>{currentStep.text}</p>

          <div className="live-tour-buttons">

            {step > 0 && (
              <button
                type="button"
                onClick={previousStep}
                className="live-tour-back-button"
              >
                ← Back
              </button>
            )}

            <button
              type="button"
              onClick={finishTour}
              className="live-tour-skip-button"
            >
              Skip
            </button>

            <button
              type="button"
              onClick={nextStep}
              className="live-tour-next-button"
            >
              {step === steps.length - 1
                ? "Finish ✓"
                : "Next →"}
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          TARGET NOT FOUND FALLBACK
      ===================================================== */}

      {currentStep?.target && !position && (
        <div className="live-tour-center-box">

          <div className="live-tour-step">
            Step {step + 1} of {steps.length}
          </div>

          <h2>{currentStep.title}</h2>

          <p>{currentStep.text}</p>

          <div className="live-tour-buttons">

            {step > 0 && (
              <button
                type="button"
                onClick={previousStep}
                className="live-tour-back-button"
              >
                ← Back
              </button>
            )}

            <button
              type="button"
              onClick={finishTour}
              className="live-tour-skip-button"
            >
              Skip
            </button>

            <button
              type="button"
              onClick={nextStep}
              className="live-tour-next-button"
            >
              {step === steps.length - 1
                ? "Finish ✓"
                : "Next →"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default LiveTour;