import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

/*
 * SummaryCard
 * -----------
 * Reusable financial summary card.
 *
 * Used for values such as:
 * - Total Income
 * - Total Expenses
 * - Savings
 * - Balance
 *
 * Example:
 *
 * <SummaryCard
 *   title="Total Income"
 *   value="₹50,000"
 *   change="+12.5%"
 *   changeType="positive"
 *   icon={ArrowUpRight}
 * />
 */
function SummaryCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
}) {
  const changeStyles = {
    positive: "text-emerald-600 bg-emerald-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-slate-500 bg-slate-100",
  };

  const ChangeIcon =
    changeType === "positive"
      ? ArrowUpRight
      : changeType === "negative"
        ? ArrowDownRight
        : Minus;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/[0.06]">
      {/* Subtle decorative gradient */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-100/50 blur-3xl transition-all duration-300 group-hover:bg-blue-200/60" />

      <div className="relative">
        {/* Card header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {title}
            </p>

            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {value}
            </h3>
          </div>

          {/* Icon */}
          {Icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon size={20} strokeWidth={1.9} />
            </div>
          )}
        </div>

        {/* Change indicator */}
        {(change || description) && (
          <div className="mt-4 flex items-center gap-2">
            {change && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                  changeStyles[changeType] || changeStyles.neutral
                }`}
              >
                <ChangeIcon size={13} strokeWidth={2} />
                {change}
              </span>
            )}

            {description && (
              <span className="text-xs text-slate-400">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryCard;
