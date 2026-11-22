import { Target } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/*
 * BudgetProgress
 * --------------
 * Compact budget progress card.
 */
function BudgetProgress({ budget }) {
  if (!budget) return null;

  const amount = Number(budget.amount || 0);
  const spent = Number(budget.spent || 0);
  const percentage = amount > 0 ? (spent / amount) * 100 : 0;
  const progressWidth = Math.min(percentage, 100);

  const isOverBudget = percentage > 100;
  const isWarning = percentage >= 80 && percentage <= 100;

  const status = isOverBudget ? "Over budget" : isWarning ? "Approaching limit" : "Within budget";

  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Target size={18} />
          </div>
          <div>
            <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">{budget.category || "Budget"}</h3>
            <p className="text-xs capitalize text-[var(--text-muted)]">{budget.period || "monthly"}</p>
          </div>
        </div>

        <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
          isOverBudget
            ? "bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/20"
            : isWarning
              ? "bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/20"
              : "bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/20"
        }`}>{status}</span>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)]">Spent</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--text-primary)] numeric">{formatCurrency(spent)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-muted)]">Limit</p>
            <p className="mt-1 font-semibold text-[var(--text-secondary)]">{formatCurrency(amount)}</p>
          </div>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--border-subtle)]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOverBudget
                ? "bg-[var(--danger)]"
                : isWarning
                  ? "bg-[var(--warning)]"
                  : "bg-[var(--gradient-primary)]"
            }`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-[var(--text-muted)]">
          <span>{percentage.toFixed(1)}% used</span>
          <span>
            {isOverBudget ? `${formatCurrency(spent - amount)} over` : `${formatCurrency(amount - spent)} remaining`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BudgetProgress;
