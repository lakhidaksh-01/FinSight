import Expense from "../models/Expense.js";
import Income from "../models/Income.js";

// Get dashboard analytics
export const getDashboardAnalytics = async (
  userId,
  query
) => {
  const filter = { user: userId };

  if (query.startDate || query.endDate) {
    filter.date = {};

    if (query.startDate) {
      filter.date.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      filter.date.$lte = new Date(query.endDate);
    }
  }

  const [expenses, income] = await Promise.all([
    Expense.find(filter),
    Income.find(filter)
  ]);

  const totalExpenses = expenses.reduce(
    (total, item) => total + item.amount,
    0
  );

  const totalIncome = income.reduce(
    (total, item) => total + item.amount,
    0
  );

  const savings = totalIncome - totalExpenses;

  const savingsRate = totalIncome > 0
    ? (savings / totalIncome) * 100
    : 0;

  return {
    totalIncome,
    totalExpenses,
    savings,
    savingsRate: Number(savingsRate.toFixed(2))
  };
};

// Spending analytics
export const getSpendingAnalytics = async (
  userId,
  query
) => {
  const filter = { user: userId };

  if (query.startDate || query.endDate) {
    filter.date = {};

    if (query.startDate) {
      filter.date.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      filter.date.$lte = new Date(query.endDate);
    }
  }

  const expenses = await Expense.find(filter);

  const categoryTotals = {};

  expenses.forEach((expense) => {
    const category = expense.category;

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += expense.amount;
  });

  return {
    totalExpenses: expenses.reduce(
      (total, item) => total + item.amount,
      0
    ),
    categoryTotals
  };
};

// Savings analytics
export const getSavingsAnalytics = async (
  userId,
  query
) => {
  const dashboard = await getDashboardAnalytics(
    userId,
    query
  );

  return {
    income: dashboard.totalIncome,
    expenses: dashboard.totalExpenses,
    savings: dashboard.savings,
    savingsRate: dashboard.savingsRate
  };
};