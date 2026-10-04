/*
 * calculations
 * ------------
 * Pure financial maths. No React, no network calls.
 *
 * The backend exposes raw aggregated totals only, so anything the interface
 * shows as a trend, a forecast, a health score or a category split is derived
 * here from the expense and income records the API already returns.
 */

import { parseDate, toMonthKey } from "./formatDate";

/*
 * Totals
 */
export const sumAmount = (items = []) =>
  (items || []).reduce(
    (total, item) => total + (Number(item?.amount) || 0),
    0
  );

export const sumBy = (items = [], key = "amount") =>
  (items || []).reduce(
    (total, item) => total + (Number(item?.[key]) || 0),
    0
  );

export const average = (values = []) => {
  const numbers = (values || []).filter((value) =>
    Number.isFinite(Number(value))
  );

  if (!numbers.length) {
    return 0;
  }

  return (
    numbers.reduce((total, value) => total + Number(value), 0) /
    numbers.length
  );
};

/*
 * Percentage change between two periods.
 * Returns null when there is no previous data.
 */
export const percentChange = (current, previous) => {
  const currentTotal = Number(current) || 0;
  const previousTotal = Number(previous) || 0;

  if (previousTotal <= 0) {
    return null;
  }

  return ((currentTotal - previousTotal) / previousTotal) * 100;
};

export const savingsRateOf = (income, expenses) => {
  const incomeTotal = Number(income) || 0;
  const savings = incomeTotal - (Number(expenses) || 0);

  return incomeTotal > 0 ? (savings / incomeTotal) * 100 : 0;
};

/*
 * Date range helpers
 */
export const startOfDay = (value) => {
  const date = parseDate(value) || new Date();

  date.setHours(0, 0, 0, 0);

  return date;
};

export const endOfDay = (value) => {
  const date = parseDate(value) || new Date();

  date.setHours(23, 59, 59, 999);

  return date;
};

/*
 * Inclusive range covering the last `months` calendar months.
 */
export const getRollingRange = (months = 6, reference = new Date()) => {
  const base = parseDate(reference) || new Date();
  const total = Math.max(1, Number(months) || 1);

  const startDate = new Date(
    base.getFullYear(),
    base.getMonth() - (total - 1),
    1
  );

  const endDate = new Date(
    base.getFullYear(),
    base.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  return {
    startDate,
    endDate,
  };
};

export const isWithinRange = (value, startDate, endDate) => {
  if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
    return true;
  }

  const date = parseDate(value);

  if (!date) {
    return false;
  }

  if (startDate && date < startDate) {
    return false;
  }

  return !(endDate && date > endDate);
};

export const filterByRange = (items = [], startDate, endDate) =>
  (items || []).filter((item) =>
    isWithinRange(item?.date || item?.createdAt, startDate, endDate)
  );

/*
 * Filtering and sorting shared by the expenses and income screens.
 *
 * The API supports category + date range.
 * Search and sorting are applied locally.
 */
export const searchRecords = (items = [], term = "", fields = []) => {
  const query = String(term || "").trim().toLowerCase();

  if (!query) {
    return items;
  }

  const keys = fields.length
    ? fields
    : ["description", "category", "source", "notes"];

  return items.filter((item) =>
    keys.some((key) =>
      String(item?.[key] ?? "")
        .toLowerCase()
        .includes(query)
    )
  );
};

/*
 * Converts an expense/income date into a reliable timestamp.
 *
 * We first use the application's parseDate helper.
 * If that cannot parse the value, we fall back to JavaScript Date parsing.
 */
const getRecordTime = (item) => {
  const value = item?.date || item?.createdAt;

  if (!value) {
    return 0;
  }

  const parsed = parseDate(value);

  if (parsed instanceof Date && !Number.isNaN(parsed.getTime())) {
    return parsed.getTime();
  }

  const fallback = new Date(value).getTime();

  return Number.isNaN(fallback) ? 0 : fallback;
};

