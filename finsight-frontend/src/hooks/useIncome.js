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
 * The API applies source, date range, search and sorting before pagination.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { incomeService } from "../services/incomeService";

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
  const [aggregateSummary, setAggregateSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(initialFilters.page || 1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);
  const requestId = useRef(0);

  const queryKey = JSON.stringify({
    source: filters.source,
    search: filters.search,
    sort: filters.sort,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    page,
    limit: 20,
  });

  useEffect(() => {
    let active = true;
    const currentRequest = requestId.current + 1;

    requestId.current = currentRequest;
    setLoading(true);
    setError(null);

    incomeService
      .getPaginatedIncomes(JSON.parse(queryKey))
      .then((result) => {
        if (!active || requestId.current !== currentRequest) {
          return;
        }

        setRecords(result.items);
        setPagination(result.pagination);
        setAggregateSummary(result.summary);
      })
      .catch((loadError) => {
        if (!active || requestId.current !== currentRequest) {
          return;
        }

        setRecords([]);
        setPagination(null);
        setAggregateSummary(null);
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

  useEffect(() => {
    setPage(1);
  }, [filters.source, filters.search, filters.dateFrom, filters.dateTo]);

  const incomes = records;
  const summary = aggregateSummary || {
    total: 0,
    count: 0,
    average: 0,
    largest: null,
    thisMonth: 0,
    categories: [],
    topCategory: null,
  };

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
    pagination,
    setPage,
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