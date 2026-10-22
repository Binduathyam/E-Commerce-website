
import React from "react";
import {
  ShoppingBag,
  Target,
  Eye,
  Heart,
  ShieldCheck,
  Truck,
  Headphones,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const highlights = [
  {
    icon: ShoppingBag,
    title: "Easy Shopping",
    description:
      "Discover a wide range of products through a simple and convenient shopping experience.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "Clear product information and transparent policies help you shop with confidence.",
  },
  {
    icon: Truck,
    title: "Delivery Support",
    description:
      "Get order and delivery information to help you stay informed about your purchases.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Our support channels help you with questions about products, orders, and services.",
  },
];

function About() {
  const navigate = useNavigate();

  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">
            <Sparkles size={16} />
            GET TO KNOW US
          </span>

          <h1>
            Shopping Made
            <span> Simple with ShopEase.</span>
          </h1>

          <p className="about-hero-description">
            Welcome to ShopEase, your online shopping destination
            designed to make discovering products, placing orders,
            and managing your shopping experience easier.
          </p>

          <div className="about-hero-actions">
            <button
              className="about-primary-btn"
              onClick={() => navigate("/")}
            >
              Explore ShopEase
              <ArrowRight size={18} />
            </button>

            <button
              className="about-secondary-btn"
              onClick={() => navigate("/contact-us")}
            >
              Contact Us
            </button>
          </div>

          <div className="about-trust-note">
            <CheckCircle2 size={18} />
            <span>Designed around your shopping convenience</span>
          </div>
        </div>

        <div className="about-hero-visual">
          <div className="about-visual-glow" />

          <div className="about-shopping-art">
            <div className="about-art-top">
              <span className="about-art-logo">
                <ShoppingBag size={23} />
              </span>
              <span className="about-art-label">SHOP SMARTER</span>
            </div>

            <div className="about-art-main">
              <div className="about-art-circle">
                <ShoppingBag size={82} strokeWidth={1.3} />
              </div>
              <span className="about-art-spark about-spark-one">
                ✦
              </span>
              <span className="about-art-spark about-spark-two">
                ✧
              </span>
            </div>

            <div className="about-art-bottom">
              <div>
                <strong>Your Style.</strong>
                <span>Your Choices.</span>
              </div>
              <span className="about-art-arrow">
                <ArrowRight size={20} />
              </span>
            </div>
          </div>

          <div className="about-floating-card about-floating-top">
            <span className="about-floating-icon">
              <PackageCheck size={21} />
            </span>
            <div>
              <strong>Easy Ordering</strong>
              <span>Simple and convenient</span>
            </div>
          </div>

          <div className="about-floating-card about-floating-bottom">
            <span className="about-floating-icon">
              <Heart size={21} />
            </span>
            <div>
              <strong>Customer First</strong>
              <span>Your experience matters</span>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="about-intro-section">
        <div className="about-section-heading">
          <span className="about-section-label">ABOUT SHOPEASE</span>
          <h2>
            A better way to
            <span> shop online.</span>
          </h2>
          <p>
            We bring products and convenience together in one
            easy-to-use platform, helping customers discover what
            they need without making shopping complicated.
          </p>
        </div>

        <div className="about-intro-card">
          <div className="about-intro-icon">
            <ShoppingBag size={30} />
          </div>
          <h3>Who We Are</h3>
          <p>
            ShopEase is an online marketplace designed to bring
            different product categories together in one place.
            Our goal is to create a smooth and accessible shopping
            journey, from exploring products to managing orders.
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="about-purpose-section">
        <div className="about-purpose-card about-mission-card">
          <div className="about-purpose-icon">
            <Target size={28} />
          </div>
          <span>OUR MISSION</span>
          <h2>Making everyday shopping easier.</h2>
          <p>
            Our mission is to provide a convenient shopping
            experience through useful product information,
            straightforward ordering, and dependable customer
            support.
          </p>
        </div>

        <div className="about-purpose-card about-vision-card">
          <div className="about-purpose-icon">
            <Eye size={28} />
          </div>
          <span>OUR VISION</span>
          <h2>A shopping experience customers can trust.</h2>
          <p>
            We aim to build a user-friendly shopping destination
            where customers can explore products, make informed
            choices, and manage their purchases with confidence.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="about-offers-section">
        <div className="about-section-heading">
          <span className="about-section-label">THE SHOPEASE EXPERIENCE</span>
          <h2>
            Everything designed
            <span> around you.</span>
          </h2>
          <p>
            We focus on the things that make online shopping more
            straightforward and convenient.
          </p>
        </div>

        <div className="about-highlights-grid">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                className="about-highlight-card"
                key={item.title}
              >
                <div className="about-highlight-top">
                  <div className="about-highlight-icon">
                    <Icon size={25} />
                  </div>
                  <span className="about-highlight-number">
                    0{index + 1}
                  </span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="about-values-section">
        <div className="about-values-content">
          <span className="about-section-label">WHAT MATTERS TO US</span>
          <h2>
            Shopping should feel
            <span> simple and reassuring.</span>
          </h2>
          <p>
            Every part of the ShopEase experience should help
            customers make informed decisions and shop with
            greater convenience.
          </p>
        </div>

        <div className="about-values-list">
          <div className="about-value-item">
            <CheckCircle2 size={21} />
            <div>
              <h3>Simplicity</h3>
              <p>Easy navigation and a straightforward shopping journey.</p>
            </div>
          </div>

          <div className="about-value-item">
            <CheckCircle2 size={21} />
            <div>
              <h3>Transparency</h3>
              <p>Helpful product details and accessible policies.</p>
            </div>
          </div>

          <div className="about-value-item">
            <CheckCircle2 size={21} />
            <div>
              <h3>Customer Focus</h3>
              <p>Support and information for your shopping needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="about-cta-section">
        <div className="about-cta-icon">
          <Heart size={28} />
        </div>

        <div className="about-cta-content">
          <span>WE ARE HERE TO HELP</span>
          <h2>Have a question about ShopEase?</h2>
          <p>
            Need help with a product, an order, or our services?
            Get in touch with our support team.
          </p>
        </div>

        <button
          className="about-cta-btn"
          onClick={() => navigate("/contact-us")}
        >
          Get in Touch
          <ArrowRight size={18} />
        </button>
      </section>
    </main>
  );
}

export default About;
