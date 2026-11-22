import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  ReceiptText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

/*
 * RecentTransactions
 * ------------------
 * Latest income and expense records on the dashboard.
 */
function RecentTransactions({ transactions = [] }) {
  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--info-soft)] text-[var(--info)]">
            <ReceiptText size={18} strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">Recent Transactions</h3>
            <p className="text-xs text-[var(--text-muted)]">Your latest financial activity</p>
          </div>
        </div>

        <Link
          to="/app/expenses"
          className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {transactions.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <p className="text-sm font-medium text-[var(--text-secondary)]">No recent transactions</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Your latest income and expenses will appear here.</p>
          </div>
        ) : (
          transactions.slice(0, 6).map((transaction, index) => {
            const isIncome = transaction.type === "income";

            return (
              <div
                key={transaction._id || transaction.id || `${transaction.date}-${index}`}
                className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-[var(--surface-raised)] sm:px-6"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isIncome ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--info-soft)] text-[var(--info)]"}`}>
                  {isIncome ? (
                    <ArrowDownLeft size={18} strokeWidth={1.9} />
                  ) : (
                    <ArrowUpRight size={18} strokeWidth={1.9} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                    {transaction.description || transaction.category || "Transaction"}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {transaction.category || "General"} · {formatDate(transaction.date)}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-bold ${isIncome ? "text-[var(--success)]" : "text-[var(--text-primary)]"}`}>
                    {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentTransactions;
