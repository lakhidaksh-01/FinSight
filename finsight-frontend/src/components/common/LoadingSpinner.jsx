import { Loader2 } from "lucide-react";

/*
 * LoadingSpinner
 * --------------
 * Small reusable loading indicator.
 */
function LoadingSpinner({ size = "medium", text, className = "" }) {
  const sizes = { small: 16, medium: 24, large: 36 };
  const iconSize = sizes[size] || sizes.medium;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center gap-2.5 text-[var(--text-muted)] ${className}`}
    >
      <Loader2 size={iconSize} strokeWidth={1.8} className="animate-spin" />
      {text && <span className="text-sm text-[var(--text-secondary)]">{text}</span>}
    </div>
  );
}

export default LoadingSpinner;
