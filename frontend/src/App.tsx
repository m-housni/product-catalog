import { useProducts } from "./hooks/useProducts";
import { ProductGrid } from "./components/ProductGrid";
import { CategoryFilter } from "./components/CategoryFilter";
import { Pagination } from "./components/Pagination";
import { SortSelect } from "./components/SortSelect";
import styles from "./App.module.css";

export default function App() {
  const {
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
  } = useProducts();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo}>
            ShopCatalog <span className={styles.logoSub}>| Products</span>
          </h1>
        </div>
      </header>

      <main className={styles.main}>
        <CategoryFilter
          categories={categories}
          selected={categoryId}
          onSelect={selectCategory}
        />

        <div className={styles.toolbar}>
          <SortSelect value={sort} onChange={selectSort} />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <ProductGrid products={products} loading={loading} />

        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}
