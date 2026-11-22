
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

/*
 * Input
 * -----
 * Reusable form input for FinSight.
 *
 * Supports:
 * - text
 * - email
 * - password
 * - number
 * - date
 * - textarea
 * - labels
 * - errors
 * - helper text
 */
function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  textarea = false,
  rows = 4,
  icon,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const actualType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const inputClasses = `
    w-full rounded-xl border
    bg-[var(--surface-raised)]
    px-4
    text-sm text-[var(--text-primary)]
    outline-none
    placeholder:text-[var(--text-muted)]
    transition-all duration-200
    disabled:cursor-not-allowed disabled:opacity-50
    ${
      error
        ? "border-red-500/40 focus:border-red-400"
        : "border-[var(--border-subtle)] focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/10"
    }
    ${type === "password" ? "pr-12" : ""}
    ${icon ? "pl-10" : ""}
    ${textarea ? "min-h-[110px] py-3.5 resize-y" : "h-11"}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
        >
          {label}

          {required && <span className="ml-1 text-slate-500">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3.5 top-3.5 text-slate-500">{icon}</span>}
        {textarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={inputClasses}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={actualType}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />
        )}

        {/* Password visibility button */}
        {type === "password" && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={1.8} />
            ) : (
              <Eye size={18} strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium text-red-400">{error}</p>
      )}

      {!error && helperText && (
        <p className="mt-2 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
