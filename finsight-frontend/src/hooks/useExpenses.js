/*
 * useExpenses
 * -----------
 * Expense list state for the expenses page, the expense table, the summary
 * cards and the recent-transaction widgets.
 *
 *   const {
 *     expenses, filters, setFilter, loading, saving, error,
 *     createExpense, updateExpense, deleteExpense, summary,
 *   } = useExpenses();
 *
 * Division of labour
 *   - category and the date range are sent to GET /api/expenses, because the
 *     API filters on them
 *   - text search and sorting are applied locally, because the API has no
 *     search or order parameter, and applying them locally keeps typing
 *     instant instead of firing a request per keystroke
 *   - every mutation refreshes the list, so the numbers shown on screen always
 *     come back from the server
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { expenseService } from "../services/expenseService";
import {
  groupByCategory,
  searchRecords,
  sortRecords,
  sumAmount,
  topCategory,
} from "../utils/calculations";
import { isSameMonth } from "../utils/formatDate";

const SEARCH_FIELDS = ["description", "category", "notes", "amount"];

const DEFAULT_FILTERS = {
  search: "",
  category: "all",
  sort: "newest",
  dateFrom: "",
  dateTo: "",
};

export function useExpenses(initialFilters = {}) {
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);
  const requestId = useRef(0);

  /*
   * Only server-side filters re-request; search and sort stay client side.
   */
  const queryKey = JSON.stringify({
    category: filters.category,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });

  useEffect(() => {
    let active = true;
    const currentRequest = requestId.current + 1;

    requestId.current = currentRequest;
    setLoading(true);
    setError(null);

    expenseService
      .getExpenses(JSON.parse(queryKey))
      .then((data) => {
        if (!active || requestId.current !== currentRequest) {
          return;
        }

        setRecords(data);
      })
      .catch((loadError) => {
        if (!active || requestId.current !== currentRequest) {
          return;
        }

        setRecords([]);
        setError(
          loadError?.message || "Unable to load your expenses right now."
        );
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

  const expenses = useMemo(
    () =>
      sortRecords(
        searchRecords(records, filters.search, SEARCH_FIELDS),
        filters.sort
      ),
    [records, filters.search, filters.sort]
  );

  const summary = useMemo(() => {
    const total = sumAmount(expenses);
    const largest = expenses.reduce(
      (best, item) => (!best || Number(item.amount) > Number(best.amount) ? item : best),
      null
    );

    return {
      total,
      count: expenses.length,
      average: expenses.length ? total / expenses.length : 0,
      largest,
      thisMonth: sumAmount(
        records.filter((item) => isSameMonth(item.date || item.createdAt))
      ),
      categories: groupByCategory(expenses),
      topCategory: topCategory(expenses),
    };
  }, [expenses, records]);

  const setFilter = useCallback((key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  const refresh = useCallback(() => {
    setVersion((previous) => previous + 1);
  }, []);

  const mutate = useCallback(
    async (action) => {
      setSaving(true);
      setError(null);

      try {
        const result = await action();

        setVersion((previous) => previous + 1);

        return result;
      } catch (mutationError) {
        setError(
          mutationError?.message || "Your change could not be saved."
        );

        throw mutationError;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const createExpense = useCallback(
    (values) => mutate(() => expenseService.createExpense(values)),
    [mutate]
  );

  const updateExpense = useCallback(
    (id, values) => mutate(() => expenseService.updateExpense(id, values)),
    [mutate]
  );

  /*
   * Removes the row instantly so the table feels responsive even though the
   * list is re-fetched afterwards.
   */
  const deleteExpense = useCallback(
    async (id) => {
      setRecords((previous) => previous.filter((item) => item.id !== id));

      return mutate(() => expenseService.deleteExpense(id));
    },
    [mutate]
  );

  const deleteAllExpenses = useCallback(async () => {
    setRecords([]);

    return mutate(() => expenseService.deleteAllExpenses());
  }, [mutate]);

  return {
    expenses,
    records,
    filters,
    setFilters,
    setFilter,
    resetFilters,
    loading,
    saving,
    error,
    refresh,
    createExpense,
    updateExpense,
    deleteExpense,
    deleteAllExpenses,
    summary,
  };
}

export default useExpenses;