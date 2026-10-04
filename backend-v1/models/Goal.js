import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    targetAmount: {
      type: Number,
      required: true,
      min: 0
    },

    currentAmount: {
      type: Number,
      default: 0,
      min: 0
    },

    targetDate: {
      type: Date,
      required: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

goalSchema.index({ user: 1, targetDate: 1 });

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;