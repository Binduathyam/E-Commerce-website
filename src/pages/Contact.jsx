function Contact() {
  return (
    <div className="info-page">
     
      <div className="info-card">
        <div className="info-icon">💬</div>

        <p className="info-label">SHOPEASE</p>

        <h1>Contact Us</h1>

        <p className="info-intro">
          Need help with your order or account? Our support team
          is here to help.
        </p>

        <div className="contact-box">
          <div className="contact-item">
            <span>📧</span>
            <div>
              <small>Email</small>
              <strong>support@shopease.com</strong>
            </div>
          </div>

          <div className="contact-item">
            <span>📞</span>
            <div>
              <small>Phone</small>
              <strong>+91 90000 00000</strong>
            </div>
          </div>

          <div className="contact-item">
            <span>📍</span>
            <div>
              <small>Address</small>
              <strong>ShopEase Support Center, India</strong>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Support</h2>
          <p>
            Contact us for assistance with products, orders,
            payments, delivery, or account-related questions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;