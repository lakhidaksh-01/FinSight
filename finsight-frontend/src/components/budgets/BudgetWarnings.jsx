import {
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

function BudgetWarnings({
  budgets = [],
  onViewBudget,
}) {
  const warnings = budgets
    .map((budget) => {
      const amount = Number(budget.amount || 0);
      const spent = Number(budget.spent || 0);

      if (amount <= 0) {
        return null;
      }

      const percentage = (spent / amount) * 100;

      if (percentage > 100) {
        return {
          ...budget,
          percentage,
          type: "danger",
          message: "This budget has been exceeded.",
        };
      }

      if (percentage >= 80) {
        return {
          ...budget,
          percentage,
          type: "warning",
          message: "Spending is approaching the budget limit.",
        };
      }

      return null;
    })
    .filter(Boolean);

  if (!warnings.length) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-blue-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <ShieldCheck size={19} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Budgets are looking healthy
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              No budgets are currently approaching or exceeding their limits.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {warnings.map((budget) => {
        const isDanger = budget.type === "danger";

        return (
          <div
            key={budget._id || budget.id || budget.category}
            className={`rounded-2xl border p-4 ${
              isDanger
                ? "border-red-100 bg-red-50/70"
                : "border-amber-100 bg-amber-50/70"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${
                  isDanger ? "text-red-600" : "text-amber-600"
                }`}
              >
                <AlertTriangle size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">
                    {budget.category || "Budget"}
                  </h3>

                  <span
                    className={`text-sm font-bold ${
                      isDanger ? "text-red-600" : "text-amber-600"
                    }`}
                  >
                    {budget.percentage.toFixed(0)}%
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-600">
                  {budget.message}
                </p>

                {onViewBudget && (
                  <button
                    type="button"
                    onClick={() => onViewBudget(budget)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-purple-600"
                  >
                    View budget
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BudgetWarnings;
