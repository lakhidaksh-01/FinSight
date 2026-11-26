import test from "node:test";
import assert from "node:assert/strict";

import { assessFinancialRisk } from "./insights.js";

test("budget risk is based on actual overages, not total category spend", () => {
  const result = assessFinancialRisk({
    income: 2000,
    expenses: 1000,
    budgets: [{ amount: 200, spent: 300 }],
  });

  assert.equal(result.riskLevel, "low");
  assert.equal(result.amount, null);
});
