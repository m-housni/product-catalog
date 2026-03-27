import { db, sqlite } from "./index.js";
import { categories, products } from "./schema.js";

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    image_url TEXT,
    amount INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expiration_time TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1
  );
`);

// Clear existing data
sqlite.exec("DELETE FROM cart_items");
sqlite.exec("DELETE FROM carts");
sqlite.exec("DELETE FROM products");
sqlite.exec("DELETE FROM categories");

// Seed categories
const categoryData = [
  { name: "Electronics" },
  { name: "Clothing" },
  { name: "Home & Kitchen" },
  { name: "Books" },
  { name: "Sports & Outdoors" },
];

const insertedCategories = categoryData.map((c) =>
  db.insert(categories).values(c).returning().get()
);

console.log(`Seeded ${insertedCategories.length} categories`);

// Seed products
const productData = [
  { name: "Wireless Headphones", price: 79.99, categoryId: insertedCategories[0].id, amount: 25 },
  { name: "USB-C Hub Adapter", price: 34.99, categoryId: insertedCategories[0].id, amount: 50 },
  { name: "Mechanical Keyboard", price: 129.99, categoryId: insertedCategories[0].id, amount: 15 },
  { name: "Portable Bluetooth Speaker", price: 49.99, categoryId: insertedCategories[0].id, amount: 30 },
  { name: "Smartphone Stand", price: 19.99, categoryId: insertedCategories[0].id, amount: 100 },
  { name: "Cotton T-Shirt", price: 24.99, categoryId: insertedCategories[1].id, amount: 200 },
  { name: "Denim Jacket", price: 89.99, categoryId: insertedCategories[1].id, amount: 40 },
  { name: "Running Sneakers", price: 119.99, categoryId: insertedCategories[1].id, amount: 60 },
  { name: "Wool Beanie", price: 14.99, categoryId: insertedCategories[1].id, amount: 150 },
  { name: "Stainless Steel Water Bottle", price: 22.99, categoryId: insertedCategories[2].id, amount: 80 },
  { name: "Non-Stick Frying Pan", price: 39.99, categoryId: insertedCategories[2].id, amount: 45 },
  { name: "Ceramic Mug Set", price: 29.99, categoryId: insertedCategories[2].id, amount: 70 },
  { name: "LED Desk Lamp", price: 44.99, categoryId: insertedCategories[2].id, amount: 35 },
  { name: "Throw Blanket", price: 34.99, categoryId: insertedCategories[2].id, amount: 55 },
  { name: "The Great Gatsby", price: 12.99, categoryId: insertedCategories[3].id, amount: 120 },
  { name: "JavaScript: The Good Parts", price: 29.99, categoryId: insertedCategories[3].id, amount: 90 },
  { name: "Clean Code", price: 39.99, categoryId: insertedCategories[3].id, amount: 75 },
  { name: "Yoga Mat", price: 29.99, categoryId: insertedCategories[4].id, amount: 65 },
  { name: "Resistance Bands Set", price: 19.99, categoryId: insertedCategories[4].id, amount: 110 },
  { name: "Camping Tent (2-Person)", price: 149.99, categoryId: insertedCategories[4].id, amount: 20 },
];

const insertedProducts = productData.map((p, i) =>
  db
    .insert(products)
    .values({
      ...p,
      imageUrl: `https://picsum.photos/seed/product${i + 1}/400/300`,
    })
    .returning()
    .get()
);

console.log(`Seeded ${insertedProducts.length} products`);
console.log("Database seeded successfully!");

process.exit(0);
