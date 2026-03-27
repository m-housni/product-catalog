import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { carts, cartItems, products } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

// Create a new cart
router.post("/", async (_req: Request, res: Response) => {
  try {
    const expirationTime = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();

    const cart = db
      .insert(carts)
      .values({ expirationTime })
      .returning()
      .get();

    res.status(201).json(cart);
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ error: "Failed to create cart" });
  }
});

// Get cart by ID with items
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const cartId = parseInt(req.params.id as string);
    if (isNaN(cartId)) {
      res.status(400).json({ error: "Invalid cart ID" });
      return;
    }

    const cart = db
      .select()
      .from(carts)
      .where(eq(carts.id, cartId))
      .get();

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    const items = db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        productId: products.id,
        productName: products.name,
        productPrice: products.price,
        productImageUrl: products.imageUrl,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cartId))
      .all();

    res.json({ ...cart, items });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Add item to cart
router.post("/:id/items", async (req: Request, res: Response) => {
  try {
    const cartId = parseInt(req.params.id as string);
    if (isNaN(cartId)) {
      res.status(400).json({ error: "Invalid cart ID" });
      return;
    }

    const { productId, quantity = 1 } = req.body;
    if (!productId || typeof productId !== "number") {
      res.status(400).json({ error: "productId is required and must be a number" });
      return;
    }

    // Verify cart exists
    const cart = db.select().from(carts).where(eq(carts.id, cartId)).get();
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    // Verify product exists
    const product = db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .get();
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const item = db
      .insert(cartItems)
      .values({ cartId, productId, quantity: Math.max(1, quantity) })
      .returning()
      .get();

    res.status(201).json(item);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Remove item from cart
router.delete("/:id/items/:itemId", async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.itemId as string);
    if (isNaN(itemId)) {
      res.status(400).json({ error: "Invalid item ID" });
      return;
    }

    const deleted = db
      .delete(cartItems)
      .where(eq(cartItems.id, itemId))
      .returning()
      .get();

    if (!deleted) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

export default router;
