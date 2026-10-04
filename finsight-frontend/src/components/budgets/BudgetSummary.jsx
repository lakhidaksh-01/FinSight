import {
  WalletCards,
  Target,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function SummaryItem({
  icon: Icon,
  label,
  value,
  description,
  iconClassName,
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 truncate text-lg font-bold text-slate-900">
          {value}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function BudgetSummary({
  budgets = [],
}) {
  const totalBudget = budgets.reduce(
    (total, budget) => total + Number(budget.amount || 0),
    0
  );

  const totalSpent = budgets.reduce(
    (total, budget) => total + Number(budget.spent || 0),
    0
  );

  const activeBudgets = budgets.length;

  const exceededBudgets = budgets.filter(
    (budget) =>
      Number(budget.amount || 0) > 0 &&
      Number(budget.spent || 0) > Number(budget.amount || 0)
  ).length;

  const remaining = Math.max(totalBudget - totalSpent, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={WalletCards}
          label="Total Budget"
          value={formatCurrency(totalBudget)}
          description="Combined budget limits"
          iconClassName="bg-blue-50 text-blue-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={TrendingDown}
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          description="Across all budgets"
          iconClassName="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={Target}
          label="Remaining"
          value={formatCurrency(remaining)}
          description="Available budget"
          iconClassName="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={AlertTriangle}
          label="Attention Needed"
          value={exceededBudgets}
          description={
            activeBudgets
              ? `of ${activeBudgets} active budgets`
              : "No active budgets"
          }
          iconClassName={
            exceededBudgets > 0
              ? "bg-red-50 text-red-600"
              : "bg-slate-100 text-slate-500"
          }
        />
      </div>
    </div>
  );
}

export default BudgetSummary;
