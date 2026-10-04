import Expense from "../models/Expense.js";
import ApiError from "../utils/apiError.js";

// Add expense
export const createExpense = async (userId, data) => {
  const expense = await Expense.create({
    ...data,
    user: userId
  });

  return expense;
};

// Get expenses
export const getExpenses = async (userId, query) => {
  const filter = { user: userId };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.startDate || query.endDate) {
    filter.date = {};

    if (query.startDate) {
      filter.date.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      filter.date.$lte = new Date(query.endDate);
    }
  }

  const expenses = await Expense.find(filter)
    .sort({ date: -1 });

  return expenses;
};

// Get one expense
export const getExpenseById = async (userId, expenseId) => {
  const expense = await Expense.findOne({
    _id: expenseId,
    user: userId
  });

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return expense;
};

// Update expense
export const updateExpense = async (
  userId,
  expenseId,
  data
) => {
  const expense = await Expense.findOneAndUpdate(
    {
      _id: expenseId,
      user: userId
    },
    data,
    {
      new: true,
      runValidators: true
    }
  );

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return expense;
};

// Delete expense
export const deleteExpense = async (
  userId,
  expenseId
) => {
  const expense = await Expense.findOneAndDelete({
    _id: expenseId,
    user: userId
  });

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return expense;
};

// Delete all expenses
export const deleteAllExpenses = async (userId) => {
  return await Expense.deleteMany({
    user: userId
  });
};