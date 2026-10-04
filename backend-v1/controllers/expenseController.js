import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  deleteAllExpenses
} from "../services/expenseService.js";

// Add expense
export const addExpense = async (req, res, next) => {
  try {
    const expense = await createExpense(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

// Get all expenses
export const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await getExpenses(
      req.user._id,
      req.query
    );

    res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

// Get one expense
export const getSingleExpense = async (req, res, next) => {
  try {
    const expense = await getExpenseById(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

// Update expense
export const editExpense = async (req, res, next) => {
  try {
    const expense = await updateExpense(
      req.user._id,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

// Delete one expense
export const removeExpense = async (req, res, next) => {
  try {
    await deleteExpense(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Delete all expenses
export const removeAllExpenses = async (req, res, next) => {
  try {
    await deleteAllExpenses(req.user._id);

    res.status(200).json({
      success: true,
      message: "All expenses deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};