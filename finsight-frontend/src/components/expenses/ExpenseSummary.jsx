import {
  WalletCards,
  TrendingDown,
  Receipt,
  Calculator,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

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

function ExpenseSummary({ expenses = [], previousTotal = 0 }) {
  const totalExpenses = expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);
  const transactionCount = expenses.length;
  const averageExpense = transactionCount > 0 ? totalExpenses / transactionCount : 0;

  const change = previousTotal > 0 ? ((totalExpenses - previousTotal) / previousTotal) * 100 : null;
  const changeText = change === null
    ? "No previous data"
    : `${Math.abs(change).toFixed(1)}% ${change >= 0 ? "higher" : "lower"} than previous period`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={WalletCards} label="Total Spending" value={formatCurrency(totalExpenses)} description={changeText} iconClassName="bg-[var(--info-soft)] text-[var(--info)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={Receipt} label="Transactions" value={transactionCount} description="Expense records" iconClassName="bg-[var(--accent-soft)] text-[var(--accent)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={Calculator} label="Average Expense" value={formatCurrency(averageExpense)} description="Per transaction" iconClassName="bg-[var(--accent-soft)] text-[var(--accent)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem
          icon={TrendingDown}
          label="Spending Trend"
          value={change === null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`}
          description={change === null ? "Compare with a previous period" : change >= 0 ? "Spending increased" : "Spending decreased"}
          iconClassName={change !== null && change < 0 ? "bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]/20" : "bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/20"}
        />
      </div>
    </div>
  );
}

export default ExpenseSummary;
