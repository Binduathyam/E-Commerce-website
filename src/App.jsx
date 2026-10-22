import { useEffect, useState } from "react";


import Navbar from "./components/Navbar";

import Footer from "./components/Footer";

import LiveTour from "./components/LiveTour";

import Hero from "./components/Hero";

import ProductCard from "./components/ProductCard";

import Chatbot from "./components/Chatbot";
import About from "./components/About";
import ReturnsRefunds from "./components/ReturnsRefunds";


import ProductDetails from "./pages/ProductDetails";

import Cart from "./pages/Cart";

import Wishlist from "./pages/Wishlist";

import Checkout from "./pages/Checkout";

import OrderSuccess from "./pages/OrderSuccess";

import OrderTracking from "./pages/OrderTracking";

import OrderDetails from "./pages/OrderDetails";

import MyAddresses from "./pages/MyAddresses";

import AccountSettings from "./pages/AccountSettings";

import Privacy from "./pages/Privacy";

import Terms from "./pages/Terms";

import Contact from "./pages/Contact";



import Login from "./pages/Login";

import Registration from "./pages/Registration";

import ForgotPassword from "./pages/ForgotPassword";



import MerchantHome from "./merchant/MerchantHome";

import AddProduct from "./merchant/AddProduct";

import MerchantProducts from "./merchant/MerchantProducts";

import MerchantInventory from "./merchant/MerchantInventory";

import MerchantOrders from "./merchant/MerchantOrders";

import MerchantProfile from "./merchant/MerchantProfile";

import MerchantRegister from "./merchant/MerchantRegister";

import MerchantSales from "./merchant/MerchantSales";



import AdminHome from "./admin/AdminHome";

import AdminCustomers from "./admin/AdminCustomers";

import AdminMerchants from "./admin/AdminMerchants";

import AdminProducts from "./admin/AdminProducts";

import AdminOrders from "./admin/AdminOrders";

import AdminPayments from "./admin/AdminPayments";

import AdminReports from "./admin/AdminReports";

import AdminDeliveryPartners from "./admin/AdminDeliveryPartners";

import AdminProfit from "./admin/AdminProfit";

import AdminLogin from "./admin/AdminLogin";
import BannerManagement from "./admin/BannerManagement";
import HelpSupport from "./components/HelpSupport";

import Profile from "./pages/Profile";

import OrderHistory from "./pages/OrderHistory";

import Invoice from "./pages/Invoice";





import DeliveryDashboard from "./Delivery/DeliveryDashboard";

import AssignedOrders from "./Delivery/AssignedOrders";

import DeliveryProfile from "./Delivery/Profile";

import DeliveryRegister from "./Delivery/DeliveryRegister";



import "./App.css";



const API_BASE_URL = "http://3.110.90.184";



