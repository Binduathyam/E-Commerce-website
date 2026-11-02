import React, { useMemo, useState } from "react";

/* =========================================================
   ProductFilters.jsx
   - Filter panel + sort for the home page products
   - Own CSS is inside this file, so no CSS file change needed
   - Filters work on the products already loaded (no backend change)
========================================================= */

/* =========================================================
   SETTINGS
========================================================= */

// Variant attributes that can be used as filters
const ATTRIBUTE_FILTERS = [
  { key: "color", label: "Color" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Storage" },
  { key: "size", label: "Size" },
];

const DISCOUNT_OPTIONS = [0, 10, 20, 30, 50];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Discount: High to Low" },
  { value: "newest", label: "Newest First" },
];

const emptyAttrs = () => {
  const attrs = {};

  ATTRIBUTE_FILTERS.forEach((item) => {
    attrs[item.key] = [];
  });

  return attrs;
};

export const DEFAULT_FILTERS = {
  sort: "relevance",
  types: [],
  brands: [],
  minPrice: "",
  maxPrice: "",
  minDiscount: 0,
  inStockOnly: false,
  attrs: emptyAttrs(),
};

/* =========================================================
   PRODUCT HELPERS
========================================================= */

const norm = (value) => String(value ?? "").trim().toLowerCase();

const parseAttributes = (attributes) => {
  if (!attributes) {
    return {};
  }

  if (typeof attributes === "object") {
    return attributes;
  }

  try {
    return JSON.parse(attributes);
  } catch {
    return {};
  }
};

