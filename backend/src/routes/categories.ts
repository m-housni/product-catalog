import { Router, Request, Response } from "express";
import { db } from "../db/index.js";
import { categories, products } from "../db/schema.js";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = db
      .select({
        id: categories.id,
        name: categories.name,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .groupBy(categories.id, categories.name)
      .orderBy(categories.name)
      .all();

    res.json(rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
