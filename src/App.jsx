import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Footer from "./components/Footer";

import products from "./data/products";

import "./App.css";

function App() {
  /* =========================
     SEARCH & CATEGORY
  ========================= */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  /* =========================
     LOAD MORE
  ========================= */

  const [visibleCount, setVisibleCount] =
    useState(20);

  /* =========================
     CART
  ========================= */

  const [cart, setCart] = useState([]);

  /* =========================
     WISHLIST
  ========================= */

  const [wishlist, setWishlist] =
    useState([]);

  /* =========================
     PRODUCT DETAILS
  ========================= */

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  /* =========================
     PAGE STATES
  ========================= */

  const [showCart, setShowCart] =
    useState(false);

  const [showWishlist, setShowWishlist] =
    useState(false);

  const [showCheckout, setShowCheckout] =
    useState(false);

  const [showOrderSuccess, setShowOrderSuccess] =
    useState(false);
  const [showOrderTracking, setShowOrderTracking] =
   useState(false);
  const [showLogin, setShowLogin] =
  useState(false);

  const [showRegistration, setShowRegistration] =
  useState(false);

  const [orderData, setOrderData] =
    useState(null);

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct =
        currentCart.find(
          (item) =>
            item.id === product.id
        );

      if (existingProduct) {
        return currentCart.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  /* =========================
     REMOVE FROM CART
  ========================= */

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.id !== productId
      )
    );
  };

  /* =========================
     UPDATE CART QUANTITY
  ========================= */

  const updateQuantity = (
    productId,
    change
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (
            item.id === productId
          ) {
            return {
              ...item,
              quantity:
                item.quantity + change,
            };
          }

          return item;
        })
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  /* =========================
     ADD / REMOVE WISHLIST
  ========================= */

  const toggleWishlist = (product) => {
    const alreadyAdded =
      wishlist.some(
        (item) =>
          item.id === product.id
      );

    if (alreadyAdded) {
      setWishlist(
        (currentWishlist) =>
          currentWishlist.filter(
            (item) =>
              item.id !== product.id
          )
      );
    } else {
      setWishlist(
        (currentWishlist) => [
          ...currentWishlist,
          product,
        ]
      );
    }
  };

  /* =========================
     REMOVE FROM WISHLIST
  ========================= */

  const removeFromWishlist = (
    productId
  ) => {
    setWishlist(
      (currentWishlist) =>
        currentWishlist.filter(
          (item) =>
            item.id !== productId
        )
    );
  };

  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filteredProducts =
    products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        category === "All" ||
        product.category ===
          category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  /* =========================
     VISIBLE PRODUCTS
  ========================= */

  const visibleProducts =
    filteredProducts.slice(
      0,
      visibleCount
    );

  /* =========================
     LOAD MORE
  ========================= */

  const loadMoreProducts = () => {
    setVisibleCount(
      (currentCount) =>
        currentCount + 20
    );
  };

  /* =========================
     RESET VISIBLE COUNT
     WHEN SEARCH/CATEGORY CHANGES
  ========================= */

  const handleSearchChange = (
    value
  ) => {
    setSearch(value);
    setVisibleCount(20);
  };

  const handleCategoryChange = (
    value
  ) => {
    setCategory(value);
    setVisibleCount(20);
  };

  /* =========================
     CART COUNT
  ========================= */

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  /* =================================================
     ORDER SUCCESS PAGE
  ================================================= */
 if (showLogin) {
  return (
    <div className="app">
      <Login
        onBack={() => {
          setShowLogin(false);
        }}
        onRegister={() => {
          setShowLogin(false);
          setShowRegistration(true);
        }}
        onLoginSuccess={() => {
          setShowLogin(false);
        }}
      />
    </div>
  );
}

