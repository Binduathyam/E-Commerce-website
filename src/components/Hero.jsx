import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";

function Hero() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  const scrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchActiveBanner = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/banners/active`
        );

        const data = await response.json();

        if (data.success && data.banner) {
          setBanner(data.banner);
        }
      } catch (error) {
        console.error("Failed to fetch active banner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBanner();
  }, []);

  // While loading, don't show anything
  if (loading) {
    return null;
  }

  // If admin has not created an active banner,
  // show the existing default Hero
  if (!banner) {
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

          <button
            className="shop-button"
            onClick={scrollToProducts}
          >
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

  // Convert backend image path into full image URL
  const bannerImageUrl = banner.image?.startsWith("http")
    ? banner.image
    : `${API_BASE_URL}${banner.image}`;

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="small-title">WELCOME TO SHOPEASE</p>

        <h1>
          {banner.title}
        </h1>

        {banner.discount && (
          <h2>
            {banner.discount}% OFF
          </h2>
        )}

        {banner.description && (
          <p className="hero-text">
            {banner.description}
          </p>
        )}

        <button
          className="shop-button"
          onClick={scrollToProducts}
        >
          {banner.button_text || "Shop Now"} →
        </button>
      </div>

      <div className="hero-image">
        <img
          src={bannerImageUrl}
          alt={banner.title || "ShopEase Banner"}
        />
      </div>
    </section>
  );
}

export default Hero;