/*
 * Date sorting.
 *
 * asc  = oldest -> newest
 * desc = newest -> oldest
 */
const byDate = (direction = "desc") => (a, b) => {
  const left = getRecordTime(a);
  const right = getRecordTime(b);

  return direction === "asc"
    ? left - right
    : right - left;
};

/*
 * Sort keys come straight from ExpenseFilters / IncomeFilters.
 */
export const sortRecords = (items = [], sort = "newest") => {
  const list = [...(items || [])];

  switch (sort) {
    case "oldest":
      return list.sort(byDate("asc"));

    case "highest":
      return list.sort(
        (a, b) => (Number(b?.amount) || 0) - (Number(a?.amount) || 0)
      );

    case "lowest":
      return list.sort(
        (a, b) => (Number(a?.amount) || 0) - (Number(b?.amount) || 0)
      );

    case "newest":
    default:
      return list.sort(byDate("desc"));
  }
};

/*
 * Monthly buckets
 */
const buildMonthKeys = (months = 6, reference = new Date()) => {
  const base = parseDate(reference) || new Date();
  const total = Math.max(1, Number(months) || 1);
  const keys = [];

  for (let index = total - 1; index >= 0; index -= 1) {
    const date = new Date(
      base.getFullYear(),
      base.getMonth() - index,
      1
    );

    keys.push({
      key: toMonthKey(date),
      date,
    });
  }

  return keys;
};

/*
 * Totals of items grouped into the last `months` months.
 */
export const buildMonthlySeries = (
  items = [],
  months = 6,
  reference = new Date()
) => {
  const buckets = new Map();

  (items || []).forEach((item) => {
    const key = toMonthKey(item?.date || item?.createdAt);

    if (!key) {
      return;
    }

    buckets.set(
      key,
      (buckets.get(key) || 0) + (Number(item?.amount) || 0)
    );
  });

  return buildMonthKeys(months, reference).map(({ key, date }) => ({
    key,
    date,
    label: new Intl.DateTimeFormat("en-GB", {
      month: "short",
      year: "2-digit",
    }).format(date),
    amount: Number((buckets.get(key) || 0).toFixed(2)),
  }));
};

/*
 * One row per month with income, expenses and savings side by side.
 */
export const buildCombinedSeries = (
  expenses = [],
  incomes = [],
  months = 6,
  reference = new Date()
) => {
  const expenseSeries = buildMonthlySeries(
    expenses,
    months,
    reference
  );

  const incomeSeries = buildMonthlySeries(
    incomes,
    months,
    reference
  );

  return expenseSeries.map((bucket, index) => {
    const income = incomeSeries[index]?.amount || 0;
    const expense = bucket.amount;

    return {
      key: bucket.key,
      date: bucket.date,
      label: bucket.label,
      income,
      expenses: expense,
      savings: Number((income - expense).toFixed(2)),
    };
  });
};

/*
 * Category breakdown for the donut chart.
 */
export const groupByCategory = (items = []) => {
  const totals = new Map();

  (items || []).forEach((item) => {
    const category =
      item?.category || item?.source || "Other";

    const existing =
      totals.get(category) || {
        category,
        amount: 0,
        count: 0,
      };

    totals.set(category, {
      category,
      amount: Number(
        (
          existing.amount +
          (Number(item?.amount) || 0)
        ).toFixed(2)
      ),
      count: existing.count + 1,
    });
  });

  const groups = [...totals.values()].sort(
    (a, b) => b.amount - a.amount
  );

  const grandTotal = groups.reduce(
    (total, group) => total + group.amount,
    0
  );

  return groups.map((group) => ({
    ...group,
    percentage:
      grandTotal > 0
        ? Number(
            ((group.amount / grandTotal) * 100).toFixed(1)
          )
        : 0,
  }));
};

/*
 * The single category that dominates recent spending.
 */
export const topCategory = (items = []) =>
  groupByCategory(items)[0] || null;

/*
 * Budget utilisation
 */
