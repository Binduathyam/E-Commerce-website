function Hero() {
  const scrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="small-title">WELCOME TO SHOPEASE</p>

        <h1>
          Everything you need,
          <br />
          <span>all in one place.</span>
        </h1>

        <p className="hero-text">
          Discover amazing products at great prices. Shop electronics,
          fashion, home essentials and more.
        </p>

        <button className="shop-button" onClick={scrollToProducts}>
          Shop Now →
        </button>
      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=80"
          alt="Shopping"
        />
      </div>
    </section>
  );
}

export default Hero;
