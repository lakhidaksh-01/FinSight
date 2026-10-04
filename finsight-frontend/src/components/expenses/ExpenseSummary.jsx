import {
  WalletCards,
  TrendingDown,
  Receipt,
  Calculator,
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

        {description && (
          <p className="mt-0.5 text-xs text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function ExpenseSummary({
  expenses = [],
  previousTotal = 0,
}) {
  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const transactionCount = expenses.length;

  const averageExpense =
    transactionCount > 0 ? totalExpenses / transactionCount : 0;

  const change =
    previousTotal > 0
      ? ((totalExpenses - previousTotal) / previousTotal) * 100
      : null;

  const changeText =
    change === null
      ? "No previous data"
      : `${Math.abs(change).toFixed(1)}% ${
          change >= 0 ? "higher" : "lower"
        } than previous period`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Total spending */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/30">
        <SummaryItem
          icon={WalletCards}
          label="Total Spending"
          value={formatCurrency(totalExpenses)}
          description={changeText}
          iconClassName="bg-blue-50 text-blue-600"
        />
      </div>

      {/* Number of transactions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/30">
        <SummaryItem
          icon={Receipt}
          label="Transactions"
          value={transactionCount}
          description="Expense records"
          iconClassName="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Average expense */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/30">
        <SummaryItem
          icon={Calculator}
          label="Average Expense"
          value={formatCurrency(averageExpense)}
          description="Per transaction"
          iconClassName="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Spending trend */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-lg hover:shadow-red-100/30">
        <SummaryItem
          icon={TrendingDown}
          label="Spending Trend"
          value={
            change === null
              ? "—"
              : `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`
          }
          description={
            change === null
              ? "Compare with a previous period"
              : change >= 0
                ? "Spending increased"
                : "Spending decreased"
          }
          iconClassName={
            change !== null && change < 0
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
          }
        />
      </div>
    </div>
  );
}

export default ExpenseSummary;