export const calculateBudgetSpent = (
  budget = {},
  expenses = []
) => {
  const month = Number(budget.month);
  const year = Number(budget.year);

  if (!Number.isFinite(month) || !Number.isFinite(year)) {
    return sumAmount(
      expenses.filter(
        (expense) =>
          expense?.category === budget.category
      )
    );
  }

  return sumAmount(
    expenses.filter((expense) => {
      const date = parseDate(
        expense?.date || expense?.createdAt
      );

      return (
        expense?.category === budget.category &&
        date &&
        date.getFullYear() === year &&
        date.getMonth() + 1 === month
      );
    })
  );
};

export const withBudgetProgress = (
  budgets = [],
  expenses = []
) =>
  (budgets || []).map((budget) => {
    const spent = calculateBudgetSpent(
      budget,
      expenses
    );

    const amount = Number(budget?.amount) || 0;
    const percentage =
      amount > 0 ? (spent / amount) * 100 : 0;

    return {
      ...budget,
      spent: Number(spent.toFixed(2)),
      remaining: Number(
        Math.max(amount - spent, 0).toFixed(2)
      ),
      percentage: Number(percentage.toFixed(1)),
      isOverBudget: spent > amount,
      isWarning:
        percentage >= 80 && percentage <= 100,
    };
  });

/*
 * Least-squares forecast
 */
export const linearForecast = (
  values = [],
  steps = 3
) => {
  const points = (values || [])
    .map((value, index) => ({
      x: index + 1,
      y: Number(value) || 0,
    }))
    .filter((point) =>
      Number.isFinite(point.y)
    );

  if (points.length < 2) {
    const flat = points.length
      ? points[0].y
      : 0;

    return {
      values: Array.from(
        {
          length: Math.max(0, steps),
        },
        () => Number(flat.toFixed(2))
      ),
      slope: 0,
      intercept: flat,
      confidence: 0,
      trend: "stable",
      dataPoints: points.length,
      sufficientData: false,
    };
  }

  const count = points.length;

  const sumX = points.reduce(
    (total, point) => total + point.x,
    0
  );

  const sumY = points.reduce(
    (total, point) => total + point.y,
    0
  );

  const sumXY = points.reduce(
    (total, point) =>
      total + point.x * point.y,
    0
  );

  const sumXX = points.reduce(
    (total, point) =>
      total + point.x * point.x,
    0
  );

  const denominator =
    count * sumXX - sumX * sumX;

  const slope =
    denominator === 0
      ? 0
      : (count * sumXY - sumX * sumY) /
        denominator;

  const intercept =
    (sumY - slope * sumX) / count;

  const predicted = Array.from(
    {
      length: Math.max(0, steps),
    },
    (_, index) => {
      const x = count + index + 1;

      return Math.max(
        0,
        Number(
          (intercept + slope * x).toFixed(2)
        )
      );
    }
  );

  const mean = sumY / count;

  const totalVariance = points.reduce(
    (total, point) =>
      total + (point.y - mean) ** 2,
    0
  );

  const residualVariance = points.reduce(
    (total, point) =>
      total +
      (
        point.y -
        (intercept + slope * point.x)
      ) ** 2,
    0
  );

  const rSquared =
    totalVariance === 0
      ? 1
      : 1 -
        residualVariance /
          totalVariance;

  const confidence = Math.round(
    Math.min(
      96,
      Math.max(
        45,
        45 + Math.max(0, rSquared) * 51
      )
    )
  );

  const relativeSlope =
    sumY === 0
      ? 0
      : (slope * count) / sumY;

  return {
    values: predicted,
    slope: Number(slope.toFixed(2)),
    intercept: Number(intercept.toFixed(2)),
    confidence,
    trend:
      relativeSlope > 0.05
        ? "up"
        : relativeSlope < -0.05
          ? "down"
          : "stable",
    dataPoints: count,
    sufficientData: count >= 3,
    rSquared: Number(
      Math.max(0, rSquared).toFixed(3)
    ),
  };
};

/*
 * Financial health score
 */
