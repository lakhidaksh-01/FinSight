import Income from "../models/Income.js";
import ApiError from "../utils/apiError.js";

// Add income
export const createIncome = async (userId, data) => {
  const income = await Income.create({
    ...data,
    user: userId
  });

  return income;
};

// Get income
export const getIncome = async (userId, query) => {
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

  return await Income.find(filter)
    .sort({ date: -1 });
};

// Get one income
export const getIncomeById = async (
  userId,
  incomeId
) => {
  const income = await Income.findOne({
    _id: incomeId,
    user: userId
  });

  if (!income) {
    throw new ApiError(404, "Income not found");
  }

  return income;
};

// Update income
export const updateIncome = async (
  userId,
  incomeId,
  data
) => {
  const income = await Income.findOneAndUpdate(
    {
      _id: incomeId,
      user: userId
    },
    data,
    {
      new: true,
      runValidators: true
    }
  );

  if (!income) {
    throw new ApiError(404, "Income not found");
  }

  return income;
};

// Delete income
export const deleteIncome = async (
  userId,
  incomeId
) => {
  const income = await Income.findOneAndDelete({
    _id: incomeId,
    user: userId
  });

  if (!income) {
    throw new ApiError(404, "Income not found");
  }

  return income;
};