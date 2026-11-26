const timestamp = (record) => {
  const parsed = new Date(record?.createdAt || 0).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const recordId = (record) => String(record?._id || record?.id || "");

const compareNewestFirst = (left, right) =>
  timestamp(right) - timestamp(left) ||
  recordId(right).localeCompare(recordId(left));

const compareOldestFirst = (left, right) =>
  timestamp(left) - timestamp(right) ||
  recordId(left).localeCompare(recordId(right));

export const restoreLatestForecastRun = (records = []) => {
  const forecasts = (records || [])
    .filter((record) => record?.predictionType === "expense_forecast")
    .sort(compareNewestFirst);
  const latest = forecasts[0] || null;

  if (!latest) {
    return { latest: null, run: [] };
  }

  const run = latest.metadata?.runId
    ? forecasts.filter(
        (record) => record.metadata?.runId === latest.metadata.runId
      )
    : [latest];

  return {
    latest,
    run: run.sort(compareOldestFirst),
  };
};
