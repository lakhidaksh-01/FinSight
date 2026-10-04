import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, PiggyBank } from "lucide-react";
import CategoryChart from "../../components/analytics/CategoryChart";
import IncomeExpenseChart from "../../components/analytics/IncomeExpenseChart";
import SavingsChart from "../../components/analytics/SavingsChart";
import TrendChart from "../../components/analytics/TrendChart";
import ErrorState from "../../components/common/ErrorState";
import MetricCard from "../../components/common/MetricCard";
import PageHeader from "../../components/layout/PageHeader";
import { ANALYTICS_PERIODS } from "../../constants/app";
import { useAnalytics } from "../../hooks/useAnalytics";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Analytics() {
  const { months, setMonths, loading, error, refresh, summary, series, categoryBreakdown, comparison } = useAnalytics();
  const [period, setPeriod] = useState(String(months));
  const selectPeriod = (value) => { setPeriod(value); setMonths(Number(value)); };
  const savingsSeries = series.map((item) => ({ ...item, amount: item.savings }));

  return <div className="space-y-6">
    <PageHeader title="Analytics" eyebrow="Intelligence" description="Explore how your income, spending and savings move over time." action={<div role="group" aria-label="Analytics period" className="flex rounded-lg border border-white/10 bg-[#121a16] p-1">{ANALYTICS_PERIODS.map((item) => <button key={item.value} type="button" aria-pressed={period === String(item.value)} onClick={() => selectPeriod(String(item.value))} className={`rounded-md px-3 py-2 text-xs font-medium transition ${period === String(item.value) ? "bg-[#9bd3a9] text-[#132119]" : "text-[#aab6ad] hover:text-white"}`}>{item.label.replace("Last ", "")}</button>)}</div>} />
    {error && <ErrorState message={error} onRetry={refresh} />}
    {loading && <p className="text-sm text-[#91a097]">Calculating your financial trends…</p>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Income" value={formatCurrency(summary.totalIncome)} detail={`${comparison.incomeChange >= 0 ? "+" : ""}${comparison.incomeChange}% vs previous month`} icon={ArrowUpRight} tone="mint" /><MetricCard label="Expenses" value={formatCurrency(summary.totalExpenses)} detail={`${comparison.expenseChange >= 0 ? "+" : ""}${comparison.expenseChange}% vs previous month`} icon={ArrowDownRight} tone="amber" /><MetricCard label="Savings" value={formatCurrency(summary.savings)} detail={`${summary.savingsRate}% savings rate`} icon={PiggyBank} tone="blue" /><MetricCard label="Average monthly spending" value={formatCurrency(summary.averageMonthlyExpense)} detail={`Across ${months} months`} icon={ArrowDownRight} tone="rose" /></div>
    <TrendChart data={series} title="Financial trends" description="Monthly income, expenses and net savings." />
    <div className="grid gap-4 xl:grid-cols-2"><CategoryChart data={categoryBreakdown} /><IncomeExpenseChart data={series} title="Income and expenses" /><SavingsChart data={savingsSeries} /></div>
  </div>;
}