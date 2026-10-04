import {
  Wallet,
  TrendingUp,
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

function IncomeSummary({
  incomes = [],
  previousTotal = 0,
}) {
  const totalIncome = incomes.reduce(
    (total, income) => total + Number(income.amount || 0),
    0
  );

  const transactionCount = incomes.length;

  const averageIncome =
    transactionCount > 0 ? totalIncome / transactionCount : 0;

  const change =
    previousTotal > 0
      ? ((totalIncome - previousTotal) / previousTotal) * 100
      : null;

  const changeText =
    change === null
      ? "No previous data"
      : `${Math.abs(change).toFixed(1)}% ${
          change >= 0 ? "higher" : "lower"
        } than previous period`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Total income */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/30">
        <SummaryItem
          icon={Wallet}
          label="Total Income"
          value={formatCurrency(totalIncome)}
          description={changeText}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Number of income records */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/30">
        <SummaryItem
          icon={Receipt}
          label="Transactions"
          value={transactionCount}
          description="Income records"
          iconClassName="bg-blue-50 text-blue-600"
        />
      </div>

      {/* Average income */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/30">
        <SummaryItem
          icon={Calculator}
          label="Average Income"
          value={formatCurrency(averageIncome)}
          description="Per transaction"
          iconClassName="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Income trend */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/30">
        <SummaryItem
          icon={TrendingUp}
          label="Income Trend"
          value={
            change === null
              ? "—"
              : `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`
          }
          description={
            change === null
              ? "Compare with a previous period"
              : change >= 0
                ? "Income increased"
                : "Income decreased"
          }
          iconClassName={
            change !== null && change >= 0
              ? "bg-emerald-50 text-emerald-600"
              : "bg-orange-50 text-orange-600"
          }
        />
      </div>
    </div>
  );
}

export default IncomeSummary;
