export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  categoryId: number;
  imageUrl: string;
  amount: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  productCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
