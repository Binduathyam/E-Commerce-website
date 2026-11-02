import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../api";

/* =========================================================
   HOME PAGE  (single file: markup + styles)
   Put this file at: src/pages/HomePage.jsx
   It renders everything BETWEEN <Navbar /> and <Footer />.
========================================================= */

const CATEGORIES = [
  { name: "All", icon: "🛍️", note: "Everything in store", tone: "a" },
  { name: "Electronics", icon: "📱", note: "Phones, laptops, audio", tone: "b" },
  { name: "Fashion", icon: "👕", note: "Clothing and footwear", tone: "c" },
  { name: "Home", icon: "🛋️", note: "Furniture and decor", tone: "d" },
];

/* =========================================================
   PRODUCT CARD  (built into this file, same props as before)
========================================================= */

const PRICE_RANGES = [
  { id: "all", label: "Any price", min: 0, max: Infinity },
  { id: "u500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-1000", label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { id: "1000-5000", label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
  { id: "5000-20000", label: "₹5,000 - ₹20,000", min: 5000, max: 20000 },
  { id: "20000+", label: "Above ₹20,000", min: 20000, max: Infinity },
];

const getProductType = (p) =>
  String(p.product_type || p.sub_category || p.subcategory || "").trim();

const ATTRS = [
  { key: "color", label: "Color" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Storage" },
  { key: "size", label: "Size" },
];

const DISCOUNTS = [
  { value: 0, label: "Any discount" },
  { value: 10, label: "10% or more" },
  { value: 20, label: "20% or more" },
  { value: 30, label: "30% or more" },
  { value: 50, label: "50% or more" },
];

const variantsOf = (p) => {
  const v = p?.product_variants;
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v.trim()) {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const attrValues = (p, key) =>
  variantsOf(p)
    .map((v) => {
      let a = v?.attributes;
      if (typeof a === "string") {
        try { a = JSON.parse(a); } catch { a = {}; }
      }
      return String(a?.[key] ?? "").trim();
    })
    .filter(Boolean);

const totalStock = (p) => {
  const vs = variantsOf(p);
  if (vs.length > 0) return vs.reduce((t, v) => t + (Number(v?.stock) > 0 ? Number(v.stock) : 0), 0);
  return Number(p?.stock) > 0 ? Number(p.stock) : 0;
};

const rupee = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const imageUrl = (path) => {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

// Same price logic as the ProductDetails page
const getCardPrice = (product) => {
  const num = (v) => Number(v) || 0;
  const variants = Array.isArray(product.product_variants)
    ? product.product_variants
    : [];

  let selling = 0;
  let mrp = 0;
  let from = false;

  const priced = variants
    .map((v) => ({
      selling: num(v.discount_price ?? v.price),
      mrp: num(v.price),
    }))
    .filter((v) => v.selling > 0);

  if (priced.length > 0) {
    const cheapest = priced.reduce((a, b) => (b.selling < a.selling ? b : a));
    selling = cheapest.selling;
    mrp = cheapest.mrp;
    from = new Set(priced.map((v) => v.selling)).size > 1;
  } else {
    selling = num(product.discount_price ?? product.discountPrice ?? product.price);
    mrp = num(
      product.original_price ??
        product.originalPrice ??
        product.mrp ??
        product.old_price ??
        (num(product.price) > selling ? product.price : 0)
    );
  }

  let off = mrp > selling ? Math.round(((mrp - selling) / mrp) * 100) : 0;

  if (!off) {
    off = num(
      product.discount_percentage ?? product.discountPercentage ?? product.discount
    );
    if (off > 0 && !(mrp > selling) && selling > 0) {
      mrp = Math.round(selling / (1 - off / 100));
    }
  }

  return { selling, mrp: mrp > selling ? mrp : 0, off, from };
};

const getCardImage = (product) => {
  const variants = Array.isArray(product.product_variants)
    ? product.product_variants
    : [];
  const raw =
    product.image ||
    (Array.isArray(product.images) ? product.images[0] : "") ||
    variants.find((v) => v?.image)?.image ||
    variants.find((v) => Array.isArray(v?.images) && v.images[0])?.images?.[0] ||
    "";
  return imageUrl(raw);
};

function ShopCard({ product, isWishlisted, onAddToCart, onToggleWishlist, onViewDetails }) {
  const { selling, mrp, off, from } = getCardPrice(product);
  const image = getCardImage(product);

  return (
    <article className="hp-card">
      <div className="hp-card-media" onClick={onViewDetails}>
        {image ? (
          <img src={image} alt={product.name} loading="lazy" />
        ) : (
          <span className="hp-card-noimg">🛍️</span>
        )}

        <button
          type="button"
          className={`hp-card-heart ${isWishlisted ? "is-on" : ""}`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </div>

      <div className="hp-card-body">
        <span className="hp-card-cat">{product.category}</span>

        <h3 className="hp-card-name" onClick={onViewDetails}>
          {product.name}
        </h3>

        <div className="hp-card-price">
          {selling > 0 ? (
            <>
              <strong>
                {from && <small>From </small>}
                {rupee(selling)}
              </strong>
              {mrp > 0 && <del>{rupee(mrp)}</del>}
              {off > 0 && <span className="hp-card-save">{off}% OFF</span>}
            </>
          ) : (
            <strong className="hp-card-view">View price</strong>
          )}
        </div>

        <button
          type="button"
          className="hp-card-add"
          onClick={() => onAddToCart(product)}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   HERO BANNER  (still dynamic: banner comes from admin)
========================================================= */

function HeroBanner({ onShop }) {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/banners/active`);
        const data = await res.json();
        if (data.success && data.banner) setBanner(data.banner);
      } catch (error) {
        console.error("Failed to fetch active banner:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="hp-hero hp-hero-loading" />;

  const title = banner?.title || "Everything you need, all in one place.";
  const description =
    banner?.description ||
    "Discover amazing products at great prices across electronics, fashion and home.";
  const discount = banner?.discount
    ? String(banner.discount).replace("%", "").trim()
    : "";
  const buttonText = banner?.button_text || "Shop now";
  const image = banner?.image
    ? banner.image.startsWith("http")
      ? banner.image
      : `${API_BASE_URL}${banner.image}`
    : "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=80";

  return (
    <section className="hp-hero">
      <div className="hp-hero-copy">
        <span className="hp-pill">Welcome to ShopEase</span>

        <h1>{title}</h1>

        {discount && (
          <div className="hp-offer">
            <strong>{discount}%</strong>
            <span>OFF</span>
          </div>
        )}

        <p>{description}</p>

        <div className="hp-hero-actions">
          <button type="button" className="hp-btn hp-btn-light" onClick={onShop}>
            {buttonText}
          </button>
          <span className="hp-hero-note">Free delivery above ₹999</span>
        </div>
      </div>

      <div className="hp-hero-art">
        <span className="hp-blob" />
        <img src={image} alt={title} />
        <span className="hp-chip hp-chip-1">🚚 Fast delivery</span>
        <span className="hp-chip hp-chip-2">↩️ 7-day returns</span>
      </div>
    </section>
  );
}

function HomePage({
  search,
  category,
  products,
  filteredProducts,
  productsLoading,
  productsError,
  wishlist,
  onCategoryChange,
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
}) {
  const isSearching = Boolean(search.trim());

  /* ---------- filters (category-aware) ---------- */
  const [productType, setProductType] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [visible, setVisible] = useState(20);
  const [attrSel, setAttrSel] = useState({ color: [], ram: [], storage: [], size: [] });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [minDiscount, setMinDiscount] = useState(0);

  useEffect(() => {
    setProductType("");
    setSelectedBrands([]);
    setPriceRange("all");
    setAttrSel({ color: [], ram: [], storage: [], size: [] });
    setInStockOnly(false);
    setMinDiscount(0);
    setVisible(20);
  }, [category, search]);

  useEffect(() => {
    if (!drawer) return undefined;
    const onKey = (e) => e.key === "Escape" && setDrawer(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  const typeOptions = useMemo(() => {
    const map = new Map();
    filteredProducts.forEach((p) => {
      const label = getProductType(p);
      if (!label) return;
      const key = label.toLowerCase();
      const entry = map.get(key) || { key, label, count: 0 };
      entry.count += 1;
      map.set(key, entry);
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [filteredProducts]);

  const typeFiltered = useMemo(
    () =>
      productType
        ? filteredProducts.filter(
            (p) => getProductType(p).toLowerCase() === productType
          )
        : filteredProducts,
    [filteredProducts, productType]
  );

  // brands shown here belong ONLY to the selected type
  const brandOptions = useMemo(() => {
    const map = new Map();
    typeFiltered.forEach((p) => {
      const label = String(p.brand || "").trim();
      if (!label) return;
      const key = label.toLowerCase();
      const entry = map.get(key) || { key, label, count: 0 };
      entry.count += 1;
      map.set(key, entry);
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [typeFiltered]);

  // colour / RAM / storage / size options, only for the selected type
  const attrOptions = useMemo(() => {
    const out = {};
    ATTRS.forEach(({ key }) => {
      const map = new Map();
      if (productType) {
        typeFiltered.forEach((p) => {
          const seen = new Set();
          attrValues(p, key).forEach((val) => {
            const k = val.toLowerCase();
            if (seen.has(k)) return;
            seen.add(k);
            const entry = map.get(k) || { key: k, label: val, count: 0 };
            entry.count += 1;
            map.set(k, entry);
          });
        });
      }
      out[key] = [...map.values()].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { numeric: true })
      );
    });
    return out;
  }, [typeFiltered, productType]);

  const list = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === priceRange) || PRICE_RANGES[0];

    const result = typeFiltered.filter((p) => {
      if (
        selectedBrands.length > 0 &&
        !selectedBrands.includes(String(p.brand || "").trim().toLowerCase())
      ) {
        return false;
      }
      const info = getCardPrice(p);
      if (info.selling < range.min || info.selling >= range.max) return false;
      if (minDiscount > 0 && info.off < minDiscount) return false;
      if (inStockOnly && totalStock(p) <= 0) return false;

      for (const { key } of ATTRS) {
        const chosen = attrSel[key];
        if (chosen.length > 0) {
          const have = attrValues(p, key).map((x) => x.toLowerCase());
          if (!have.some((x) => chosen.includes(x))) return false;
        }
      }
      return true;
    });

    if (sort === "low") {
      result.sort((a, b) => getCardPrice(a).selling - getCardPrice(b).selling);
    } else if (sort === "high") {
      result.sort((a, b) => getCardPrice(b).selling - getCardPrice(a).selling);
    } else if (sort === "discount") {
      result.sort((a, b) => getCardPrice(b).off - getCardPrice(a).off);
    } else if (sort === "newest") {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }
    return result;
  }, [typeFiltered, selectedBrands, priceRange, sort, attrSel, inStockOnly, minDiscount]);

  const shown = list.slice(0, visible);
  const activeCount =
    (productType ? 1 : 0) +
    selectedBrands.length +
    (priceRange !== "all" ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    Object.values(attrSel).reduce((t, a) => t + a.length, 0);
  const selectedTypeLabel =
    typeOptions.find((t) => t.key === productType)?.label || "";

  const pickType = (key) => {
    setProductType(key);
    setSelectedBrands([]);
    setAttrSel({ color: [], ram: [], storage: [], size: [] });
    setVisible(20);
  };

  const toggleBrand = (key) => {
    setSelectedBrands((prev) =>
      prev.includes(key) ? prev.filter((b) => b !== key) : [...prev, key]
    );
    setVisible(20);
  };

  const toggleAttr = (key, val) => {
    setAttrSel((prev) => ({
      ...prev,
      [key]: prev[key].includes(val)
        ? prev[key].filter((x) => x !== val)
        : [...prev[key], val],
    }));
    setVisible(20);
  };

  const clearFilters = () => {
    setProductType("");
    setSelectedBrands([]);
    setAttrSel({ color: [], ram: [], storage: [], size: [] });
    setInStockOnly(false);
    setMinDiscount(0);
    setPriceRange("all");
    setSort("relevance");
    setVisible(20);
  };

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const key = (p.category || "").toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    counts.all = products.length;
    return counts;
  }, [products]);

  const scrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="hp">
      <style>{HOME_CSS}</style>

      {/* ================= HERO (admin-managed banners) ================= */}
      {!isSearching && <HeroBanner onShop={scrollToProducts} />}

      {/* ================= CATEGORIES ================= */}
      {!isSearching && (
        <section className="hp-section">
          <div className="hp-head">
            <h2>Shop by category</h2>
            <p>Choose a category to narrow down the products below.</p>
          </div>

          <div className="hp-cats">
            {CATEGORIES.map((item) => {
              const active = category === item.name;
              const count = categoryCounts[item.name.toLowerCase()] || 0;

              return (
                <button
                  type="button"
                  key={item.name}
                  className={`hp-cat tone-${item.tone} ${active ? "is-active" : ""}`}
                  aria-pressed={active}
                  onClick={() => {
                    onCategoryChange(item.name);
                    scrollToProducts();
                  }}
                >
                  <span className="hp-cat-icon">{item.icon}</span>
                  <span className="hp-cat-text">
                    <strong>{item.name}</strong>
                    <small>{item.note}</small>
                  </span>
                  <span className="hp-cat-count">{count}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= PRODUCTS ================= */}
      <section className="hp-section hp-products" id="products">
        <div className="hp-head hp-head-row">
          <div>
            <h2>
              {isSearching
                ? `Search results for "${search}"`
                : category === "All"
                ? "Popular products"
                : `${category} products`}
            </h2>
            <p>Handpicked items from trusted merchants.</p>
          </div>

          <span className="hp-count">{list.length} products</span>
        </div>

        {!productsLoading && !productsError && filteredProducts.length > 0 && (
          <>
            {/* ---------- TOOLBAR ---------- */}
            <div className="hp-toolbar">
              <button
                type="button"
                className="hp-filter-btn"
                onClick={() => setDrawer(true)}
              >
                ☰ Filters
                {activeCount > 0 && <span className="hp-fbadge">{activeCount}</span>}
              </button>

              <span className="hp-tcount">{list.length} products</span>

              <label className="hp-tsort">
                <span>Sort by</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="discount">Biggest discount</option>
                  <option value="newest">Newest first</option>
                </select>
              </label>
            </div>

            {/* ---------- ACTIVE FILTER CHIPS ---------- */}
            {activeCount > 0 && (
              <div className="hp-active">
                {productType && (
                  <span className="hp-achip">
                    {selectedTypeLabel}
                    <button type="button" onClick={() => pickType("")}>×</button>
                  </span>
                )}
                {selectedBrands.map((key) => (
                  <span className="hp-achip" key={key}>
                    {brandOptions.find((b) => b.key === key)?.label || key}
                    <button type="button" onClick={() => toggleBrand(key)}>×</button>
                  </span>
                ))}
                {ATTRS.map(({ key, label }) =>
                  attrSel[key].map((val) => (
                    <span className="hp-achip" key={`${key}-${val}`}>
                      {label}: {attrOptions[key].find((o) => o.key === val)?.label || val}
                      <button type="button" onClick={() => toggleAttr(key, val)}>×</button>
                    </span>
                  ))
                )}
                {priceRange !== "all" && (
                  <span className="hp-achip">
                    {PRICE_RANGES.find((r) => r.id === priceRange)?.label}
                    <button type="button" onClick={() => setPriceRange("all")}>×</button>
                  </span>
                )}
                {minDiscount > 0 && (
                  <span className="hp-achip">
                    {minDiscount}% off or more
                    <button type="button" onClick={() => setMinDiscount(0)}>×</button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="hp-achip">
                    In stock only
                    <button type="button" onClick={() => setInStockOnly(false)}>×</button>
                  </span>
                )}
                <button type="button" className="hp-fclear" onClick={clearFilters}>
                  Clear all
                </button>
              </div>
            )}

            {/* ---------- SIDEBAR DRAWER ---------- */}
            {drawer && (
              <>
                <div className="hp-overlay" onClick={() => setDrawer(false)} />

                <aside className="hp-drawer" role="dialog" aria-label="Filters">
                  <header className="hp-dhead">
                    <h3>Filters</h3>
                    <button type="button" onClick={() => setDrawer(false)} aria-label="Close filters">×</button>
                  </header>

                  <div className="hp-dbody">
                    {typeOptions.length > 1 && (
                      <section className="hp-dsec">
                        <h4>Product type</h4>
                        <div className="hp-fchips">
                          <button
                            type="button"
                            className={`hp-fchip ${!productType ? "is-on" : ""}`}
                            onClick={() => pickType("")}
                          >
                            All
                          </button>
                          {typeOptions.map((t) => (
                            <button
                              type="button"
                              key={t.key}
                              className={`hp-fchip ${productType === t.key ? "is-on" : ""}`}
                              onClick={() => pickType(t.key)}
                            >
                              {t.label} <em>{t.count}</em>
                            </button>
                          ))}
                        </div>
                      </section>
                    )}

                    {brandOptions.length > 0 && (
                      <section className="hp-dsec">
                        <h4>{selectedTypeLabel ? `${selectedTypeLabel} brands` : "Brands"}</h4>
                        <div className="hp-dlist">
                          {brandOptions.map((b) => (
                            <label className="hp-dcheck" key={b.key}>
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(b.key)}
                                onChange={() => toggleBrand(b.key)}
                              />
                              <span>{b.label}</span>
                              <small>{b.count}</small>
                            </label>
                          ))}
                        </div>
                      </section>
                    )}

                    {ATTRS.map(({ key, label }) =>
                      attrOptions[key].length > 0 ? (
                        <section className="hp-dsec" key={key}>
                          <h4>{label}</h4>
                          <div className="hp-fchips">
                            {attrOptions[key].map((o) => (
                              <button
                                type="button"
                                key={o.key}
                                className={`hp-fchip ${attrSel[key].includes(o.key) ? "is-on" : ""}`}
                                onClick={() => toggleAttr(key, o.key)}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                        </section>
                      ) : null
                    )}

                    <section className="hp-dsec">
                      <h4>Price</h4>
                      <div className="hp-dlist">
                        {PRICE_RANGES.map((r) => (
                          <label className="hp-dcheck" key={r.id}>
                            <input
                              type="radio"
                              name="hp-price"
                              checked={priceRange === r.id}
                              onChange={() => { setPriceRange(r.id); setVisible(20); }}
                            />
                            <span>{r.label}</span>
                          </label>
                        ))}
                      </div>
                    </section>

                    <section className="hp-dsec">
                      <h4>Discount</h4>
                      <div className="hp-dlist">
                        {DISCOUNTS.map((d) => (
                          <label className="hp-dcheck" key={d.value}>
                            <input
                              type="radio"
                              name="hp-discount"
                              checked={minDiscount === d.value}
                              onChange={() => { setMinDiscount(d.value); setVisible(20); }}
                            />
                            <span>{d.label}</span>
                          </label>
                        ))}
                      </div>
                    </section>

                    <section className="hp-dsec">
                      <h4>Availability</h4>
                      <label className="hp-dcheck">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => { setInStockOnly(e.target.checked); setVisible(20); }}
                        />
                        <span>In stock only</span>
                      </label>
                    </section>
                  </div>

                  <footer className="hp-dfoot">
                    <button type="button" className="hp-btn hp-btn-line" onClick={clearFilters}>
                      Clear all
                    </button>
                    <button type="button" className="hp-btn hp-btn-primary" onClick={() => setDrawer(false)}>
                      Show {list.length} results
                    </button>
                  </footer>
                </aside>
              </>
            )}
          </>
        )}

        {productsLoading && (
          <div className="hp-grid" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="hp-skeleton" key={i}>
                <div className="hp-sk-img" />
                <div className="hp-sk-line" />
                <div className="hp-sk-line short" />
              </div>
            ))}
          </div>
        )}

        {!productsLoading && productsError && (
          <div className="hp-empty">
            <div className="hp-empty-icon">⚠️</div>
            <h3>Unable to load products</h3>
            <p>{productsError}</p>
          </div>
        )}

        {!productsLoading && !productsError && (
          <div className="hp-grid">
            {shown.map((product) => (
              <ShopCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.some((item) => item.id === product.id)}
                onViewDetails={() => onViewDetails(product)}
              />
            ))}
          </div>
        )}

        {!productsLoading &&
          !productsError &&
          visible < list.length && (
            <div className="hp-more">
              <button
                type="button"
                className="hp-btn hp-btn-primary"
                onClick={() => setVisible((v) => v + 20)}
              >
                Load more products
              </button>
              <span>
                Showing {Math.min(visible, list.length)} of{" "}
                {list.length}
              </span>
            </div>
          )}

        {!productsLoading && !productsError && list.length === 0 && (
          <div className="hp-empty">
            <div className="hp-empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try another search word, category or clear the filters.</p>
          </div>
        )}
      </section>

      {/* ================= SELL BAND ================= */}
      {!isSearching && (
        <section className="hp-band">
          <div>
            <h2>Have something to sell?</h2>
            <p>
              Register as a merchant, list your products and reach customers
              across ShopEase.
            </p>
          </div>

          <button
            type="button"
            className="hp-btn hp-btn-accent"
            onClick={() => {
              window.history.pushState(
                { page: "merchant-register" },
                "",
                "/shopease/merchant-register"
              );
              window.dispatchEvent(new PopStateEvent("popstate", { state: { page: "merchant-register" } }));
            }}
          >
            Become a merchant
          </button>
        </section>
      )}
    </div>
  );
}

export default HomePage;

/* =========================================================
   STYLES  (all scoped with the hp- prefix)
========================================================= */

const HOME_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;700&display=swap");

.hp {
  --hp-ink: #17132b;
  --hp-brand: #6d28d9;
  --hp-brand-dark: #5b21b6;
  --hp-soft: #ede9fe;
  --hp-mist: #f5f2fd;
  --hp-line: #e6e0f6;
  --hp-muted: #6b6785;
  --hp-coral: #e5484d;
  font-family: "DM Sans", system-ui, sans-serif;
  color: var(--hp-ink);
  background: #fff;
  padding-bottom: 48px;
}

.hp h1, .hp h2, .hp h3 {
  font-family: "Bricolage Grotesque", "DM Sans", sans-serif;
  letter-spacing: -0.02em;
  margin: 0;
}

.hp p { margin: 0; }

.hp button:focus-visible {
  outline: 3px solid var(--hp-brand);
  outline-offset: 2px;
}

/* ---------- buttons ---------- */
.hp-btn {
  border: 0;
  cursor: pointer;
  font: 700 15px "DM Sans", sans-serif;
  padding: 14px 26px;
  border-radius: 12px;
  transition: transform .15s ease, background .15s ease;
}
.hp-btn:active { transform: scale(.97); }
.hp-btn-primary { background: var(--hp-brand); color: #fff; }
.hp-btn-primary:hover { background: var(--hp-brand-dark); }
.hp-btn-accent { background: var(--hp-brand); color: #fff; }
.hp-btn-accent:hover { background: var(--hp-brand-dark); }


/* ---------- hero ---------- */
.hp-hero {
  position: relative;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: 24px;
  max-width: 1240px;
  margin: 20px auto 0;
  padding: 56px 56px 0;
  min-height: 460px;
  border-radius: 32px;
  background:
    radial-gradient(circle at 12% 110%, rgba(251,191,36,.28), transparent 40%),
    linear-gradient(120deg, #3b1585 0%, #6d28d9 55%, #8b5cf6 100%);
  color: #fff;
  overflow: hidden;
}
.hp-hero-loading { background: var(--hp-soft); animation: hp-pulse 1.2s ease-in-out infinite alternate; }
@keyframes hp-pulse { from { opacity: .6; } to { opacity: 1; } }

.hp-pill {
  display: inline-block;
  background: rgba(255,255,255,.16);
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
}
.hp-hero h1 {
  font-size: clamp(34px, 4.8vw, 62px);
  line-height: 1.03;
  font-weight: 800;
  margin: 18px 0 18px;
  max-width: 13ch;
}
.hp-offer {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  background: #fbbf24;
  color: #3b1585;
  padding: 8px 20px;
  border-radius: 14px;
  transform: rotate(-2deg);
  margin-bottom: 16px;
}
.hp-offer strong { font: 800 34px "Bricolage Grotesque", sans-serif; }
.hp-offer span { font-weight: 700; font-size: 16px; }
.hp-hero-copy > p { font-size: 17px; line-height: 1.55; max-width: 44ch; color: rgba(255,255,255,.88); }
.hp-hero-actions { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; margin: 28px 0 56px; }
.hp-hero-note { font-size: 14px; color: rgba(255,255,255,.8); }
.hp-btn-light { background: #fff; color: var(--hp-brand-dark); }
.hp-btn-light:hover { background: #f3eefe; }

.hp-hero-art { position: relative; align-self: end; height: 100%; min-height: 380px; display: flex; align-items: flex-end; justify-content: center; }
.hp-blob {
  position: absolute; bottom: -60px; left: 50%;
  width: 420px; height: 420px;
  translate: -50% 0;
  border-radius: 50%;
  background: rgba(255,255,255,.14);
}
.hp-hero-art img {
  position: relative;
  width: min(100%, 440px);
  height: 400px;
  object-fit: cover;
  object-position: top;
  border-radius: 220px 220px 0 0;
  box-shadow: 0 -10px 50px rgba(0,0,0,.25);
}
.hp-chip {
  position: absolute;
  background: #fff;
  color: var(--hp-ink);
  font-weight: 700;
  font-size: 13px;
  padding: 10px 16px;
  border-radius: 999px;
  box-shadow: 0 10px 28px rgba(0,0,0,.2);
  animation: hp-float 4s ease-in-out infinite alternate;
}
.hp-chip-1 { top: 70px; left: 0; }
.hp-chip-2 { bottom: 90px; right: 0; animation-delay: 1.5s; }
@keyframes hp-float { to { translate: 0 -10px; } }


/* ---------- override global App.css styles (h1 colour, centring) ---------- */
.hp .hp-hero h1 { color: #fff; text-align: left; margin-left: 0; margin-right: 0; }
.hp .hp-hero-copy { text-align: left; }
.hp .hp-hero-copy > p { text-align: left; margin-left: 0; }
.hp .hp-head { text-align: left; }
.hp .hp-head h2, .hp .hp-head p { text-align: left; margin-left: 0; }
.hp .hp-band h2 { color: var(--hp-ink); text-align: left; }
.hp .hp-band p { text-align: left; }

/* ---------- sections ---------- */
.hp-section { max-width: 1240px; margin: 56px auto 0; padding: 0 4px; }
.hp-head { margin-bottom: 24px; }
.hp-head h2 { font-size: clamp(26px, 3vw, 36px); font-weight: 800; }
.hp-head p { color: var(--hp-muted); margin-top: 6px; }
.hp-head-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
.hp-count {
  background: var(--hp-mist);
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
}

/* ---------- categories ---------- */
.hp-cats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.hp-cat {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: var(--hp-mist);
  border: 2px solid transparent;
  border-radius: 20px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  color: var(--hp-ink);
  transition: border-color .15s ease, transform .15s ease;
}
.hp-cat:hover { border-color: var(--hp-brand); }
.hp-cat.is-active { background: var(--hp-brand); color: #fff; }

.hp-cat.tone-a { background: linear-gradient(135deg, #ede9fe, #ddd6fe); }
.hp-cat.tone-b { background: linear-gradient(135deg, #e0f2fe, #bae6fd); }
.hp-cat.tone-c { background: linear-gradient(135deg, #fce7f3, #fbcfe8); }
.hp-cat.tone-d { background: linear-gradient(135deg, #fef3c7, #fde68a); }
.hp-cat.is-active { background: var(--hp-brand); }
.hp-cat:hover { transform: translateY(-3px); }
.hp-cat-icon {
  width: 52px; height: 52px; flex: none;
  display: grid; place-items: center;
  font-size: 26px;
  background: #fff;
  border-radius: 16px;
}
.hp-cat-text { flex: 1; min-width: 0; }
.hp-cat-text strong { display: block; font: 700 17px "Bricolage Grotesque", sans-serif; }
.hp-cat-text small { font-size: 12px; opacity: .75; }
.hp-cat-count {
  font-weight: 700; font-size: 13px;
  background: rgba(109,40,217,.1);
  padding: 4px 10px; border-radius: 999px;
}
.hp-cat.is-active .hp-cat-count { background: rgba(255,255,255,.2); }

/* ---------- product grid ---------- */
.hp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 22px;
  margin-top: 20px;
}

.hp-more { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 36px; }
.hp-more span { font-size: 13px; color: var(--hp-muted); }

/* skeleton */
.hp-skeleton { border: 1px solid var(--hp-line); border-radius: 18px; padding: 14px; }
.hp-sk-img, .hp-sk-line {
  background: linear-gradient(90deg, #f1edfb 25%, #e6e0f6 50%, #f1edfb 75%);
  background-size: 200% 100%;
  animation: hp-shimmer 1.3s infinite linear;
  border-radius: 12px;
}
.hp-sk-img { height: 190px; }
.hp-sk-line { height: 14px; margin-top: 14px; }
.hp-sk-line.short { width: 55%; }
@keyframes hp-shimmer { to { background-position: -200% 0; } }

/* empty / error */
.hp-empty {
  text-align: center;
  padding: 56px 20px;
  background: var(--hp-mist);
  border-radius: 20px;
  margin-top: 20px;
}
.hp-empty-icon { font-size: 44px; }
.hp-empty h3 { font-size: 22px; margin: 10px 0 6px; }
.hp-empty p { color: var(--hp-muted); }



/* ---------- filters ---------- */
.hp-filters {
  background: #fff;
  border: 1px solid var(--hp-line);
  border-radius: 20px;
  padding: 8px 20px;
  margin-top: 8px;
}
.hp-frow { display: flex; align-items: center; gap: 16px; padding: 12px 0; }
.hp-frow + .hp-frow { border-top: 1px solid var(--hp-line); }
.hp-flabel { flex: none; width: 118px; font: 700 14px "DM Sans", sans-serif; color: var(--hp-ink); }
.hp-fchips { display: flex; flex-wrap: wrap; gap: 8px; }
.hp-fchip {
  border: 1.5px solid var(--hp-line);
  background: #fff;
  color: var(--hp-ink);
  font: 500 14px "DM Sans", sans-serif;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: border-color .15s ease, background .15s ease;
}
.hp-fchip em { font-style: normal; font-size: 12px; color: var(--hp-muted); margin-left: 4px; }
.hp-fchip:hover { border-color: var(--hp-brand); }
.hp-fchip.is-on { background: var(--hp-brand); border-color: var(--hp-brand); color: #fff; }
.hp-fchip.is-on em { color: rgba(255,255,255,.8); }
.hp-ftools { flex-wrap: wrap; justify-content: flex-end; }
.hp-ftools label { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--hp-muted); }
.hp-ftools select {
  font: 500 14px "DM Sans", sans-serif;
  padding: 9px 12px;
  border: 1.5px solid var(--hp-line);
  border-radius: 10px;
  background: #fff;
  color: var(--hp-ink);
}
.hp-fcheck input { accent-color: var(--hp-brand); width: 16px; height: 16px; margin: 0; }
.hp-fclear {
  border: 0; background: transparent; color: var(--hp-brand);
  font: 700 14px "DM Sans", sans-serif; cursor: pointer; padding: 8px;
}


/* ---------- toolbar + sidebar drawer ---------- */
.hp-toolbar { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-top: 8px; }
.hp-filter-btn {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1.5px solid var(--hp-brand); background: #fff; color: var(--hp-brand);
  font: 700 15px "DM Sans", sans-serif;
  padding: 11px 20px; border-radius: 12px; cursor: pointer;
}
.hp-filter-btn:hover { background: var(--hp-soft); }
.hp-fbadge {
  background: var(--hp-coral); color: #fff; border-radius: 999px;
  font-size: 12px; min-width: 20px; height: 20px; padding: 0 6px;
  display: inline-flex; align-items: center; justify-content: center;
}
.hp-tcount { color: var(--hp-muted); font-size: 14px; }
.hp-tsort { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--hp-muted); }
.hp-tsort select {
  font: 500 14px "DM Sans", sans-serif; padding: 10px 12px;
  border: 1.5px solid var(--hp-line); border-radius: 10px; background: #fff; color: var(--hp-ink);
}

.hp-active { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 14px; }
.hp-achip {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--hp-soft); color: var(--hp-brand-dark);
  font: 600 13px "DM Sans", sans-serif;
  padding: 6px 8px 6px 12px; border-radius: 999px;
}
.hp-achip button {
  border: 0; width: 18px; height: 18px; border-radius: 50%;
  background: rgba(91,33,182,.15); color: var(--hp-brand-dark);
  font-size: 13px; line-height: 1; padding: 0; cursor: pointer;
}

.hp-overlay {
  position: fixed; inset: 0; z-index: 3000;
  background: rgba(23,19,43,.5);
  animation: hp-fade .2s ease both;
}
.hp-drawer {
  position: fixed; top: 0; left: 0; bottom: 0; z-index: 3001;
  width: min(380px, 92vw);
  background: #fff;
  display: flex; flex-direction: column;
  box-shadow: 12px 0 40px rgba(0,0,0,.2);
  animation: hp-slide .25s cubic-bezier(.2,.8,.2,1) both;
  text-align: left;
}
@keyframes hp-slide { from { translate: -100% 0; } to { translate: 0 0; } }
@keyframes hp-fade { from { opacity: 0; } to { opacity: 1; } }

.hp-dhead {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px; border-bottom: 1px solid var(--hp-line);
}
.hp .hp-dhead h3 { font-size: 22px; font-weight: 800; }
.hp-dhead button {
  border: 0; background: var(--hp-mist); color: var(--hp-ink);
  width: 38px; height: 38px; border-radius: 50%; font-size: 22px; cursor: pointer;
}
.hp-dbody { flex: 1; overflow-y: auto; padding: 8px 22px 20px; }
.hp-dsec { padding: 18px 0; border-bottom: 1px solid var(--hp-line); }
.hp-dsec:last-child { border-bottom: 0; }
.hp .hp-dsec h4 {
  margin: 0 0 12px; font: 700 14px "DM Sans", sans-serif;
  text-transform: uppercase; letter-spacing: .04em; color: var(--hp-ink);
}
.hp-dlist { display: flex; flex-direction: column; gap: 4px; max-height: 240px; overflow-y: auto; }
.hp-dcheck {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 4px; font-size: 15px; color: var(--hp-ink); cursor: pointer;
}
.hp-dcheck input { accent-color: var(--hp-brand); width: 18px; height: 18px; margin: 0; }
.hp-dcheck span { flex: 1; }
.hp-dcheck small { color: var(--hp-muted); }
.hp-dsec .hp-fchips { max-height: 220px; overflow-y: auto; }

.hp-dfoot {
  display: flex; gap: 12px; padding: 16px 22px;
  border-top: 1px solid var(--hp-line); background: #fff;
}
.hp-dfoot .hp-btn { flex: 1; padding: 13px 10px; }
.hp-btn-line { background: #fff; color: var(--hp-brand); box-shadow: inset 0 0 0 1.5px var(--hp-brand); }
.hp-btn-line:hover { background: var(--hp-soft); }

/* ---------- product card ---------- */
.hp-products { scroll-margin-top: 110px; }
.hp-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--hp-line);
  border-radius: 20px;
  overflow: hidden;
  transition: box-shadow .2s ease, transform .2s ease;
}
.hp-card:hover { box-shadow: 0 14px 34px rgba(109,40,217,.14); transform: translateY(-3px); }

.hp .hp-card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  height: auto;
  background: #fff;
  border-bottom: 1px solid var(--hp-line);
  overflow: hidden;
  display: block;
  cursor: pointer;
}
.hp .hp-card-media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: contain;
  object-position: center;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 0;
  margin: 0;
}
.hp-card-noimg { position: absolute; inset: 0; display: grid; place-items: center; font-size: 56px; background: var(--hp-mist); }

.hp-card-off {
  position: absolute; top: 12px; left: 12px;
  background: var(--hp-coral); color: #fff;
  font: 700 12px "DM Sans", sans-serif;
  padding: 5px 10px; border-radius: 999px;
}
.hp-card-heart {
  position: absolute; top: 10px; right: 10px;
  width: 38px; height: 38px;
  border: 0; border-radius: 50%;
  background: #fff; color: var(--hp-muted);
  font-size: 20px; line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,.12);
}
.hp-card-heart.is-on { color: var(--hp-coral); }

.hp-card-body {
  display: flex; flex-direction: column; flex: 1;
  padding: 14px 16px 16px;
  text-align: left;
}
.hp-card-cat { font-size: 12px; color: var(--hp-brand); font-weight: 700; }
.hp .hp-card-name {
  font: 700 16px/1.3 "DM Sans", sans-serif;
  letter-spacing: 0;
  margin: 4px 0 10px;
  text-align: left;
  color: var(--hp-ink);
  min-height: 2.6em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
}
.hp-card-price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 8px; margin-top: auto; margin-bottom: 14px; }
.hp-card-price strong { font: 800 20px "Bricolage Grotesque", sans-serif; }
.hp-card-price small { font: 500 12px "DM Sans", sans-serif; color: var(--hp-muted); }
.hp-card-price del { color: var(--hp-muted); font-size: 14px; }
.hp-card-save { font: 700 13px "DM Sans", sans-serif; color: #15803d; background: #e7f6ec; padding: 3px 8px; border-radius: 6px; }
.hp-card-view { font-size: 15px !important; color: var(--hp-muted); }

.hp-card-add {
  width: 100%;
  border: 0; border-radius: 12px;
  background: var(--hp-brand); color: #fff;
  font: 700 15px "DM Sans", sans-serif;
  padding: 12px;
  cursor: pointer;
  transition: background .15s ease;
}
.hp-card-add:hover { background: var(--hp-brand-dark); }

/* ---------- sell band ---------- */
.hp-band {
  max-width: 1240px;
  margin: 64px auto 0;
  padding: 36px 44px;
  background: var(--hp-soft);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.hp-band h2 { font-size: 30px; font-weight: 800; }
.hp-band p { margin-top: 6px; max-width: 52ch; }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .hp-hero { grid-template-columns: 1fr; padding: 36px 24px 0; margin: 12px 12px 0; text-align: left; }
  .hp-hero-actions { margin-bottom: 28px; }
  .hp-hero-art { min-height: 300px; }
  .hp-hero-art img { height: 300px; width: min(100%, 340px); border-radius: 170px 170px 0 0; }
  .hp-blob { width: 320px; height: 320px; }
  .hp-chip-1 { left: 4%; top: 40px; }
  .hp-chip-2 { right: 4%; bottom: 60px; }
  .hp-cats { grid-template-columns: repeat(2, 1fr); }
  .hp-section { padding: 0 12px; }
  .hp-band { margin: 56px 12px 0; padding: 28px; }
}

@media (max-width: 560px) {
  .hp-frow { flex-direction: column; align-items: flex-start; gap: 8px; }
  .hp-flabel { width: auto; }
  .hp-fchips { flex-wrap: nowrap; overflow-x: auto; max-width: 100%; padding-bottom: 4px; }
  .hp-fchip { white-space: nowrap; }
  .hp-ftools { justify-content: flex-start; }
  .hp-cat { padding: 12px; gap: 10px; }
  .hp-cat-icon { width: 42px; height: 42px; font-size: 20px; }
  .hp-cat-count { display: none; }
  .hp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .hp-card-body { padding: 10px 12px 12px; }
  .hp-card-name { font-size: 14px !important; }
  .hp-card-price strong { font-size: 17px; }
}

@media (prefers-reduced-motion: reduce) {
  .hp-chip, .hp-hero-loading { animation: none; }
  .hp-sk-img, .hp-sk-line { animation: none; }
  .hp-btn, .hp-cat, .hp-card { transition: none; }
  .hp-drawer, .hp-overlay { animation: none; }
}
`;
