import Expense from "../models/Expense.js";
import Income from "../models/Income.js";

// Calculate financial risk
export const calculateRisk = async (userId) => {
  const [expenses, income] = await Promise.all([
    Expense.find({ user: userId }),
    Income.find({ user: userId })
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

  let riskLevel = "LOW";

  if (savingsRate < 10) {
    riskLevel = "HIGH";
  } else if (savingsRate < 20) {
    riskLevel = "MEDIUM";
  }

  return {
    riskLevel,
    savingsRate: Number(savingsRate.toFixed(2)),
    totalIncome,
    totalExpenses,
    savings
  };
};