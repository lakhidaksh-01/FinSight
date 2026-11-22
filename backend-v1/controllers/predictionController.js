import {
  generatePredictions,
  getPredictions,
  getLatestPrediction
} from "../services/predictionService.js";

// Create prediction
export const predictSpending = async (req, res, next) => {
  try {
    const result = await generatePredictions(
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Forecast generated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Get prediction history
export const getPredictionHistory = async (req, res, next) => {
  try {
    const predictions = await getPredictions(
      req.user._id,
      req.query
    );

    res.status(200).json({
      success: true,
      data: predictions,
      ...(predictions?.pagination ? { pagination: predictions.pagination } : {})
    });
  } catch (error) {
    next(error);
  }
};

// Get latest prediction
export const getLatest = async (req, res, next) => {
  try {
    const prediction = await getLatestPrediction(
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
};