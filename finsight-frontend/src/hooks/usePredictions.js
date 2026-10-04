/*
 * usePredictions
 * --------------
 * The forecasting screen: history, the generated forecast and its saved
 * history.
 *
 *   const {
 *     historyMonths, setHistoryMonths, horizon, setHorizon,
 *     historicalSeries, forecast, chartSeries, confidence, trend,
 *     insufficientData, generating, saved, generate, history, loading, error,
 *   } = usePredictions();
 *
 * Where the number comes from
 *   The Python models under backend-v1/ml are not exposed by the API, so the
 *   forecast is a least-squares fit (linearForecast) over the user's own
 *   monthly totals. That keeps the prediction explainable and it works offline.
 *
 *   The result is then persisted through POST /api/predictions, one record per
 *   projected month, so the Predictions page can show a real history and the
 *   backend stays the record of what was predicted and when.
 *
 * Confidence is the R-squared of the fit mapped to a 45-96 band; with fewer
 * than MIN_MONTHS_FOR_FORECAST months of history the forecast is still shown
 * but flagged as not trustworthy.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_PREDICTION_MONTHS,
  MIN_MONTHS_FOR_FORECAST,
  PREDICTION_MODEL_LABEL,
} from "../constants/app";
import { expenseService } from "../services/expenseService";
import { incomeService } from "../services/incomeService";
import { PREDICTION_TYPES, predictionService } from "../services/predictionService";
import {
  buildForecastChartSeries,
  buildMonthlySeries,
  linearForecast,
} from "../utils/calculations";
import { toMonthKey } from "../utils/formatDate";

const DEFAULT_HISTORY_MONTHS = 6;
const HISTORY_CHOICES = [3, 6, 12];

/*
 * Labels for the months that follow today, aligned with the labels
 * buildMonthlySeries produces for the past.
 */
const futureMonths = (steps = 3) => {
  const now = new Date();

  return Array.from({ length: Math.max(1, steps) }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() + index + 1, 1);

    return {
      key: toMonthKey(date),
      label: new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "2-digit",
      }).format(date),
    };
  });
};

export function usePredictions(options = {}) {
  const [historyMonths, setHistoryMonths] = useState(
    Number(options.historyMonths) || DEFAULT_HISTORY_MONTHS
  );
  const [horizon, setHorizon] = useState(
    Number(options.horizon) || DEFAULT_PREDICTION_MONTHS
  );
  const [expenseRecords, setExpenseRecords] = useState([]);
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    Promise.all([
      expenseService.getExpenses({}),
      incomeService.getIncomes({}),
      predictionService
        .getPredictions({})
        /*
         * Prediction history is an extra: an empty or failing endpoint must not
         * stop the forecast from being calculated.
         */
        .catch(() => []),
      predictionService.getLatestPrediction().catch(() => null),
    ])
      .then(([expenses, incomes, predictions, latestPrediction]) => {
        if (!active) {
          return;
        }

        setExpenseRecords(expenses);
        setIncomeRecords(incomes);
        setHistory(predictions);
        setLatest(latestPrediction);
      })
      .catch((loadError) => {
        if (!active) {
          return;
        }

        setError(loadError?.message || "Unable to load your history right now.");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [version]);

  const refresh = useCallback(() => setVersion((value) => value + 1), []);

  const historicalSeries = useMemo(
    () => buildMonthlySeries(expenseRecords, historyMonths),
    [expenseRecords, historyMonths]
  );

  const fit = useMemo(
    () => linearForecast(historicalSeries.map((point) => point.amount), horizon),
    [historicalSeries, horizon]
  );

  const forecast = useMemo(() => {
    const months = futureMonths(horizon);

    return months.map((month, index) => ({
      ...month,
      amount: fit.values[index] || 0,
      confidence: fit.confidence,
      metadata: {
        trend: fit.trend,
        historyMonths,
        dataPoints: fit.dataPoints,
        model: PREDICTION_MODEL_LABEL,
      },
    }));
  }, [fit, horizon, historyMonths]);

  const chartSeries = useMemo(
    () => buildForecastChartSeries(historicalSeries, forecast),
    [historicalSeries, forecast]
  );

  const generate = useCallback(async () => {
    setGenerating(true);
    setError(null);

    try {
      const records = await predictionService.saveForecast(forecast, {
        predictionType: PREDICTION_TYPES.MONTHLY_SPENDING,
        model: PREDICTION_MODEL_LABEL,
      });

      setSaved(records);
      setHistory((previous) => [...records, ...previous]);
      setLatest(records[records.length - 1] || null);

      return records;
    } catch (saveError) {
      setError(saveError?.message || "Unable to save this forecast.");
      throw saveError;
    } finally {
      setGenerating(false);
    }
  }, [forecast]);

  const totalIncome = useMemo(
    () => buildMonthlySeries(incomeRecords, historyMonths).reduce((sum, item) => sum + item.amount, 0),
    [incomeRecords, historyMonths]
  );

  return {
    historyMonths,
    setHistoryMonths: (value) => setHistoryMonths(HISTORY_CHOICES.includes(Number(value)) ? Number(value) : DEFAULT_HISTORY_MONTHS),
    horizon,
    setHorizon: (value) => setHorizon(Math.max(1, Math.min(12, Number(value) || DEFAULT_PREDICTION_MONTHS))),
    historicalSeries,
    forecast,
    chartSeries,
    confidence: fit.confidence,
    trend: fit.trend,
    insufficientData: historyMonths < MIN_MONTHS_FOR_FORECAST || !fit.sufficientData,
    generating,
    saved,
    generate,
    history,
    latest,
    loading,
    error,
    refresh,
    totalIncome,
  };
}

export default usePredictions;