import Income from "../models/Income.js";
import ApiError from "../utils/apiError.js";
import { getPagination } from "../utils/pagination.js";
import {
  buildTransactionFilter,
  getPaginatedTransactions,
  getTransactionSort,
} from "../utils/transactionQuery.js";

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
  const filter = buildTransactionFilter(userId, query);

  const paginated = query.page !== undefined || query.limit !== undefined;
  const pagination = getPagination(query);
  const sort = getTransactionSort(query.sort);

  if (paginated) {
    return getPaginatedTransactions(Income, filter, pagination, sort);
  }

  return Income.find(filter).sort(sort);
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
      returnDocument: "after",
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