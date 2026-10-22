import React from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Database,
  UserRound,
  ShoppingBag,
  Cookie,
  Share2,
  Eye,
  Trash2,
  RefreshCw,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Privacy.css";

function Privacy() {
  const navigate = useNavigate();

  const privacySections = [
    {
      icon: Database,
      number: "01",
      title: "Information We Collect",
      description:
        "Depending on how you use ShopEase, we may collect information such as your name, email address, phone number, delivery address, account details, and order information.",
    },
    {
      icon: ShoppingBag,
      number: "02",
      title: "How We Use Your Information",
      description:
        "We may use relevant information to process orders, coordinate deliveries, manage accounts, respond to support requests, communicate important updates, and improve our services.",
    },
    {
      icon: LockKeyhole,
      number: "03",
      title: "Data Protection",
      description:
        "We take reasonable technical and organizational measures to protect personal information against unauthorized access, loss, misuse, or disclosure. No online system can guarantee absolute security.",
    },
    {
      icon: Share2,
      number: "04",
      title: "Information Sharing",
      description:
        "Information may be shared with relevant service providers, such as delivery partners, payment processors, and technical service providers, when needed to operate our services or meet legal obligations.",
    },
    {
      icon: Cookie,
      number: "05",
      title: "Cookies & Technologies",
      description:
        "Our website may use cookies or similar technologies to maintain sessions, remember preferences, improve functionality, and understand website usage. Consent will be obtained where required by applicable law.",
    },
    {
      icon: Eye,
      number: "06",
      title: "Your Privacy Choices",
      description:
        "Depending on applicable law, you may have the right to access, correct, update, or request deletion of your personal information and exercise other available privacy rights.",
    },
    {
      icon: UserRound,
      number: "07",
      title: "Account Information",
      description:
        "Please keep your account details accurate and protect your login credentials. Contact our support team if you notice suspicious activity or believe your account has been accessed without authorization.",
    },
    {
      icon: Trash2,
      number: "08",
      title: "Data Retention",
      description:
        "We retain personal information only for as long as necessary for relevant business purposes, service delivery, dispute resolution, and applicable legal or regulatory requirements.",
    },
    {
      icon: RefreshCw,
      number: "09",
      title: "Policy Updates",
      description:
        "We may update this Privacy Policy when our services, practices, or legal obligations change. The latest version and its revision date will be published on this page.",
    },
  ];

  return (
    <main className="privacy-page">
      <div className="privacy-container">

        {/* Hero Section */}
        <section className="privacy-hero">
          <div className="privacy-hero-content">
            <div className="privacy-eyebrow">
              <ShieldCheck size={16} />
              <span>SHOPEASE PRIVACY CENTER</span>
            </div>

            <h1>
              Your Privacy. <span>Our Priority.</span>
            </h1>

            <p>
              Your trust matters to us. Learn how ShopEase may
              collect, use, store, and protect your personal
              information when you browse our website and shop
              with us.
            </p>

            <div className="privacy-trust-note">
              <LockKeyhole size={19} />
              <span>Your information deserves careful handling.</span>
            </div>
          </div>

          <div className="privacy-hero-visual">
            <div className="privacy-visual-circle">
              <ShieldCheck size={70} strokeWidth={1.5} />
            </div>

            <div className="privacy-floating-card privacy-floating-top">
              <LockKeyhole size={21} />
              <div>
                <strong>Privacy Matters</strong>
                <span>Responsible data handling</span>
              </div>
            </div>

            <div className="privacy-floating-card privacy-floating-bottom">
              <Eye size={21} />
              <div>
                <strong>Know Your Rights</strong>
                <span>Understand your choices</span>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="privacy-introduction">
          <div className="privacy-intro-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h2>About This Privacy Policy</h2>
            <p>
              This policy describes how ShopEase handles personal
              information in connection with our website and services.
              The information we actually collect and how we use it
              depend on the features you use and the way our platform
              operates.
            </p>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="privacy-content-section">
          <div className="privacy-section-heading">
            <span className="privacy-section-label">
              YOUR INFORMATION
            </span>

            <h2>Understanding Your Privacy</h2>

            <p>
              Explore the main areas of our privacy practices.
            </p>
          </div>

          <div className="privacy-sections-grid">
            {privacySections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  className="privacy-section-card"
                  key={section.number}
                >
                  <div className="privacy-card-top">
                    <div className="privacy-card-icon">
                      <Icon size={23} strokeWidth={1.8} />
                    </div>

                    <span className="privacy-card-number">
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

        {/* Additional Information */}
        <section className="privacy-rights-banner">
          <div className="privacy-rights-icon">
            <UserRound size={27} />
          </div>

          <div className="privacy-rights-content">
            <h2>Your Information, Your Choices</h2>
            <p>
              If you have a question about your personal information,
              want to update your details, or wish to make a privacy
              request, contact our support team. Requests are handled
              according to applicable law and verification requirements.
            </p>
          </div>
        </section>

        {/* Related Policies */}
        <section className="privacy-related-section">
          <div className="privacy-section-heading">
            <span className="privacy-section-label">
              EXPLORE MORE
            </span>

            <h2>Related Policies</h2>

            <p>
              Learn more about our shopping policies and services.
            </p>
          </div>

          <div className="privacy-related-grid">
            <button
              type="button"
              className="privacy-related-card"
              onClick={() => navigate("/terms")}
            >
              <span className="privacy-related-icon">
                <ShoppingBag size={22} />
              </span>

              <span className="privacy-related-text">
                <strong>Terms & Conditions</strong>
                <small>Rules for using ShopEase</small>
              </span>

              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="privacy-related-card"
              onClick={() => navigate("/returns-refunds")}
            >
              <span className="privacy-related-icon">
                <RefreshCw size={22} />
              </span>

              <span className="privacy-related-text">
                <strong>Returns & Refunds</strong>
                <small>Understand our return process</small>
              </span>

              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Contact Banner */}
        <section className="privacy-contact-banner">
          <div className="privacy-contact-icon">
            <Headphones size={28} />
          </div>

          <div className="privacy-contact-copy">
            <h2>Questions about your privacy?</h2>

            <p>
              Contact our support team for help with privacy-related
              questions and requests concerning your information.
            </p>
          </div>

          <button
            type="button"
            className="privacy-contact-btn"
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

export default Privacy;