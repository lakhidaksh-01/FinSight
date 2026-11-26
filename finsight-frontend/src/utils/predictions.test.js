import test from "node:test";
import assert from "node:assert/strict";

import { restoreLatestForecastRun } from "./predictions.js";

const record = (id, createdAt, runId, predictionType = "expense_forecast") => ({
  _id: id,
  createdAt,
  predictionType,
  metadata: runId ? { runId } : {},
});

test("restores the latest saved forecast run in forecast-period order", () => {
  const records = [
    record("older-a", "2026-01-01T00:00:00.000Z", "older"),
    record("newer-c", "2026-02-01T00:00:00.000Z", "newer"),
    record("other", "2026-03-01T00:00:00.000Z", null, "monthly_savings"),
    record("newer-a", "2026-02-01T00:00:00.000Z", "newer"),
    record("newer-b", "2026-02-01T00:00:00.000Z", "newer"),
  ];

  const restored = restoreLatestForecastRun(records);

  assert.equal(restored.latest._id, "newer-c");
  assert.deepEqual(
    restored.run.map((prediction) => prediction._id),
    ["newer-a", "newer-b", "newer-c"]
  );
});

test("restores one legacy forecast without run metadata", () => {
  const restored = restoreLatestForecastRun([
    record("legacy-old", "2026-01-01T00:00:00.000Z", null),
    record("legacy-latest", "2026-02-01T00:00:00.000Z", null),
  ]);

  assert.equal(restored.latest._id, "legacy-latest");
  assert.deepEqual(restored.run.map((prediction) => prediction._id), [
    "legacy-latest",
  ]);
});

test("returns an empty restoration when no forecast has been saved", () => {
  assert.deepEqual(
    restoreLatestForecastRun([
      record("income", "2026-02-01T00:00:00.000Z", null, "monthly_savings"),
    ]),
    { latest: null, run: [] }
  );
});
