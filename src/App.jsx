import { useEffect, useState } from "react";

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

import "./App.css";

function App() {
  /* =========================
     SEARCH & CATEGORY
  ========================= */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  /* =========================
     PRODUCTS FROM BACKEND
  ========================= */

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] =
    useState(true);
  const [productsError, setProductsError] =
    useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to fetch products"
          );
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error(
          "Products fetch error:",
          error
        );

        setProductsError(
          "Unable to load products. Please make sure the backend is running."
        );
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
     LOGGED-IN USER
  ========================= */

  const [loggedInUser, setLoggedInUser] =
    useState(null);

  const CART_API_URL =
    "http://localhost:5000/api/cart";

  /* =========================
     LOAD USER CART
  ========================= */

  const loadCart = async (userId) => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${CART_API_URL}/${userId}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load cart"
        );
      }

      const dbCart = (
        data.cart || []
      ).map((item) => ({
        id: item.product_id,
        cartItemId: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        name: item.name,
        price: Number(item.price),
        category: item.category,
        image: item.image,
        quantity: Number(item.quantity),
      }));

      setCart(dbCart);
    } catch (error) {
      console.error(
        "Load cart error:",
        error
      );
    }
  };

  useEffect(() => {
    if (loggedInUser?.id) {
      loadCart(loggedInUser.id);
    } else {
      setCart([]);
    }
  }, [loggedInUser]);

  /* =========================
     WISHLIST
  ========================= */

  const [wishlist, setWishlist] =
    useState([]);

  const WISHLIST_API_URL =
    "http://localhost:5000/api/wishlist";

  /* =========================
     LOAD USER WISHLIST
  ========================= */

  const loadWishlist = async (userId) => {
    if (!userId) {
      setWishlist([]);
      return;
    }

    try {
      const response = await fetch(
        `${WISHLIST_API_URL}/${userId}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load wishlist"
        );
      }

      const dbWishlist = (
        data.wishlist || []
      ).map((item) => ({
        id: item.product_id,
        wishlistItemId: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        name: item.name,
        price: Number(item.price),
        category: item.category,
        image: item.image,
        description: item.description,
      }));

      setWishlist(dbWishlist);
    } catch (error) {
      console.error(
        "Load wishlist error:",
        error
      );
    }
  };

  useEffect(() => {
    if (loggedInUser?.id) {
      loadWishlist(loggedInUser.id);
    } else {
      setWishlist([]);
    }
  }, [loggedInUser]);

  /* =========================
     PRODUCT DETAILS
  ========================= */

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  /* =========================
     PAGE STATES
  ========================= */

  const [showCart, setShowCart] =
    useState(false);

  const [showWishlist, setShowWishlist] =
    useState(false);

  const [showCheckout, setShowCheckout] =
    useState(false);

  const [
    showOrderSuccess,
    setShowOrderSuccess,
  ] = useState(false);

  const [
    showOrderTracking,
    setShowOrderTracking,
  ] = useState(false);

  const [showLogin, setShowLogin] =
    useState(false);

  const [
    showRegistration,
    setShowRegistration,
  ] = useState(false);

  const [orderData, setOrderData] =
    useState(null);

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = async (product) => {
    if (!loggedInUser?.id) {
      setShowLogin(true);
      return;
    }

    try {
      const response = await fetch(
        CART_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id: loggedInUser.id,
            product_id: product.id,
            quantity: 1,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to add product to cart"
        );
      }

      await loadCart(
        loggedInUser.id
      );

      console.log(
        "Product added to MySQL cart:",
        product.name
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      alert(
        error.message ||
          "Failed to add product to cart"
      );
    }
  };

  /* =========================
     REMOVE FROM CART
  ========================= */

  const removeFromCart = async (
    productId
  ) => {
    if (!loggedInUser?.id) {
      setShowLogin(true);
      return;
    }

    try {
      const response = await fetch(
        `${CART_API_URL}/${productId}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id: loggedInUser.id,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to remove product"
        );
      }

      await loadCart(
        loggedInUser.id
      );
    } catch (error) {
      console.error(
        "Remove cart error:",
        error
      );

      alert(
        error.message ||
          "Failed to remove product"
      );
    }
  };

  /* =========================
     UPDATE CART QUANTITY
  ========================= */

  const updateQuantity = async (
    productId,
    change
  ) => {
    if (!loggedInUser?.id) {
      setShowLogin(true);
      return;
    }

    const currentItem =
      cart.find(
        (item) =>
          item.id === productId
      );

    if (!currentItem) return;

    const newQuantity =
      currentItem.quantity +
      change;

    try {
      const response = await fetch(
        `${CART_API_URL}/${productId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id: loggedInUser.id,
            quantity: newQuantity,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update cart"
        );
      }

      await loadCart(
        loggedInUser.id
      );
    } catch (error) {
      console.error(
        "Update cart error:",
        error
      );

      alert(
        error.message ||
          "Failed to update cart"
      );
    }
  };

  /* =========================
     ADD / REMOVE WISHLIST
  ========================= */

  const toggleWishlist = async (
    product
  ) => {
    if (!loggedInUser?.id) {
      setShowLogin(true);
      return;
    }

    const alreadyAdded =
      wishlist.some(
        (item) =>
          item.id === product.id
      );

    try {
      if (alreadyAdded) {
        const response =
          await fetch(
            `${WISHLIST_API_URL}/${product.id}`,
            {
              method: "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                user_id:
                  loggedInUser.id,
              }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to remove product from wishlist"
          );
        }
      } else {
        const response =
          await fetch(
            WISHLIST_API_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                user_id:
                  loggedInUser.id,
                product_id:
                  product.id,
              }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to add product to wishlist"
          );
        }
      }

      await loadWishlist(
        loggedInUser.id
      );
    } catch (error) {
      console.error(
        "Wishlist update error:",
        error
      );

      alert(
        error.message ||
          "Failed to update wishlist"
      );
    }
  };

  /* =========================
     REMOVE FROM WISHLIST
  ========================= */

  const removeFromWishlist = async (
    productId
  ) => {
    if (!loggedInUser?.id) {
      setShowLogin(true);
      return;
    }

    try {
      const response =
        await fetch(
          `${WISHLIST_API_URL}/${productId}`,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              user_id:
                loggedInUser.id,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to remove product from wishlist"
        );
      }

      await loadWishlist(
        loggedInUser.id
      );
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );

      alert(
        error.message ||
          "Failed to remove product from wishlist"
      );
    }
  };

  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filteredProducts =
    products.filter(
      (product) => {
        const matchesSearch =
          product.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          category === "All" ||
          product.category
            ?.toLowerCase() ===
            category.toLowerCase();

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

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
     LOGIN PAGE
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

          onLoginSuccess={(user) => {
            console.log(
              "Logged in user:",
              user
            );

            setLoggedInUser(user);
            setShowLogin(false);
          }}
        />
      </div>
    );
  }

  /* =================================================
     REGISTRATION PAGE
  ================================================= */

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

  /* =================================================
     ORDER TRACKING PAGE
  ================================================= */

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

  /* =================================================
     ORDER SUCCESS PAGE
  ================================================= */

  if (showOrderSuccess) {
    return (
      <div className="app">

        <OrderSuccess
          order={orderData}

          onContinueShopping={() => {
            setShowOrderSuccess(false);
            setOrderData(null);

            /*
              IMPORTANT:
              The Orders API clears the database cart
              after a successful order.
            */
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

          /*
            IMPORTANT:
            Logged-in user's ID is now
            passed to Checkout so that
            the address can be stored
            in MySQL against that user.
          */
          loggedInUser={loggedInUser}

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

          onCartClick={() => {
            setShowCart(true);
          }}

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

        {productsLoading && (
          <div className="no-products">

            <h3>
              Loading products...
            </h3>

            <p>
              Please wait while we load
              the latest products.
            </p>

          </div>
        )}

        {!productsLoading &&
          productsError && (
            <div className="no-products">

              <div className="no-products-icon">
                ⚠️
              </div>

              <h3>
                Unable to load products
              </h3>

              <p>
                {productsError}
              </p>

            </div>
          )}

        {!productsLoading &&
          !productsError && (
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
          )}

        {/* =========================
            LOAD MORE
        ========================= */}

        {!productsLoading &&
          !productsError &&
          visibleCount <
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

        {!productsLoading &&
          !productsError &&
          filteredProducts.length ===
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