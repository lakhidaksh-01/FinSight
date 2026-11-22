import Budget from "../models/Budget.js";
import ApiError from "../utils/apiError.js";
import { getPagination, buildPaginatedResult } from "../utils/pagination.js";

// Create budget
export const createBudget = async (userId, data) => {
  const allowedFields = ["category", "amount", "month", "year"];
  const budgetData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      budgetData[field] = data[field];
    }
  });

  const budget = await Budget.create({
    ...budgetData,
    user: userId
  });

  return budget;
};

// Get budgets
export const getBudgets = async (userId, query) => {
  const filter = { user: userId };

  if (query.month) {
    filter.month = query.month;
  }

  if (query.year) {
    filter.year = query.year;
  }

  if (query.search) {
    const escaped = String(query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.category = { $regex: escaped, $options: "i" };
  }

  const paginated = query.page !== undefined || query.limit !== undefined;
  const pagination = getPagination(query);
  const [budgets, total] = await Promise.all([
    Budget.find(filter)
      .sort({ year: -1, month: -1, _id: -1 })
      .skip(paginated ? pagination.skip : 0)
      .limit(paginated ? pagination.limit : 0),
    paginated ? Budget.countDocuments(filter) : Promise.resolve(0)
  ]);

  return paginated
    ? buildPaginatedResult(budgets, total, pagination)
    : budgets;
};

// Get one budget
export const getBudgetById = async (
  userId,
  budgetId
) => {
  const budget = await Budget.findOne({
    _id: budgetId,
    user: userId
  });

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  return budget;
};

// Update budget
export const updateBudget = async (
  userId,
  budgetId,
  data
) => {
  const allowedFields = ["category", "amount", "month", "year"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  const budget = await Budget.findOneAndUpdate(
    {
      _id: budgetId,
      user: userId
    },
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  return budget;
};

// Delete budget
export const deleteBudget = async (
  userId,
  budgetId
) => {
  const budget = await Budget.findOneAndDelete({
    _id: budgetId,
    user: userId
  });

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  return budget;
};