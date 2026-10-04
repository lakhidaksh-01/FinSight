import Goal from "../models/Goal.js";
import ApiError from "../utils/apiError.js";

// Create goal
export const createGoal = async (userId, data) => {
  const goal = await Goal.create({
    ...data,
    user: userId
  });

  return goal;
};

// Get goals
export const getGoals = async (userId) => {
  return await Goal.find({
    user: userId
  }).sort({ targetDate: 1 });
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
  const goal = await Goal.findOneAndUpdate(
    {
      _id: goalId,
      user: userId
    },
    data,
    {
      new: true,
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