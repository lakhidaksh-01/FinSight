import {
  createIncome,
  getIncome,
  getIncomeById,
  updateIncome,
  deleteIncome
} from "../services/incomeService.js";

// Add income
export const addIncome = async (req, res, next) => {
  try {
    const income = await createIncome(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      data: income
    });
  } catch (error) {
    next(error);
  }
};

// Get income
export const getAllIncome = async (req, res, next) => {
  try {
    const income = await getIncome(
      req.user._id,
      req.query
    );

    res.status(200).json({
      success: true,
      data: income
    });
  } catch (error) {
    next(error);
  }
};

// Get one income
export const getSingleIncome = async (req, res, next) => {
  try {
    const income = await getIncomeById(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: income
    });
  } catch (error) {
    next(error);
  }
};

// Update income
export const editIncome = async (req, res, next) => {
  try {
    const income = await updateIncome(
      req.user._id,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: income
    });
  } catch (error) {
    next(error);
  }
};

// Delete income
export const removeIncome = async (req, res, next) => {
  try {
    await deleteIncome(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Income deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};