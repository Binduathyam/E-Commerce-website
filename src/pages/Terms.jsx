import React from "react";
import {
  FileText,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Truck,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Scale,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Terms.css";

function Terms() {
  const navigate = useNavigate();

  const termsSections = [
    {
      icon: UserCheck,
      number: "01",
      title: "Use of the Platform",
      description:
        "By accessing ShopEase, you agree to use the platform responsibly and comply with applicable laws. You are responsible for providing accurate information and maintaining the security of your account credentials.",
    },
    {
      icon: ShoppingBag,
      number: "02",
      title: "Products & Availability",
      description:
        "We aim to display accurate product descriptions, images, prices, and availability. Product details and availability may change. If an error affects an order, we will handle the issue in accordance with applicable law and our relevant policies.",
    },
    {
      icon: CreditCard,
      number: "03",
      title: "Orders & Payments",
      description:
        "Orders are subject to availability, order verification, and confirmation. Prices, applicable taxes, shipping charges, and available payment methods will be presented as relevant during checkout. Orders and payments are handled subject to applicable terms and law.",
    },
    {
      icon: Truck,
      number: "04",
      title: "Shipping & Delivery",
      description:
        "Customers must provide a complete and accurate delivery address and contact information. Delivery estimates may vary because of location, courier operations, weather, or other circumstances beyond our reasonable control.",
    },
    {
      icon: RefreshCw,
      number: "05",
      title: "Returns & Refunds",
      description:
        "Returns, replacements, cancellations, and refunds are governed by the applicable ShopEase policies. Eligibility, conditions, and processing requirements may vary by product and order. Please review our Returns & Refunds page before placing an order.",
    },
    {
      icon: ShieldCheck,
      number: "06",
      title: "Privacy & Personal Information",
      description:
        "We handle personal information in accordance with our Privacy Policy and applicable data protection laws. Please review the Privacy Policy to understand how information may be collected, used, and protected.",
    },
    {
      icon: AlertCircle,
      number: "07",
      title: "Acceptable Use",
      description:
        "You must not misuse the platform, interfere with its operation, attempt unauthorized access, submit fraudulent orders, or use the services for unlawful activities.",
    },
    {
      icon: FileText,
      number: "08",
      title: "Intellectual Property",
      description:
        "Unless otherwise stated, ShopEase branding, website design, text, and other original platform content may be protected by intellectual property laws. You may not reproduce or commercially use protected content without appropriate authorization.",
    },
    {
      icon: Scale,
      number: "09",
      title: "Liability & Applicable Law",
      description:
        "These terms are subject to applicable law. Nothing in these terms excludes or limits any right, remedy, or liability that cannot legally be excluded or limited. Any permitted limitations must be interpreted in accordance with applicable law.",
    },
    {
      icon: RefreshCw,
      number: "10",
      title: "Changes to These Terms",
      description:
        "We may revise these terms as our services or legal obligations change. Updated terms will be published on this page with a revised effective date. Changes will apply as permitted by applicable law.",
    },
  ];

  return (
    <main className="terms-page">
      <div className="terms-container">

        {/* Hero Section */}
        <section className="terms-hero">
          <div className="terms-hero-content">
            <div className="terms-eyebrow">
              <FileText size={16} />
              <span>SHOPEASE POLICIES</span>
            </div>

            <h1>
              Terms & <span>Conditions</span>
            </h1>

            <p>
              Please read these terms carefully before using ShopEase.
              They explain the general rules that apply when you access
              our website, browse products, or place an order.
            </p>

            <div className="terms-hero-note">
              <ShieldCheck size={19} />
              <span>
                Clear terms for a better shopping experience
              </span>
            </div>
          </div>

          <div className="terms-hero-visual">
            <div className="terms-visual-circle">
              <FileText size={67} strokeWidth={1.5} />
            </div>

            <div className="terms-floating-card terms-floating-top">
              <ShieldCheck size={21} />
              <div>
                <strong>Platform Guidelines</strong>
                <span>Know your responsibilities</span>
              </div>
            </div>

            <div className="terms-floating-card terms-floating-bottom">
              <ShoppingBag size={21} />
              <div>
                <strong>Shop with Confidence</strong>
                <span>Understand our terms</span>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="terms-introduction">
          <div className="terms-intro-icon">
            <FileText size={25} />
          </div>

          <div>
            <h2>Welcome to ShopEase</h2>
            <p>
              These Terms & Conditions describe the general rules for
              using the ShopEase platform. By accessing or using our
              services, you agree to these terms to the extent permitted
              by applicable law. If you do not agree, please discontinue
              using the platform.
            </p>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="terms-content-section">
          <div className="terms-section-heading">
            <span className="terms-section-label">
              PLATFORM POLICIES
            </span>

            <h2>Our Terms of Service</h2>

            <p>
              Important information about using ShopEase and placing orders.
            </p>
          </div>

          <div className="terms-sections-grid">
            {termsSections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  className="terms-section-card"
                  key={section.number}
                >
                  <div className="terms-card-top">
                    <div className="terms-card-icon">
                      <Icon size={23} strokeWidth={1.8} />
                    </div>

                    <span className="terms-card-number">
                      {section.number}
                    </span>
                  </div>

                  <h3>{section.title}</h3>

                  <p>{section.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Policy Links */}
        <section className="terms-related-section">
          <div className="terms-related-heading">
            <span className="terms-section-label">
              MORE INFORMATION
            </span>

            <h2>Explore Our Policies</h2>

            <p>
              Learn more about privacy, returns, and customer assistance.
            </p>
          </div>

          <div className="terms-related-links">
            <button
              type="button"
              className="terms-related-link"
              onClick={() => navigate("/privacy-policy")}
            >
              <span className="terms-related-icon">
                <ShieldCheck size={21} />
              </span>

              <span className="terms-related-text">
                <strong>Privacy Policy</strong>
                <small>How we handle personal information</small>
              </span>

              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="terms-related-link"
              onClick={() => navigate("/returns-refunds")}
            >
              <span className="terms-related-icon">
                <RefreshCw size={21} />
              </span>

              <span className="terms-related-text">
                <strong>Returns & Refunds</strong>
                <small>Information about return requests</small>
              </span>

              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Contact Banner */}
        <section className="terms-contact-banner">
          <div className="terms-contact-icon">
            <Headphones size={28} />
          </div>

          <div className="terms-contact-copy">
            <h2>Have questions about these terms?</h2>

            <p>
              Contact our support team if you need clarification
              about using ShopEase or our policies.
            </p>
          </div>

          <button
            type="button"
            className="terms-contact-btn"
            onClick={() => navigate("/contact-us")}
          >
            Contact Us
            <ArrowRight size={17} />
          </button>
        </section>

      </div>
    </main>
  );
}

export default Terms;