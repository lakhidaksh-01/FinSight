import {
  getDashboardAnalytics,
  getSpendingAnalytics,
  getSavingsAnalytics
} from "../services/analyticsService.js";

// Dashboard data
export const getDashboard = async (req, res, next) => {
  try {
    const data = await getDashboardAnalytics(
      req.user._id,
      req.query
    );

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Spending analytics
export const getSpending = async (req, res, next) => {
  try {
    const data = await getSpendingAnalytics(
      req.user._id,
      req.query
    );

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Savings analytics
export const getSavings = async (req, res, next) => {
  try {
    const data = await getSavingsAnalytics(
      req.user._id,
      req.query
    );

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};