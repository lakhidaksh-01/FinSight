import { ArrowRight, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";

/*
 * BudgetOverview
 * ---------------
 * Shows a quick overview of active budgets.
 *
 * Each budget can contain:
 * - category
 * - spent
 * - amount
 * - percentage
 */
function BudgetOverview({ budgets = [] }) {
  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <WalletCards size={18} strokeWidth={1.8} />
            </div>

            <h3 className="font-semibold text-slate-900">
              Budget Overview
            </h3>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Track your monthly spending limits
          </p>
        </div>

        <Link
          to="/app/budgets"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-purple-600"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Budgets */}
      <div className="mt-6 space-y-5">
        {budgets.length === 0 ? (
          <div className="rounded-xl bg-slate-50 px-4 py-6 text-center">
            <p className="text-sm font-medium text-slate-600">
              No budgets created yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Create a budget to start tracking your spending.
            </p>
          </div>
        ) : (
          budgets.slice(0, 4).map((budget) => {
            const amount = Number(budget.amount || 0);
            const spent = Number(budget.spent || 0);

            const percentage =
              amount > 0
                ? Math.min(100, Math.round((spent / amount) * 100))
                : 0;

            const isOverBudget = spent > amount;

            return (
              <div key={budget._id || budget.id || budget.category}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {budget.category}
                    </p>

                    <p className="text-xs text-slate-400">
                      {formatAmount(spent)} of {formatAmount(amount)}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      isOverBudget
                        ? "text-red-500"
                        : "text-slate-500"
                    }`}
                  >
                    {percentage}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverBudget
                        ? "bg-red-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BudgetOverview;
