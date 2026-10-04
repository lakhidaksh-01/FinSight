/*
 * insights
 * --------
 * Local intelligence layer.
 *
 * The API exposes raw transaction, budget, goal and prediction data but has no
 * /insights, /anomaly or /risk endpoint (backend riskService exists without a
 * route and the Python models are not wired up). Instead of inventing
 * endpoints, FinSight derives observations here from data the user actually
 * owns, using rules that stay explainable on screen.
 */

import { RISK_THRESHOLDS } from "../constants/app";
import { getCategoryLabel } from "../constants/categories";
import {
  average,
  buildMonthlySeries,
  groupByCategory,
  percentChange,
  savingsRateOf,
  sumAmount,
  sumBy,
} from "./calculations";
import { daysUntil, parseDate } from "./formatDate";

const HIGH_EXPENSE_MULTIPLIER = 2.5;
const MIN_MONTHLY_RECORDS = 4;

/*
 * Anomaly detection
 *
 * Two explainable rules:
 * 1. a single expense far above the average of its own category
 * 2. a month whose spending breaks far above the user's monthly average
 */
export const detectExpenseAnomalies = (expenses = [], incomes = []) => {
  const records = (expenses || []).filter(
    (expense) => Number(expense?.amount) > 0
  );

  const anomalies = [];

  if (records.length < MIN_MONTHLY_RECORDS) {
    return anomalies;
  }

  // Rule 1: outlier transaction inside its category.
  const categories = groupByCategory(records);

  categories.forEach((group) => {
    const siblings = records.filter(
      (expense) => (expense?.category || "Other") === group.category
    );

    if (siblings.length < 3) {
      return;
    }

    const mean = average(siblings.map((expense) => expense.amount));

    const outlier = siblings
      .filter((expense) => expense.amount >= mean * HIGH_EXPENSE_MULTIPLIER)
      .sort((a, b) => b.amount - a.amount)[0];

    if (!outlier) {
      return;
    }

    const multiple = (outlier.amount / mean).toFixed(1);

    anomalies.push({
      id: `expense-${outlier.id || outlier._id || outlier.date}`,
      severity: outlier.amount >= mean * 4 ? "high" : "medium",
      title:
        outlier.description ||
        `Unusual ${getCategoryLabel(group.category)} expense`,
      message: `This payment is ${multiple}x your typical ${getCategoryLabel(
        group.category
      )} transaction of ${Math.round(mean).toLocaleString("en-IN")}.`,
      amount: Number(outlier.amount),
      category: getCategoryLabel(group.category),
      date: outlier.date,
    });
  });

  // Rule 2: month that spikes against the personal monthly average.
  const monthly = buildMonthlySeries(records, 6);
  const completed = monthly.slice(0, -1);

  if (completed.length >= 3) {
    const baseline = average(completed.map((month) => month.amount));
    const current = monthly[monthly.length - 1];

    if (baseline > 0 && current.amount >= baseline * HIGH_EXPENSE_MULTIPLIER) {
      anomalies.push({
        id: `month-${current.key}`,
        severity: "high",
        title: `${current.label} spending spike`,
        message: `Spending this month is already ${(current.amount / baseline).toFixed(
          1
        )}x your recent monthly average of ${Math.round(baseline).toLocaleString(
          "en-IN"
        )}.`,
        amount: Number(current.amount),
        category: "Monthly total",
      });
    }
  }

  return anomalies.sort((a, b) => {
    const left = parseDate(a.date)?.getTime() || 0;
    const right = parseDate(b.date)?.getTime() || 0;

    return right - left;
  });
};

export const getPrimaryAnomaly = (anomalies = []) => anomalies[0] || null;

/*
 * Risk assessment
 *
 * Mirrors backend/services/riskService.js thresholds (savings rate under 10%
 * is high risk, under 20% medium) and extends them with budget breaches.
 */
