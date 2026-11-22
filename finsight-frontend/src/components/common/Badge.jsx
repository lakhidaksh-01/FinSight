/*
 * Badge
 * -----
 * Small reusable status / category label.
 *
 * Variants: default, success, warning, danger, info
 */
function Badge({ children, variant = "default", size = "medium", className = "" }) {
  const variants = {
    default:
      "border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-muted)]",
    success:
      "border border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--success)]",
    warning:
      "border border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--warning)]",
    danger:
      "border border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--danger)]",
    info:
      "border border-[var(--info)]/20 bg-[var(--info-soft)] text-[var(--info)]",
  };

  const sizes = {
    small: "px-2 py-0.5 text-[10px]",
    medium: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.medium} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
