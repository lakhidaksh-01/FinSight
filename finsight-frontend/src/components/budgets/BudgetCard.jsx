import {
  Pencil,
  Trash2,
  WalletCards,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function BudgetCard({
  budget,
  onEdit,
  onDelete,
}) {
  if (!budget) {
    return null;
  }

  const amount = Number(budget.amount || 0);
  const spent = Number(budget.spent || 0);

  const percentage =
    amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;

  const remaining = Math.max(amount - spent, 0);
  const isOverBudget = spent > amount;
  const actualPercentage = amount > 0 ? (spent / amount) * 100 : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/30">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-purple-600">
            <WalletCards size={19} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {budget.category || "General Budget"}
            </h3>

            <p className="mt-1 text-xs capitalize text-slate-500">
              {budget.period || "Monthly"} budget
            </p>
          </div>
        </div>

        {isOverBudget ? (
          <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
            Over budget
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            On track
          </span>
        )}
      </div>

      {/* Amount */}
      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Spent
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatCurrency(spent)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">Budget</p>

          <p className="mt-1 font-semibold text-slate-700">
            {formatCurrency(amount)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {actualPercentage.toFixed(0)}% used
          </span>

          <span
            className={
              isOverBudget
                ? "font-semibold text-red-600"
                : "font-medium text-slate-600"
            }
          >
            {isOverBudget
              ? `${formatCurrency(spent - amount)} over`
              : `${formatCurrency(remaining)} left`}
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget
                ? "bg-red-500"
                : "bg-gradient-to-r from-blue-500 to-purple-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Date */}
      {budget.startDate && (
        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <CalendarDays size={14} />
          <span>Started {formatDate(budget.startDate)}</span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="outline"
          size="small"
          icon={Pencil}
          onClick={() => onEdit?.(budget)}
        >
          Edit
        </Button>

        <Button
          variant="ghost"
          size="small"
          icon={Trash2}
          onClick={() => onDelete?.(budget)}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default BudgetCard;
