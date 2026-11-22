import Income from "../models/Income.js";
import ApiError from "../utils/apiError.js";
import { getPagination, buildPaginatedResult } from "../utils/pagination.js";

// Add income
export const createIncome = async (userId, data) => {
  const allowedFields = ["amount", "category", "description", "date"];
  const incomeData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      incomeData[field] = data[field];
    }
  });

  const income = await Income.create({
    ...incomeData,
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

  if (query.search) {
    const escaped = String(query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { description: { $regex: escaped, $options: "i" } },
      { category: { $regex: escaped, $options: "i" } }
    ];
  }

  const paginated = query.page !== undefined || query.limit !== undefined;
  const pagination = getPagination(query);

  const [incomes, total] = await Promise.all([
    Income.find(filter)
      .sort({ date: -1, _id: -1 })
      .skip(paginated ? pagination.skip : 0)
      .limit(paginated ? pagination.limit : 0),
    paginated ? Income.countDocuments(filter) : Promise.resolve(0)
  ]);

  if (paginated) {
    return buildPaginatedResult(incomes, total, pagination);
  }

  return incomes;
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
  const allowedFields = ["amount", "category", "description", "date"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  const income = await Income.findOneAndUpdate(
    {
      _id: incomeId,
      user: userId
    },
    updates,
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