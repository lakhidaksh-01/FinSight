/*
 * useIncome
 * ---------
 * Income list state for the income page, its table, filters and summary cards.
 *
 *   const {
 *     incomes, filters, setFilter, loading, saving, error,
 *     createIncome, updateIncome, deleteIncome, summary,
 *   } = useIncome();
 *
 * The API names the money source "category" while every income component calls
 * it "source"; incomeService performs that rename, so this hook only ever
 * works with `source`.
 *
 * Same division of labour as useExpenses: the source and the date range go to
 * GET /api/income, text search and sorting stay local.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { incomeService } from "../services/incomeService";
import {
  groupByCategory,
  searchRecords,
  sortRecords,
  sumAmount,
  topCategory,
} from "../utils/calculations";
import { isSameMonth } from "../utils/formatDate";

const SEARCH_FIELDS = ["description", "source", "amount"];

const DEFAULT_FILTERS = {
  search: "",
  source: "all",
  sort: "newest",
  dateFrom: "",
  dateTo: "",
};

export function useIncome(initialFilters = {}) {
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

  const queryKey = JSON.stringify({
    source: filters.source,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });

  useEffect(() => {
    let active = true;
    const currentRequest = requestId.current + 1;

    requestId.current = currentRequest;
    setLoading(true);
    setError(null);

    incomeService
      .getIncomes(JSON.parse(queryKey))
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
          loadError?.message || "Unable to load your income right now."
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

  const incomes = useMemo(
    () =>
      sortRecords(
        searchRecords(records, filters.search, SEARCH_FIELDS),
        filters.sort
      ),
    [records, filters.search, filters.sort]
  );

  const summary = useMemo(() => {
    const total = sumAmount(incomes);
    const largest = incomes.reduce(
      (best, item) => (!best || Number(item.amount) > Number(best.amount) ? item : best),
      null
    );

    return {
      total,
      count: incomes.length,
      average: incomes.length ? total / incomes.length : 0,
      largest,
      thisMonth: sumAmount(
        records.filter((item) => isSameMonth(item.date || item.createdAt))
      ),
      sources: groupByCategory(incomes),
      topSource: topCategory(incomes),
    };
  }, [incomes, records]);

  const setFilter = useCallback((key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
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

  const createIncome = useCallback(
    (values) => mutate(() => incomeService.createIncome(values)),
    [mutate]
  );

  const updateIncome = useCallback(
    (id, values) => mutate(() => incomeService.updateIncome(id, values)),
    [mutate]
  );

  const deleteIncome = useCallback(
    async (id) => {
      setRecords((previous) => previous.filter((item) => item.id !== id));

      return mutate(() => incomeService.deleteIncome(id));
    },
    [mutate]
  );

  return {
    incomes,
    records,
    filters,
    setFilters,
    setFilter,
    resetFilters,
    loading,
    saving,
    error,
    refresh,
    createIncome,
    updateIncome,
    deleteIncome,
    summary,
  };
}

export default useIncome;