import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import "./AdminProducts.css";

function AdminProducts({ onBack }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/products`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load products"
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Admin products error:", error);

      setError(
        error.message || "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) {
      return {
        text: "Out of Stock",
        className: "stock-out",
      };
    }

    if (stock <= 5) {
      return {
        text: "Low Stock",
        className: "stock-low",
      };
    }

    return {
      text: "In Stock",
      className: "stock-good",
    };
  };

  return (
    <section className="admin-products-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="admin-products-header">

        <button
          type="button"
          className="admin-products-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <p>ADMIN</p>

          <h1>
            Products
          </h1>

          <span>
            Manage all products listed on ShopEase
          </span>
        </div>

      </header>


      {/* =========================
          CONTENT
      ========================= */}

      <main className="admin-products-content">

        {/* SUMMARY */}

        <div className="admin-products-summary">

          <div className="products-summary-card">

            <div className="products-summary-icon">
              📦
            </div>

            <div>
              <p>
                Total Products
              </p>

              <h2>
                {products.length}
              </h2>
            </div>

          </div>

          <div className="products-summary-card">

            <div className="products-summary-icon">
              ⚠️
            </div>

            <div>
              <p>
                Low Stock
              </p>

              <h2>
                {
                  products.filter(
                    (product) =>
                      product.stock > 0 &&
                      product.stock <= 5
                  ).length
                }
              </h2>
            </div>

          </div>

          <div className="products-summary-card">

            <div className="products-summary-icon">
              ❌
            </div>

            <div>
              <p>
                Out of Stock
              </p>

              <h2>
                {
                  products.filter(
                    (product) =>
                      Number(product.stock) <= 0
                  ).length
                }
              </h2>
            </div>

          </div>

        </div>


        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="admin-products-message">
            Loading products...
          </div>
        )}


        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="admin-products-error">

            <h3>
              Unable to load products
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProducts}
            >
              Try Again
            </button>

          </div>
        )}


        {/* =========================
            EMPTY
        ========================= */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="admin-products-message">
              No products found.
            </div>
          )}


        {/* =========================
            PRODUCTS TABLE
        ========================= */}

        {!loading &&
          !error &&
          products.length > 0 && (

            <div className="admin-products-table-wrapper">

              <table className="admin-products-table">

                <thead>

                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Merchant</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Added</th>
                  </tr>

                </thead>


                <tbody>

                  {products.map((product) => {

                    const stockStatus =
                      getStockStatus(
                        Number(product.stock || 0)
                      );

                    return (
                      <tr key={product.id}>

                        {/* PRODUCT */}

                        <td>

                          <div className="admin-product-info">

                            <div className="admin-product-image">

                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  onError={(e) => {
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

                              <small>
                                ID #{product.id}
                              </small>

                              {product.brand && (
                                <small>
                                  {product.brand}
                                </small>
                              )}

                            </div>

                          </div>

                        </td>


                        {/* CATEGORY */}

                        <td>
                          {product.category ||
                            "Uncategorized"}
                        </td>


                        {/* MERCHANT */}

                        <td>

                          <div className="admin-product-merchant">

                            <strong>
                              {product.business_name ||
                                "Unknown Store"}
                            </strong>

                            <small>
                              {product.merchant_name ||
                                "Unknown Merchant"}
                            </small>

                          </div>

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


                        {/* DISCOUNT */}

                        <td>

                          {Number(
                            product.discount || 0
                          ) > 0 ? (
                            <span className="discount-badge">
                              {Number(
                                product.discount
                              )}% OFF
                            </span>
                          ) : (
                            <span className="no-discount">
                              No Discount
                            </span>
                          )}

                        </td>


                        {/* STOCK */}

                        <td>
                          {Number(
                            product.stock || 0
                          )}
                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`product-stock-status ${stockStatus.className}`}
                          >
                            {stockStatus.text}
                          </span>

                        </td>


                        {/* DATE */}

                        <td>

                          {product.created_at
                            ? new Date(
                                product.created_at
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

      </main>

    </section>
  );
}

export default AdminProducts;