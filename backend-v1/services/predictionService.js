import Prediction from "../models/Prediction.js";
import ApiError from "../utils/apiError.js";

// Create prediction
export const createPrediction = async (
  userId,
  data
) => {
  const prediction = await Prediction.create({
    ...data,
    user: userId
  });

  return prediction;
};

// Get prediction history
export const getPredictions = async (userId) => {
  return await Prediction.find({
    user: userId
  }).sort({ createdAt: -1 });
};

// Get latest prediction
export const getLatestPrediction = async (userId) => {
  const prediction = await Prediction.findOne({
    user: userId
  }).sort({ createdAt: -1 });

  if (!prediction) {
    throw new ApiError(
      404,
      "No prediction found"
    );
  }

  return prediction;
};