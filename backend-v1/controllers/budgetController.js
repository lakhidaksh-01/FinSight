import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget
} from "../services/budgetService.js";

// Create budget
export const addBudget = async (req, res, next) => {
  try {
    const budget = await createBudget(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Budget created successfully",
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

// Get budgets
export const getAllBudgets = async (req, res, next) => {
  try {
    const budgets = await getBudgets(
      req.user._id,
      req.query
    );

    res.status(200).json({
      success: true,
      data: budgets
    });
  } catch (error) {
    next(error);
  }
};

// Get one budget
export const getSingleBudget = async (req, res, next) => {
  try {
    const budget = await getBudgetById(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

// Update budget
export const editBudget = async (req, res, next) => {
  try {
    const budget = await updateBudget(
      req.user._id,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

// Delete budget
export const removeBudget = async (req, res, next) => {
  try {
    await deleteBudget(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};