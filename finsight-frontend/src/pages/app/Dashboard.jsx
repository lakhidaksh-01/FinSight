import { ArrowDownRight, ArrowUpRight, PiggyBank, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import ErrorState from "../../components/common/ErrorState";
import MetricCard from "../../components/common/MetricCard";
import BalanceCard from "../../components/dashboard/BalanceCard";
import BudgetOverview from "../../components/dashboard/BudgetOverview";
import FinancialHealthCard from "../../components/dashboard/FinancialHealthCard";
import QuickActions from "../../components/dashboard/QuickActions";
import QuickInsights from "../../components/dashboard/QuickInsights";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import SavingsOverview from "../../components/dashboard/SavingsOverview";
import PageHeader from "../../components/layout/PageHeader";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatCurrency";
import { buildTransactionFeed } from "../../utils/calculations";
import { motion } from "motion/react";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    loading,
    error,
    refresh,
    summary,
    series,
    budgets,
    quickInsights,
    health,
    expenses,
    incomes,
  } = useAnalytics();
  const transactions = buildTransactionFeed(expenses, incomes, 6);
  const periodLabel = series.length ? `${series[0].label} – ${series[series.length - 1].label}` : "Last 6 months";

  const metricCards = [
    {
      label: "Income",
      value: formatCurrency(summary.totalIncome),
      detail: "Selected period",
      icon: ArrowUpRight,
      tone: "success",
    },
    {
      label: "Expenses",
      value: formatCurrency(summary.totalExpenses),
      detail: "Selected period",
      icon: ArrowDownRight,
      tone: "danger",
    },
    {
      label: "Net savings",
      value: formatCurrency(summary.savings),
      detail: `${summary.savingsRate}% savings rate`,
      icon: PiggyBank,
      tone: summary.savings >= 0 ? "info" : "danger",
    },
    {
      label: "Transactions",
      value: summary.transactionCount.toLocaleString(),
      detail: "Income and expenses",
      icon: ReceiptText,
      tone: "primary",
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <PageHeader
        eyebrow="Your finances"
        title={`Financial overview${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description={`A current view of your money · ${periodLabel}`}
      />
      {error && <ErrorState message={error} onRetry={refresh} />}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metricCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <MetricCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      <BalanceCard
        balance={summary.totalIncome - summary.totalExpenses}
        income={summary.totalIncome}
        expenses={summary.totalExpenses}
      />

      {loading && (
        <p className="text-sm text-[var(--text-muted)]">Refreshing your financial overview…</p>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <section className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Monthly cash flow</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Income compared with expenses</p>
            </div>
            <Link
              to="/app/analytics"
              className="text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
            >
              View analytics
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {series.map((point) => {
              const max =
                Math.max(
                  ...series.map((item) => Math.max(item.income, item.expenses)),
                  1,
                ) || 1;
              return (
                <div
                  key={point.key}
                  className="grid grid-cols-[48px_1fr_92px] items-center gap-3 text-xs"
                >
                  <span className="text-[var(--text-muted)]">{point.label}</span>
                  <div className="space-y-1.5">
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--border-subtle)]">
                      <div
                        className="h-full rounded-full bg-[var(--success)]"
                        style={{ width: `${(point.income / max) * 100}%` }}
                      />
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--border-subtle)]">
                      <div
                        className="h-full rounded-full bg-[var(--warning)]"
                        style={{ width: `${(point.expenses / max) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-right font-semibold text-[var(--text-primary)] numeric">
                    {formatCurrency(point.savings, undefined, { compact: true })}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-[var(--border-subtle)] pt-4 text-[11px] text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
              Income
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--warning)]" />
              Expenses
            </span>
          </div>
        </section>

        <FinancialHealthCard
          score={health.score}
          label={health.label}
          description={health.description}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <BudgetOverview budgets={budgets} />
        <QuickInsights insights={quickInsights} />
      </div>

      <SavingsOverview
        totalSavings={summary.totalIncome - summary.totalExpenses}
        savingsRate={summary.savingsRate}
      />

      <QuickActions />
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
