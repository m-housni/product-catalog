import styles from "./Pagination.module.css";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div>
      <div className={styles.pagination}>
        <button
          className={styles.button}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          ←
        </button>

        {start > 1 && (
          <>
            <button className={styles.button} onClick={() => onPageChange(1)}>
              1
            </button>
            {start > 2 && <span className={styles.button}>…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            className={`${styles.button} ${p === page ? styles.active : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className={styles.button}>…</span>}
            <button
              className={styles.button}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className={styles.button}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          →
        </button>
      </div>
      <p className={styles.info}>{total} products found</p>
    </div>
  );
}
