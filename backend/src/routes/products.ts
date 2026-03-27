import { Router, Request, Response } from "express";
import { db } from "../db/index.js";
import { products, categories } from "../db/schema.js";
import { eq, sql, count, asc, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 12));
    const categoryId = req.query.categoryId
      ? parseInt(req.query.categoryId as string)
      : undefined;
    const sort = (req.query.sort as string) || "newest";
    const offset = (page - 1) * limit;

    // Build where clause
    const where = categoryId ? eq(products.categoryId, categoryId) : undefined;

    // Determine sort order
    let orderBy;
    switch (sort) {
      case "price_asc":
        orderBy = asc(products.price);
        break;
      case "price_desc":
        orderBy = desc(products.price);
        break;
      case "name_asc":
        orderBy = asc(products.name);
        break;
      case "name_desc":
        orderBy = desc(products.name);
        break;
      case "newest":
      default:
        orderBy = desc(products.createdAt);
        break;
    }

    // Count total
    const [{ total }] = db
      .select({ total: count() })
      .from(products)
      .where(where)
      .all() as [{ total: number }];

    // Fetch products with category name
    const rows = db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        category: categories.name,
        categoryId: products.categoryId,
        imageUrl: products.imageUrl,
        amount: products.amount,
        createdAt: products.createdAt,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .all();

    res.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