export const assessFinancialRisk = ({
  income = 0,
  expenses = 0,
  budgets = [],
  savingsRate,
} = {}) => {
  const incomeTotal = Number(income) || 0;
  const expenseTotal = Number(expenses) || 0;
  const rate =
    savingsRate !== undefined
      ? Number(savingsRate)
      : savingsRateOf(incomeTotal, expenseTotal);

  const savings = incomeTotal - expenseTotal;

  const exceeded = budgets.filter(
    (budget) =>
      Number(budget?.amount) > 0 &&
      (Number(budget?.spent) || 0) > Number(budget?.amount)
  ).length;

  const overspent = sumBy(
    budgets.filter(
      (budget) =>
        Number(budget?.amount) > 0 &&
        (Number(budget?.spent) || 0) > Number(budget?.amount)
    ),
    "spent"
  );

  const breachPressure = exceeded >= 2 || overspent > expenseTotal * 0.15;

  if (incomeTotal <= 0) {
    return {
      riskLevel: "medium",
      savingsRate: Number(rate.toFixed(1)),
      amount: null,
      message:
        "Income has not been recorded yet, so FinSight cannot measure how much of it you keep. Add income records to sharpen this signal.",
    };
  }

  if (rate < RISK_THRESHOLDS.HIGH_SAVINGS_RATE || savings < 0 || breachPressure) {
    return {
      riskLevel: "high",
      savingsRate: Number(rate.toFixed(1)),
      amount: savings < 0 ? Math.abs(savings) : exceeded > 0 ? overspent : expenseTotal,
      message:
        savings < 0
          ? "Expenses are currently larger than income. Closing the gap should be the first priority."
          : breachPressure && exceeded > 0
            ? `${exceeded} budget${exceeded === 1 ? "" : "s"} already breached their limit and savings sit at ${rate.toFixed(
                1
              )}% of income.`
            : `Only ${rate.toFixed(
                1
              )}% of income is being kept, below the ${RISK_THRESHOLDS.HIGH_SAVINGS_RATE}% safety line.`,
    };
  }

  if (rate < RISK_THRESHOLDS.MEDIUM_SAVINGS_RATE) {
    return {
      riskLevel: "medium",
      savingsRate: Number(rate.toFixed(1)),
      amount: Math.max(incomeTotal * 0.1 - savings, 0),
      message: `Savings sit at ${rate.toFixed(
        1
      )}% of income. Reaching ${RISK_THRESHOLDS.MEDIUM_SAVINGS_RATE}% would move you into the low risk band.`,
    };
  }

  return {
    riskLevel: "low",
    savingsRate: Number(rate.toFixed(1)),
    amount: null,
    message: `You are keeping ${rate.toFixed(
      1
    )}% of income and spending stays inside limits.`,
  };
};

/*
 * Insight generation
 *
 * Every card carries the evidence behind it, and insight objects follow the
 * shape used by InsightCard and QuickInsights:
 * { id, type, title, message, category, value, actionLabel }
 */
