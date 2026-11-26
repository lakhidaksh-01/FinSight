import Goal from "../models/Goal.js";
import ApiError from "../utils/apiError.js";
import { getPagination, buildPaginatedResult } from "../utils/pagination.js";

// Create goal
export const createGoal = async (userId, data) => {
  const allowedFields = ["name", "targetAmount", "currentAmount", "targetDate", "description", "category"];
  const goalData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      goalData[field] = data[field];
    }
  });

  const goal = await Goal.create({
    ...goalData,
    user: userId
  });

  return goal;
};

// Get goals
export const getGoals = async (userId, query = {}) => {
  const filter = { user: userId };

  if (query.search) {
    const escaped = String(query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: escaped, $options: "i" } },
      { category: { $regex: escaped, $options: "i" } },
      { description: { $regex: escaped, $options: "i" } }
    ];
  }

  const paginated = query.page !== undefined || query.limit !== undefined;
  const pagination = getPagination(query);
  const [goals, total] = await Promise.all([
    Goal.find(filter)
      .sort({ targetDate: 1, _id: -1 })
      .skip(paginated ? pagination.skip : 0)
      .limit(paginated ? pagination.limit : 0),
    paginated ? Goal.countDocuments(filter) : Promise.resolve(0)
  ]);

  return paginated
    ? buildPaginatedResult(goals, total, pagination)
    : goals;
};

// Get one goal
export const getGoalById = async (
  userId,
  goalId
) => {
  const goal = await Goal.findOne({
    _id: goalId,
    user: userId
  });

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  return goal;
};

// Update goal
export const updateGoal = async (
  userId,
  goalId,
  data
) => {
  const allowedFields = ["name", "targetAmount", "currentAmount", "targetDate", "description", "category"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  const goal = await Goal.findOneAndUpdate(
    {
      _id: goalId,
      user: userId
    },
    updates,
    {
      returnDocument: "after",
      runValidators: true
    }
  );

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  return goal;
};

// Delete goal
export const deleteGoal = async (
  userId,
  goalId
) => {
  const goal = await Goal.findOneAndDelete({
    _id: goalId,
    user: userId
  });

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  return goal;
};