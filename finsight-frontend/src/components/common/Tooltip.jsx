/*
 * Tooltip
 * -------
 * Lightweight CSS tooltip.
 */
function Tooltip({ children, content, position = "top" }) {
  const positions = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };

  return (
    <div className="group relative inline-flex">
      {children}

      <div
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-[11px] font-medium text-[var(--text-primary)] shadow-[var(--shadow-lg)] opacity-0 transition-all duration-150 group-hover:opacity-100 ${
          positions[position] || positions.top
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default Tooltip;
