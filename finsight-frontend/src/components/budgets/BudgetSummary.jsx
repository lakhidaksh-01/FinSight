import {
  WalletCards,
  Target,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { calculateBudgetTotals } from "../../utils/calculations";

function SummaryItem({ icon: Icon, label, value, description, iconClassName }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
        <p className="mt-1 truncate text-lg font-bold tracking-tight text-[var(--text-primary)] numeric">{value}</p>
        {description && <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>}
      </div>
    </div>
  );
}

function BudgetSummary({ budgets = [] }) {
  const { totalBudgeted: totalBudget, totalSpent, totalRemaining: remaining } =
    calculateBudgetTotals(budgets);
  const activeBudgets = budgets.length;
  const exceededBudgets = budgets.filter((budget) => Number(budget.amount || 0) > 0 && Number(budget.spent || 0) > Number(budget.amount || 0)).length;
  const nearingBudgets = budgets.filter((budget) => {
    const amount = Number(budget.amount) || 0;
    const percentage = amount > 0 ? (Number(budget.spent) || 0) / amount * 100 : 0;

    return percentage >= 80 && percentage <= 100;
  }).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={WalletCards} label="Total Budget" value={formatCurrency(totalBudget)} description="Combined budget limits" iconClassName="bg-[var(--info-soft)] text-[var(--info)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={TrendingDown} label="Total Spent" value={formatCurrency(totalSpent)} description="Across all budgets" iconClassName="bg-[var(--accent-soft)] text-[var(--accent)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={Target} label="Remaining" value={formatCurrency(remaining)} description="Available budget" iconClassName="bg-[var(--success-soft)] text-[var(--success)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem
          icon={AlertTriangle}
          label="Attention Needed"
          value={exceededBudgets + nearingBudgets}
          description={activeBudgets ? `${exceededBudgets} over limit · ${nearingBudgets} nearing limit` : "No active budgets"}
          iconClassName={exceededBudgets > 0 ? "bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/20" : nearingBudgets > 0 ? "bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning)]/20" : "bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--border-subtle)]"}
        />
      </div>
    </div>
  );
}

export default BudgetSummary;
