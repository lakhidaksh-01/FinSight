import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateFinancialHealth,
  calculateBudgetTotals,
  calculateGoalTotals,
  filterByRange,
  getComparableMonthRanges,
} from "./calculations.js";

test("goal rollups cap progress per goal without hiding the actual saved total", () => {
  const goals = [
    { targetAmount: 100, currentAmount: 150 },
    { targetAmount: 200, currentAmount: 100 },
  ];

  assert.deepEqual(calculateGoalTotals(goals), {
    target: 300,
    saved: 250,
    progressAmount: 200,
    remaining: 100,
    progress: 66.7,
  });

  const health = calculateFinancialHealth({
    income: 1000,
    expenses: 500,
    goals,
  });
  assert.equal(health.score, 55);
  assert.equal(calculateFinancialHealth({
    income: 1000,
    expenses: 500,
    goals: [{ targetAmount: 0, currentAmount: 50 }],
  }).score, 45);
});

test("month-to-date comparison uses equivalent elapsed periods", () => {
  const { current, previous } = getComparableMonthRanges(
    new Date(2026, 2, 31, 10, 30)
  );
  const included = [
    { date: new Date(2026, 1, 28, 10, 0), amount: 10 },
  ];
  const excluded = [
    { date: new Date(2026, 2, 31, 10, 31), amount: 10 },
  ];

  assert.equal(previous.endDate.getDate(), 28);
  assert.equal(previous.endDate.getHours(), 10);
  assert.equal(filterByRange(included, previous.startDate, previous.endDate).length, 1);
  assert.equal(filterByRange(excluded, current.startDate, current.endDate).length, 0);
});

test("remaining budget sums per-category headroom without netting overspending", () => {
  assert.deepEqual(calculateBudgetTotals([
    { amount: 100, spent: 150 },
    { amount: 100, spent: 0 },
  ]), {
    totalBudgeted: 200,
    totalSpent: 150,
    totalRemaining: 100,
    utilization: 75,
  });
});
