import { useEffect, useState } from "react";



import Navbar from "./components/Navbar";

import Footer from "./components/Footer";

import LiveTour from "./components/LiveTour";

import Hero from "./components/Hero";

import ProductCard from "./components/ProductCard";

import Chatbot from "./components/Chatbot";



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



  const [loggedInUser, setLoggedInUser] = useState(null);



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



  const [

    selectedProduct,

    setSelectedProduct,

  ] = useState(null);



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



  const [orderData, setOrderData] =

    useState(null);



  /* =========================================================

     PROFILE

  ========================================================= */



  const [showProfile, setShowProfile] =

    useState(false);



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



  /* =========================================================

     ADD TO CART

  ========================================================= */



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

            "Content-Type": "application/json",

          },



          body: JSON.stringify({

            user_id: loggedInUser.id,

            product_id: product.id,

            quantity: 1,

          }),

        }

      );



      const data = await response.json();



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

        `${CART_API_URL}/${item.id}`,

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

            "Content-Type": "application/json",

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



    if (newQuantity <= 0) {

      await removeFromCart(

        productId

      );

      return;

    }



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



  /* =========================================================

     MY ADDRESSES

  ========================================================= */



  if (showMyAddresses) {

    return (

      <MyAddresses

        loggedInUser={loggedInUser}



        onBack={() => {

          setShowMyAddresses(false);

          setShowProfile(true);

        }}

      />

    );

  }



  /* =========================================================

     ACCOUNT SETTINGS

  ========================================================= */



  if (showAccountSettings) {

    return (

      <AccountSettings

        loggedInUser={loggedInUser}



        onBack={() => {

          setShowAccountSettings(false);

          setShowProfile(true);

        }}



        onUpdated={(updatedUser) => {

          setLoggedInUser(updatedUser);

        }}

      />

    );

  }



  /* =========================================================

     PROFILE PAGE

  ========================================================= */



  if (showProfile) {

    return (

      <Profile

        loggedInUser={loggedInUser}



        onBack={() => {

          setShowProfile(false);

        }}



        onLogin={() => {

          setShowProfile(false);

          setShowLogin(true);

        }}



        onRegister={() => {

          setShowProfile(false);

          setShowRegistration(true);

        }}



        onOrders={() => {

          setShowProfile(false);

          setShowOrderHistory(true);

        }}



        onAddresses={() => {

          setShowProfile(false);

          setShowMyAddresses(true);

        }}



        onAccountSettings={() => {

          setShowProfile(false);

          setShowAccountSettings(true);

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



          setShowProfile(false);

          setShowLogin(true);

        }}

      />

    );

  }



  /* =========================================================

     ORDER HISTORY

  ========================================================= */



  if (showOrderHistory) {

    return (

      <OrderHistory

        loggedInUser={loggedInUser}



        onBack={() => {

          setShowOrderHistory(false);

          setShowProfile(true);

        }}



        onViewDetails={(order) => {

          setSelectedOrder(order);

          setShowOrderHistory(false);

          setShowOrderDetails(true);

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

        }}



        onDownloadInvoice={(order) => {

          setSelectedInvoiceOrder(order);

          setShowInvoice(true);

          setShowOrderHistory(false);

        }}

      />

    );

  }



  /* =========================================================

     INVOICE

  ========================================================= */



  if (showInvoice) {

    return (

      <Invoice

        order={selectedInvoiceOrder}



        onBack={() => {

          setShowInvoice(false);

          setSelectedInvoiceOrder(null);

          setShowOrderHistory(true);

        }}

      />

    );

  }



  /* =========================================================

     ORDER DETAILS

  ========================================================= */



  if (showOrderDetails) {

    return (

      <OrderDetails

        order={selectedOrder}



        onBack={() => {

          setShowOrderDetails(false);

          setSelectedOrder(null);

          setShowOrderHistory(true);

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

        }}



        onCancel={(order) => {

          alert(

            "Cancel Order will be connected to the backend next."

          );

        }}

      />

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

          setShowAddProduct(false);

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

          setShowMerchantProducts(false);

        }}



        onAddProduct={() => {

          setShowMerchantProducts(false);

          setShowAddProduct(true);

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

          setShowMerchantOrders(false);

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

          setShowMerchantInventory(false);

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

          setShowMerchantProfile(false);

        }}



        onLogout={() => {

          setLoggedInUser(null);



          localStorage.removeItem(

            "merchant_token"

          );



          localStorage.removeItem(

            "merchant_user"

          );



          setShowMerchantHome(false);

          setShowLiveTour(false);

          setTourRole(null);

          setShowLogin(true);

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

          setShowMerchantRegister(false);

          setShowLogin(true);

        }}



        onLogin={() => {

          setShowMerchantRegister(false);

          setShowLogin(true);

        }}



        onRegistered={(merchant) => {

          console.log(

            "Registered merchant:",

            merchant

          );



          setShowMerchantRegister(false);

          setShowLogin(true);

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

          setShowMerchantSales(false);

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

          setShowAdminMerchants(false);

          setShowAdminHome(true);

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

          setShowAdminCustomers(false);

          setShowAdminHome(true);

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

          setShowAdminProducts(false);

          setShowAdminHome(true);

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

          setShowAdminOrders(false);

          setShowAdminHome(true);

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

          setShowAdminPayments(false);

          setShowAdminHome(true);

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

          setShowAdminDeliveryPartners(false);

          setShowAdminHome(true);

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

          setShowAdminProfit(false);

          setShowAdminHome(true);

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

          setShowAdminReports(false);

          setShowAdminHome(true);

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



          setShowAdminHome(false);

          setShowLiveTour(false);

          setTourRole(null);

          setShowLogin(true);

        }}



        onCustomers={() => {

          setShowAdminHome(false);

          setShowAdminCustomers(true);

        }}



        onMerchants={() => {

          setShowAdminHome(false);

          setShowAdminMerchants(true);

        }}



        onProducts={() => {

          setShowAdminHome(false);

          setShowAdminProducts(true);

        }}



        onOrders={() => {

          setShowAdminHome(false);

          setShowAdminOrders(true);

        }}



        onPayments={() => {

          setShowAdminHome(false);

          setShowAdminPayments(true);

        }}



        onReports={() => {

          setShowAdminHome(false);

          setShowAdminReports(true);

        }}



        onDeliveryPartners={() => {

          setShowAdminHome(false);

          setShowAdminDeliveryPartners(true);

        }}



        onProfit={() => {

          setShowAdminHome(false);

          setShowAdminProfit(true);

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



            setShowLogin(true);

          }}



          onAddProduct={() => {

            setShowAddProduct(true);

          }}



          onProducts={() => {

            setShowMerchantProducts(true);

          }}



          onOrders={() => {

            setShowMerchantOrders(true);

          }}



          onInventory={() => {

            setShowMerchantInventory(true);

          }}



          onSales={() => {

            setShowMerchantSales(true);

          }}



          onProfile={() => {

            setShowMerchantProfile(true);

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

            setShowAdminLogin(false);

            setShowLogin(true);

          }}



          onLoginSuccess={(user) => {

            setLoggedInUser(user);



            setShowAdminLogin(false);

            setShowAdminHome(true);

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

          setShowAssignedOrders(false);

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

          setShowDeliveryProfile(false);

        }}



        onLogout={() => {

          setLoggedInUser(null);



          localStorage.removeItem(

            "delivery_token"

          );



          localStorage.removeItem(

            "delivery_user"

          );



          setShowDeliveryPartnerHome(false);

          setShowLiveTour(false);

          setTourRole(null);

          setShowLogin(true);

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

          }}



          onProfile={() => {

            setShowDeliveryProfile(true);

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

          setShowDeliveryRegister(false);

          setShowLogin(true);

        }}



        onLogin={() => {

          setShowDeliveryRegister(false);

          setShowLogin(true);

        }}



        onRegistered={(deliveryPartner) => {

          console.log(

            "Delivery Partner Registered:",

            deliveryPartner

          );



          setShowDeliveryRegister(false);

          setShowLogin(true);

        }}

      />

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

            setShowLogin(false);

          }}



          onRegister={() => {

            setShowLogin(false);

            setShowRegistration(true);

          }}



          onMerchantRegister={() => {

            setShowLogin(false);

            setShowMerchantRegister(true);

          }}



          onDeliveryLogin={() => {

            setShowLogin(false);

            setShowDeliveryRegister(true);

          }}



          onAdminLogin={() => {

            setShowLogin(false);

            setShowAdminLogin(true);

          }}



          onLoginSuccess={(user) => {

            console.log(

              "Logged in user:",

              user

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



  /* =========================================================

     PRIVACY

  ========================================================= */



  if (showPrivacy) {

    return (

      <div className="app simple-page-wrapper">

        <button

          type="button"

          className="simple-page-back"

          onClick={() =>

            setShowPrivacy(false)

          }

        >

          ← Back

        </button>



        <Privacy />

      </div>

    );

  }



  /* =========================================================

     TERMS

  ========================================================= */



  if (showTerms) {

    return (

      <div className="app simple-page-wrapper">

        <button

          type="button"

          className="simple-page-back"

          onClick={() =>

            setShowTerms(false)

          }

        >

          ← Back

        </button>



        <Terms />

      </div>

    );

  }



  /* =========================================================

     CONTACT

  ========================================================= */



  if (showContact) {

    return (

      <div className="app simple-page-wrapper">

        <button

          type="button"

          className="simple-page-back"

          onClick={() =>

            setShowContact(false)

          }

        >

          ← Back

        </button>



        <Contact />

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

      <OrderTracking

        order={orderData}



        onBack={() => {

          setShowOrderTracking(false);



          if (trackingFromDetails) {

            setShowOrderDetails(true);

          } else {

            setShowOrderHistory(true);

          }



          setTrackingFromDetails(false);

        }}



        onCancel={handleCancelOrder}



        onReturn={handleReturnOrder}

      />

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

          }}



          onTrackOrder={() => {

            setShowOrderSuccess(false);

            setTrackingFromDetails(false);

            setShowOrderTracking(true);

          }}

        />

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

          setShowCheckout(false);

          setShowCart(true);

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
  }
}}

      />



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



          onAdminLogin={() => {

            setShowWishlist(false);

            setShowAdminLogin(true);

          }}

        />



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



          onBack={() =>

            setShowCart(false)

          }



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

          }}



          onCheckout={() => {

            setShowCart(false);

            setShowCheckout(true);

          }}

        />



      </div>

    );

  }



  /* =========================================================

     PRODUCT DETAILS

  ========================================================= */



  if (selectedProduct) {

    return (

      <div className="app">



        <Navbar

          search={search}

          setSearch={handleSearchChange}



          cartCount={cartCount}



          wishlistCount={

            wishlist.length

          }



          onLoginClick={() => {

            setShowProfile(true);

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



        loggedInUser={

          loggedInUser

        }



        cartCount={cartCount}



        wishlistCount={

          wishlist.length

        }



        onLoginClick={() => {

          setShowProfile(true);

        }}



        onCartClick={() =>

          setShowCart(true)

        }



        onWishlistClick={() =>

          setShowWishlist(true)

        }

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

        onPrivacy={() =>

          setShowPrivacy(true)

        }



        onTerms={() =>

          setShowTerms(true)

        }



        onContact={() =>

          setShowContact(true)

        }

      />



      {/* CHATBOT */}



      <Chatbot />



    </div>

  );

}



export default App;