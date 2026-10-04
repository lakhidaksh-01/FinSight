import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Percent,
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

function AnalyticsSummary({
  income = 0,
  expenses = 0,
  savings = 0,
  savingsRate,
}) {
  const calculatedSavings = Number(savings) || Number(income) - Number(expenses);

  const calculatedSavingsRate =
    savingsRate !== undefined
      ? Number(savingsRate)
      : Number(income) > 0
        ? (calculatedSavings / Number(income)) * 100
        : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Income */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/30">
        <SummaryItem
          icon={TrendingUp}
          label="Total Income"
          value={formatCurrency(income)}
          description="Selected period"
          iconClassName="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Expenses */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/30">
        <SummaryItem
          icon={TrendingDown}
          label="Total Expenses"
          value={formatCurrency(expenses)}
          description="Selected period"
          iconClassName="bg-blue-50 text-blue-600"
        />
      </div>

      {/* Savings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/30">
        <SummaryItem
          icon={PiggyBank}
          label="Net Savings"
          value={formatCurrency(calculatedSavings)}
          description="Income minus expenses"
          iconClassName="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Savings rate */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/30">
        <SummaryItem
          icon={Percent}
          label="Savings Rate"
          value={`${Math.max(calculatedSavingsRate, 0).toFixed(1)}%`}
          description="Percentage of income saved"
          iconClassName="bg-indigo-50 text-indigo-600"
        />
      </div>
    </div>
  );
}

export default AnalyticsSummary;
