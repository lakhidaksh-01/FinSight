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
      "bg-white text-slate-950 hover:bg-slate-200 shadow-lg shadow-white/[0.04]",
    secondary:
      "bg-white/[0.08] text-white hover:bg-white/[0.12] border border-white/[0.08]",
    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
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
