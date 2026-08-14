const fs = require("fs");

const file = fs.readFileSync(
  "./src/data/products.js",
  "utf8"
);

const matches = [...file.matchAll(
  /{\s*id:\s*(\d+),\s*name:\s*"([^"]+)",\s*price:\s*(\d+),\s*category:\s*"([^"]+)",\s*image:\s*"([^"]+)"/g
)];

console.log(`Found ${matches.length} products.`);

if (matches.length !== 100) {
  console.log(
    "Expected 100 products. Stopping to avoid incorrect import."
  );
  process.exit(1);
}

const values = matches.map((match) => {
  const [, id, name, price, category, image] = match;

  const escape = (value) =>
    value.replace(/\\/g, "\\\\").replace(/'/g, "''");

  return `(
    ${Number(id)},
    '${escape(name)}',
    '${escape(category)}',
    ${Number(price)},
    'Product available at ShopEase.',
    '${escape(image)}'
  )`;
});

const sql = `
USE shopease_db;

INSERT INTO products
(id, name, category, price, description, image)
VALUES
${values.join(",\n")};

SELECT COUNT(*) AS total_products FROM products;
`;

fs.writeFileSync("./products-import.sql", sql);

console.log("SQL file created: products-import.sql");