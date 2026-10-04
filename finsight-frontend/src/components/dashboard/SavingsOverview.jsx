import { PiggyBank, TrendingUp } from "lucide-react";

/*
 * SavingsOverview
 * ----------------
 * Displays savings statistics from the
 * savings analytics API.
 */
function SavingsOverview({
  totalSavings = 0,
  savingsRate = 0,
  currency = "₹",
}) {
  const formatAmount = (amount) => {
    return `${currency}${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const safeRate = Number(savingsRate || 0);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Decorative purple glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-100 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Savings Overview
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {formatAmount(totalSavings)}
            </h3>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <PiggyBank size={21} strokeWidth={1.8} />
          </div>
        </div>

        {/* Savings rate */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Savings rate
            </span>

            <span className="flex items-center gap-1 text-sm font-bold text-purple-600">
              <TrendingUp size={14} />
              {safeRate.toFixed(1)}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{
                width: `${Math.min(100, Math.max(0, safeRate))}%`,
              }}
            />
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          Your savings rate shows how much of your income remains after expenses.
        </p>
      </div>
    </div>
  );
}

export default SavingsOverview;
