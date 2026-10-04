/*
 * predictionService
 * -----------------
 * Talks to /api/predictions.
 *
 * Endpoints (backend-v1/routes/predictionRoutes.js):
 *   POST /api/predictions   { predictionType, predictedAmount, period, confidence, model, metadata }
 *   GET  /api/predictions   history, newest first
 *   GET  /api/predictions/latest   404 when nothing has been stored yet
 *
 * The Python models under backend-v1/ml are not exposed by the API, so the
 * forecast itself is produced locally by linearForecast() in
 * utils/calculations.js and this service persists and reads it back.
 * A missing latest prediction is an empty state, not a failure, so the 404 is
 * translated into null here instead of surfacing an error to the page.
 */

import api, { ApiError, buildQuery, unwrap } from "./api";

const RESOURCE = "/predictions";

export const PREDICTION_TYPES = {
  MONTHLY_SPENDING: "expense_forecast",
  MONTHLY_SAVINGS: "monthly_savings",
  CATEGORY_SPENDING: "category_spending",
};

export const PREDICTION_MODEL = "linear-regression-local";

const fromApiRecord = (record) => {
  if (!record) {
    return null;
  }

  return {
    ...record,
    id: record._id || record.id,
    predictedAmount: Number(record.predictedAmount) || 0,
    confidence: Number(record.confidence) <= 1
      ? Math.round((Number(record.confidence) || 0) * 100)
      : Number(record.confidence) || 0,
    metadata: record.metadata || {},
  };
};

export const predictionService = {
  async getPredictions({ type } = {}) {
    const response = await api.get(RESOURCE, {
      params: buildQuery({ predictionType: type }),
    });

    return (unwrap(response) || []).map(fromApiRecord);
  },

  /*
   * null when the user has never generated a prediction.
   */
  async getLatestPrediction() {
    try {
      const response = await api.get(`${RESOURCE}/latest`);

      return fromApiRecord(unwrap(response));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      throw error;
    }
  },

  async createPrediction({
    predictionType = PREDICTION_TYPES.MONTHLY_SPENDING,
    predictedAmount,
    period,
    confidence,
    model = PREDICTION_MODEL,
    metadata = {},
  }) {
    const response = await api.post(RESOURCE, {
      predictionType,
      predictedAmount: Math.max(Number(predictedAmount) || 0, 0),
      period,
      confidence: Number(confidence) > 1
        ? Number(confidence) / 100
        : Number(confidence) || 0,
      model,
      metadata,
    });

    return fromApiRecord(unwrap(response));
  },

  /*
   * Stores one forecast point per future month, which is what
   * PredictionHistory and PredictionChart consume.
   */
  async saveForecast(forecast = [], { predictionType, model } = {}) {
    const created = [];

    for (const point of forecast) {
      created.push(
        await predictionService.createPrediction({
          predictionType,
          predictedAmount: point.amount,
          period: point.label,
          confidence: point.confidence,
          model,
          metadata: point.metadata || {},
        })
      );
    }

    return created;
  },
};

export default predictionService;