const getVariants = (product) => {
  const variants = product?.product_variants;

  if (Array.isArray(variants)) {
    return variants;
  }

  if (typeof variants === "string" && variants.trim()) {
    try {
      const parsed = JSON.parse(variants);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const variantSellingPrice = (variant) => {
  const discount = Number(variant?.discount_price ?? variant?.discountPrice);

  if (discount > 0) {
    return discount;
  }

  const price = Number(variant?.price);

  return price > 0 ? price : 0;
};

// lowest selling price (variants first, then the product itself)
const getPrice = (product) => {
  const prices = getVariants(product)
    .map(variantSellingPrice)
    .filter((price) => price > 0);

  if (prices.length > 0) {
    return Math.min(...prices);
  }

  const discountPrice = Number(product?.discount_price);

  if (discountPrice > 0) {
    return discountPrice;
  }

  const price = Number(product?.price);

  return price > 0 ? price : 0;
};

// highest discount percentage
const getDiscount = (product) => {
  const variantDiscounts = getVariants(product)
    .map((variant) => {
      const original = Number(variant?.price);
      const selling = variantSellingPrice(variant);

      return original > 0 && selling > 0 && selling < original
        ? Math.round(((original - selling) / original) * 100)
        : 0;
    })
    .filter((value) => value > 0);

  if (variantDiscounts.length > 0) {
    return Math.max(...variantDiscounts);
  }

  const price = Number(product?.price);
  const original = Number(product?.original_price);

  if (original > 0 && price > 0 && original > price) {
    return Math.round(((original - price) / original) * 100);
  }

  const direct = Number(product?.discount);

  return direct > 0 ? direct : 0;
};

const getStock = (product) => {
  const variants = getVariants(product);

  if (variants.length > 0) {
    return variants.reduce((total, variant) => {
      const stock = Number(variant?.stock);

      return stock > 0 ? total + stock : total;
    }, 0);
  }

  const stock = Number(product?.stock);

  return stock > 0 ? stock : 0;
};

// values of one variant attribute (for example all colors)
const getAttributeValues = (product, key) => {
  const values = [];

  getVariants(product).forEach((variant) => {
    const attributes = parseAttributes(variant?.attributes);
    const value = String(attributes?.[key] ?? "").trim();

    if (value) {
      values.push(value);
    }
  });

  return values;
};

/* =========================================================
   APPLY FILTERS + SORT  (used by App.jsx)
========================================================= */

export const applyFilters = (products, filters) => {
  const list = Array.isArray(products) ? products : [];

  const f = {
    ...DEFAULT_FILTERS,
    ...(filters || {}),
    attrs: { ...emptyAttrs(), ...(filters?.attrs || {}) },
  };

  const min = f.minPrice !== "" ? Number(f.minPrice) : null;
  const max = f.maxPrice !== "" ? Number(f.maxPrice) : null;

  const result = list.filter((product) => {
    if (f.types.length > 0 && !f.types.includes(norm(product.product_type))) {
      return false;
    }

    if (f.brands.length > 0 && !f.brands.includes(norm(product.brand))) {
      return false;
    }

    const price = getPrice(product);

    if (min !== null && !Number.isNaN(min) && price < min) {
      return false;
    }

    if (max !== null && !Number.isNaN(max) && price > max) {
      return false;
    }

    if (f.minDiscount > 0 && getDiscount(product) < f.minDiscount) {
      return false;
    }

    if (f.inStockOnly && getStock(product) <= 0) {
      return false;
    }

    for (const key of Object.keys(f.attrs)) {
      const selected = f.attrs[key] || [];

      if (selected.length > 0) {
        const values = getAttributeValues(product, key).map(norm);

        if (!values.some((value) => selected.includes(value))) {
          return false;
        }
      }
    }

    return true;
  });

  const sorted = [...result];

  if (f.sort === "price-asc") {
    sorted.sort((a, b) => getPrice(a) - getPrice(b));
  } else if (f.sort === "price-desc") {
    sorted.sort((a, b) => getPrice(b) - getPrice(a));
  } else if (f.sort === "discount") {
    sorted.sort((a, b) => getDiscount(b) - getDiscount(a));
  } else if (f.sort === "newest") {
    sorted.sort((a, b) => Number(b.id) - Number(a.id));
  }

  return sorted;
};

/* =========================================================
   COMPONENT
========================================================= */

function ProductFilters({
  products = [],
  filters,
  onChange,
  resultCount = 0,
}) {
  const [open, setOpen] = useState(false);

  const current = {
    ...DEFAULT_FILTERS,
    ...(filters || {}),
    attrs: { ...emptyAttrs(), ...(filters?.attrs || {}) },
  };

  /* ---------- options built from the products on screen ---------- */

  const options = useMemo(() => {
    const types = new Map();
    const brands = new Map();
    const attrs = {};

    ATTRIBUTE_FILTERS.forEach((item) => {
      attrs[item.key] = new Map();
    });

    const bump = (map, label) => {
      const key = norm(label);

      if (!key) {
        return;
      }

      const existing = map.get(key);

      map.set(key, {
        key,
        label: existing ? existing.label : String(label).trim(),
        count: existing ? existing.count + 1 : 1,
      });
    };

    let lowest = Infinity;
    let highest = 0;

    products.forEach((product) => {
      bump(types, product.product_type);
      bump(brands, product.brand);

      ATTRIBUTE_FILTERS.forEach((item) => {
        const seen = new Set();

        getAttributeValues(product, item.key).forEach((value) => {
          const key = norm(value);

          // count a product only once per value
          if (!seen.has(key)) {
            seen.add(key);
            bump(attrs[item.key], value);
          }
        });
      });

      const price = getPrice(product);

      if (price > 0) {
        lowest = Math.min(lowest, price);
        highest = Math.max(highest, price);
      }
    });

    const toList = (map) =>
      Array.from(map.values()).sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { numeric: true })
      );

    const attrLists = {};

    ATTRIBUTE_FILTERS.forEach((item) => {
      attrLists[item.key] = toList(attrs[item.key]);
    });

    return {
      types: toList(types),
      brands: toList(brands),
      attrs: attrLists,
      lowest: lowest === Infinity ? 0 : lowest,
      highest,
    };
  }, [products]);

  /* ---------- update helpers ---------- */

  const update = (patch) => {
    onChange({ ...current, ...patch });
  };

  const toggleIn = (list, value) =>
    list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];

  const toggleAttribute = (key, value) => {
    update({
      attrs: {
        ...current.attrs,
        [key]: toggleIn(current.attrs[key] || [], value),
      },
    });
  };

  const clearAll = () => {
    onChange({
      ...DEFAULT_FILTERS,
      attrs: emptyAttrs(),
      sort: current.sort,
    });
  };

  const labelOf = (list, key) => {
    const found = list.find((item) => item.key === key);

    return found ? found.label : key;
  };

  /* ---------- active filter chips ---------- */

  const chips = [];

  current.types.forEach((key) =>
    chips.push({
      id: `type-${key}`,
      label: labelOf(options.types, key),
      remove: () =>
        update({ types: current.types.filter((item) => item !== key) }),
    })
  );

  current.brands.forEach((key) =>
    chips.push({
      id: `brand-${key}`,
      label: labelOf(options.brands, key),
      remove: () =>
        update({ brands: current.brands.filter((item) => item !== key) }),
    })
  );

  if (current.minPrice !== "" || current.maxPrice !== "") {
    const from = current.minPrice !== "" ? `₹${current.minPrice}` : "₹0";
    const to = current.maxPrice !== "" ? `₹${current.maxPrice}` : "Any";

    chips.push({
      id: "price",
      label: `${from} - ${to}`,
      remove: () => update({ minPrice: "", maxPrice: "" }),
    });
  }

  if (current.minDiscount > 0) {
    chips.push({
      id: "discount",
      label: `${current.minDiscount}% off or more`,
      remove: () => update({ minDiscount: 0 }),
    });
  }

  if (current.inStockOnly) {
    chips.push({
      id: "stock",
      label: "In stock only",
      remove: () => update({ inStockOnly: false }),
    });
  }

  ATTRIBUTE_FILTERS.forEach((item) => {
    (current.attrs[item.key] || []).forEach((key) =>
      chips.push({
        id: `${item.key}-${key}`,
        label: `${item.label}: ${labelOf(options.attrs[item.key], key)}`,
        remove: () =>
          update({
            attrs: {
              ...current.attrs,
              [item.key]: current.attrs[item.key].filter(
                (value) => value !== key
              ),
            },
          }),
      })
    );
  });

  /* ---------- UI ---------- */

  return (
    <div className="pf-wrapper">
      <style>{FILTER_CSS}</style>

      {/* TOOLBAR */}

      <div className="pf-toolbar">
        <button
          type="button"
          className={open ? "pf-toggle pf-open" : "pf-toggle"}
          onClick={() => setOpen((value) => !value)}
        >
          ☰ Filters
          {chips.length > 0 && <span className="pf-badge">{chips.length}</span>}
        </button>

        <span className="pf-count">
          {resultCount} {resultCount === 1 ? "product" : "products"}
        </span>

        <div className="pf-sort">
          <label htmlFor="pf-sort-select">Sort by</label>

          <select
            id="pf-sort-select"
            value={current.sort}
            onChange={(e) => update({ sort: e.target.value })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ACTIVE FILTERS */}

      {chips.length > 0 && (
        <div className="pf-chips">
          {chips.map((chip) => (
            <span className="pf-chip" key={chip.id}>
              {chip.label}

              <button
                type="button"
                onClick={chip.remove}
                aria-label={`Remove ${chip.label}`}
              >
                ×
              </button>
            </span>
          ))}

          <button type="button" className="pf-clear" onClick={clearAll}>
            Clear all
          </button>
        </div>
      )}

      {/* FILTER PANEL */}

      {open && (
        <div className="pf-panel">
          {/* PRODUCT TYPE */}

          {options.types.length > 1 && (
            <div className="pf-group">
              <h4>Product Type</h4>

              <div className="pf-list">
                {options.types.map((item) => (
                  <label className="pf-check" key={item.key}>
                    <input
                      type="checkbox"
                      checked={current.types.includes(item.key)}
                      onChange={() =>
                        update({ types: toggleIn(current.types, item.key) })
                      }
                    />

                    {item.label}

                    <small>{item.count}</small>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* BRAND */}

          {options.brands.length > 1 && (
            <div className="pf-group">
              <h4>Brand</h4>

              <div className="pf-list">
                {options.brands.map((item) => (
                  <label className="pf-check" key={item.key}>
                    <input
                      type="checkbox"
                      checked={current.brands.includes(item.key)}
                      onChange={() =>
                        update({ brands: toggleIn(current.brands, item.key) })
                      }
                    />

                    {item.label}

                    <small>{item.count}</small>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* PRICE */}

          <div className="pf-group">
            <h4>Price (₹)</h4>

            <div className="pf-price-row">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={current.minPrice}
                onChange={(e) => update({ minPrice: e.target.value })}
              />

              <span>to</span>

              <input
                type="number"
                min="0"
                placeholder="Max"
                value={current.maxPrice}
                onChange={(e) => update({ maxPrice: e.target.value })}
              />
            </div>

            {options.highest > 0 && (
              <p className="pf-hint">
                Available: ₹{options.lowest.toLocaleString("en-IN")} - ₹
                {options.highest.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {/* DISCOUNT */}

          <div className="pf-group">
            <h4>Discount</h4>

            <div className="pf-list">
              {DISCOUNT_OPTIONS.map((value) => (
                <label className="pf-check" key={value}>
                  <input
                    type="radio"
                    name="pf-discount"
                    checked={current.minDiscount === value}
                    onChange={() => update({ minDiscount: value })}
                  />

                  {value === 0 ? "Any discount" : `${value}% or more`}
                </label>
              ))}
            </div>
          </div>

          {/* AVAILABILITY */}

          <div className="pf-group">
            <h4>Availability</h4>

            <label className="pf-check">
              <input
                type="checkbox"
                checked={current.inStockOnly}
                onChange={(e) => update({ inStockOnly: e.target.checked })}
              />
              In stock only
            </label>
          </div>

          {/* VARIANT FILTERS (color, RAM, storage, size) */}

          {ATTRIBUTE_FILTERS.map((item) => {
            const list = options.attrs[item.key];

            if (!list || list.length === 0) {
              return null;
            }

            return (
              <div className="pf-group" key={item.key}>
                <h4>{item.label}</h4>

                <div className="pf-option-chips">
                  {list.map((option) => (
                    <button
                      type="button"
                      key={option.key}
                      className={
                        (current.attrs[item.key] || []).includes(option.key)
                          ? "pf-option pf-active"
                          : "pf-option"
                      }
                      onClick={() => toggleAttribute(item.key, option.key)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   CSS (only used by this component)
========================================================= */

const FILTER_CSS = `
.pf-wrapper { width: 100%; margin: 0 0 22px; font-family: inherit; box-sizing: border-box; }
.pf-wrapper * { box-sizing: border-box; }

.pf-toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 12px 16px; }

.pf-toggle { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #d9d2f5; background: #f5f1ff; color: #5b21b6; font-weight: 700; font-size: 14px; padding: 9px 16px; border-radius: 10px; cursor: pointer; }
.pf-toggle.pf-open { background: #6f38dc; border-color: #6f38dc; color: #ffffff; }

.pf-badge { background: #ef4444; color: #ffffff; border-radius: 999px; font-size: 11px; min-width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; padding: 0 5px; }

.pf-count { color: #6b7280; font-size: 14px; }

.pf-sort { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 14px; color: #374151; }
.pf-sort select { border: 1px solid #d1d5db; border-radius: 10px; padding: 8px 12px; font-size: 14px; background: #ffffff; color: #111827; cursor: pointer; }

.pf-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 12px; }
.pf-chip { display: inline-flex; align-items: center; gap: 6px; background: #ede9fe; color: #5b21b6; border-radius: 999px; padding: 6px 8px 6px 12px; font-size: 13px; font-weight: 600; }
.pf-chip button { border: none; background: rgba(91, 33, 182, 0.15); color: #5b21b6; width: 18px; height: 18px; border-radius: 50%; cursor: pointer; line-height: 1; font-size: 13px; padding: 0; }
.pf-clear { border: none; background: transparent; color: #dc2626; font-weight: 700; font-size: 13px; cursor: pointer; padding: 6px 8px; }

.pf-panel { margin-top: 12px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 18px; display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 22px; }

.pf-group h4 { margin: 0 0 10px; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; color: #111827; }

.pf-list { display: flex; flex-direction: column; gap: 8px; max-height: 190px; overflow-y: auto; }

.pf-check { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #374151; cursor: pointer; }
.pf-check input { accent-color: #6f38dc; width: 16px; height: 16px; margin: 0; }
.pf-check small { margin-left: auto; color: #9ca3af; }

.pf-price-row { display: flex; align-items: center; gap: 8px; color: #6b7280; font-size: 13px; }
.pf-price-row input { width: 100%; min-width: 0; border: 1px solid #d1d5db; border-radius: 10px; padding: 9px 10px; font-size: 14px; }
.pf-hint { margin: 6px 0 0; font-size: 12px; color: #9ca3af; }

.pf-option-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.pf-option { border: 1px solid #d1d5db; background: #ffffff; color: #374151; border-radius: 999px; padding: 6px 12px; font-size: 13px; cursor: pointer; }
.pf-option.pf-active { background: #6f38dc; border-color: #6f38dc; color: #ffffff; }

@media (max-width: 640px) {
  .pf-sort { margin-left: 0; width: 100%; }
  .pf-sort select { flex: 1; }
  .pf-panel { grid-template-columns: 1fr; }
}
`;

export default ProductFilters;
