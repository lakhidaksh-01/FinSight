import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal
} from "../services/goalService.js";

// Create goal
export const addGoal = async (req, res, next) => {
  try {
    const goal = await createGoal(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// Get goals
export const getAllGoals = async (req, res, next) => {
  try {
    const goals = await getGoals(req.user._id);

    res.status(200).json({
      success: true,
      data: goals
    });
  } catch (error) {
    next(error);
  }
};

// Get one goal
export const getSingleGoal = async (req, res, next) => {
  try {
    const goal = await getGoalById(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// Update goal
export const editGoal = async (req, res, next) => {
  try {
    const goal = await updateGoal(
      req.user._id,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// Delete goal
export const removeGoal = async (req, res, next) => {
  try {
    await deleteGoal(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};