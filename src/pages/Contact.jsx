import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Headphones,
  Package,
  CreditCard,
  UserRound,
  ArrowRight,
  Clock,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

function Contact() {
  const navigate = useNavigate();

  const contactDetails = [
    {
      icon: Mail,
      label: "Email Support",
      value: "support@shopease.com",
      description: "Send us your questions",
      color: "blue",
      action: () =>
        window.location.assign("mailto:support@shopease.com"),
    },
    {
      icon: Phone,
      label: "Phone Support",
      value: "+91 90000 00000",
      description: "Call our support team",
      color: "green",
      action: () =>
        window.location.assign("tel:+919000000000"),
    },
    {
      icon: MapPin,
      label: "Our Location",
      value: "ShopEase Support Center",
      description: "India",
      color: "purple",
    },
  ];

  const supportTopics = [
    {
      icon: Package,
      title: "Orders & Delivery",
      description:
        "Get assistance with order status, tracking, and delivery questions.",
    },
    {
      icon: CreditCard,
      title: "Payments & Refunds",
      description:
        "Get help with payment issues, transactions, and refund requests.",
    },
    {
      icon: UserRound,
      title: "Account Assistance",
      description:
        "Need help with your profile, login, or account information?",
    },
  ];

  return (
    <main className="contact-page">
      <div className="contact-container">

        {/* Hero Section */}
        <section className="contact-hero">
          <div className="contact-hero-content">
            <div className="contact-eyebrow">
              <Headphones size={16} />
              <span>SHOPEASE CUSTOMER CARE</span>
            </div>

            <h1>
              Let's start a <span>conversation.</span>
            </h1>

            <p>
              Have a question or need assistance with your shopping
              experience? Our support team is here to help you find
              the right solution.
            </p>

            <button
              type="button"
              className="contact-primary-btn"
              onClick={() =>
                window.location.assign("mailto:support@shopease.com")
              }
            >
              <Mail size={18} />
              Email Our Team
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="contact-hero-visual">
            <div className="contact-visual-circle">
              <MessageCircle size={67} strokeWidth={1.5} />
            </div>

            <div className="contact-floating-card contact-floating-top">
              <span className="contact-status-dot" />
              <div>
                <strong>We're here to help</strong>
                <small>Customer support</small>
              </div>
            </div>

            <div className="contact-floating-card contact-floating-bottom">
              <Headphones size={21} />
              <div>
                <strong>Need assistance?</strong>
                <small>Get in touch with us</small>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="contact-details-section">
          <div className="contact-section-heading">
            <span className="contact-section-label">
              GET IN TOUCH
            </span>

            <h2>We're just a message away</h2>

            <p>
              Choose the most convenient way to contact ShopEase.
            </p>
          </div>

          <div className="contact-details-grid">
            {contactDetails.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  className="contact-detail-card"
                  key={item.label}
                >
                  <div className={`contact-detail-icon ${item.color}`}>
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <h3>{item.label}</h3>

                  <strong className="contact-detail-value">
                    {item.value}
                  </strong>

                  <p>{item.description}</p>

                  {item.action && (
                    <button
                      type="button"
                      className="contact-detail-link"
                      onClick={item.action}
                    >
                      {item.label === "Email Support"
                        ? "Send an email"
                        : "Call support"}
                      <ArrowRight size={15} />
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Support Categories */}
        <section className="contact-support-section">
          <div className="contact-section-heading">
            <span className="contact-section-label">
              HOW CAN WE HELP?
            </span>

            <h2>What do you need assistance with?</h2>

            <p>
              Find the right support for your ShopEase experience.
            </p>
          </div>

          <div className="contact-support-grid">
            {supportTopics.map((topic) => {
              const Icon = topic.icon;

              return (
                <article
                  className="contact-support-card"
                  key={topic.title}
                >
                  <div className="contact-support-icon">
                    <Icon size={24} />
                  </div>

                  <h3>{topic.title}</h3>

                  <p>{topic.description}</p>

                  <button
                    type="button"
                    className="contact-support-link"
                    onClick={() => navigate("/help-support")}
                  >
                    Get help
                    <ArrowRight size={16} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* Working Hours Notice */}
        <section className="contact-hours-banner">
          <div className="contact-hours-icon">
            <Clock size={26} />
          </div>

          <div className="contact-hours-content">
            <h2>We're happy to hear from you</h2>

            <p>
              Contact us by email or phone for help with your
              orders, payments, deliveries, or account.
              Our team will respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="contact-bottom-banner">
          <div className="contact-bottom-icon">
            <MessageCircle size={29} />
          </div>

          <div className="contact-bottom-content">
            <h2>Your shopping experience matters to us.</h2>

            <p>
              Can't find what you're looking for? Visit our Help &
              Support page for additional assistance.
            </p>
          </div>

          <button
            type="button"
            className="contact-bottom-btn"
            onClick={() => navigate("/help-support")}
          >
            Help & Support
            <ArrowRight size={17} />
          </button>
        </section>

      </div>
    </main>
  );
}

export default Contact;