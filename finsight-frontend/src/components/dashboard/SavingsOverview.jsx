import { PiggyBank, TrendingUp } from "lucide-react";

/*
 * SavingsOverview
 * ---------------
 * Savings statistics card.
 */
function SavingsOverview({ totalSavings = 0, savingsRate = 0, currency = "₹" }) {
  const formatAmount = (amount) => `${currency}${Number(amount || 0).toLocaleString("en-IN")}`;
  const safeRate = Number(savingsRate || 0);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--accent-soft)] blur-[64px]" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Savings Overview</p>
            <h3 className="mt-1 text-lg font-bold tracking-tight text-[var(--text-primary)] numeric">{formatAmount(totalSavings)}</h3>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <PiggyBank size={21} strokeWidth={1.8} />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-muted)]">Savings rate</span>
            <span className="flex items-center gap-1 text-sm font-bold text-[var(--text-primary)]">
              <TrendingUp size={14} /> {safeRate.toFixed(1)}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--border-subtle)]">
            <div
              className="h-full rounded-full bg-[var(--gradient-primary)] transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, safeRate))}%` }}
            />
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
          Your savings rate shows how much of your income remains after expenses.
        </p>
      </div>
    </div>
  );
}

export default SavingsOverview;
