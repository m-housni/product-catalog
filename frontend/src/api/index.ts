import type { Product, Category, PaginatedResponse, SortOption } from "../types";

const API_BASE = "/api";

export async function fetchProducts(params: {
  page?: number;
  limit?: number;
  categoryId?: number;
  sort?: SortOption;
}): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.categoryId) searchParams.set("categoryId", String(params.categoryId));
  if (params.sort) searchParams.set("sort", params.sort);

  const res = await fetch(`${API_BASE}/products?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}
