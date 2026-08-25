import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./MerchantInventory.css";

function MerchantInventory({
  merchant,
  onBack,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [newStock, setNewStock] =
    useState("");

  const [updatingStock, setUpdatingStock] =
    useState(false);

  /* =========================
     FETCH INVENTORY
  ========================= */

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/products/merchant/${merchant.id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch inventory"
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error(
        "Inventory error:",
        error
      );

      setError(
        error.message ||
          "Unable to load inventory"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (merchant?.id) {
      fetchInventory();
    }
  }, [merchant?.id]);

  /* =========================
     CALCULATIONS
  ========================= */

  const totalProducts =
    products.length;

  const totalStock =
    products.reduce(
      (sum, product) =>
        sum + Number(product.stock || 0),
      0
    );

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.stock || 0) > 0 &&
        Number(product.stock || 0) <= 5
    );

  const outOfStockProducts =
    products.filter(
      (product) =>
        Number(product.stock || 0) === 0
    );

  const inStockProducts =
    products.filter(
      (product) =>
        Number(product.stock || 0) > 5
    );

  /* =========================
     STOCK STATUS
  ========================= */

  const getStockStatus = (stock) => {
    const value = Number(stock || 0);

    if (value === 0) {
      return {
        text: "Out of Stock",
        className: "inventory-out",
      };
    }

    if (value <= 5) {
      return {
        text: "Low Stock",
        className: "inventory-low",
      };
    }

    return {
      text: "In Stock",
      className: "inventory-good",
    };
  };

  /* =========================
     UPDATE STOCK
  ========================= */

  const handleStockUpdate = async () => {
    if (!editingProduct) {
      return;
    }

    const stockValue =
      Number(newStock);

    if (
      !Number.isInteger(stockValue) ||
      stockValue < 0
    ) {
      alert(
        "Please enter a valid stock quantity."
      );
      return;
    }

    try {
      setUpdatingStock(true);

      const response = await fetch(
        `${API_BASE_URL}/api/products/${editingProduct.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            merchant_id:
              merchant.id,

            name:
              editingProduct.name,

            category:
              editingProduct.category || "",

            price:
              editingProduct.price,

            original_price:
              editingProduct.original_price ||
              editingProduct.price,

            discount:
              editingProduct.discount || 0,

            stock:
              stockValue,

            brand:
              editingProduct.brand || "",

            description:
              editingProduct.description || "",

            image:
              editingProduct.image || "",
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
            "Failed to update stock"
        );
      }

      setProducts(
        (currentProducts) =>
          currentProducts.map(
            (product) =>
              product.id ===
              editingProduct.id
                ? data.product
                : product
          )
      );

      setEditingProduct(null);
      setNewStock("");

    } catch (error) {
      console.error(
        "Stock update error:",
        error
      );

      alert(
        error.message ||
          "Failed to update stock"
      );
    } finally {
      setUpdatingStock(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="merchant-inventory-page">
        <div className="inventory-loading">
          Loading inventory...
        </div>
      </section>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <section className="merchant-inventory-page">

        <div className="inventory-error">

          <div className="inventory-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Inventory
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchInventory}
          >
            Try Again
          </button>

        </div>

      </section>
    );
  }

  return (
    <section className="merchant-inventory-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="merchant-inventory-header">

        <div className="inventory-heading">

          <button
            type="button"
            className="inventory-back-button"
            onClick={onBack}
          >
            ←
          </button>

          <div>

            <p>
              MERCHANT
            </p>

            <h1>
              Inventory
            </h1>

            <span>
              Monitor and manage your
              product stock
            </span>

          </div>

        </div>

        <button
          type="button"
          className="inventory-refresh-button"
          onClick={fetchInventory}
        >
          ↻ Refresh
        </button>

      </div>


      {/* =========================
          STORE
      ========================= */}

      <div className="inventory-store-card">

        <div className="inventory-store-icon">
          🏪
        </div>

        <div>

          <strong>
            {merchant?.businessName ||
              merchant?.business_name ||
              "My Store"}
          </strong>

          <span>
            Inventory overview for your
            store
          </span>

        </div>

      </div>


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="inventory-summary-grid">

        <div className="inventory-summary-card">

          <div className="inventory-card-icon">
            📦
          </div>

          <div>
            <span>
              Total Products
            </span>

            <strong>
              {totalProducts}
            </strong>
          </div>

        </div>


        <div className="inventory-summary-card">

          <div className="inventory-card-icon">
            📊
          </div>

          <div>
            <span>
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>
          </div>

        </div>


        <div className="inventory-summary-card">

          <div className="inventory-card-icon">
            ✅
          </div>

          <div>
            <span>
              In Stock
            </span>

            <strong>
              {inStockProducts.length}
            </strong>
          </div>

        </div>


        <div className="inventory-summary-card inventory-warning-card">

          <div className="inventory-card-icon">
            ⚠️
          </div>

          <div>
            <span>
              Low Stock
            </span>

            <strong>
              {lowStockProducts.length}
            </strong>
          </div>

        </div>


        <div className="inventory-summary-card inventory-danger-card">

          <div className="inventory-card-icon">
            🚫
          </div>

          <div>
            <span>
              Out of Stock
            </span>

            <strong>
              {outOfStockProducts.length}
            </strong>
          </div>

        </div>

      </div>


      {/* =========================
          LOW STOCK ALERT
      ========================= */}

      {lowStockProducts.length > 0 && (
        <div className="inventory-alert">

          <div className="inventory-alert-icon">
            ⚠️
          </div>

          <div>

            <strong>
              Low Stock Alert
            </strong>

            <p>
              {lowStockProducts.length}{" "}
              product
              {lowStockProducts.length !== 1
                ? "s are"
                : " is"}{" "}
              running low on stock.
            </p>

          </div>

        </div>
      )}


      {/* =========================
          PRODUCT TABLE
      ========================= */}

      <div className="inventory-products-section">

        <div className="inventory-section-header">

          <div>

            <h2>
              Product Inventory
            </h2>

            <span>
              {totalProducts} products
            </span>

          </div>

        </div>


        {products.length === 0 ? (

          <div className="inventory-empty">

            <div>
              📦
            </div>

            <h2>
              No Products
            </h2>

            <p>
              You haven't added any
              products yet.
            </p>

          </div>

        ) : (

          <div className="inventory-table-wrapper">

            <table className="inventory-table">

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {products.map(
                  (product) => {

                    const status =
                      getStockStatus(
                        product.stock
                      );

                    return (
                      <tr
                        key={product.id}
                      >

                        {/* PRODUCT */}

                        <td>

                          <div className="inventory-product-info">

                            <div className="inventory-product-image">

                              {product.image ? (

                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name
                                  }
                                  onError={(
                                    e
                                  ) => {
                                    e.currentTarget.style.display =
                                      "none";
                                  }}
                                />

                              ) : (

                                <span>
                                  📦
                                </span>

                              )}

                            </div>

                            <div>

                              <strong>
                                {product.name}
                              </strong>

                              <span>
                                {product.brand ||
                                  "No brand"}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* CATEGORY */}

                        <td>
                          {product.category ||
                            "Product"}
                        </td>


                        {/* PRICE */}

                        <td>

                          <strong>
                            ₹
                            {Number(
                              product.price || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </td>


                        {/* STOCK */}

                        <td>

                          <span
                            className={
                              Number(
                                product.stock || 0
                              ) <= 5
                                ? "inventory-stock-number inventory-stock-low"
                                : "inventory-stock-number"
                            }
                          >
                            {product.stock}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`inventory-status ${status.className}`}
                          >
                            {status.text}
                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="inventory-update-stock-button"
                            onClick={() => {
                              setEditingProduct(
                                product
                              );

                              setNewStock(
                                String(
                                  product.stock || 0
                                )
                              );
                            }}
                          >
                            Update Stock
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =========================
          UPDATE STOCK MODAL
      ========================= */}

      {editingProduct && (

        <div className="inventory-modal-overlay">

          <div className="inventory-modal">

            <button
              type="button"
              className="inventory-modal-close"
              onClick={() => {
                setEditingProduct(null);
                setNewStock("");
              }}
            >
              ×
            </button>

            <p>
              INVENTORY
            </p>

            <h2>
              Update Stock
            </h2>

            <strong>
              {editingProduct.name}
            </strong>

            <div className="inventory-current-stock">
              Current Stock:{" "}
              {editingProduct.stock}
            </div>

            <label>
              New Stock
            </label>

            <input
              type="number"
              min="0"
              value={newStock}
              onChange={(e) =>
                setNewStock(
                  e.target.value
                )
              }
            />

            <div className="inventory-modal-actions">

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setNewStock("");
                }}
                disabled={updatingStock}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleStockUpdate
                }
                disabled={updatingStock}
              >
                {updatingStock
                  ? "Updating..."
                  : "Update Stock"}
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default MerchantInventory;