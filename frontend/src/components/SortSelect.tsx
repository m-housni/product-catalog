import type { SortOption } from "../types";
import styles from "./SortSelect.module.css";

interface Props {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name_asc", label: "Name: A → Z" },
  { value: "name_desc", label: "Name: Z → A" },
];

export function SortSelect({ value, onChange }: Props) {
  return (
    <div className={styles.sortBar}>
      <span className={styles.label}>Sort by:</span>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
