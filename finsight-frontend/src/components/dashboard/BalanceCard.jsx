import { ArrowUpRight, Wallet } from "lucide-react";

/*
 * BalanceCard
 * -----------
 * Main balance card displayed prominently
 * on the FinSight dashboard.
 *
 * Shows:
 * - Current balance
 * - Income
 * - Expenses
 *
 * The blue/purple gradient gives this card
 * more visual importance than normal cards.
 */
function BalanceCard({
  balance = 0,
  income = 0,
  expenses = 0,
  currency = "₹",
}) {
  const formatAmount = (amount) => {
    return `${currency}${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-purple-600 p-6 text-white shadow-xl shadow-blue-600/20 sm:p-7">
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Wallet size={18} strokeWidth={1.9} />
              </div>

              <span className="text-sm font-medium text-white/75">
                Available Balance
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {formatAmount(balance)}
            </h2>
          </div>

          <div className="hidden rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm sm:flex sm:items-center sm:gap-1.5">
            <ArrowUpRight size={15} />
            <span className="text-xs font-semibold">Overview</span>
          </div>
        </div>

        {/* Income / Expenses */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
          <div>
            <p className="text-xs font-medium text-white/60">
              Total Income
            </p>

            <p className="mt-1.5 text-base font-semibold sm:text-lg">
              {formatAmount(income)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-white/60">
              Total Expenses
            </p>

            <p className="mt-1.5 text-base font-semibold sm:text-lg">
              {formatAmount(expenses)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BalanceCard;
