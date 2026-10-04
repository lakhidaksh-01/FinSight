import { Loader2 } from "lucide-react";

/*
 * LoadingSpinner
 * --------------
 * Small reusable loading indicator.
 */
function LoadingSpinner({
  size = "medium",
  text,
  className = "",
}) {
  const sizes = {
    small: 16,
    medium: 22,
    large: 32,
  };

  const iconSize = sizes[size] || sizes.medium;

  return (
    <div
      className={`flex items-center justify-center gap-2 text-slate-400 ${className}`}
    >
      <Loader2
        size={iconSize}
        strokeWidth={1.8}
        className="animate-spin"
      />

      {text && <span className="text-sm">{text}</span>}
    </div>
  );
}

export default LoadingSpinner;
