import {
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

/*
 * BudgetWarnings
 * --------------
 * Budgets approaching or past their limit.
 */
function BudgetWarnings({ budgets = [], onViewBudget }) {
  const warnings = budgets
    .map((budget) => {
      const amount = Number(budget.amount || 0);
      const spent = Number(budget.spent || 0);
      if (amount <= 0) return null;
      const percentage = (spent / amount) * 100;

      if (percentage > 100) {
        return { ...budget, percentage, type: "danger", message: "This budget has been exceeded." };
      }
      if (percentage >= 80) {
        return { ...budget, percentage, type: "warning", message: "Spending is approaching the budget limit." };
      }
      return null;
    })
    .filter(Boolean);

  if (!warnings.length) {
    return (
      <div className="rounded-3xl border border-[var(--success)]/20 bg-[var(--success-soft)] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-[var(--text-inverse)] shadow-lg shadow-[var(--success)]/20">
            <ShieldCheck size={19} />
          </div>
          <div>
            <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">Budgets are looking healthy</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">No budgets are currently approaching or exceeding their limits.</p>
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
            className={`rounded-2xl border p-4 ${isDanger ? "border-[var(--danger)]/20 bg-[var(--danger-soft)]" : "border-[var(--warning)]/20 bg-[var(--warning-soft)]"}`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] shadow-sm ${isDanger ? "text-[var(--danger)]" : "text-[var(--warning)]"}`}>
                <AlertTriangle size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">{budget.category || "Budget"}</h3>
                  <span className={`text-sm font-bold ${isDanger ? "text-[var(--danger)]" : "text-[var(--warning)]"}`}>{budget.percentage.toFixed(0)}%</span>
                </div>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{budget.message}</p>

                {onViewBudget && (
                  <button
                    type="button"
                    onClick={() => onViewBudget(budget)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
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
