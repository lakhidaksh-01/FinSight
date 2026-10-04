import { ChevronDown } from "lucide-react";

/*
 * Select
 * ------
 * Reusable dropdown field.
 *
 * options format:
 *
 * [
 *   { value: "Food", label: "Food" },
 *   { value: "Transport", label: "Transport" }
 * ]
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
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          {label}

          {required && <span className="ml-1 text-slate-500">*</span>}
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
          className={`
            h-11 w-full appearance-none rounded-xl border
            bg-slate-900
            px-4 pr-10
            text-sm text-white
            outline-none
            transition-all duration-200
            disabled:cursor-not-allowed disabled:opacity-50
            ${
              error
                ? "border-red-500/40 focus:border-red-400"
                : "border-white/[0.08] focus:border-white/20"
            }
            ${className}
          `}
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
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
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

export default Select;