function App() {
 

  /* =========================================================

     SEARCH & CATEGORY

  ========================================================= */



  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");



  /* =========================================================

     PRODUCTS

  ========================================================= */



  const [products, setProducts] = useState([]);

  const [productsLoading, setProductsLoading] = useState(true);

  const [productsError, setProductsError] = useState("");



  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setProductsLoading(true);

        setProductsError("");



        const response = await fetch(

          `${API_BASE_URL}/api/products`

        );



        const data = await response.json();



        if (!response.ok || !data.success) {

          throw new Error(

            data.message || "Failed to fetch products"

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



  /* =========================================================

     LOAD MORE

  ========================================================= */



  const [visibleCount, setVisibleCount] = useState(20);



  /* =========================================================

     CART

  ========================================================= */



  const [cart, setCart] = useState([]);



  /* =========================================================

     LOGGED-IN USER

  ========================================================= */

const [loggedInUser, setLoggedInUser] = useState(() => {
  try {
    const activeUser = sessionStorage.getItem("active_user");

    if (activeUser) {
      return JSON.parse(activeUser);
    }

    return null;
  } catch (error) {
    console.error("Failed to restore logged-in user:", error);
    return null;
  }
});
  /* =========================================================

     LIVE TOUR

  ========================================================= */



  const [tourRole, setTourRole] = useState(null);

  const [showLiveTour, setShowLiveTour] = useState(false);



  /* =========================================================

     LOGIN MESSAGE

  ========================================================= */



  const [loginMessage, setLoginMessage] = useState("");



  /* =========================================================

     MERCHANT STATES

  ========================================================= */



  const [showMerchantHome, setShowMerchantHome] =

    useState(false);



  const [showAddProduct, setShowAddProduct] =

    useState(false);



  const [showMerchantProducts, setShowMerchantProducts] =

    useState(false);



  const [showMerchantInventory, setShowMerchantInventory] =

    useState(false);



  const [showMerchantOrders, setShowMerchantOrders] =

    useState(false);



  const [showMerchantProfile, setShowMerchantProfile] =

    useState(false);



  const [showMerchantRegister, setShowMerchantRegister] =

    useState(false);



  const [showMerchantSales, setShowMerchantSales] =

    useState(false);



  /* =========================================================

     ADMIN STATES

  ========================================================= */



  const [showAdminHome, setShowAdminHome] =

    useState(false);



  const [showAdminCustomers, setShowAdminCustomers] =

    useState(false);



  const [showAdminMerchants, setShowAdminMerchants] =

    useState(false);



  const [showAdminProducts, setShowAdminProducts] =

    useState(false);

  const [showAdminBanners, setShowAdminBanners] = 
    useState(false);

  const [showAdminOrders, setShowAdminOrders] =

    useState(false);



  const [showAdminPayments, setShowAdminPayments] =

    useState(false);



  const [showAdminReports, setShowAdminReports] =

    useState(false);



  const [showAdminDeliveryPartners, setShowAdminDeliveryPartners] =

    useState(false);



  const [showAdminProfit, setShowAdminProfit] =

    useState(false);



  const [showAdminLogin, setShowAdminLogin] =

    useState(false);



  /* =========================================================

     CUSTOMER STATES

  ========================================================= */



  const [showMyAddresses, setShowMyAddresses] =

    useState(false);



  const [showAccountSettings, setShowAccountSettings] =

    useState(false);



  const [showPrivacy, setShowPrivacy] =

    useState(false);



  const [showTerms, setShowTerms] =

    useState(false);



  const [showContact, setShowContact] =

    useState(false);

  const [showAbout, setShowAbout] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);

const [showReturnsRefunds, setShowReturnsRefunds] =
  useState(false);

  const [showInvoice, setShowInvoice] =

    useState(false);



  const [selectedInvoiceOrder, setSelectedInvoiceOrder] =

    useState(null);



  /* =========================================================

     DELIVERY STATES

  ========================================================= */



  const [showDeliveryPartnerHome, setShowDeliveryPartnerHome] =

    useState(false);



  const [showAssignedOrders, setShowAssignedOrders] =

    useState(false);



  const [showDeliveryProfile, setShowDeliveryProfile] =

    useState(false);



  const [showDeliveryRegister, setShowDeliveryRegister] =

    useState(false);



  /* =========================================================

     API URLs

  ========================================================= */



  const CART_API_URL =

    `${API_BASE_URL}/api/cart`;



  const WISHLIST_API_URL =

    `${API_BASE_URL}/api/wishlist`;


/* =========================================================
   LOAD CART
========================================================= */

const loadCart = async (userId) => {
  if (!userId) return;

  try {
    const response = await fetch(
      `${CART_API_URL}/${userId}`
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to load cart"
      );
    }

    const dbCart = (data.cart || []).map((item) => ({
  id: item.product_id,

  // Actual cart table row ID
  cartItemId: item.id,

  user_id: item.user_id,

  product_id: item.product_id,

  name: item.name,

  price:
    Number(item.price) || 0,

  original_price:
    Number(item.original_price) || 0,

  discount:
    Number(item.discount) || 0,

  gst_rate:
    Number(item.gst_rate) || 0,

  category:
    item.category || "",

  image:
    item.image || "",

  quantity:
    Number(item.quantity) || 1,

  // Preserve selected variant
  variant_id:
    item.variant_id ??
    item.variantId ??
    null,

  // Preserve selected size
  selected_size:
    item.selected_size ??
    item.selectedSize ??
    null,
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



  /* =========================================================

     WISHLIST

  ========================================================= */



  const [wishlist, setWishlist] = useState([]);



  /* =========================================================

     LOAD WISHLIST

  ========================================================= */



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

          data.message || "Failed to load wishlist"

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



  /* =========================================================

     PRODUCT DETAILS

  ========================================================= */



  const [selectedProduct, setSelectedProduct] = useState(null);


  /* =========================================================

     PAGE STATES

  ========================================================= */



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

  const [
  showForgotPassword,
  setShowForgotPassword,
] = useState(false);

const [
  forgotPasswordRole,
  setForgotPasswordRole,
] = useState("customer");



  const [orderData, setOrderData] =

    useState(null);



  /* =========================================================

     PROFILE

  ========================================================= */


const [showProfile, setShowProfile] = useState(
  window.location.pathname === "/shopease/profile"
);



  /* =========================================================

     ORDER HISTORY

  ========================================================= */



  const [

    showOrderHistory,

    setShowOrderHistory,

  ] = useState(false);



  /* =========================================================

     ORDER DETAILS

  ========================================================= */



  const [

    showOrderDetails,

    setShowOrderDetails,

  ] = useState(false);



  const [

    selectedOrder,

    setSelectedOrder,

  ] = useState(null);



  /* =========================================================

     TRACKING RETURN

  ========================================================= */



  const [
    trackingFromDetails,
    setTrackingFromDetails,
  ] = useState(false);

useEffect(() => {
  const handleBrowserPopState = (event) => {
    const path = window.location.pathname;
    const historyState = event.state;

    // Reset all page states
    setShowCart(false);
    setShowWishlist(false);
    setShowCheckout(false);
    setShowOrderSuccess(false);
    setShowOrderTracking(false);
    setShowLogin(false);
    setShowRegistration(false);
    setShowForgotPassword(false);
    setShowOrderHistory(false);
    setShowOrderDetails(false);
    setShowInvoice(false);
    setShowProfile(false);

    setShowMerchantHome(false);
    setShowAddProduct(false);
    setShowMerchantProducts(false);
    setShowMerchantInventory(false);
    setShowMerchantOrders(false);
    setShowMerchantProfile(false);
    setShowMerchantRegister(false);
    setShowMerchantSales(false);

    setShowAdminHome(false);
    setShowAdminCustomers(false);
    setShowAdminMerchants(false);
    setShowAdminProducts(false);
    setShowAdminOrders(false);
    setShowAdminPayments(false);
    setShowAdminReports(false);
    setShowAdminDeliveryPartners(false);
    setShowAdminProfit(false);
    setShowAdminLogin(false);

    setShowMyAddresses(false);
    setShowAccountSettings(false);
    setShowPrivacy(false);
    setShowTerms(false);
    setShowContact(false);
    setShowAbout(false);
    setShowHelpSupport(false);
    setShowReturnsRefunds(false);

    setShowDeliveryPartnerHome(false);
    setShowAssignedOrders(false);
    setShowDeliveryProfile(false);
    setShowDeliveryRegister(false);

    setSelectedProduct(null);
    setSelectedOrder(null);
    setSelectedInvoiceOrder(null);
    setOrderData(null);

    // ==============================
    // PRODUCT DETAILS
    // ==============================
    const productMatch = path.match(
      /^\/shopease\/product\/(\d+)$/
    );

    if (productMatch) {
      const productId = Number(productMatch[1]);

      const product = products.find(
        (item) => Number(item.id) === productId
      );

      if (product) {
        setSelectedProduct(product);
      }

      return;
    }

    // ==============================
    // CUSTOMER PAGES
    // ==============================
    if (path === "/shopease/cart") {
      setShowCart(true);
      return;
    }

    if (path === "/shopease/wishlist") {
      setShowWishlist(true);
      return;
    }

    if (path === "/shopease/checkout") {
      setShowCheckout(true);
      return;
    }

    if (path === "/shopease/order-success") {
      setShowOrderSuccess(true);
      return;
    }

    if (path === "/shopease/order-tracking") {
      if (historyState?.order) {
        setOrderData(historyState.order);
      }

      setShowOrderTracking(true);
      return;
    }

    if (path === "/shopease/login") {
      setShowLogin(true);
      return;
    }

    if (path === "/shopease/forgot-password") {
      setShowForgotPassword(true);
      return;
    }

    if (path === "/shopease/registration") {
      setShowRegistration(true);
      return;
    }

    if (path === "/shopease/profile") {
      setShowProfile(true);
      return;
    }

    if (path === "/shopease/order-history") {
      setShowOrderHistory(true);
      return;
    }

    if (path.startsWith("/shopease/order-details/")) {
      if (historyState?.order) {
        setSelectedOrder(historyState.order);
      }

      setShowOrderDetails(true);
      return;
    }

    if (path.startsWith("/shopease/invoice/")) {
      if (historyState?.order) {
        setSelectedInvoiceOrder(historyState.order);
      }

      setShowInvoice(true);
      return;
    }

    if (path === "/shopease/addresses") {
      setShowMyAddresses(true);
      return;
    }

    if (path === "/shopease/account-settings") {
      setShowAccountSettings(true);
      return;
    }

    if (path === "/shopease/privacy") {
      setShowPrivacy(true);
      return;
    }

    if (path === "/shopease/terms") {
      setShowTerms(true);
      return;
    }

    if (path === "/shopease/contact") {
      setShowContact(true);
      return;
    }
    if (path === "/shopease/about") {
  setShowAbout(true);
  return;
}

if (path === "/shopease/help-support") {
  setShowHelpSupport(true);
  return;
}
if (path === "/shopease/returns-refunds") {
  setShowReturnsRefunds(true);
  return;
}

    // ==============================
    // MERCHANT PAGES
    // ==============================
    if (path === "/shopease/merchant") {
      setShowMerchantHome(true);
      return;
    }

    if (path === "/shopease/merchant/add-product") {
      setShowMerchantHome(true);
      setShowAddProduct(true);
      return;
    }

    if (path === "/shopease/merchant/products") {
      setShowMerchantHome(true);
      setShowMerchantProducts(true);
      return;
    }

    if (path === "/shopease/merchant/inventory") {
      setShowMerchantHome(true);
      setShowMerchantInventory(true);
      return;
    }

    if (path === "/shopease/merchant/orders") {
      setShowMerchantHome(true);
      setShowMerchantOrders(true);
      return;
    }

    if (path === "/shopease/merchant/profile") {
      setShowMerchantHome(true);
      setShowMerchantProfile(true);
      return;
    }

    if (path === "/shopease/merchant/sales") {
      setShowMerchantHome(true);
      setShowMerchantSales(true);
      return;
    }

    if (path === "/shopease/merchant-register") {
      setShowMerchantRegister(true);
      return;
    }

    // ==============================
    // ADMIN PAGES
    // ==============================
    if (path === "/shopease/admin") {
      setShowAdminHome(true);
      return;
    }

    if (path === "/shopease/admin/customers") {
      setShowAdminCustomers(true);
      return;
    }

    if (path === "/shopease/admin/merchants") {
      setShowAdminMerchants(true);
      return;
    }

    if (path === "/shopease/admin/products") {
      setShowAdminProducts(true);
      return;
    }

    if (path === "/shopease/admin/orders") {
      setShowAdminOrders(true);
      return;
    }

    if (path === "/shopease/admin/payments") {
      setShowAdminPayments(true);
      return;
    }

    if (path === "/shopease/admin/reports") {
      setShowAdminReports(true);
      return;
    }

    if (path === "/shopease/admin/delivery-partners") {
      setShowAdminDeliveryPartners(true);
      return;
    }

    if (path === "/shopease/admin/profit") {
      setShowAdminProfit(true);
      return;
    }

    if (path === "/shopease/admin-login") {
      setShowAdminLogin(true);
      return;
    }

    // ==============================
    // DELIVERY PAGES
    // ==============================
    if (path === "/shopease/delivery") {
      setShowDeliveryPartnerHome(true);
      return;
    }

    if (path === "/shopease/delivery/assigned-orders") {
      setShowDeliveryPartnerHome(true);
      setShowAssignedOrders(true);
      return;
    }

    if (path === "/shopease/delivery/profile") {
      setShowDeliveryPartnerHome(true);
      setShowDeliveryProfile(true);
      return;
    }

    if (path === "/shopease/delivery-register") {
      setShowDeliveryRegister(true);
      return;
    }
  };

  window.addEventListener(
    "popstate",
    handleBrowserPopState
  );

  // Run routing when app starts/reloads
  handleBrowserPopState({
    state: window.history.state
  });

  return () => {
    window.removeEventListener(
      "popstate",
      handleBrowserPopState
    );
  };
}, [products]);

const addToCart = async (product, options = {}) => {
  const openCart = options.openCart !== false;

  // =========================================
  // LOGIN CHECK
  // =========================================
  if (!loggedInUser?.id) {
    setShowLogin(true);

    window.history.pushState(
      { page: "login" },
      "",
      "/shopease/login"
    );

    return;
  }

  // =========================================
  // FIND PRICE / VARIANT
  // (home page products have price 0 when
  //  the real prices are inside the variants)
  // =========================================
  const parseAttributes = (attributes) => {
    if (!attributes) return {};
    if (typeof attributes === "object") return attributes;

    try {
      return JSON.parse(attributes);
    } catch {
      return {};
    }
  };

  let finalPrice =
    Number(product.price) ||
    Number(product.discount_price) ||
    Number(product.discountPrice) ||
    0;

  let variantId =
    product.variant_id ??
    product.variantId ??
    product.selectedVariant?.id ??
    null;

  let selectedSize =
    product.selected_size ??
    product.selectedSize ??
    null;

  const productVariants = Array.isArray(product.product_variants)
    ? product.product_variants
    : [];

  // No variant chosen (home page) -> use the cheapest available one
  if (productVariants.length > 0 && !variantId) {
    const availableVariants = productVariants.filter(
      (variant) =>
        Number(variant.stock || 0) > 0 &&
        variant.available !== false
    );

    const candidates =
      availableVariants.length > 0
        ? availableVariants
        : productVariants;

    const cheapest = candidates.reduce((best, current) => {
      const bestPrice =
        Number(best.discount_price) || Number(best.price) || 0;
      const currentPrice =
        Number(current.discount_price) || Number(current.price) || 0;

      return currentPrice > 0 &&
        (bestPrice === 0 || currentPrice < bestPrice)
        ? current
        : best;
    });

    variantId = cheapest.id ?? null;

    finalPrice =
      Number(cheapest.discount_price) ||
      Number(cheapest.price) ||
      finalPrice;

    const attributes = parseAttributes(cheapest.attributes);

    if (!selectedSize && attributes.size) {
      selectedSize = String(attributes.size);
    }
  }

  // Never add a ₹0 item
  if (finalPrice <= 0) {
    alert("This product has no valid price. Please contact the seller.");
    return;
  }

  try {
    console.log("ADD TO CART PRODUCT:", product);

    // =========================================
    // SEND PRODUCT TO BACKEND
    // =========================================
    const response = await fetch(CART_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: loggedInUser.id,

        product_id: product.id,

        quantity:
          Number(product.quantity) > 0
            ? Number(product.quantity)
            : 1,

        price: finalPrice,

        gst_rate:
          Number(
            product.gst_rate ??
              product.gstRate ??
              0
          ),

        selected_size: selectedSize,

        variant_id: variantId,
      }),
    });

    const data = await response.json();

    console.log("ADD TO CART RESPONSE:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to add product to cart"
      );
    }

    // =========================================
    // LOAD UPDATED CART
    // =========================================
    await loadCart(loggedInUser.id);

    // =========================================
    // HOME PAGE: stay on the page, just show a message
    // =========================================
    if (!openCart) {
      setLoginMessage("Added to cart");

      setTimeout(() => {
        setLoginMessage("");
      }, 2000);

      return;
    }

    // =========================================
    // PRODUCT DETAILS / WISHLIST: open the cart
    // =========================================
    setSelectedProduct(null);
    setShowCheckout(false);
    setShowCart(true);

    window.history.pushState(
      { page: "cart" },
      "",
      "/shopease/cart"
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

/* =========================================================

   MOVE FROM CART TO WISHLIST

========================================================= */



const moveToWishlist = async (item) => {

  if (!loggedInUser?.id) {

    setShowLogin(true);

    return;

  }



  try {



    /* =========================

       CHECK WISHLIST

    ========================= */



    const alreadyInWishlist =

      wishlist.some(

        (product) =>

          product.id === item.id

      );



    /* =========================

       ADD TO WISHLIST

    ========================= */



    if (!alreadyInWishlist) {



      const response = await fetch(

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

              item.id,

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

          "Failed to move product to wishlist"

        );

      }



    }



    /* =========================

       REMOVE FROM CART

    ========================= */



    const removeResponse =

      await fetch(

       `${CART_API_URL}/${item.cartItemId}`,

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



    const removeData =

      await removeResponse.json();



    if (

      !removeResponse.ok ||

      !removeData.success

    ) {

      throw new Error(

        removeData.message ||

        "Failed to remove product from cart"

      );

    }



    /* =========================

       RELOAD BOTH

    ========================= */



    await loadCart(

      loggedInUser.id

    );



    await loadWishlist(

      loggedInUser.id

    );



  } catch (error) {



    console.error(

      "Move to wishlist error:",

      error

    );



    alert(

      error.message ||

      "Failed to move product to wishlist"

    );

  }

};


/* =========================================================
   REMOVE FROM CART
========================================================= */

const removeFromCart = async (
  cartItemId
) => {

  if (!loggedInUser?.id) {
    setShowLogin(true);
    return;
  }

  try {

    const response = await fetch(
      `${CART_API_URL}/${cartItemId}`,
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
  /* =========================================================
   UPDATE CART QUANTITY
========================================================= */

const updateQuantity = async (
  cartItemId,
  change
) => {

  if (!loggedInUser?.id) {
    setShowLogin(true);
    return;
  }

  const currentItem = cart.find(
    (item) =>
      item.cartItemId === cartItemId
  );

  if (!currentItem) {
    console.error(
      "Cart item not found:",
      cartItemId
    );
    return;
  }

  const newQuantity =
    Number(currentItem.quantity) +
    Number(change);

  if (newQuantity <= 0) {
    await removeFromCart(cartItemId);
    return;
  }

  try {

    const response = await fetch(
      `${CART_API_URL}/${cartItemId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          user_id:
            loggedInUser.id,

          quantity:
            newQuantity,
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

  /* =========================================================

     ADD / REMOVE WISHLIST

  ========================================================= */



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



  /* =========================================================

     REMOVE FROM WISHLIST

  ========================================================= */



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



  /* =========================================================

     FILTER PRODUCTS

  ========================================================= */



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



  /* =========================================================

     VISIBLE PRODUCTS

  ========================================================= */



  const visibleProducts =

    filteredProducts.slice(

      0,

      visibleCount

    );



  /* =========================================================

     LOAD MORE

  ========================================================= */



  const loadMoreProducts = () => {

    setVisibleCount(

      (currentCount) =>

        currentCount + 20

    );

  };



  /* =========================================================

     SEARCH

  ========================================================= */



  const handleSearchChange = (

    value

  ) => {

    setSearch(value);

    setVisibleCount(20);

  };



  /* =========================================================

     CATEGORY

  ========================================================= */



  const handleCategoryChange = (

    value

  ) => {

    setCategory(value);

    setVisibleCount(20);

  };



  /* =========================================================

     CART COUNT

  ========================================================= */



  const cartCount = cart.reduce(

    (total, item) =>

      total + item.quantity,

    0

  );

const renderFooter = () => {
  return (
    <Footer
      onHome={() => {
        window.history.pushState(
          { page: "home" },
          "",
          "/shopease"
        );

        window.location.reload();
      }}

      onProducts={() => {
        window.history.pushState(
          { page: "home" },
          "",
          "/shopease#products"
        );

        window.location.reload();
      }}

      onOrders={() => {
        setShowOrderHistory(true);

        window.history.pushState(
          { page: "order-history" },
          "",
          "/shopease/order-history"
        );
      }}

      onAddresses={() => {
        setShowMyAddresses(true);

        window.history.pushState(
          { page: "addresses" },
          "",
          "/shopease/addresses"
        );
      }}

      onSupport={() => {
        setShowHelpSupport(true);

        window.history.pushState(
          { page: "help-support" },
          "",
          "/shopease/help-support"
        );
      }}

      onReturns={() => {
        setShowReturnsRefunds(true);

        window.history.pushState(
          { page: "returns-refunds" },
          "",
          "/shopease/returns-refunds"
        );
      }}

      onAbout={() => {
        setShowAbout(true);

        window.history.pushState(
          { page: "about" },
          "",
          "/shopease/about"
        );
      }}

      onPrivacy={() => {
        setShowPrivacy(true);

        window.history.pushState(
          { page: "privacy" },
          "",
          "/shopease/privacy"
        );
      }}

      onTerms={() => {
        setShowTerms(true);

        window.history.pushState(
          { page: "terms" },
          "",
          "/shopease/terms"
        );
      }}

      onContact={() => {
        setShowContact(true);

        window.history.pushState(
          { page: "contact" },
          "",
          "/shopease/contact"
        );
      }}
    />
  );
};

  /* =========================================================

     MY ADDRESSES

  ========================================================= */



  if (showMyAddresses) {

    return (

      <div className="app">

      <MyAddresses

        loggedInUser={loggedInUser}


onBack={() => {
  window.history.back();
}}

      />
      {renderFooter()}

    </div>
    );

  }



  /* =========================================================

     ACCOUNT SETTINGS

  ========================================================= */



  if (showAccountSettings) {

    return (
      <div className="app">

      <AccountSettings

        loggedInUser={loggedInUser}

onBack={() => {
  window.history.back();
}}


        onUpdated={(updatedUser) => {

          setLoggedInUser(updatedUser);

        }}

      />
 {renderFooter()}

    </div>

    );

  }



  /* =========================================================

     PROFILE PAGE

  ========================================================= */



  if (showProfile) {

    return (
 <div className="app">
      <Profile

        loggedInUser={loggedInUser}


onBack={() => {
  window.history.back();
}}
onLogin={() => {
  setShowProfile(false);
  setShowLogin(true);

  window.history.pushState(
    { page: "login" },
    "",
    "/shopease/login"
  );
}}
      onRegister={() => {

  setShowProfile(false);
  setShowRegistration(true);

  window.history.pushState(
    { page: "registration" },
    "",
    "/shopease/registration"
  );

}}
onOrders={() => {
  setShowProfile(false);
  setShowOrderHistory(true);

  window.history.pushState(
    { page: "order-history" },
    "",
    "/shopease/order-history"
  );
}}

onAddresses={() => {
  setShowProfile(false);
  setShowMyAddresses(true);

  window.history.pushState(
    { page: "addresses" },
    "",
    "/shopease/addresses"
  );
}}

       onAccountSettings={() => {
  setShowProfile(false);
  setShowAccountSettings(true);

  window.history.pushState(
    { page: "account-settings" },
    "",
    "/shopease/account-settings"
  );
}}


        onLogout={() => {

          setLoggedInUser(null);

          setCart([]);

          setWishlist([]);



          localStorage.removeItem(

            "customer_token"

          );



          localStorage.removeItem(

            "customer_user"

          );
          sessionStorage.removeItem("active_user");
setShowProfile(false);

setShowLogin(true);

window.history.pushState(
  { page: "login" },
  "",
  "/shopease/login"
);   }}

      />
{renderFooter()}

  </div>
    );

  }



  /* =========================================================

     ORDER HISTORY

  ========================================================= */



  if (showOrderHistory) {

    return (
      <div className="app">
      <OrderHistory

        loggedInUser={loggedInUser}



        onBack={() => {
  window.history.back();
}}


onViewDetails={(order) => {
  setSelectedOrder(order);
  setShowOrderHistory(false);
  setShowOrderDetails(true);

  window.history.pushState(
  {
    page: "order-details",
    order: order
  },
  "",
  `/shopease/order-details/${order.id}`
);
}}


        onTrackOrder={async (order) => {

          try {

            const response = await fetch(

              `${API_BASE_URL}/api/orders/${order.id}`,

              {

                headers: {

                  Authorization:

                    `Bearer ${localStorage.getItem(

                      "customer_token"

                    )}`,

                },

              }

            );



            const data =

              await response.json();



            if (!response.ok) {

              throw new Error(

                data.message ||

                "Failed to fetch latest order"

              );

            }



            setOrderData(

              data.order ||

              data.data ||

              data

            );

          } catch (error) {

            console.error(

              "Failed to fetch latest order:",

              error

            );



            setOrderData(order);

          }


setShowOrderHistory(false);
setTrackingFromDetails(false);
setShowOrderTracking(true);
window.history.pushState(
  {
    page: "order-tracking",
    order: order
  },
  "",
  "/shopease/order-tracking"
);     }}

onDownloadInvoice={(order) => {
  setSelectedInvoiceOrder(order);
  setShowInvoice(true);
  setShowOrderHistory(false);

 window.history.pushState(
  {
    page: "invoice",
    order: order
  },
  "",
  `/shopease/invoice/${order.id}`
);
}}
      />

      {renderFooter()}

    </div>
    );

  }



  /* =========================================================

     INVOICE

  ========================================================= */



  if (showInvoice) {

    return (
<div className="app">
      <Invoice

        order={selectedInvoiceOrder}

onBack={() => {
  window.history.back();
}}
      />
{renderFooter()}

    </div>
    );

  }



  /* =========================================================

     ORDER DETAILS

  ========================================================= */



  if (showOrderDetails) {

    return (
<div className="app">
      <OrderDetails

        order={selectedOrder}



       onBack={() => {
  window.history.back();
}}



        onTrack={async (order) => {

          try {

            const response = await fetch(

              `${API_BASE_URL}/api/orders/${order.id}`,

              {

                headers: {

                  Authorization:

                    `Bearer ${localStorage.getItem(

                      "customer_token"

                    )}`,

                },

              }

            );



            const data =

              await response.json();



            if (!response.ok) {

              throw new Error(

                data.message ||

                "Failed to fetch latest order"

              );

            }



            setOrderData(

              data.order ||

              data.data ||

              data

            );

          } catch (error) {

            console.error(

              "Failed to fetch latest order:",

              error

            );



            setOrderData(order);

          }



          setShowOrderDetails(false);
setTrackingFromDetails(true);
setShowOrderTracking(true);
window.history.pushState(
  {
    page: "order-tracking",
    order: order
  },
  "",
  "/shopease/order-tracking"
);
        }}



        onCancel={(order) => {

          alert(

            "Cancel Order will be connected to the backend next."

          );

        }}

      />

      {renderFooter()}

    </div>

    );

  }



  /* =========================================================

     MERCHANT ADD PRODUCT

  ========================================================= */



  if (

    showMerchantHome &&

    showAddProduct

  ) {

    return (

      <AddProduct

        merchant={loggedInUser}
onBack={() => {
  window.history.back();
}}

        onProductAdded={(product) => {

          console.log(

            "New product added:",

            product

          );



          setProducts(

            (previousProducts) => [

              product,

              ...previousProducts,

            ]

          );



          setShowAddProduct(false);

        }}

      />

    );

  }



  /* =========================================================

     MERCHANT PRODUCTS

  ========================================================= */



  if (

    showMerchantHome &&

    showMerchantProducts

  ) {

    return (

      <MerchantProducts

        merchant={loggedInUser}

onBack={() => {
  window.history.back();
}}

    onAddProduct={() => {
  setShowMerchantProducts(false);
  setShowAddProduct(true);

  window.history.pushState(
    { page: "merchant-add-product" },
    "",
    "/shopease/merchant/add-product"
  );
}}
      />

    );

  }



  /* =========================================================

     MERCHANT ORDERS

  ========================================================= */



  if (

    showMerchantHome &&

    showMerchantOrders

  ) {

    return (

      <MerchantOrders

        merchant={loggedInUser}
onBack={() => {
  window.history.back();
}}
      />

    );

  }



  /* =========================================================

     MERCHANT INVENTORY

  ========================================================= */



  if (

    showMerchantHome &&

    showMerchantInventory

  ) {

    return (

      <MerchantInventory

        merchant={loggedInUser}
onBack={() => {
  window.history.back();
}}
      />

    );

  }



  /* =========================================================

     MERCHANT PROFILE

  ========================================================= */



  if (

    showMerchantHome &&

    showMerchantProfile

  ) {

    return (

      <MerchantProfile

        merchant={loggedInUser}
onBack={() => {
  window.history.back();
}}
        onLogout={() => {

          setLoggedInUser(null);



          localStorage.removeItem(

            "merchant_token"

          );



          localStorage.removeItem(

            "merchant_user"

          );
          sessionStorage.removeItem("active_user");
setShowMerchantHome(false);

setShowLiveTour(false);

setTourRole(null);

setShowLogin(true);

window.history.pushState(
  { page: "login" },
  "",
  "/shopease/login"
);

        }}



        onProfileUpdated={(updatedUser) => {

          setLoggedInUser(updatedUser);

        }}

      />

    );

  }



  /* =========================================================

     MERCHANT REGISTER

  ========================================================= */



  if (showMerchantRegister) {

    return (

      <MerchantRegister
onBack={() => {
  window.history.back();
}}
onLogin={() => {
  setShowMerchantRegister(false);
  setShowLogin(true);

  window.history.pushState(
    { page: "login" },
    "",
    "/shopease/login"
  );
}}
        onRegistered={(merchant) => {

          console.log(

            "Registered merchant:",

            merchant

          );
setShowMerchantRegister(false);
setShowLogin(true);

window.history.pushState(
  { page: "login" },
  "",
  "/shopease/login"
);
        }}

      />

    );

  }



  /* =========================================================

     MERCHANT SALES

  ========================================================= */



  if (

    showMerchantHome &&

    showMerchantSales

  ) {

    return (

      <MerchantSales

        merchant={loggedInUser}
onBack={() => {
  window.history.back();
}}
      />

    );

  }



  /* =========================================================

     ADMIN MERCHANTS

  ========================================================= */



  if (showAdminMerchants) {

    return (

      <AdminMerchants

        admin={loggedInUser}
onBack={() => {
  window.history.back();
}}

      />

    );

  }



  /* =========================================================

     ADMIN CUSTOMERS

  ========================================================= */



  if (showAdminCustomers) {

    return (

      <AdminCustomers

        admin={loggedInUser}
onBack={() => {
  window.history.back();
}}

      />

    );

  }



  /* =========================================================

     ADMIN PRODUCTS

  ========================================================= */



  if (showAdminProducts) {

    return (

      <AdminProducts

        admin={loggedInUser}

onBack={() => {
  window.history.back();
}}
      />

    );

  }



  /* =========================================================

     ADMIN ORDERS

  ========================================================= */



  if (showAdminOrders) {

    return (

      <AdminOrders

        admin={loggedInUser}
onBack={() => {
  window.history.back();
}}
      />

    );

  }



  /* =========================================================

     ADMIN PAYMENTS

  ========================================================= */



  if (showAdminPayments) {

    return (

      <AdminPayments

        admin={loggedInUser}
onBack={() => {
  window.history.back();
}}
      />

    );

  }



  /* =========================================================

     ADMIN DELIVERY PARTNERS

  ========================================================= */



  if (showAdminDeliveryPartners) {

    return (

      <AdminDeliveryPartners

        admin={loggedInUser}
onBack={() => {
  window.history.back();
}}
      />

    );

  }



  /* =========================================================

     ADMIN PROFIT

  ========================================================= */



  if (showAdminProfit) {

    return (

      <AdminProfit

        admin={loggedInUser}
onBack={() => {
  window.history.back();
}}
      />

    );

  }



  /* =========================================================

     ADMIN REPORTS

  ========================================================= */



  if (showAdminReports) {

    return (

      <AdminReports

        admin={loggedInUser}
onBack={() => {
  window.history.back();
}}

      />

    );

  }

if (showAdminBanners) {
  return (
    <BannerManagement
      onBack={() => {
        setShowAdminBanners(false);
        setShowAdminHome(true);

        window.history.pushState(
          { page: "admin-home" },
          "",
          "/shopease/admin"
        );
      }}
    />
  );
}

  /* =========================================================

     ADMIN HOME

     NO LIVE TOUR

  ========================================================= */



  if (showAdminHome) {

    return (

      <AdminHome

        admin={loggedInUser}



        onLogout={() => {

          setLoggedInUser(null);



          localStorage.removeItem(

            "admin_token"

          );



          localStorage.removeItem(

            "admin_user"

          );
          sessionStorage.removeItem("active_user");



          setShowAdminHome(false);

          setShowLiveTour(false);

          setTourRole(null);

          setShowLogin(true);
          window.history.pushState(
  { page: "login" },
  "",
  "/shopease/login"
);

        }}

onCustomers={() => {
  setShowAdminHome(false);
  setShowAdminCustomers(true);

  window.history.pushState(
    { page: "admin-customers" },
    "",
    "/shopease/admin/customers"
  );
}}

      onMerchants={() => {
  setShowAdminHome(false);
  setShowAdminMerchants(true);

  window.history.pushState(
    { page: "admin-merchants" },
    "",
    "/shopease/admin/merchants"
  );
}}

onProducts={() => {
  setShowAdminHome(false);
  setShowAdminProducts(true);

  window.history.pushState(
    { page: "admin-products" },
    "",
    "/shopease/admin/products"
  );
}}
onOrders={() => {
  setShowAdminHome(false);
  setShowAdminOrders(true);

  window.history.pushState(
    { page: "admin-orders" },
    "",
    "/shopease/admin/orders"
  );
}}
onPayments={() => {
  setShowAdminHome(false);
  setShowAdminPayments(true);

  window.history.pushState(
    { page: "admin-payments" },
    "",
    "/shopease/admin/payments"
  );
}}
     onReports={() => {
  setShowAdminHome(false);
  setShowAdminReports(true);

  window.history.pushState(
    { page: "admin-reports" },
    "",
    "/shopease/admin/reports"
  );
}}
onDeliveryPartners={() => {
  setShowAdminHome(false);
  setShowAdminDeliveryPartners(true);

  window.history.pushState(
    { page: "admin-delivery-partners" },
    "",
    "/shopease/admin/delivery-partners"
  );
}}
onProfit={() => {
  setShowAdminHome(false);
  setShowAdminProfit(true);

  window.history.pushState(
    { page: "admin-profit" },
    "",
    "/shopease/admin/profit"
  );
}}

onBanners={() => {
  setShowAdminHome(false);
  setShowAdminBanners(true);

  window.history.pushState(
    { page: "admin-banners" },
    "",
    "/shopease/admin/banners"
  );
}}

      />

    );

  }



  /* =========================================================

     MERCHANT HOME + LIVE TOUR

  ========================================================= */



  if (showMerchantHome) {

    return (

      <>

        <MerchantHome

          merchant={loggedInUser}



          onLogout={() => {

            setLoggedInUser(null);



            setShowMerchantHome(false);

            setShowLiveTour(false);

            setTourRole(null);



            localStorage.removeItem(

              "merchant_token"

            );



            localStorage.removeItem(

              "merchant_user"

            );

sessionStorage.removeItem("active_user");

            setShowLogin(true);
            window.history.pushState(
  { page: "login" },
  "",
  "/shopease/login"
);

          }}
onAddProduct={() => {
  setShowAddProduct(true);

  window.history.pushState(
    { page: "merchant-add-product" },
    "",
    "/shopease/merchant/add-product"
  );
}}
onProducts={() => {
  setShowMerchantProducts(true);

  window.history.pushState(
    { page: "merchant-products" },
    "",
    "/shopease/merchant/products"
  );
}}
onOrders={() => {
  setShowMerchantOrders(true);

  window.history.pushState(
    { page: "merchant-orders" },
    "",
    "/shopease/merchant/orders"
  );
}}
onInventory={() => {
  setShowMerchantInventory(true);

  window.history.pushState(
    { page: "merchant-inventory" },
    "",
    "/shopease/merchant/inventory"
  );
}}
onSales={() => {
  setShowMerchantSales(true);

  window.history.pushState(
    { page: "merchant-sales" },
    "",
    "/shopease/merchant/sales"
  );
}}
onProfile={() => {
  setShowMerchantProfile(true);

  window.history.pushState(
    { page: "merchant-profile" },
    "",
    "/shopease/merchant/profile"
  );
}}
        />



        {showLiveTour &&

          tourRole === "merchant" && (

            <LiveTour

              role="merchant"

              onFinish={() => {

                setShowLiveTour(false);

              }}

            />

          )}

      </>

    );

  }



  /* =========================================================

     ADMIN LOGIN

  ========================================================= */



  if (showAdminLogin) {

    return (

      <div className="app">

        <AdminLogin

         onBack={() => {
  window.history.back();
}}



          onLoginSuccess={(user) => {

            setLoggedInUser(user);



            setShowAdminLogin(false);

            setShowAdminHome(true);
            window.history.pushState(
  { page: "admin-home" },
  "",
  "/shopease/admin"
);

            setShowMerchantHome(false);

            setShowDeliveryPartnerHome(false);



            setShowLiveTour(false);

            setTourRole(null);



            setLoginMessage(

              "Admin login successful!"

            );



            setTimeout(() => {

              setLoginMessage("");

            }, 3000);

          }}

        />

      </div>

    );

  }



  /* =========================================================

     DELIVERY PARTNER - ASSIGNED ORDERS

  ========================================================= */



  if (

    showDeliveryPartnerHome &&

    showAssignedOrders

  ) {

    return (

      <AssignedOrders

        deliveryPartner={loggedInUser}
onBack={() => {
  window.history.back();
}}
      />

    );

  }



  /* =========================================================

     DELIVERY PARTNER - PROFILE

  ========================================================= */



  if (

    showDeliveryPartnerHome &&

    showDeliveryProfile

  ) {

    return (

      <DeliveryProfile

        deliveryPartner={loggedInUser}
onBack={() => {
  window.history.back();
}}
        onLogout={() => {

          setLoggedInUser(null);



          localStorage.removeItem(

            "delivery_token"

          );



          localStorage.removeItem(

            "delivery_user"

          );
sessionStorage.removeItem("active_user");


          setShowDeliveryPartnerHome(false);

          setShowLiveTour(false);

          setTourRole(null);

          setShowLogin(true);
          window.history.pushState(
  { page: "login" },
  "",
  "/shopease/login"
);

        }}

      />

    );

  }



  /* =========================================================

     DELIVERY PARTNER HOME + LIVE TOUR

  ========================================================= */



  if (showDeliveryPartnerHome) {

    return (

      <>

        <DeliveryDashboard

          deliveryPartner={loggedInUser}
onAssignedOrders={() => {
  setShowAssignedOrders(true);

  window.history.pushState(
    { page: "delivery-assigned-orders" },
    "",
    "/shopease/delivery/assigned-orders"
  );
}}
onProfile={() => {
  setShowDeliveryProfile(true);

  window.history.pushState(
    { page: "delivery-profile" },
    "",
    "/shopease/delivery/profile"
  );
}}
          onLogout={() => {

            setLoggedInUser(null);



            setShowDeliveryPartnerHome(false);

            setShowLiveTour(false);

            setTourRole(null);



            localStorage.removeItem(

              "delivery_token"

            );



            localStorage.removeItem(

              "delivery_user"

            );



            setShowLogin(true);
            window.history.pushState(
  { page: "login" },
  "",
  "/shopease/login"
);

          }}

        />



        {showLiveTour &&

          tourRole === "delivery" && (

            <LiveTour

              role="delivery"

              onFinish={() => {

                setShowLiveTour(false);

              }}

            />

          )}

      </>

    );

  }



  /* =========================================================

     DELIVERY PARTNER REGISTRATION

  ========================================================= */



  if (showDeliveryRegister) {

    return (

      <DeliveryRegister

        onBack={() => {
  window.history.back();
}}

onLogin={() => {
  setShowDeliveryRegister(false);
  setShowLogin(true);

  window.history.pushState(
    { page: "login" },
    "",
    "/shopease/login"
  );
}}
onRegistered={(deliveryPartner) => {
  console.log(
    "Delivery Partner Registered:",
    deliveryPartner
  );

  setShowDeliveryRegister(false);
  setShowLogin(true);

  window.history.pushState(
    { page: "login" },
    "",
    "/shopease/login"
  );
}}

      />

    );

  }

/* =========================================================
   FORGOT PASSWORD
========================================================= */

if (showForgotPassword) {
  return (
    <div className="app">
      <ForgotPassword
        role={forgotPasswordRole}
        onBack={() => {
          setShowForgotPassword(false);
          setShowLogin(true);

          window.history.pushState(
            { page: "login" },
            "",
            "/shopease/login"
          );
        }}
      />
    </div>
  );
}

  /* =========================================================

     LOGIN PAGE

  ========================================================= */



  if (showLogin) {

    return (

      <div className="app">

        <Login

 onBack={() => {
  window.history.back();
}}

         onRegister={() => {
  setShowLogin(false);
  setShowRegistration(true);

  window.history.pushState(
    { page: "registration" },
    "",
    "/shopease/registration"
  );
}}

         onMerchantRegister={() => {
  setShowLogin(false);
  setShowMerchantRegister(true);

  window.history.pushState(
    { page: "merchant-register" },
    "",
    "/shopease/merchant-register"
  );
}}
        onDeliveryLogin={() => {
  setShowLogin(false);
  setShowDeliveryRegister(true);

  window.history.pushState(
    { page: "delivery-register" },
    "",
    "/shopease/delivery-register"
  );
}}

          onAdminLogin={() => {
  setShowLogin(false);
  setShowAdminLogin(true);

  window.history.pushState(
    { page: "admin-login" },
    "",
    "/shopease/admin-login"
  );
}}
onForgotPassword={(role) => {
  setShowLogin(false);
  setForgotPasswordRole(role || "customer");
  setShowForgotPassword(true);

  window.history.pushState(
    { page: "forgot-password" },
    "",
    "/shopease/forgot-password"
  );
}}


          onLoginSuccess={(user) => {

            console.log(

              "Logged in user:",

              user

            );


sessionStorage.setItem(
  "active_user",
  JSON.stringify(user)
);

setLoggedInUser(user);



            setLoginMessage(

              "Login successful! Welcome back."

            );



            setTimeout(() => {

              setLoginMessage("");

            }, 3000);



            setShowLogin(false);



            setShowLiveTour(false);

            setTourRole(null);



            /* ADMIN */



            if (user.role === "admin") {

              setShowAdminHome(true);
              window.history.pushState(
  { page: "admin-home" },
  "",
  "/shopease/admin"
);

              setShowMerchantHome(false);

              setShowDeliveryPartnerHome(false);



              setShowLiveTour(false);

              setTourRole(null);

            }



            /* MERCHANT */



            else if (

              user.role === "merchant"

            ) {

              setShowAdminHome(false);

              setShowMerchantHome(true);
              window.history.pushState(
  { page: "merchant-home" },
  "",
  "/shopease/merchant"
);

              setShowDeliveryPartnerHome(false);



              setTourRole("merchant");



              if (

                localStorage.getItem(

                  "shopease_merchant_tour_completed"

                ) !== "true"

              ) {

                setTimeout(() => {

                  setShowLiveTour(true);

                }, 800);

              }

            }



            /* DELIVERY PARTNER */



            else if (

              user.role === "delivery_partner"

            ) {

              setShowAdminHome(false);

              setShowMerchantHome(false);

              setShowDeliveryPartnerHome(true);
              window.history.pushState(
  { page: "delivery-home" },
  "",
  "/shopease/delivery"
);



              setTourRole("delivery");



              if (

                localStorage.getItem(

                  "shopease_delivery_tour_completed"

                ) !== "true"

              ) {

                setTimeout(() => {

                  setShowLiveTour(true);

                }, 800);

              }

            }



            /* CUSTOMER */



            else {

              setShowAdminHome(false);

              setShowMerchantHome(false);

              setShowDeliveryPartnerHome(false);
              window.history.pushState(
  { page: "home" },
  "",
  "/shopease/"
);


              setTourRole("customer");



              if (

                localStorage.getItem(

                  "shopease_customer_tour_completed"

                ) !== "true"

              ) {

                setTimeout(() => {

                  setShowLiveTour(true);

                }, 800);

              }

            }

          }}

        />

      </div>

    );

  }



  /* =========================================================

     REGISTRATION PAGE

  ========================================================= */



  if (showRegistration) {

    return (

      <div className="app">

        <Registration

         onBack={() => {
  window.history.back();
}}


onLogin={() => {
  setShowRegistration(false);
  setShowLogin(true);

  window.history.pushState(
    { page: "login" },
    "",
    "/shopease/login"
  );
}}

        />

      </div>

    );

  }



  /* =========================================================

     PRIVACY

  ========================================================= */

if (showPrivacy) {
  return (
    <div className="app simple-page-wrapper">
      <Privacy />
       {renderFooter()}
    </div>
  );
}

  /* =========================================================

     TERMS

  ========================================================= */
if (showTerms) {
  return (
    <div className="app simple-page-wrapper">
      <Terms />
       {renderFooter()}
    </div>
  );
}

  /* =========================================================

     CONTACT

  ========================================================= */

if (showContact) {
  return (
    <div className="app simple-page-wrapper">
      <Contact />

      {renderFooter()}
    </div>
  );
}
if (showAbout) {
  return (
    <div className="app">
      <About />
      {renderFooter()}
    </div>
  );
}

if (showHelpSupport) {
  return (
    <div className="app">
      <HelpSupport />

      {renderFooter()}
    </div>
  );
}
if (showReturnsRefunds) {
  return (
    <div className="app">
      <ReturnsRefunds />
      {renderFooter()}
    </div>
  );
}
  /* =========================================================

     ORDER TRACKING

  ========================================================= */



  if (showOrderTracking) {

    const handleCancelOrder = async (

      orderId,

      cancellationReason

    ) => {

      const response = await fetch(

        `${API_BASE_URL}/api/orders/${orderId}/cancel`,

        {

          method: "PUT",



          headers: {

            "Content-Type":

              "application/json",



            Authorization:

              `Bearer ${localStorage.getItem(

                "customer_token"

              )}`,

          },



          body: JSON.stringify({

            cancellation_reason:

              cancellationReason,

          }),

        }

      );



      const data =

        await response.json();



      if (!response.ok) {

        throw new Error(

          data.message ||

          "Failed to cancel order"

        );

      }



      setOrderData(

        (previousOrder) => ({

          ...previousOrder,

          order_status:

            "Cancelled",

          cancellation_reason:

            cancellationReason,

        })

      );



      return data;

    };



    const handleReturnOrder = async (

      orderId,

      returnReason

    ) => {

      const response = await fetch(

        `${API_BASE_URL}/api/orders/${orderId}/return`,

        {

          method: "PUT",



          headers: {

            "Content-Type":

              "application/json",



            Authorization:

              `Bearer ${localStorage.getItem(

                "customer_token"

              )}`,

          },



          body: JSON.stringify({

            return_reason:

              returnReason,

          }),

        }

      );



      const data =

        await response.json();



      if (!response.ok) {

        throw new Error(

          data.message ||

          "Failed to submit return request"

        );

      }



      setOrderData(

        (previousOrder) => ({

          ...previousOrder,



          return_status:

            "Requested",



          return_reason:

            returnReason,

        })

      );



      return data;

    };



    return (
 <div className="app">
      <OrderTracking

        order={orderData}

       onBack={() => {
  window.history.back();
}}

        onCancel={handleCancelOrder}
        onReturn={handleReturnOrder}

      />

    {renderFooter()}

  </div>
    );

  }



  /* =========================================================

     ORDER SUCCESS

  ========================================================= */



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

  window.history.pushState(
    { page: "home" },
    "",
    "/shopease/"
  );
}}
         onTrackOrder={() => {
  setShowOrderSuccess(false);
  setTrackingFromDetails(false);
  setShowOrderTracking(true);
window.history.pushState(
  {
    page: "order-tracking",
    order: orderData
  },
  "",
  "/shopease/order-tracking"
);
}}

        />
{renderFooter()}
      </div>

    );

  }



  /* =========================================================

     CHECKOUT

  ========================================================= */



  if (showCheckout) {

  return (

    <div className="app">



      <Checkout

        cart={cart}



        loggedInUser={loggedInUser}
onBack={() => {
  window.history.back();
}}
onManageAddresses={() => {
  setShowCheckout(false);
  setShowMyAddresses(true);

  window.history.pushState(
    { page: "addresses" },
    "",
    "/shopease/addresses"
  );
}}


onOrderPlaced={async (order) => {
  try {
    // Save the newly created order
    setOrderData(order);

    // ==============================
    // REMOVE ORDERED PRODUCTS FROM CART
    // ==============================

    if (loggedInUser?.id && cart.length > 0) {
      for (const item of cart) {
        try {
          const response = await fetch(
            `${CART_API_URL}/${item.id}`,
            {
              method: "DELETE",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                user_id: loggedInUser.id,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok || !data.success) {
            console.error(
              `Failed to remove product ${item.id} from cart:`,
              data.message
            );
          }
        } catch (error) {
          console.error(
            `Cart removal error for product ${item.id}:`,
            error
          );
        }
      }
    }

    // ==============================
    // CLEAR CART FROM UI
    // ==============================

    setCart([]);

// ==============================
// GO TO ORDER SUCCESS
// ==============================

setShowCheckout(false);
setShowOrderSuccess(true);

window.history.pushState(
  { page: "order-success" },
  "",
  "/shopease/order-success"
);
  } catch (error) {
    console.error(
      "Post-order cart cleanup error:",
      error
    );

    // Even if cart cleanup has an issue,
    // show the successful order page.
    setCart([]);
setShowCheckout(false);
setShowOrderSuccess(true);

window.history.pushState(
  { page: "order-success" },
  "",
  "/shopease/order-success"
);
  }
}}

      />

{renderFooter()}

    </div>

  );

}



  /* =========================================================

     WISHLIST PAGE

     NAVBAR HIDDEN

  ========================================================= */



  if (showWishlist) {

    return (

      <div className="app">



        <Wishlist

          wishlist={wishlist}
onBack={() => {
  window.history.back();
}}
          onRemove={
            removeFromWishlist
          }
          onAddToCart={

            addToCart

          }

onCartClick={() => {
  setShowWishlist(false);
  setShowCart(true);

  window.history.pushState(
    { page: "cart" },
    "",
    "/shopease/cart"
  );
}}
onAdminLogin={() => {

  setShowWishlist(false);
  setShowAdminLogin(true);

  window.history.pushState(
    { page: "admin-login" },
    "",
    "/shopease/admin-login"
  );

}}

        />

{renderFooter()}

      </div>

    );

  }



  /* =========================================================

     CART PAGE

     NAVBAR HIDDEN

  ========================================================= */



  if (showCart) {

    return (

      <div className="app">



        <Cart

          cart={cart}


onBack={() => {
  window.history.back();
}}


          onRemove={

            removeFromCart

          }



          onUpdateQuantity={

            updateQuantity

          }



          onMoveToWishlist={moveToWishlist}

onWishlistClick={() => {
  setShowCart(false);
  setShowWishlist(true);

  window.history.pushState(
    { page: "wishlist" },
    "",
    "/shopease/wishlist"
  );
}}

onCheckout={() => {
  setShowCart(false);
  setShowCheckout(true);

  window.history.pushState(
    { page: "checkout" },
    "",
    "/shopease/checkout"
  );
}}

        />
{renderFooter()}


      </div>

    );

  }



  /* =========================================================

     PRODUCT DETAILS

  ========================================================= */



    if (selectedProduct) {

    return (

      <div className="app">

        {/* ADDED TO CART MESSAGE */}
        {loginMessage && (
          <div className="login-success-message">
            ✓ {loginMessage}
          </div>
        )}

        <Navbar
  search={search}
  setSearch={handleSearchChange}

  loggedInUser={loggedInUser}

  cartCount={cartCount}

  wishlistCount={wishlist.length}

  onLoginClick={() => {
    setShowLogin(true);

    window.history.pushState(
      { page: "login" },
      "",
      "/shopease/login"
    );
  }}

  onOrders={() => {
    setSelectedProduct(null);
    setShowOrderHistory(true);

    window.history.pushState(
      { page: "order-history" },
      "",
      "/shopease/order-history"
    );
  }}

  onAddresses={() => {
    setSelectedProduct(null);
    setShowMyAddresses(true);

    window.history.pushState(
      { page: "addresses" },
      "",
      "/shopease/addresses"
    );
  }}

  onAccountSettings={() => {
    setSelectedProduct(null);
    setShowAccountSettings(true);

    window.history.pushState(
      { page: "account-settings" },
      "",
      "/shopease/account-settings"
    );
  }}

  onLogout={() => {
    setLoggedInUser(null);
    setCart([]);
    setWishlist([]);

    localStorage.removeItem(
      "customer_token"
    );

    localStorage.removeItem(
      "customer_user"
    );

    sessionStorage.removeItem(
      "active_user"
    );

    setSelectedProduct(null);
    setShowLogin(true);

    window.history.pushState(
      { page: "login" },
      "",
      "/shopease/login"
    );
  }}

  onCartClick={() => {
    setSelectedProduct(null);
    setShowCart(true);

    window.history.pushState(
      { page: "cart" },
      "",
      "/shopease/cart"
    );
  }}

  onWishlistClick={() => {
    setSelectedProduct(null);
    setShowWishlist(true);

    window.history.pushState(
      { page: "wishlist" },
      "",
      "/shopease/wishlist"
    );
  }}
/>
<ProductDetails
  product={selectedProduct}
  products={products}

  onBack={() => {
    window.history.back();
  }}

  onAddToCart={(item) => addToCart(item, { openCart: false })}

  onBuyNow={(product) => {
    console.log("BUY NOW CLICKED:", product);

    setCart([product]);

    setSelectedProduct(null);

    setShowCheckout(true);

    window.history.pushState(
      { page: "checkout" },
      "",
      "/shopease/checkout"
    );
  }}

   onProductSelect={(relatedProduct) => {
    setSelectedProduct(relatedProduct);
  }}

  onToggleWishlist={toggleWishlist}
  isWishlisted={wishlist.some(
    (item) => item.id === selectedProduct.id
  )}
/>

{renderFooter()}

      </div>

    );

  }



  /* =========================================================

     HOME PAGE

  ========================================================= */


  return (

    <div className="app">



      {/* LOGIN SUCCESS MESSAGE */}



      {loginMessage && (

        <div className="login-success-message">

          ✓ {loginMessage}

        </div>

      )}



      {/* CUSTOMER LIVE TOUR */}



      {showLiveTour &&

        tourRole === "customer" && (

          <LiveTour

            role="customer"

            onFinish={() => {

              setShowLiveTour(false);

            }}

          />

        )}



      {/* NAVBAR */}



      <Navbar
  search={search}
  setSearch={handleSearchChange}

  loggedInUser={loggedInUser}

  cartCount={cartCount}

  wishlistCount={wishlist.length}

  onLoginClick={() => {
    setShowLogin(true);

    window.history.pushState(
      { page: "login" },
      "",
      "/shopease/login"
    );
  }}

  onOrders={() => {
    setShowOrderHistory(true);

    window.history.pushState(
      { page: "order-history" },
      "",
      "/shopease/order-history"
    );
  }}

  onAddresses={() => {
    setShowMyAddresses(true);

    window.history.pushState(
      { page: "addresses" },
      "",
      "/shopease/addresses"
    );
  }}

  onAccountSettings={() => {
    setShowAccountSettings(true);

    window.history.pushState(
      { page: "account-settings" },
      "",
      "/shopease/account-settings"
    );
  }}

  onLogout={() => {
    setLoggedInUser(null);
    setCart([]);
    setWishlist([]);

    localStorage.removeItem(
      "customer_token"
    );

    localStorage.removeItem(
      "customer_user"
    );

    sessionStorage.removeItem(
      "active_user"
    );

    setShowLogin(true);

    window.history.pushState(
      { page: "login" },
      "",
      "/shopease/login"
    );
  }}

  onCartClick={() => {
    setShowCart(true);

    window.history.pushState(
      { page: "cart" },
      "",
      "/shopease/cart"
    );
  }}

  onWishlistClick={() => {
    setShowWishlist(true);

    window.history.pushState(
      { page: "wishlist" },
      "",
      "/shopease/wishlist"
    );
  }}
/>



      {/* HERO */}



      {!search.trim() && (

        <Hero />

      )}



      {/* CATEGORIES */}



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



      {/* PRODUCTS */}



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



        {/* LOADING */}



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



        {/* ERROR */}



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



        {/* PRODUCT GRID */}



        {!productsLoading &&

          !productsError && (



            <div className="product-grid">



              {visibleProducts.map(

                (product) => (



                  <ProductCard

                    key={product.id}



                    product={product}


onAddToCart={(item) => addToCart(item, { openCart: false })}


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


onViewDetails={() => {
  setSelectedProduct(product);
  window.history.pushState(
  { page: "product-details" },
  "",
  `/shopease/product/${product.id}`
);
}}

                  />



                )

              )}



            </div>

          )}



        {/* LOAD MORE */}



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



        {/* NO PRODUCTS */}



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



      {/* FEATURES */}



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



      {/* FOOTER */}


<Footer

  onHome={() => {
    window.history.pushState(
      { page: "home" },
      "",
      "/shopease"
    );

    window.location.reload();
  }}

 onProducts={() => {
  const productsSection = document.getElementById("products");

  if (productsSection) {
    productsSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}}

  onOffers={() => {
    window.history.pushState(
      { page: "offers" },
      "",
      "/shopease"
    );

    window.location.reload();
  }}

  onNewArrivals={() => {
    window.history.pushState(
      { page: "new-arrivals" },
      "",
      "/shopease"
    );

    window.location.reload();
  }}

  onOrders={() => {
    setShowOrderHistory(true);

    window.history.pushState(
      { page: "order-history" },
      "",
      "/shopease/order-history"
    );
  }}

  onAddresses={() => {
    setShowMyAddresses(true);

    window.history.pushState(
      { page: "addresses" },
      "",
      "/shopease/addresses"
    );
  }}

 onSupport={() => {
  setShowHelpSupport(true);

  window.history.pushState(
    { page: "help-support" },
    "",
    "/shopease/help-support"
  );
}}

 onReturns={() => {
  setShowReturnsRefunds(true);

  window.history.pushState(
    { page: "returns-refunds" },
    "",
    "/shopease/returns-refunds"
  );
}}

onAbout={() => {
  setShowAbout(true);

  window.history.pushState(
    { page: "about" },
    "",
    "/shopease/about"
  );
}}

  onPrivacy={() => {
    setShowPrivacy(true);

    window.history.pushState(
      { page: "privacy" },
      "",
      "/shopease/privacy"
    );
  }}

  onTerms={() => {
    setShowTerms(true);

    window.history.pushState(
      { page: "terms" },
      "",
      "/shopease/terms"
    );
  }}

  onContact={() => {
    setShowContact(true);

    window.history.pushState(
      { page: "contact" },
      "",
      "/shopease/contact"
    );
  }}

/>



      {/* CHATBOT */}



      <Chatbot />



    </div>

  );

}



export default App;