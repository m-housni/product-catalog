import type { Category } from "../types";
import styles from "./CategoryFilter.module.css";

interface Props {
  categories: Category[];
  selected: number | undefined;
  onSelect: (id: number | undefined) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: Props) {
  return (
    <div className={styles.filters}>
      <button
        className={`${styles.pill} ${selected === undefined ? styles.active : ""}`}
        onClick={() => onSelect(undefined)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`${styles.pill} ${selected === cat.id ? styles.active : ""}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
          <span className={styles.count}>({cat.productCount})</span>
        </button>
      ))}
    </div>
  );
}
