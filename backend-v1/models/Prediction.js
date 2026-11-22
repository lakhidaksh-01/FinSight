import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    predictionType: {
      type: String,
      required: true,
      trim: true,
      enum: ["expense_forecast", "monthly_savings", "category_spending"]
    },

    predictedAmount: {
      type: Number,
      required: true,
      min: 0
    },

    period: {
      type: String,
      required: true,
      trim: true
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100
    },

    model: {
      type: String,
      trim: true
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

predictionSchema.index({ user: 1, createdAt: -1 });
predictionSchema.index({ user: 1, predictionType: 1, createdAt: -1 });

const Prediction = mongoose.model(
  "Prediction",
  predictionSchema
);

export default Prediction;