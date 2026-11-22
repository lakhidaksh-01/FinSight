function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  const previousDisabled = pagination.page <= 1;
  const nextDisabled = pagination.page >= pagination.pages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#121a16] px-4 py-3"
    >
      <p className="text-xs text-[#91a097]" aria-live="polite">
        Page {pagination.page} of {pagination.pages}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={previousDisabled}
          onClick={() => onPageChange(pagination.page - 1)}
          className="h-9 rounded-lg border border-white/10 px-3 text-sm text-[#b4c0b7] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={nextDisabled}
          onClick={() => onPageChange(pagination.page + 1)}
          className="h-9 rounded-lg border border-white/10 px-3 text-sm text-[#b4c0b7] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
