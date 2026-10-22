import {
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";

function Footer({
  onHome,
  onProducts,
  onOrders,
  onAddresses,
  onSupport,
  onReturns,
  onAbout,
  onPrivacy,
  onTerms,
  onContact,
}) {
  return (
    <footer className="footer">

      {/* =========================
          FOOTER MAIN
      ========================== */}
      <div className="footer-container">

        {/* =========================
            BRAND
        ========================== */}
        <div className="footer-brand">

          <div className="footer-logo">
            Shop<span>Ease</span>
          </div>

          <p className="footer-description">
            Your trusted online marketplace for quality
            products, great prices and a seamless shopping
            experience.
          </p>

          {/* TRUST FEATURES */}
          <div className="footer-trust">

            <div className="footer-trust-item">
              <ShieldCheck size={17} />
              <span>Secure Shopping</span>
            </div>

            <div className="footer-trust-item">
              <Truck size={17} />
              <span>Fast Delivery</span>
            </div>

            <div className="footer-trust-item">
              <Headphones size={17} />
              <span>Customer Support</span>
            </div>

          </div>

          {/* SOCIAL ICONS */}
          <div className="footer-socials">

            <button
              type="button"
              aria-label="Instagram"
            >
              ◎
            </button>

            <button
              type="button"
              aria-label="Facebook"
            >
              f
            </button>

            <button
              type="button"
              aria-label="LinkedIn"
            >
              in
            </button>

            <button
              type="button"
              aria-label="Twitter"
            >
              𝕏
            </button>

          </div>

        </div>


        {/* =========================
            SHOP
        ========================== */}
        <div className="footer-column">

          <h3>Shop</h3>

          <button
            type="button"
            onClick={onHome}
          >
            Home
          </button>

          <button
            type="button"
            onClick={onProducts}
          >
            Products
          </button>

        </div>


        {/* =========================
            CUSTOMER SERVICE
        ========================== */}
        <div className="footer-column">

          <h3>Customer Service</h3>

          <button
            type="button"
            onClick={onOrders}
          >
            My Orders
          </button>

          <button
            type="button"
            onClick={onAddresses}
          >
            My Addresses
          </button>

          <button
            type="button"
            onClick={onSupport}
          >
            Help & Support
          </button>

          <button
            type="button"
            onClick={onReturns}
          >
            Returns & Refunds
          </button>

        </div>


        {/* =========================
            COMPANY
        ========================== */}
        <div className="footer-column">

          <h3>Company</h3>

          <button
            type="button"
            onClick={onAbout}
          >
            About Us
          </button>

          <button
            type="button"
            onClick={onContact}
          >
            Contact Us
          </button>

          <button
            type="button"
            onClick={onPrivacy}
          >
            Privacy Policy
          </button>

          <button
            type="button"
            onClick={onTerms}
          >
            Terms & Conditions
          </button>

        </div>

      </div>


      {/* =========================
          FOOTER BOTTOM
      ========================== */}
      <div className="footer-bottom">

        <p>
          © 2026 ShopEase. All rights reserved.
        </p>

        <div className="footer-bottom-right">

          <span>Secure</span>
          <span>•</span>
          <span>Trusted</span>
          <span>•</span>
          <span>Easy Shopping</span>

        </div>

      </div>

    </footer>
  );
}

export default Footer;