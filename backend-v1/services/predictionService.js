import Prediction from "../models/Prediction.js";
import ApiError from "../utils/apiError.js";
import Expense from "../models/Expense.js";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPagination, buildPaginatedResult } from "../utils/pagination.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let activePythonRuns = 0;
const pythonQueue = [];
const MAX_PYTHON_RUNS = 2;

const runNextPythonJob = () => {
  if (activePythonRuns >= MAX_PYTHON_RUNS) {
    return;
  }

  const next = pythonQueue.shift();
  if (!next) {
    return;
  }

  activePythonRuns += 1;

  try {
    Promise.resolve(next.action())
      .then(next.resolve, next.reject)
      .finally(() => {
        activePythonRuns -= 1;
        runNextPythonJob();
      });
  } catch (error) {
    activePythonRuns -= 1;
    next.reject(error);
    runNextPythonJob();
  }
};

const withPythonCapacity = (action) => {
  if (activePythonRuns < MAX_PYTHON_RUNS) {
    activePythonRuns += 1;
    return Promise.resolve(action()).finally(() => {
      activePythonRuns -= 1;
      runNextPythonJob();
    });
  }

  return new Promise((resolve, reject) => {
    pythonQueue.push({ action, resolve, reject });
  });
};

const buildMonthlyExpenseData = (expenses, months, now = new Date()) => {
  const totals = new Map();

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    totals.set(key, (totals.get(key) || 0) + Number(expense.amount || 0));
  });

  const data = [];

  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    data.push({
      date: `${key}-01`,
      amount: Number((totals.get(key) || 0).toFixed(2)),
      category: "Expense"
    });
  }

  return data;
};

const isNonNegativeNumber = (value) =>
  Number.isFinite(value) && value >= 0;

const isValidPythonResult = (result, horizon) => {
  const predictions = result?.prediction?.linearRegression;
  const anomalies = result?.anomalies;
  const evaluation = result?.evaluation;

  return (
    result?.success === true &&
    Array.isArray(predictions) &&
    predictions.length === horizon &&
    predictions.every(isNonNegativeNumber) &&
    isNonNegativeNumber(result.prediction.baseline) &&
    isNonNegativeNumber(result.prediction.movingAverage) &&
    Number.isInteger(result.dataPoints) &&
    result.dataPoints > 0 &&
    ["up", "down", "stable"].includes(result.trend) &&
    (result.fitScore === null ||
      (isNonNegativeNumber(result.fitScore) && result.fitScore <= 100)) &&
    typeof result.fitScoreMethod === "string" &&
    result.fitScoreMethod.length > 0 &&
    result.models?.forecast === "scikit-learn LinearRegression" &&
    result.models?.anomaly === "scikit-learn IsolationForest" &&
    anomalies?.method === "isolation_forest" &&
    anomalies?.granularity === "positive_monthly_expense_totals" &&
    anomalies.minimumActiveMonths === 5 &&
    Number.isInteger(anomalies.count) &&
    Array.isArray(anomalies.records) &&
    anomalies.count === anomalies.records.length &&
    anomalies.records.every((record) =>
      typeof record?.date === "string" &&
      Number.isFinite(Date.parse(record.date)) &&
      isNonNegativeNumber(record.amount) &&
      typeof record.category === "string"
    ) &&
    Number.isInteger(evaluation?.samples) &&
    evaluation.samples >= 0 &&
    evaluation.method === "rolling_origin_one_step" &&
    (evaluation.mae === null || isNonNegativeNumber(evaluation.mae)) &&
    (evaluation.rmse === null || isNonNegativeNumber(evaluation.rmse))
  );
};

const runPythonPrediction = async (data, horizon) => {
  const python = process.env.PYTHON_PATH || "python";
  const scriptPath = path.resolve(__dirname, "../ml/predict.py");

  return await withPythonCapacity(() => new Promise((resolve, reject) => {
    const child = spawn(python, [scriptPath], {
      cwd: path.resolve(__dirname, "../ml"),
      env: process.env,
      windowsHide: true
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        child.kill();
        reject(new ApiError(503, "The forecasting service timed out"));
      }
    }, 30000);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      if (!settled) {
        settled = true;
        reject(new ApiError(503, "The forecasting service is unavailable"));
      }
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (settled) {
        return;
      }
      settled = true;

      if (code !== 0) {
        reject(new ApiError(503, "The forecasting service is unavailable"));
        return;
      }

      try {
        const response = JSON.parse(stdout.trim());

        if (!response.success) {
          reject(new ApiError(
            422,
            response.message || "Not enough financial data"
          ));
          return;
        }

        if (!isValidPythonResult(response, horizon)) {
          reject(new ApiError(
            503,
            "The forecasting service returned incomplete or invalid model results"
          ));
          return;
        }

        resolve(response);
      } catch (error) {
        reject(new ApiError(
          503,
          "The forecasting service returned an invalid response"
        ));
      }
    });

    child.stdin.end(JSON.stringify({ data, horizon }));
  }));
};

