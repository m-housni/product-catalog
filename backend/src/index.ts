import express from "express";
import cors from "cors";
import { initDatabase } from "./db/init.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import cartRoutes from "./routes/cart.js";

// Initialize database (create tables + seed if empty)
initDatabase();

const app = express();
const PORT = parseInt(process.env.PORT || "4000");

app.use(cors());
app.use(express.json());

// Routes
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/cart", cartRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
