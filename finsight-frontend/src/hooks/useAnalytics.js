/*
 * useAnalytics
 * ------------
 * Everything the analytics and AI-insight screens render, from a single load.
 *
 *   const {
 *     summary, series, categoryBreakdown, comparison, health,
 *     insights, anomalies, risk, months, setMonths, loading, error,
 *   } = useAnalytics();
 *
 * Why the records are loaded once and cut locally
 *   GET /api/analytics only answers with totals for a date range: it has no
 *   per-month series, no previous-period comparison and no anomaly detection.
 *   Rather than firing one request per chart, this hook pulls the raw expense,
 *   income, budget and goal records a single time and derives every shape with
 *   utils/calculations.js and utils/insights.js. Changing the period therefore
 *   re-computes instantly instead of hitting the API again.
 *
 * The API totals are still fetched and used as the source of truth for the
 * headline numbers, so what the server reports and what the charts add up to
 * stay comparable.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_ANALYTICS_MONTHS } from "../constants/app";
import { analyticsService } from "../services/analyticsService";
import { budgetService } from "../services/budgetService";
import { expenseService } from "../services/expenseService";
import { goalService } from "../services/goalService";
import { incomeService } from "../services/incomeService";
import {
  buildCombinedSeries,
  calculateFinancialHealth,
  filterByRange,
  getRollingRange,
  groupByCategory,
  percentChange,
  savingsRateOf,
  sumAmount,
  withBudgetProgress,
} from "../utils/calculations";
import {
  assessFinancialRisk,
  buildInsights,
  detectExpenseAnomalies,
  getQuickInsights,
  summarizeInsights,
} from "../utils/insights";

const previousMonthReference = () => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth() - 1, 15);
};

export function useAnalytics({ months: initialMonths } = {}) {
  const [months, setMonths] = useState(
    Number(initialMonths) || DEFAULT_ANALYTICS_MONTHS
  );
  const [data, setData] = useState({
    expenses: [],
    incomes: [],
    budgets: [],
    goals: [],
    apiSummary: null,
    apiSpending: null,
    apiSavings: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    const requestRange = getRollingRange(months);
    const requestFilters = {
      startDate: requestRange.startDate.toISOString(),
      endDate: requestRange.endDate.toISOString(),
    };

    Promise.all([
      expenseService.getExpenses({}),
      incomeService.getIncomes({}),
      budgetService.getBudgets({}),
      goalService.getGoals(),
      analyticsService
        .getDashboard(requestFilters)
        /*
         * The dashboard endpoint is a convenience: if it fails the numbers are
         * still computed locally, so it must not break the page.
         */
        .catch(() => null),
      analyticsService.getSpending(requestFilters).catch(() => null),
      analyticsService.getSavings(requestFilters).catch(() => null),
    ])
      .then(([expenses, incomes, budgets, goals, apiSummary, apiSpending, apiSavings]) => {
        if (!active) {
          return;
        }

        setData({ expenses, incomes, budgets, goals, apiSummary, apiSpending, apiSavings });
      })
      .catch((loadError) => {
        if (!active) {
          return;
        }

        setError(loadError?.message || "Unable to load your analytics right now.");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [months, version]);

  const refresh = useCallback(() => setVersion((value) => value + 1), []);

  const range = useMemo(() => getRollingRange(months), [months]);

  const expenses = useMemo(
    () => filterByRange(data.expenses, range.startDate, range.endDate),
    [data.expenses, range]
  );

  const incomes = useMemo(
    () => filterByRange(data.incomes, range.startDate, range.endDate),
    [data.incomes, range]
  );

  const budgets = useMemo(
    () => withBudgetProgress(data.budgets, data.expenses),
    [data.budgets, data.expenses]
  );

  const totalExpenses = useMemo(() => sumAmount(expenses), [expenses]);
  const totalIncome = useMemo(() => sumAmount(incomes), [incomes]);
  /*
   * One row per month with income, expenses and savings: TrendChart,
   * IncomeExpenseChart and SavingsChart all consume this.
   */
  const series = useMemo(
    () => buildCombinedSeries(expenses, incomes, months),
    [expenses, incomes, months]
  );

  const categoryBreakdown = useMemo(() => {
    const groups = groupByCategory(expenses);

    return groups.map((group) => ({
      ...group,
      percentage:
        totalExpenses > 0
          ? Number(((group.amount / totalExpenses) * 100).toFixed(1))
          : 0,
    }));
  }, [expenses, totalExpenses]);

  /*
   * Month-over-month movement, the basis of both the comparison cards and the
   * "spending is climbing" insight.
   */
  const currentRange = useMemo(() => getRollingRange(1), []);
  const previousRange = useMemo(() => getRollingRange(1, previousMonthReference()), []);

  const currentMonthExpenses = useMemo(
    () => filterByRange(data.expenses, currentRange.startDate, currentRange.endDate),
    [data.expenses, currentRange]
  );
  const previousMonthExpenses = useMemo(
    () => filterByRange(data.expenses, previousRange.startDate, previousRange.endDate),
    [data.expenses, previousRange]
  );
  const currentMonthIncomes = useMemo(
    () => filterByRange(data.incomes, currentRange.startDate, currentRange.endDate),
    [data.incomes, currentRange]
  );

  const comparison = useMemo(() => {
    const currentExpenseTotal = sumAmount(currentMonthExpenses);
    const previousExpenseTotal = sumAmount(previousMonthExpenses);
    const currentIncomeTotal = sumAmount(currentMonthIncomes);

    return {
      currentExpenseTotal,
      previousExpenseTotal,
      currentIncomeTotal,
      expenseChange: percentChange(currentExpenseTotal, previousExpenseTotal),
      incomeChange: percentChange(
        currentIncomeTotal,
        sumAmount(filterByRange(data.incomes, previousRange.startDate, previousRange.endDate))
      ),
      monthLabel: series[series.length - 1]?.label || "",
      previousMonthLabel: series[series.length - 2]?.label || "",
    };
  }, [
    currentMonthExpenses,
    previousMonthExpenses,
    currentMonthIncomes,
    data.incomes,
    previousRange,
    series,
  ]);

  const summary = useMemo(() => {
    const savings = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      savings,
      savingsRate: savingsRateOf(totalIncome, totalExpenses),
      averageMonthlyExpense:
        months > 0 ? Number((totalExpenses / months).toFixed(2)) : totalExpenses,
      averageMonthlyIncome:
        months > 0 ? Number((totalIncome / months).toFixed(2)) : totalIncome,
      largestCategory: categoryBreakdown[0] || null,
      transactionCount: expenses.length + incomes.length,
      /*
       * The totals reported by GET /api/analytics for the same window, kept
       * alongside so a mismatch is visible instead of silent.
       */
      apiSummary: data.apiSummary,
      apiSpending: data.apiSpending,
      apiSavings: data.apiSavings,
    };
  }, [
    totalIncome,
    totalExpenses,
    months,
    categoryBreakdown,
    expenses.length,
    incomes.length,
    data.apiSummary,
    data.apiSpending,
    data.apiSavings,
  ]);

  const anomalies = useMemo(
    () => detectExpenseAnomalies(expenses, incomes),
    [expenses, incomes]
  );

  const risk = useMemo(
    () =>
      assessFinancialRisk({
        income: totalIncome,
        expenses: totalExpenses,
        budgets,
      }),
    [totalIncome, totalExpenses, budgets]
  );

  const health = useMemo(
    () =>
      calculateFinancialHealth({
        income: totalIncome,
        expenses: totalExpenses,
        budgets,
        goals: data.goals,
        transactionCount: summary.transactionCount,
      }),
    [totalIncome, totalExpenses, budgets, data.goals, summary.transactionCount]
  );

  const insights = useMemo(
    () =>
      buildInsights({
        expenses,
        incomes,
        budgets,
        goals: data.goals,
        anomalies,
        risk,
        analytics: { totalIncome, totalExpenses },
        currentMonthExpenses,
        previousMonthExpenses,
        currentMonthIncomes,
      }),
    [
      expenses,
      incomes,
      budgets,
      data.goals,
      anomalies,
      risk,
      totalIncome,
      totalExpenses,
      currentMonthExpenses,
      previousMonthExpenses,
      currentMonthIncomes,
    ]
  );

  return {
    months,
    setMonths,
    range,
    loading,
    error,
    refresh,
    records: data,
    expenses,
    incomes,
    budgets,
    goals: data.goals,
    series,
    categoryBreakdown,
    comparison,
    summary,
    anomalies,
    risk,
    health,
    insights,
    quickInsights: getQuickInsights(insights, 4),
    insightSummary: summarizeInsights(insights, anomalies, risk),
  };
}

export default useAnalytics;