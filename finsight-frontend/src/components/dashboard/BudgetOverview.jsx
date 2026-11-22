import { ArrowRight, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

/*
 * BudgetOverview
 * ---------------
 * Quick overview of active budgets on the dashboard.
 */
function BudgetOverview({ budgets = [] }) {
  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <WalletCards size={18} strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">
              Budget Overview
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Track your monthly spending limits
            </p>
          </div>
        </div>

        <Link
          to="/app/budgets"
          className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {budgets.length === 0 ? (
          <div className="rounded-2xl bg-[var(--surface-raised)] px-5 py-8 text-center">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              No budgets created yet
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Create a budget to start tracking your spending.
            </p>
          </div>
        ) : (
          budgets.slice(0, 4).map((budget) => {
            const amount = Number(budget.amount || 0);
            const spent = Number(budget.spent || 0);
            const percentage =
              amount > 0 ? Math.round((spent / amount) * 100) : 0;
            const isOverBudget = spent > amount;

            return (
              <div key={budget._id || budget.id || budget.category}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {budget.category}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {formatCurrency(spent)} of {formatCurrency(amount)}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">
                    {percentage}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[var(--border-subtle)]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isOverBudget
                        ? "bg-[var(--danger)]"
                        : "bg-[var(--gradient-primary)]"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
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
