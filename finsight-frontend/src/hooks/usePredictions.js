/*
 * usePredictions
 * --------------
 * The forecasting screen: history, the generated forecast and its saved
 * history.
 *
 *   const {
 *     historyMonths, setHistoryMonths, horizon, setHorizon,
 *     historicalSeries, forecast, chartSeries, fitScore, trend,
 *     insufficientData, generating, saved, generate, history, loading, error,
 *   } = usePredictions();
 *
 * Where the number comes from
 *   The Python forecasting and anomaly pipeline is invoked by the Express API.
 *   It receives monthly totals derived from the user's expense records, and
 *   persists the generated forecast points in MongoDB.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_PREDICTION_MONTHS,
  MIN_MONTHS_FOR_FORECAST,
} from "../constants/app";
import { expenseService } from "../services/expenseService";
import { incomeService } from "../services/incomeService";
import { predictionService } from "../services/predictionService";
import {
  buildForecastChartSeries,
  buildMonthlySeries,
} from "../utils/calculations";
import { restoreLatestForecastRun } from "../utils/predictions";

const DEFAULT_HISTORY_MONTHS = 6;
const HISTORY_CHOICES = [3, 6, 12];

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
  const [serverForecast, setServerForecast] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [anomalyCount, setAnomalyCount] = useState(0);
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
      predictionService.getPredictions({ type: "expense_forecast" }),
    ])
      .then(([expenses, incomes, predictions]) => {
        if (!active) {
          return;
        }

        const { latest: latestPrediction, run: latestRun } =
          restoreLatestForecastRun(predictions);

        setExpenseRecords(expenses);
        setIncomeRecords(incomes);
        setHistory(predictions);
        setLatest(latestPrediction);
        setServerForecast(latestRun);
        const savedAnomalies = Array.isArray(
          latestPrediction?.metadata?.anomalies
        )
          ? latestPrediction.metadata.anomalies
          : [];
        setAnomalies(savedAnomalies);
        setAnomalyCount(savedAnomalies.length);
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

  const forecast = useMemo(
    () => serverForecast.map((record) => ({
      key: record.period,
      label: record.period,
      amount: record.predictedAmount,
      metadata: record.metadata || {},
    })),
    [serverForecast]
  );

  const chartSeries = useMemo(
    () => buildForecastChartSeries(historicalSeries, forecast),
    [historicalSeries, forecast]
  );

  const generate = useCallback(async () => {
    setGenerating(true);
    setError(null);

    try {
      const result = await predictionService.generateForecast({
        historyMonths,
        horizon,
      });

      const records = result.forecasts;
      setServerForecast(records);
      setAnomalies(result.anomalies);
      setAnomalyCount(result.anomalies.length);
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
  }, [historyMonths, horizon]);

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
    fitScore: serverForecast[0]?.metadata?.fitScore ?? null,
    fitScoreMethod: serverForecast[0]?.metadata?.fitScoreMethod ?? null,
    evaluation: serverForecast[0]?.metadata?.evaluation ?? null,
    anomalyModel: serverForecast[0]?.metadata?.anomalyModel ?? null,
    anomalyGranularity:
      serverForecast[0]?.metadata?.anomalyGranularity ?? null,
    anomalyMinimumMonths:
      serverForecast[0]?.metadata?.anomalyMinimumMonths ?? null,
    trend: serverForecast[0]?.metadata?.trend || "stable",
    insufficientData:
      historicalSeries.filter((point) => point.amount > 0).length <
      MIN_MONTHS_FOR_FORECAST,
    generating,
    saved,
    generate,
    history,
    latest,
    loading,
    error,
    refresh,
    anomalies,
    anomalyCount,
    totalIncome,
  };
}

export default usePredictions;