/*
 * Pagination
 * ----------
 * Premium pagination controls.
 */
function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  const previousDisabled = pagination.page <= 1;
  const nextDisabled = pagination.page >= pagination.pages;

  return (
    <nav
      aria-label="Pagination"
      className="inline-flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-sm)]"
    >
      <p className="text-xs font-medium text-[var(--text-muted)]" aria-live="polite">
        Page {pagination.page} of {pagination.pages}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={previousDisabled}
          onClick={() => onPageChange(pagination.page - 1)}
          className="h-10 rounded-xl border border-[var(--border-subtle)] px-3 text-sm text-[var(--text-secondary)] transition-colors disabled:pointer-events-none disabled:opacity-40 hover:bg-[var(--surface-raised)]"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={nextDisabled}
          onClick={() => onPageChange(pagination.page + 1)}
          className="h-10 rounded-xl border border-[var(--border-subtle)] px-3 text-sm text-[var(--text-secondary)] transition-colors disabled:pointer-events-none disabled:opacity-40 hover:bg-[var(--surface-raised)]"
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
