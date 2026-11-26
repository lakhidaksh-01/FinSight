import Expense from "../models/Expense.js";
import ApiError from "../utils/apiError.js";
import { getPagination } from "../utils/pagination.js";
import {
  buildTransactionFilter,
  getPaginatedTransactions,
  getTransactionSort,
} from "../utils/transactionQuery.js";

// Add expense
export const createExpense = async (userId, data) => {
  const allowedFields = ["amount", "category", "description", "notes", "date"];
  const expenseData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      expenseData[field] = data[field];
    }
  });

  const expense = await Expense.create({
    ...expenseData,
    user: userId
  });

  return expense;
};

// Get expenses
export const getExpenses = async (userId, query) => {
  const filter = buildTransactionFilter(userId, query, { includeNotes: true });

  const paginated = query.page !== undefined || query.limit !== undefined;
  const pagination = getPagination(query);
  const sort = getTransactionSort(query.sort);

  if (paginated) {
    return getPaginatedTransactions(Expense, filter, pagination, sort);
  }

  return Expense.find(filter).sort(sort);
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
  const allowedFields = ["amount", "category", "description", "notes", "date"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  const expense = await Expense.findOneAndUpdate(
    {
      _id: expenseId,
      user: userId
    },
    updates,
    {
      returnDocument: "after",
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