// Create prediction
export const createPrediction = async (
  userId,
  data
) => {
  const allowedFields = [
    "predictionType",
    "predictedAmount",
    "period",
    "confidence",
    "model",
    "metadata"
  ];
  const predictionData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      predictionData[field] = data[field];
    }
  });

  const prediction = await Prediction.create({
    ...predictionData,
    user: userId
  });

  return prediction;
};

export const generatePredictions = async (
  userId,
  { historyMonths = 6, horizon = 3 } = {}
) => {
  const normalizedHistoryMonths = Math.max(3, Math.min(12, Number(historyMonths) || 6));
  const normalizedHorizon = Math.max(1, Math.min(12, Number(horizon) || 3));
  const now = new Date();
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth() - (normalizedHistoryMonths - 1),
    1
  );
  startDate.setHours(0, 0, 0, 0);

  const expenses = await Expense.find({
    user: userId,
    date: { $gte: startDate }
  }).select("date amount").lean();

  const monthlyData = buildMonthlyExpenseData(
    expenses,
    normalizedHistoryMonths,
    now
  );
  const populatedMonths = monthlyData.filter((item) => item.amount > 0).length;

  if (populatedMonths < 3) {
    throw new ApiError(
      422,
      "Add at least three months of expense history before generating a forecast"
    );
  }

  const result = await runPythonPrediction(monthlyData, normalizedHorizon);

  const forecastValues = result.prediction.linearRegression;
  const runId = randomUUID();
  const created = [];

  for (let index = 0; index < forecastValues.length; index += 1) {
    const periodDate = new Date(now.getFullYear(), now.getMonth() + index + 1, 1);
    const period = new Intl.DateTimeFormat("en-GB", {
      month: "short",
      year: "2-digit"
    }).format(periodDate);

    created.push(await createPrediction(userId, {
      predictionType: "expense_forecast",
      predictedAmount: forecastValues[index],
      period,
      model: result.models.forecast,
      metadata: {
        runId,
        anomalyMethod: result.anomalies.method,
        anomalyModel: result.models.anomaly,
        anomalyGranularity: result.anomalies.granularity,
        anomalyMinimumMonths: result.anomalies.minimumActiveMonths,
        baseline: result.prediction.baseline,
        movingAverage: result.prediction.movingAverage,
        trend: result.trend,
        fitScore: result.fitScore,
        fitScoreMethod: result.fitScoreMethod,
        historyMonths: normalizedHistoryMonths,
        horizon: normalizedHorizon,
        dataPoints: result.dataPoints,
        anomalyCount: result.anomalies.count,
        anomalies: result.anomalies.records,
        evaluation: result.evaluation || null
      }
    }));
  }

  return {
    forecasts: created,
    prediction: result.prediction,
    anomalies: result.anomalies.records,
    anomalyCount: result.anomalies.count,
    anomalyMethod: result.anomalies.method,
    anomalyModel: result.models.anomaly,
    anomalyGranularity: result.anomalies.granularity,
    anomalyMinimumMonths: result.anomalies.minimumActiveMonths,
    dataPoints: result.dataPoints,
    fitScore: result.fitScore,
    fitScoreMethod: result.fitScoreMethod,
    models: result.models,
    trend: result.trend,
    evaluation: result.evaluation || null
  };
};

// Get prediction history
export const getPredictions = async (userId, query = {}) => {
  const filter = { user: userId };

  if (query.predictionType) {
    filter.predictionType = query.predictionType;
  }

  const paginated = query.page !== undefined || query.limit !== undefined;
  const pagination = getPagination(query);
  const [predictions, total] = await Promise.all([
    Prediction.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(paginated ? pagination.skip : 0)
      .limit(paginated ? pagination.limit : 0),
    paginated ? Prediction.countDocuments(filter) : Promise.resolve(0)
  ]);

  return paginated
    ? buildPaginatedResult(predictions, total, pagination)
    : predictions;
};

// Get latest prediction
export const getLatestPrediction = async (userId) => {
  const prediction = await Prediction.findOne({
    user: userId
  }).sort({ createdAt: -1 });

  if (!prediction) {
    throw new ApiError(
      404,
      "No prediction found"
    );
  }

  return prediction;
};