export const calculateFinancialHealth = ({
  income = 0,
  expenses = 0,
  budgets = [],
  goals = [],
  transactionCount = 0,
} = {}) => {
  const incomeTotal = Number(income) || 0;
  const expenseTotal = Number(expenses) || 0;
  const savings = incomeTotal - expenseTotal;
  const rate = savingsRateOf(
    incomeTotal,
    expenseTotal
  );

  let score = 0;

  // Savings behaviour (max 45)
  if (incomeTotal > 0) {
    if (rate >= 30) score += 45;
    else if (rate >= 20) score += 36;
    else if (rate >= 10) score += 24;
    else if (rate >= 0) score += 12;
  }

  // Budget discipline (max 30)
  const budgetsWithData = (
    budgets || []
  ).filter(
    (budget) =>
      Number(budget?.amount) > 0
  );

  if (budgetsWithData.length) {
    const healthy =
      budgetsWithData.filter(
        (budget) =>
          (Number(budget?.spent) || 0) <=
          Number(budget?.amount)
      ).length;

    score += Math.round(
      (healthy /
        budgetsWithData.length) *
        30
    );
  } else {
    score += 12;
  }

  // Goal momentum (max 15)
  const goalTarget = sumBy(
    goals,
    "targetAmount"
  );

  const goalSaved = sumBy(
    goals,
    "currentAmount"
  );

  if (goalTarget > 0) {
    score += Math.round(
      Math.min(
        goalSaved / goalTarget,
        1
      ) * 15
    );
  } else if ((goals || []).length) {
    score += 6;
  }

  // Consistency of recording (max 10)
  if (transactionCount >= 40) score += 10;
  else if (transactionCount >= 15) score += 8;
  else if (transactionCount >= 5) score += 5;
  else if (transactionCount > 0) score += 3;

  const safeScore = Math.min(
    100,
    Math.max(0, Math.round(score))
  );

  const label =
    safeScore >= 75
      ? "Excellent"
      : safeScore >= 60
        ? "Healthy"
        : safeScore >= 40
          ? "Needs Attention"
          : "At Risk";

  const description =
    safeScore >= 75
      ? "Strong savings habits and controlled spending. Keep the momentum going."
      : safeScore >= 60
        ? "You are in good shape. Tighten the categories flagged in Budgets to climb higher."
        : safeScore >= 40
          ? "Spending is growing faster than savings. Review your largest categories this month."
          : "Savings are under pressure. Build a buffer before increasing discretionary spending.";

  return {
    score: safeScore,
    label,
    description,
    savings,
    savingsRate: Number(
      rate.toFixed(1)
    ),
  };
};

/*
 * Merges expenses and income into the single feed
 * RecentTransactions expects.
 */
export const buildTransactionFeed = (
  expenses = [],
  incomes = [],
  limit = 6
) => {
  const expensesAsTransactions = (
    expenses || []
  ).map((expense) => ({
    ...expense,
    id: expense?.id || expense?._id,
    type: "expense",
  }));

  const incomeAsTransactions = (
    incomes || []
  ).map((income) => ({
    ...income,
    id: income?.id || income?._id,
    type: "income",
    description:
      income?.description ||
      income?.source ||
      "Income",
  }));

  return [
    ...expensesAsTransactions,
    ...incomeAsTransactions,
  ]
    .sort(byDate("desc"))
    .slice(0, limit);
};

/*
 * Combines historical and predicted points.
 */
export const buildForecastChartSeries = (
  historical = [],
  forecast = []
) => {
  const history = (historical || []).map(
    (point) => ({
      label: point.label,
      historical:
        point.amount ??
        point.expenses ??
        0,
      predicted: null,
    })
  );

  const last =
    history[history.length - 1];

  if (last) {
    history[history.length - 1] = {
      ...last,
      predicted: last.historical,
    };
  }

  const future = (forecast || []).map(
    (point) => ({
      label: point.label,
      historical: null,
      predicted: point.amount,
    })
  );

  return [...history, ...future];
};