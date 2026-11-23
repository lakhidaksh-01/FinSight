import { Loader2 } from "lucide-react";

/*
 * Button
 * ------
 * Reusable FinSight button with premium variants.
 *
 * Variants: primary, secondary, outline, ghost, danger
 * Sizes: small, medium, large
 */
function Button({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = "left",
  onClick,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-60";

  const variants = {
    primary:
      "bg-[var(--accent)] text-[var(--text-on-accent)] shadow-[var(--shadow-sm)] hover:bg-[var(--accent-strong)] focus-visible:ring-[var(--accent)]",
    secondary:
      "bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)] focus-visible:ring-[var(--accent)]",
    outline:
      "border border-[var(--border-subtle)] text-[var(--text-secondary)] bg-transparent hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] focus-visible:ring-[var(--accent)]",
    ghost:
      "text-[var(--text-muted)] bg-transparent hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] focus-visible:ring-[var(--accent)]",
    danger:
      "bg-[var(--danger)] text-[var(--text-on-danger)] shadow-[var(--shadow-sm)] hover:bg-[var(--danger-strong)] focus-visible:ring-[var(--danger)]",
  };

  const sizes = {
    small: "h-9 px-3.5 text-xs",
    medium: "h-11 px-4.5 text-sm",
    large: "h-12 px-6 text-sm",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
      className={`${base} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.medium
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon size={17} strokeWidth={1.9} />
          )}
          <span>{children}</span>
          {Icon && iconPosition === "right" && <Icon size={17} strokeWidth={1.9} />}
        </>
      )}
    </button>
  );
}

export default Button;
