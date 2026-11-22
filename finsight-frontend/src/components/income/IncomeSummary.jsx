import {
  Wallet,
  TrendingUp,
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

function IncomeSummary({ incomes = [], previousTotal = 0 }) {
  const totalIncome = incomes.reduce((total, income) => total + Number(income.amount || 0), 0);
  const transactionCount = incomes.length;
  const averageIncome = transactionCount > 0 ? totalIncome / transactionCount : 0;

  const change = previousTotal > 0 ? ((totalIncome - previousTotal) / previousTotal) * 100 : null;
  const changeText = change === null
    ? "No previous data"
    : `${Math.abs(change).toFixed(1)}% ${change >= 0 ? "higher" : "lower"} than previous period`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={Wallet} label="Total Income" value={formatCurrency(totalIncome)} description={changeText} iconClassName="bg-[var(--success-soft)] text-[var(--success)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={Receipt} label="Transactions" value={transactionCount} description="Income records" iconClassName="bg-[var(--info-soft)] text-[var(--info)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={Calculator} label="Average Income" value={formatCurrency(averageIncome)} description="Per transaction" iconClassName="bg-[var(--accent-soft)] text-[var(--accent)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem
          icon={TrendingUp}
          label="Income Trend"
          value={change === null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`}
          description={change === null ? "Compare with a previous period" : change >= 0 ? "Income increased" : "Income decreased"}
          iconClassName={change !== null && change >= 0 ? "bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]/20" : "bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning)]/20"}
        />
      </div>
    </div>
  );
}

export default IncomeSummary;
