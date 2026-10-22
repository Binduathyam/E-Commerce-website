import React from "react";
import {
  RotateCcw,
  PackageCheck,
  ClipboardCheck,
  Wallet,
  Clock,
  Headphones,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ReturnsRefunds.css";

function ReturnsRefunds() {
  const navigate = useNavigate();

  const returnSteps = [
    {
      icon: ClipboardCheck,
      number: "01",
      title: "Submit a Request",
      description:
        "Contact our support team with your order details and the reason for your return request.",
    },
    {
      icon: PackageCheck,
      number: "02",
      title: "Request Review",
      description:
        "Our team will review your request against the applicable product and return conditions.",
    },
    {
      icon: RotateCcw,
      number: "03",
      title: "Return the Product",
      description:
        "If approved, follow the return instructions provided by our support team.",
    },
    {
      icon: Wallet,
      number: "04",
      title: "Refund Processing",
      description:
        "Eligible refunds will be processed according to the applicable policy and payment method.",
    },
  ];

  return (
    <main className="returns-page">
      <div className="returns-container">

        {/* Hero */}
        <section className="returns-hero">
          <div className="returns-hero-content">
            <div className="returns-eyebrow">
              <RotateCcw size={16} />
              <span>SHOPEASE CUSTOMER CARE</span>
            </div>

            <h1>
              Returns & <span>Refunds</span>
            </h1>

            <p>
              We want you to shop with confidence. If something
              isn't right with your purchase, learn how to request
              a return and get assistance with an eligible refund.
            </p>

            <button
              type="button"
              className="returns-primary-btn"
              onClick={() => navigate("/contact-us")}
            >
              Request Assistance
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="returns-hero-art">
            <div className="returns-art-circle">
              <RotateCcw size={65} strokeWidth={1.5} />
            </div>

            <div className="returns-floating-card returns-floating-one">
              <PackageCheck size={21} />
              <div>
                <strong>Return Support</strong>
                <span>Guidance when you need it</span>
              </div>
            </div>

            <div className="returns-floating-card returns-floating-two">
              <ShieldCheck size={21} />
              <div>
                <strong>Shop with Confidence</strong>
                <span>Clear return guidance</span>
              </div>
            </div>
          </div>
        </section>

        {/* Return Policy */}
        <section className="returns-policy-section">
          <div className="returns-section-heading">
            <span className="returns-section-label">
              OUR RETURN PROCESS
            </span>

            <h2>How Returns & Refunds Work</h2>

            <p>
              Follow these steps to get assistance with your purchase.
            </p>
          </div>

          <div className="returns-steps-grid">
            {returnSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  className="returns-step-card"
                  key={step.number}
                >
                  <div className="returns-step-top">
                    <div className="returns-step-icon">
                      <Icon size={25} strokeWidth={1.8} />
                    </div>

                    <span className="returns-step-number">
                      {step.number}
                    </span>
                  </div>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Important Information */}
        <section className="returns-information">
          <div className="returns-information-heading">
            <div className="returns-information-icon">
              <ClipboardCheck size={25} />
            </div>

            <div>
              <span className="returns-section-label">
                BEFORE YOU REQUEST A RETURN
              </span>
              <h2>Things to Keep in Mind</h2>
            </div>
          </div>

          <div className="returns-info-list">
            <article className="returns-info-item">
              <div className="returns-info-bullet">01</div>
              <div>
                <h3>Return Eligibility</h3>
                <p>
                  Return eligibility depends on the product category,
                  applicable return window, and the published
                  ShopEase return policy.
                </p>
              </div>
            </article>

            <article className="returns-info-item">
              <div className="returns-info-bullet">02</div>
              <div>
                <h3>Product Condition</h3>
                <p>
                  Keep the product, original packaging, accessories,
                  labels, and included items where applicable.
                  Follow the instructions provided for your return.
                </p>
              </div>
            </article>

            <article className="returns-info-item">
              <div className="returns-info-bullet">03</div>
              <div>
                <h3>Refund Method</h3>
                <p>
                  Approved refunds are processed according to the
                  applicable policy and payment provider. The time
                  taken may vary depending on the payment method.
                </p>
              </div>
            </article>

            <article className="returns-info-item">
              <div className="returns-info-bullet">04</div>
              <div>
                <h3>Damaged or Incorrect Items</h3>
                <p>
                  If an item arrives damaged, defective, or different
                  from what you ordered, contact support and provide
                  your order details and any relevant evidence.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Refund Note */}
        <section className="returns-refund-note">
          <div className="returns-note-icon">
            <Clock size={25} />
          </div>

          <div>
            <h3>When will I receive my refund?</h3>
            <p>
              Refund timing depends on return approval, processing
              requirements, and your payment provider. Please refer
              to your order details or contact support for
              information about your specific request.
            </p>
          </div>
        </section>

        {/* Contact Banner */}
        <section className="returns-contact-banner">
          <div className="returns-contact-icon">
            <Headphones size={29} />
          </div>

          <div className="returns-contact-copy">
            <h2>Need help with a return?</h2>
            <p>
              Have a question about an order, return request, or
              refund? Our support team can help you understand
              the next steps.
            </p>
          </div>

          <button
            type="button"
            className="returns-contact-btn"
            onClick={() => navigate("/contact-us")}
          >
            Contact Support
            <ArrowRight size={17} />
          </button>
        </section>

        {/* Closing Note */}
        <div className="returns-closing-note">
          <ShieldCheck size={19} />
          <p>
            ShopEase aims to make the returns process clear and
            convenient. All requests are subject to the applicable
            return and refund policy.
          </p>
        </div>

      </div>
    </main>
  );
}

export default ReturnsRefunds;