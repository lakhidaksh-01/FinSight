/*
 * Badge
 * -----
 * Small reusable status/category label.
 *
 * Supported variants:
 * - default
 * - success
 * - warning
 * - danger
 * - info
 */
function Badge({
  children,
  variant = "default",
  size = "medium",
  className = "",
}) {
  const variants = {
    default:
      "border-white/[0.08] bg-white/[0.05] text-slate-300",
    success:
      "border-emerald-500/15 bg-emerald-500/10 text-emerald-400",
    warning:
      "border-amber-500/15 bg-amber-500/10 text-amber-400",
    danger:
      "border-red-500/15 bg-red-500/10 text-red-400",
    info:
      "border-blue-500/15 bg-blue-500/10 text-blue-400",
  };

  const sizes = {
    small: "px-2 py-0.5 text-[10px]",
    medium: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border
        font-medium
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.medium}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
