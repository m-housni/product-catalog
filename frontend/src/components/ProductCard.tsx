import type { Product } from "../types";
import styles from "./ProductCard.module.css";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const stockClass =
    product.amount === 0
      ? styles.outOfStock
      : product.amount <= 10
        ? styles.lowStock
        : styles.inStock;

  const stockLabel =
    product.amount === 0
      ? "Out of stock"
      : product.amount <= 10
        ? `Only ${product.amount} left`
        : "In stock";

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
        />
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <span className={`${styles.stock} ${stockClass}`}>{stockLabel}</span>
        </div>
      </div>
    </article>
  );
}
