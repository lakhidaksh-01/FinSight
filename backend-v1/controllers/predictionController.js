import {
  createPrediction,
  getPredictions,
  getLatestPrediction
} from "../services/predictionService.js";

// Create prediction
export const predictSpending = async (req, res, next) => {
  try {
    const prediction = await createPrediction(
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Prediction created successfully",
      data: prediction
    });
  } catch (error) {
    next(error);
  }
};

// Get prediction history
export const getPredictionHistory = async (req, res, next) => {
  try {
    const predictions = await getPredictions(
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: predictions
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