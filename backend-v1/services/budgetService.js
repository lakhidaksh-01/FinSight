import Budget from "../models/Budget.js";
import ApiError from "../utils/apiError.js";

// Create budget
export const createBudget = async (userId, data) => {
  const budget = await Budget.create({
    ...data,
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

  return await Budget.find(filter)
    .sort({ year: -1, month: -1 });
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
  const budget = await Budget.findOneAndUpdate(
    {
      _id: budgetId,
      user: userId
    },
    data,
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