import { useState, useEffect, useCallback } from "react";
import { fetchProducts, fetchCategories } from "../api";
import type { Product, Category, SortOption } from "../types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [sort, setSort] = useState<SortOption>("newest");

  const limit = 8;

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProducts({ page, limit, categoryId, sort });
      setProducts(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, categoryId, sort]);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch {
      console.error("Failed to load categories");
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const selectCategory = (id: number | undefined) => {
    setCategoryId(id);
    setPage(1);
  };

  const selectSort = (s: SortOption) => {
    setSort(s);
    setPage(1);
  };

  return {
    products,
    categories,
    loading,
    error,
    page,
    totalPages,
    total,
    categoryId,
    sort,
    setPage,
    selectCategory,
    selectSort,
  };
}
