import { ArrowDownRight, ArrowUpRight, PiggyBank, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import ErrorState from "../../components/common/ErrorState";
import MetricCard from "../../components/common/MetricCard";
import BudgetOverview from "../../components/dashboard/BudgetOverview";
import FinancialHealthCard from "../../components/dashboard/FinancialHealthCard";
import QuickActions from "../../components/dashboard/QuickActions";
import QuickInsights from "../../components/dashboard/QuickInsights";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import PageHeader from "../../components/layout/PageHeader";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatCurrency";
import { buildTransactionFeed } from "../../utils/calculations";

export default function Dashboard() {
  const { user } = useAuth();
  const { loading, error, refresh, summary, series, budgets, quickInsights, health, expenses, incomes } = useAnalytics();
  const transactions = buildTransactionFeed(expenses, incomes, 6);
  const periodLabel = series.length ? `${series[0].label} – ${series[series.length - 1].label}` : "Last 6 months";

  return <div className="space-y-6">
    <PageHeader eyebrow="Your finances" title={`Financial overview${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`} description={`A current view of your money · ${periodLabel}`} />
    {error && <ErrorState message={error} onRetry={refresh} />}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Income" value={formatCurrency(summary.totalIncome)} detail="Selected period" icon={ArrowUpRight} tone="mint" />
      <MetricCard label="Expenses" value={formatCurrency(summary.totalExpenses)} detail="Selected period" icon={ArrowDownRight} tone="amber" />
      <MetricCard label="Net savings" value={formatCurrency(summary.savings)} detail={`${summary.savingsRate}% savings rate`} icon={PiggyBank} tone={summary.savings >= 0 ? "blue" : "rose"} />
      <MetricCard label="Transactions" value={summary.transactionCount.toLocaleString()} detail="Income and expenses" icon={ReceiptText} tone="rose" />
    </div>
    {loading && <p className="text-sm text-[#91a097]">Refreshing your financial overview…</p>}
    <div className="grid gap-4 xl:grid-cols-[1.55fr_0.85fr]">
      <section className="rounded-xl border border-white/[0.08] bg-[#121a16] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-white">Monthly cash flow</p><p className="mt-1 text-xs text-[#91a097]">Income compared with expenses</p></div><Link to="/app/analytics" className="text-xs font-medium text-[#a5d9ad] hover:text-white">View analytics</Link></div>
        <div className="mt-6 space-y-4">{series.map((point) => {
          const max = Math.max(...series.map((item) => Math.max(item.income, item.expenses)), 1);
          return <div key={point.key} className="grid grid-cols-[46px_1fr_86px] items-center gap-3 text-xs"><span className="text-[#91a097]">{point.label}</span><div className="space-y-1.5"><div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#83bd91]" style={{ width: `${(point.income / max) * 100}%` }} /></div><div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#c59e69]" style={{ width: `${(point.expenses / max) * 100}%` }} /></div></div><span className="text-right text-[#a9b4ac]">{formatCurrency(point.savings, undefined, { compact: true })}</span></div>;
        })}</div>
        <div className="mt-5 flex gap-4 border-t border-white/[0.07] pt-4 text-[11px] text-[#91a097]"><span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#83bd91]" />Income</span><span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#c59e69]" />Expenses</span><span className="ml-auto">Right column: monthly savings</span></div>
      </section>
      <FinancialHealthCard score={health.score} label={health.label} description={health.description} />
    </div>
    <div className="grid gap-4 xl:grid-cols-2"><BudgetOverview budgets={budgets} /><QuickInsights insights={quickInsights} /></div>
    <QuickActions />
    <RecentTransactions transactions={transactions} />
  </div>;
}