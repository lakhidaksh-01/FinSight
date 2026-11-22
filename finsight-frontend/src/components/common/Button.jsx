import { Loader2 } from "lucide-react";

/*
 * Button
 * ------
 * Reusable FinSight button.
 *
 * Supported variants:
 * - primary
 * - secondary
 * - outline
 * - danger
 * - ghost
 *
 * Supports:
 * - loading state
 * - disabled state
 * - icons
 * - full width
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
  const variants = {
    primary:
      "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] shadow-[var(--shadow-sm)]",
    secondary:
      "bg-[var(--surface-raised)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-[var(--border-subtle)]",
    outline:
      "border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15",
    ghost:
      "bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]",
  };

  const sizes = {
    small: "h-9 px-3.5 text-xs",
    medium: "h-11 px-4.5 text-sm",
    large: "h-12 px-5 text-sm",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl
        font-semibold
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-white/20
        disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.medium}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
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

          {Icon && iconPosition === "right" && (
            <Icon size={17} strokeWidth={1.9} />
          )}
        </>
      )}
    </button>
  );
}

export default Button;