export const buildInsights = ({
  expenses = [],
  incomes = [],
  budgets = [],
  goals = [],
  anomalies = [],
  risk = null,
  analytics = null,
  currentMonthExpenses = [],
  previousMonthExpenses = [],
  currentMonthIncomes = [],
} = {}) => {
  const insights = [];

  const totalExpenses =
    analytics?.totalExpenses ?? sumAmount(expenses);
  const totalIncome = analytics?.totalIncome ?? sumAmount(incomes);

  const currentTotal = sumAmount(currentMonthExpenses);
  const previousTotal = sumAmount(previousMonthExpenses);
  const change = percentChange(currentTotal, previousTotal);

  /*
   * Cash flow
   */
  if (totalIncome > 0) {
    const rate = savingsRateOf(totalIncome, totalExpenses);

    insights.push({
      id: "savings-rate",
      type: rate >= 20 ? "success" : rate >= 10 ? "info" : "warning",
      title:
        rate >= 20
          ? "Healthy savings rate"
          : rate >= 10
            ? "Savings could be stronger"
            : "Savings rate is too low",
      message: `Across the recorded period you kept ${rate.toFixed(
        1
      )}% of your income. Financial planners generally recommend at least 20%.`,
      category: "cash flow",
      value: `${rate.toFixed(1)}% of income`,
      actionLabel: "Review income vs expenses",
    });
  }

  /*
   * Spending momentum
   */
  if (change !== null) {
    insights.push({
      id: "spending-momentum",
      type: change > 10 ? "warning" : change < -5 ? "success" : "info",
      title:
        change > 10
          ? "Spending is climbing"
          : change < -5
            ? "Spending is coming down"
            : "Spending is steady",
      message: `This month's spending is ${Math.abs(change).toFixed(
        1
      )}% ${change >= 0 ? "higher" : "lower"} than last month, moving from ${previousTotal.toLocaleString(
        "en-IN"
      )} to ${currentTotal.toLocaleString("en-IN")}.`,
      category: "spending",
      value: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
      actionLabel: "Open analytics",
    });
  }

  /*
   * Category concentration
   */
  const categories = groupByCategory(currentMonthExpenses.length ? currentMonthExpenses : expenses);
  const leading = categories[0];

  if (leading && leading.percentage >= 30) {
    insights.push({
      id: "category-concentration",
      type: "ai",
      title: `${getCategoryLabel(leading.category)} leads your spending`,
      message: `${getCategoryLabel(leading.category)} accounts for ${leading.percentage}% of spending (${leading.count} transaction${leading.count === 1 ? "" : "s"}). Capping this one category has the biggest effect on your total.`,
      category: "category",
      value: getCategoryLabel(leading.category),
      actionLabel: "Create a budget for it",
    });
  }

  const topThree = categories.slice(0, 3).reduce((sum, g) => sum + g.percentage, 0);

  if (categories.length > 3 && topThree >= 75) {
    insights.push({
      id: "category-concentration-top3",
      type: "info",
      title: "Three categories shape most of your spending",
      message: `${categories
        .slice(0, 3)
        .map((group) => getCategoryLabel(group.category))
        .join(", ")} together make up ${topThree.toFixed(
        0
      )}% of everything you spend.`,
      category: "category",
      actionLabel: "Explore categories",
    });
  }

  /*
   * Income concentration
   */
  const incomeGroups = groupByCategory(incomes);

  if (incomeGroups.length === 1 && sumAmount(incomes) > 0) {
    insights.push({
      id: "income-dependency",
      type: "warning",
      title: "Single income source",
      message: `All recorded income comes from ${getCategoryLabel(
        incomeGroups[0].category
      )}. A second stream reduces how much one disruption affects you.`,
      category: "income",
      value: getCategoryLabel(incomeGroups[0].category),
      actionLabel: "Track another source",
    });
  }

  /*
   * Budget behaviour
   */
  const activeBudgets = budgets.filter((budget) => Number(budget?.amount) > 0);
  const breached = activeBudgets.filter(
    (budget) => (Number(budget?.spent) || 0) > Number(budget?.amount)
  );
  const nearLimit = activeBudgets.filter((budget) => {
    const amount = Number(budget?.amount) || 0;
    const spent = Number(budget?.spent) || 0;
    const percentage = amount > 0 ? (spent / amount) * 100 : 0;

    return percentage >= 80 && percentage <= 100;
  });

  if (breached.length) {
    insights.push({
      id: "budget-breaches",
      type: "risk",
      title: `${breached.length} budget${breached.length === 1 ? "" : "s"} over the limit`,
      message: `${breached
        .map((budget) => getCategoryLabel(budget.category))
        .join(", ")} ${breached.length === 1 ? "has" : "have"} already passed their monthly cap.`,
      category: "budgets",
      value: `${breached.length} of ${activeBudgets.length}`,
      actionLabel: "Adjust budgets",
    });
  } else if (nearLimit.length) {
    insights.push({
      id: "budget-warnings",
      type: "warning",
      title: "Approaching budget limits",
      message: `${nearLimit
        .map((budget) => getCategoryLabel(budget.category))
        .join(", ")} ${nearLimit.length === 1 ? "is" : "are"} above 80% of the monthly limit with days still to go.`,
      category: "budgets",
      actionLabel: "Review budgets",
    });
  } else if (activeBudgets.length) {
    insights.push({
      id: "budget-healthy",
      type: "success",
      title: "Every budget is holding",
      message: `All ${activeBudgets.length} active budget${activeBudgets.length === 1 ? " is" : "s are"} still inside their limits this month.`,
      category: "budgets",
      actionLabel: "Open budgets",
    });
  } else {
    insights.push({
      id: "budget-missing",
      type: "info",
      title: "No budgets configured",
      message:
        "Budgets turn raw transactions into warnings before money is gone. Start with the category that dominates your spending.",
      category: "budgets",
      actionLabel: "Create a budget",
    });
  }

  /*
   * Goal pacing
   */
  const goalTarget = sumBy(goals, "targetAmount");
  const goalSaved = sumBy(goals, "currentAmount");

  if (goalTarget > 0) {
    const progress = (goalSaved / goalTarget) * 100;

    insights.push({
      id: "goal-progress",
      type: progress >= 60 ? "success" : "info",
      title: "Goal progress",
      message: `${Math.round(progress)}% of your ${goals.length} combined goal target${goals.length === 1 ? "" : "s"} is funded so far.`,
      category: "goals",
      value: `${Math.round(progress)}%`,
      actionLabel: "Open goals",
    });
  } else {
    insights.push({
      id: "goal-missing",
      type: "info",
      title: "No savings goals yet",
      message:
        "Goals give every surplus rupee a destination. An emergency fund of three months of spending is the usual starting point.",
      category: "goals",
      actionLabel: "Create a goal",
    });
  }

  const urgentGoal = (goals || [])
    .filter((goal) => goal?.targetDate && (Number(goal.currentAmount) || 0) < (Number(goal.targetAmount) || 0))
    .map((goal) => ({ goal, days: daysUntil(goal.targetDate) }))
    .filter((entry) => entry.days !== null && entry.days >= 0 && entry.days <= 60)
    .sort((a, b) => a.days - b.days)[0];

  if (urgentGoal) {
    const remaining =
      (Number(urgentGoal.goal.targetAmount) || 0) -
      (Number(urgentGoal.goal.currentAmount) || 0);

    insights.push({
      id: `goal-deadline-${urgentGoal.goal.id || urgentGoal.goal._id}`,
      type: urgentGoal.days <= 21 ? "warning" : "info",
      title: `${urgentGoal.goal.name} is due soon`,
      message: `${urgentGoal.days} day${urgentGoal.days === 1 ? "" : "s"} left to add ${remaining.toLocaleString(
        "en-IN"
      )} before the deadline.`,
      category: "goals",
      value: `${urgentGoal.days} days left`,
      actionLabel: "Update progress",
    });
  }

  /*
   * Anomalies
   */
  anomalies.slice(0, 2).forEach((anomaly) => {
    insights.push({
      id: `insight-${anomaly.id}`,
      type: "warning",
      title: anomaly.title,
      message: anomaly.message,
      category: "anomaly",
      value: anomaly.amount,
      actionLabel: "Inspect the transaction",
    });
  });

  /*
   * Recorded risk
   */
  if (risk && risk.riskLevel !== "low") {
    insights.push({
      id: "risk-summary",
      type: "risk",
      title:
        risk.riskLevel === "high" ? "High financial risk" : "Moderate financial risk",
      message: risk.message,
      category: "risk",
      actionLabel: "See how to improve",
    });
  }

  return insights;
};

