import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  ReceiptText,
} from "lucide-react";
import { Link } from "react-router-dom";

/*
 * RecentTransactions
 * -------------------
 * Displays the latest income and expense records.
 *
 * The dashboard can pass combined transaction
 * data into this component.
 *
 * Expected transaction format:
 *
 * {
 *   id,
 *   description,
 *   category,
 *   amount,
 *   type: "income" | "expense",
 *   date
 * }
 */
function RecentTransactions({ transactions = [] }) {
  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ReceiptText size={18} strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Recent Transactions
            </h3>

            <p className="text-xs text-slate-400">
              Your latest financial activity
            </p>
          </div>
        </div>

        <Link
          to="/app/expenses"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-purple-600"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Transactions */}
      <div className="divide-y divide-slate-100">
        {transactions.length === 0 ? (
          <div className="px-5 py-10 text-center sm:px-6">
            <p className="text-sm font-medium text-slate-600">
              No recent transactions
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Your latest income and expenses will appear here.
            </p>
          </div>
        ) : (
          transactions.slice(0, 6).map((transaction, index) => {
            const isIncome = transaction.type === "income";

            return (
              <div
                key={
                  transaction._id ||
                  transaction.id ||
                  `${transaction.date}-${index}`
                }
                className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6"
              >
                {/* Transaction icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isIncome
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {isIncome ? (
                    <ArrowDownLeft size={18} strokeWidth={1.9} />
                  ) : (
                    <ArrowUpRight size={18} strokeWidth={1.9} />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {transaction.description ||
                      transaction.category ||
                      "Transaction"}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {transaction.category || "General"} ·{" "}
                    {formatDate(transaction.date)}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      isIncome
                        ? "text-emerald-600"
                        : "text-slate-800"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatAmount(transaction.amount)}
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
