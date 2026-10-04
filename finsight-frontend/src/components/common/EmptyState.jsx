import { Inbox } from "lucide-react";
import Button from "./Button";

/*
 * EmptyState
 * ----------
 * Used when a page or section has no data yet.
 *
 * Example:
 *
 * <EmptyState
 *   title="No expenses yet"
 *   description="Start tracking your spending by adding your first expense."
 *   actionLabel="Add Expense"
 *   onAction={handleAddExpense}
 * />
 */
function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-10 text-center">
      {/* Icon */}
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-slate-400">
        <Icon size={24} strokeWidth={1.7} />
      </div>

      {/* Text */}
      <h3 className="text-base font-semibold text-white">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}

      {/* Optional action */}
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
