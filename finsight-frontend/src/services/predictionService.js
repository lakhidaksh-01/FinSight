/*
 * predictionService
 * -----------------
 * Talks to /api/predictions.
 *
 * Endpoints (backend-v1/routes/predictionRoutes.js):
 *   POST /api/predictions   { predictionType, predictedAmount, period, model, metadata }
 *   GET  /api/predictions   history, newest first
 *   GET  /api/predictions/latest   404 when nothing has been stored yet
 *
 * Forecast generation is delegated to POST /api/predictions. Express obtains
 * the user's real expense history and runs the Python ML pipeline, then
 * persists and returns the forecast records.
 * A missing latest prediction is an empty state, not a failure, so the 404 is
 * translated into null here instead of surfacing an error to the page.
 */

import api, { ApiError, buildQuery, unwrap } from "./api";

const RESOURCE = "/predictions";

const fromApiRecord = (record) => {
  if (!record) {
    return null;
  }

  const normalizedRecord = { ...record };
  delete normalizedRecord.confidence;

  return {
    ...normalizedRecord,
    id: record._id || record.id,
    predictedAmount: Number(record.predictedAmount) || 0,
    metadata: record.metadata || {},
  };
};

export const predictionService = {
  async generateForecast({ historyMonths = 6, horizon = 3 } = {}) {
    const response = await api.post(RESOURCE, {
      historyMonths,
      horizon,
    });

    const data = unwrap(response) || {};

    return {
      ...data,
      forecasts: (data.forecasts || []).map(fromApiRecord),
      anomalies: data.anomalies,
      anomalyCount: data.anomalies.length,
      anomalyModel: data.anomalyModel,
      anomalyGranularity: data.anomalyGranularity,
      anomalyMinimumMonths: data.anomalyMinimumMonths,
      fitScoreMethod: data.fitScoreMethod,
      models: data.models,
    };
  },

  async getPredictions({ type } = {}) {
    const response = await api.get(RESOURCE, {
      params: buildQuery({ predictionType: type }),
    });

    const data = unwrap(response);
    return (Array.isArray(data) ? data : data?.items || []).map(fromApiRecord);
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

};

export default predictionService;