/*
 * Dashboard shortlist: the three observations with the most impact.
 */
const TYPE_WEIGHT = { risk: 4, warning: 3, ai: 2, success: 2, info: 1 };

export const getQuickInsights = (insights = [], limit = 3) =>
  [...insights]
    .sort((a, b) => (TYPE_WEIGHT[b.type] || 0) - (TYPE_WEIGHT[a.type] || 0))
    .slice(0, limit);

/*
 * Counts for InsightSummary.
 */
export const summarizeInsights = (insights = [], anomalies = [], risk = null) => ({
  totalInsights: insights.length,
  riskCount:
    insights.filter((insight) => insight.type === "risk").length +
    (risk && risk.riskLevel !== "low" ? 1 : 0),
  anomalyCount:
    anomalies.length || insights.filter((insight) => insight.category === "anomaly").length,
  actionableCount: insights.filter((insight) => Boolean(insight.actionLabel)).length,
});

/*
 * Prediction-derived observation, reused by the insights and prediction pages.
 */
export const buildPredictionInsight = (prediction) => {
  if (!prediction) {
    return null;
  }

  const amount = Number(prediction.predictedAmount) || 0;

  return {
    id: `prediction-${prediction.id || prediction._id || prediction.createdAt}`,
    type: "ai",
    title: "Forecast for next month",
    message: `Based on your recorded history, spending of ${amount.toLocaleString(
      "en-IN"
    )} is expected for ${prediction.period || "the coming month"}.`,
    category: "prediction",
    value: amount,
    actionLabel: "Open predictions",
  };
};