import Expense from "../models/Expense.js";
import ApiError from "../utils/apiError.js";
import { getPagination, buildPaginatedResult } from "../utils/pagination.js";

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

  if (query.search) {
    const escaped = String(query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { description: { $regex: escaped, $options: "i" } },
      { category: { $regex: escaped, $options: "i" } },
      { notes: { $regex: escaped, $options: "i" } }
    ];
  }

  const paginated = query.page !== undefined || query.limit !== undefined;
  const pagination = getPagination(query);

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .sort({ date: -1, _id: -1 })
      .skip(paginated ? pagination.skip : 0)
      .limit(paginated ? pagination.limit : 0),
    paginated ? Expense.countDocuments(filter) : Promise.resolve(0)
  ]);

  if (paginated) {
    return buildPaginatedResult(expenses, total, pagination);
  }

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