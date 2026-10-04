import { Target } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function BudgetProgress({
  budget,
}) {
  if (!budget) {
    return null;
  }

  const amount = Number(budget.amount || 0);
  const spent = Number(budget.spent || 0);

  const percentage = amount > 0 ? (spent / amount) * 100 : 0;
  const progressWidth = Math.min(percentage, 100);

  const isOverBudget = percentage > 100;
  const isWarning = percentage >= 80 && percentage <= 100;

  const status = isOverBudget
    ? "Over budget"
    : isWarning
      ? "Approaching limit"
      : "Within budget";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Target size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              {budget.category || "Budget"}
            </h3>

            <p className="text-xs capitalize text-slate-500">
              {budget.period || "monthly"}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isOverBudget
              ? "bg-red-50 text-red-600"
              : isWarning
                ? "bg-amber-50 text-amber-600"
                : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500">Spent</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(spent)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">Limit</p>
            <p className="mt-1 font-semibold text-slate-700">
              {formatCurrency(amount)}
            </p>
          </div>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOverBudget
                ? "bg-red-500"
                : isWarning
                  ? "bg-amber-400"
                  : "bg-gradient-to-r from-blue-500 to-purple-500"
            }`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>{percentage.toFixed(1)}% used</span>

          <span>
            {isOverBudget
              ? `${formatCurrency(spent - amount)} over`
              : `${formatCurrency(amount - spent)} remaining`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BudgetProgress;
