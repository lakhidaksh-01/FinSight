import { ArrowUpRight, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

/*
 * BalanceCard
 * -----------
 * Hero balance card on the dashboard.
 *
 * Shows current balance plus income / expenses for the selected period.
 */
function BalanceCard({ balance = 0, income = 0, expenses = 0, currency = "₹" }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] sm:p-7">
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[var(--accent-glass)] blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-[var(--secondary-soft)] blur-[64px]" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Wallet size={18} strokeWidth={1.9} />
              </div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">Available Balance</span>
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] numeric sm:text-5xl">
              {formatCurrency(balance)}
            </h2>
          </div>

          <div className="hidden rounded-xl bg-[var(--surface-raised)] px-3 py-2 backdrop-blur-sm sm:flex sm:items-center sm:gap-1.5">
            <ArrowUpRight size={15} />
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Overview</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[var(--border-subtle)] pt-5">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">Total Income</p>
            <p className="mt-1.5 text-base font-semibold text-[var(--text-primary)] numeric">{formatCurrency(income)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">Total Expenses</p>
            <p className="mt-1.5 text-base font-semibold text-[var(--text-primary)] numeric">{formatCurrency(expenses)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BalanceCard;
