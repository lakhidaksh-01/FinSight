import Prediction from "../models/Prediction.js";
import ApiError from "../utils/apiError.js";
import Expense from "../models/Expense.js";
import { spawn } from "node:child_process";
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

const buildMonthlyExpenseData = (expenses, months) => {
  const now = new Date();
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
      date: date.toISOString(),
      amount: Number((totals.get(key) || 0).toFixed(2)),
      category: "Expense"
    });
  }

  return data;
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
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - (normalizedHistoryMonths - 1));
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const expenses = await Expense.find({
    user: userId,
    date: { $gte: startDate }
  }).select("date amount").lean();

  const monthlyData = buildMonthlyExpenseData(expenses, normalizedHistoryMonths);
  const populatedMonths = monthlyData.filter((item) => item.amount > 0).length;

  if (populatedMonths < 3) {
    throw new ApiError(
      422,
      "Add at least three months of expense history before generating a forecast"
    );
  }

  const result = await runPythonPrediction(monthlyData, normalizedHorizon);

  const forecastValues = result.prediction.linearRegression;
  const now = new Date();
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
      confidence: result.confidence,
      model: "linear-regression-python",
      metadata: {
        baseline: result.prediction.baseline,
        movingAverage: result.prediction.movingAverage,
        trend: result.trend,
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
    anomalies: result.anomalies.records,
    anomalyCount: result.anomalies.count,
    dataPoints: result.dataPoints,
    confidence: result.confidence,
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