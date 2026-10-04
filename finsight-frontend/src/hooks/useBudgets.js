/*
 * useBudgets
 * ----------
 * Budget list plus the utilisation numbers every budget card and the budget
 * summary cards display.
 *
 *   const {
 *     budgets, summary, loading, saving, error,
 *     createBudget, updateBudget, deleteBudget, setPeriod,
 *   } = useBudgets();
 *
 * Why expenses are loaded here too
 *   The Budget document stores { category, amount, month, year } and no usage
 *   value, so "spent" has to be measured from the expense records that fall in
 *   the same category and month. utils/calculations.js -> withBudgetProgress()
 *   performs that join, which is why this hook fetches both resources in one
 *   pass instead of relying on a field the API never sends.
 *
 * `period` filters map onto GET /api/budgets?month=&year=; leaving both empty
 * returns every budget the user has ever created.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BUDGET_THRESHOLDS } from "../constants/app";
import { budgetService } from "../services/budgetService";
import { expenseService } from "../services/expenseService";
import { sumAmount, withBudgetProgress } from "../utils/calculations";

export function useBudgets(initialPeriod = {}) {
  const [period, setPeriodState] = useState({
    month: initialPeriod.month ?? "",
    year: initialPeriod.year ?? "",
  });
  const [records, setRecords] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);
  const requestId = useRef(0);

  const queryKey = JSON.stringify(period);

  useEffect(() => {
    let active = true;
    const currentRequest = requestId.current + 1;

    requestId.current = currentRequest;
    setLoading(true);
    setError(null);

    const filters = JSON.parse(queryKey);

    Promise.all([
      budgetService.getBudgets(filters),
      expenseService.getExpenses({}),
    ])
      .then(([budgets, expenseRecords]) => {
        if (!active || requestId.current !== currentRequest) {
          return;
        }

        setRecords(budgets);
        setExpenses(expenseRecords);
      })
      .catch((loadError) => {
        if (!active || requestId.current !== currentRequest) {
          return;
        }

        setRecords([]);
        setExpenses([]);
        setError(loadError?.message || "Unable to load your budgets right now.");
      })
      .finally(() => {
        if (active && requestId.current === currentRequest) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [queryKey, version]);

  /*
   * Each budget gains spent, remaining, percentage, isWarning and
   * isOverBudget, which is exactly the shape BudgetCard expects.
   */
  const budgets = useMemo(
    () => withBudgetProgress(records, expenses),
    [records, expenses]
  );

  const summary = useMemo(() => {
    const totalBudgeted = sumAmount(budgets.map((item) => ({ amount: item.amount })));
    const totalSpent = sumAmount(budgets.map((item) => ({ amount: item.spent })));

    const warnings = budgets.filter(
      (item) =>
        item.percentage >= BUDGET_THRESHOLDS.WARNING &&
        item.percentage <= BUDGET_THRESHOLDS.EXCEEDED
    );
    const exceeded = budgets.filter(
      (item) => item.percentage > BUDGET_THRESHOLDS.EXCEEDED
    );

    return {
      totalBudgeted,
      totalSpent,
      totalRemaining: Math.max(totalBudgeted - totalSpent, 0),
      utilization:
        totalBudgeted > 0
          ? Number(((totalSpent / totalBudgeted) * 100).toFixed(1))
          : 0,
      count: budgets.length,
      warnings,
      exceeded,
      healthy: budgets.filter(
        (item) => item.percentage < BUDGET_THRESHOLDS.WARNING
      ),
    };
  }, [budgets]);

  const setPeriod = useCallback((key, value) => {
    setPeriodState((previous) => ({ ...previous, [key]: value }));
  }, []);

  const refresh = useCallback(() => {
    setVersion((previous) => previous + 1);
  }, []);

  const mutate = useCallback(async (action) => {
    setSaving(true);
    setError(null);

    try {
      const result = await action();

      setVersion((previous) => previous + 1);

      return result;
    } catch (mutationError) {
      setError(mutationError?.message || "Your change could not be saved.");

      throw mutationError;
    } finally {
      setSaving(false);
    }
  }, []);

  const createBudget = useCallback(
    (values) => mutate(() => budgetService.createBudget(values)),
    [mutate]
  );

  const updateBudget = useCallback(
    (id, values) => mutate(() => budgetService.updateBudget(id, values)),
    [mutate]
  );

  const deleteBudget = useCallback(
    async (id) => {
      setRecords((previous) => previous.filter((item) => item.id !== id));

      return mutate(() => budgetService.deleteBudget(id));
    },
    [mutate]
  );

  return {
    budgets,
    records,
    expenses,
    period,
    setPeriod,
    loading,
    saving,
    error,
    refresh,
    createBudget,
    updateBudget,
    deleteBudget,
    summary,
  };
}

export default useBudgets;