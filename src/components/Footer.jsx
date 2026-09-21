function Footer({
  onPrivacy,
  onTerms,
  onContact,
}) {
  return (
    <footer className="footer">
      <div className="footer-logo">
        Shop<span>Ease</span>
      </div>

      <p>© 2026 ShopEase. All rights reserved.</p>

      <div className="footer-links">
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

        <button
          type="button"
          onClick={onContact}
        >
          Contact
        </button>
      </div>
    </footer>
  );
}

export default Footer;