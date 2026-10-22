import React from "react";
import {
  Headphones,
  Package,
  CreditCard,
  UserRound,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./HelpSupport.css";

function HelpSupport() {
  const navigate = useNavigate();

  const supportTopics = [
    {
      icon: Package,
      title: "Orders & Tracking",
      description:
        "Track your orders, check delivery updates, and get assistance with order-related questions.",
      color: "blue",
    },
    {
      icon: CreditCard,
      title: "Payments & Refunds",
      description:
        "Get help with payment failures, transaction status, refunds, and billing questions.",
      color: "green",
    },
    {
      icon: UserRound,
      title: "Account Assistance",
      description:
        "Need help with your profile, login, saved addresses, or account information?",
      color: "purple",
    },
    {
      icon: Truck,
      title: "Shipping & Delivery",
      description:
        "Find assistance with delivery timelines, shipping information, and delivery concerns.",
      color: "orange",
    },
  ];

  return (
    <main className="help-page">
      <div className="help-container">

        {/* Hero Section */}
        <section className="help-hero">
          <div className="help-hero-content">
            <div className="help-eyebrow">
              <Headphones size={16} />
              <span>SHOPEASE CUSTOMER CARE</span>
            </div>

            <h1>
              How can we <span>help you?</span>
            </h1>

            <p>
              We're here to make your shopping experience
              simple and stress-free. Find answers, explore
              support topics, and get the help you need.
            </p>

            <button
              type="button"
              className="help-primary-btn"
              onClick={() => navigate("/contact-us")}
            >
              Contact Our Team
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="help-hero-visual">
            <div className="help-visual-circle">
              <Headphones size={66} strokeWidth={1.5} />
            </div>

            <div className="help-floating-card help-floating-top">
              <ShieldCheck size={20} />
              <div>
                <strong>Here for you</strong>
                <span>Customer assistance</span>
              </div>
            </div>

            <div className="help-floating-card help-floating-bottom">
              <MessageCircle size={20} />
              <div>
                <strong>Need assistance?</strong>
                <span>We're ready to help</span>
              </div>
            </div>
          </div>
        </section>

        {/* Support Topics */}
        <section className="help-topics-section">
          <div className="help-section-heading">
            <span className="help-section-label">
              SUPPORT CENTER
            </span>

            <h2>What can we help you with?</h2>

            <p>
              Choose a topic below to find the right kind of assistance.
            </p>
          </div>

          <div className="help-topics-grid">
            {supportTopics.map((topic, index) => {
              const Icon = topic.icon;

              return (
                <article
                  className="help-topic-card"
                  key={topic.title}
                  style={{ "--topic-index": index }}
                >
                  <div className={`help-topic-icon ${topic.color}`}>
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <h3>{topic.title}</h3>

                  <p>{topic.description}</p>

                  <button
                    type="button"
                    className="help-topic-link"
                    onClick={() => navigate("/contact-us")}
                    aria-label={`Get help with ${topic.title}`}
                  >
                    Get assistance
                    <ArrowRight size={16} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* Contact Banner */}
        <section className="help-contact-banner">
          <div className="help-contact-icon">
            <MessageCircle size={30} />
          </div>

          <div className="help-contact-copy">
            <h2>Still need a helping hand?</h2>
            <p>
              Our support team is available to help with your questions.
              Reach out to us for further assistance.
            </p>
          </div>

          <button
            type="button"
            className="help-contact-btn"
            onClick={() => navigate("/contact-us")}
          >
            Contact Us
            <ArrowRight size={17} />
          </button>
        </section>

        {/* Closing Note */}
        <div className="help-closing-note">
          <ShieldCheck size={19} />
          <p>
            Your trust matters to us. ShopEase is committed to
            providing a helpful and reliable shopping experience.
          </p>
        </div>

      </div>
    </main>
  );
}

export default HelpSupport;