if (showRegistration) {
  return (
    <div className="app">
      <Registration
        onBack={() => {
          setShowRegistration(false);
        }}
        onLogin={() => {
          setShowRegistration(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
}
  if (showOrderTracking) {
  return (
    <div className="app">

      <OrderTracking
        order={orderData}
        onBack={() => {
          setShowOrderTracking(false);
          setShowOrderSuccess(true);
        }}
      />

    </div>
  );
}

if (showOrderSuccess) {
  return (
    <div className="app">

      <OrderSuccess
        order={orderData}
        onContinueShopping={() => {
          setShowOrderSuccess(false);
          setOrderData(null);
          setCart([]);
          setVisibleCount(20);
        }}
        onTrackOrder={() => {
          setShowOrderSuccess(false);
          setShowOrderTracking(true);
        }}
      />

    </div>
  );
}
  /* =================================================
     CHECKOUT PAGE
  ================================================= */

  if (showCheckout) {
    return (
      <div className="app">

        <Navbar
          search={search}
          setSearch={
            handleSearchChange
          }
          cartCount={cartCount}
          wishlistCount={
            wishlist.length
          }
          onLoginClick={() => {
    setShowCheckout(false);
    setShowLogin(true);
  }}

          onCartClick={() => {
            setShowCheckout(false);
            setShowCart(true);
          }}

          onWishlistClick={() => {
            setShowCheckout(false);
            setShowWishlist(true);
          }}
        />

        <Checkout
          cart={cart}

          onBack={() => {
            setShowCheckout(false);
            setShowCart(true);
          }}

          onOrderPlaced={(order) => {
            setOrderData(order);

            setShowCheckout(false);

            setShowOrderSuccess(true);
          }}
        />

      </div>
    );
  }

  /* =================================================
     WISHLIST PAGE
  ================================================= */

  if (showWishlist) {
    return (
      <div className="app">

        <Navbar
          search={search}
          setSearch={
            handleSearchChange
          }
          cartCount={cartCount}
          wishlistCount={
            wishlist.length
          }
           onLoginClick={() => {
    setShowLogin(true);
  }}

          onCartClick={() => {
            setShowWishlist(false);
            setShowCart(true);
          }}

          onWishlistClick={() => {
            setShowWishlist(true);
          }}
        />

        <Wishlist
          wishlist={wishlist}

          onBack={() =>
            setShowWishlist(false)
          }

          onRemove={
            removeFromWishlist
          }

          onAddToCart={
            addToCart
          }

          onCartClick={() => {
            setShowWishlist(false);
            setShowCart(true);
          }}
        />

      </div>
    );
  }

  /* =================================================
     CART PAGE
  ================================================= */

  if (showCart) {
    return (
      <div className="app">

        <Navbar
          search={search}
          setSearch={
            handleSearchChange
          }
          cartCount={cartCount}
          wishlistCount={
            wishlist.length
          }
           onLoginClick={() => {
    setShowLogin(true);
  }}

          onCartClick={() =>
            setShowCart(true)
          }

          onWishlistClick={() => {
            setShowCart(false);
            setShowWishlist(true);
          }}
        />

        <Cart
          cart={cart}

          onBack={() =>
            setShowCart(false)
          }

          onRemove={
            removeFromCart
          }

          onUpdateQuantity={
            updateQuantity
          }

          onWishlistClick={() => {
            setShowCart(false);
            setShowWishlist(true);
          }}

          onCheckout={() => {
            setShowCart(false);
            setShowCheckout(true);
          }}
        />

      </div>
    );
  }

  /* =================================================
     PRODUCT DETAILS
  ================================================= */

  if (selectedProduct) {
    return (
      <div className="app">

        <Navbar
          search={search}
          setSearch={
            handleSearchChange
          }
          cartCount={cartCount}
          wishlistCount={
            wishlist.length
          }

          onLoginClick={() => {
    setShowLogin(true);
  }}

          onCartClick={() => {
            setSelectedProduct(null);
            setShowCart(true);
          }}

          onWishlistClick={() => {
            setSelectedProduct(null);
            setShowWishlist(true);
          }}
        />

        <ProductDetails
          product={selectedProduct}

          onBack={() =>
            setSelectedProduct(null)
          }

          onAddToCart={
            addToCart
          }
        />

      </div>
    );
  }

  /* =================================================
     HOME PAGE
  ================================================= */

  return (
    <div className="app">

      <Navbar
        search={search}
        setSearch={
          handleSearchChange
        }
        cartCount={cartCount}
        wishlistCount={
          wishlist.length
        }
         onLoginClick={() => {
    setShowLogin(true);
  }}

        onCartClick={() =>
          setShowCart(true)
        }

        onWishlistClick={() =>
          setShowWishlist(true)
        }
      />

      {/* HERO HIDDEN DURING SEARCH */}

      {!search.trim() && (
        <Hero />
      )}

      {/* =========================
          CATEGORIES
      ========================= */}
    {!search.trim() && (
      <section className="categories">

        <div className="section-title">

          <p>
            EXPLORE
          </p>

          <h2>
            Shop by Category
          </h2>

        </div>

        <div className="category-buttons">

          {[
            "All",
            "Electronics",
            "Fashion",
            "Home",
          ].map((item) => (

            <button
              key={item}
              type="button"

              className={
                category === item
                  ? "category active-category"
                  : "category"
              }

              onClick={() =>
                handleCategoryChange(
                  item
                )
              }
            >
              {item}
            </button>

          ))}

        </div>

      </section>
    )}

      {/* =========================
          PRODUCTS
      ========================= */}

      <section
        className="products-section"
        id="products"
      >

        <div className="section-heading">

          <div>

            <p>
              OUR COLLECTION
            </p>

            <h2>
              {search.trim()
                ? `Search Results for "${search}"`
                : "Popular Products"}
            </h2>

          </div>

          <span>
            {filteredProducts.length} products
          </span>

        </div>

        {/* PRODUCT GRID */}

        <div className="product-grid">

          {visibleProducts.map(
            (product) => (

              <ProductCard
                key={product.id}
                product={product}

                onAddToCart={
                  addToCart
                }

                onToggleWishlist={
                  toggleWishlist
                }

                isWishlisted={
                  wishlist.some(
                    (item) =>
                      item.id ===
                      product.id
                  )
                }

                onViewDetails={() =>
                  setSelectedProduct(
                    product
                  )
                }
              />

            )
          )}

        </div>

        {/* =========================
            LOAD MORE
        ========================= */}

        {visibleCount <
          filteredProducts.length && (

          <div className="load-more-container">

            <button
              type="button"
              className="load-more-button"

              onClick={
                loadMoreProducts
              }
            >
              Load More
            </button>

          </div>

        )}

        {/* =========================
            NO PRODUCTS
        ========================= */}

        {filteredProducts.length ===
          0 && (

          <div className="no-products">

            <div className="no-products-icon">
              🔍
            </div>

            <h3>
              No products found
            </h3>

            <p>
              Try searching for another
              product or category.
            </p>

          </div>

        )}

      </section>

      {/* =========================
          FEATURES
      ========================= */}

      <section className="features">

        <div className="feature">

          <span className="feature-icon">
            🚚
          </span>

          <h3>
            Free Delivery
          </h3>

          <p>
            On orders above ₹999
          </p>

        </div>

        <div className="feature">

          <span className="feature-icon">
            🔒
          </span>

          <h3>
            Secure Payment
          </h3>

          <p>
            100% secure checkout
          </p>

        </div>

        <div className="feature">

          <span className="feature-icon">
            ↩️
          </span>

          <h3>
            Easy Returns
          </h3>

          <p>
            7-day return policy
          </p>

        </div>

        <div className="feature">

          <span className="feature-icon">
            💬
          </span>

          <h3>
            24/7 Support
          </h3>

          <p>
            We're here to help
          </p>

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default App;