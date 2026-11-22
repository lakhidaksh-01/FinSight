import { ChevronDown } from "lucide-react";

/*
 * Select
 * ------
 * Reusable dropdown field for FinSight.
 *
 * options format: [{ value: "Food", label: "Food" }]
 */
function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  disabled = false,
  error,
  helperText,
  className = "",
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
        >
          {label}
          {required && <span className="ml-1 text-[var(--text-muted)]">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`h-11 w-full appearance-none rounded-xl border
            bg-[var(--surface-raised)]
            px-4 pr-10 text-sm text-[var(--text-primary)]
            outline-none transition-all duration-200
            disabled:cursor-not-allowed disabled:opacity-50
            ${
              error
                ? "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-1 focus:ring-[var(--danger)]/20"
                : "border-[var(--border-subtle)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20"
            }
            ${className}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          strokeWidth={1.8}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
      </div>

      {error && <p className="mt-2 text-xs font-medium text-[var(--danger)]">{error}</p>}
      {!error && helperText && (
        <p className="mt-2 text-xs text-[var(--text-muted)]">{helperText}</p>
      )}
    </div>
  );
}

export default Select;
