import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500
    },

    date: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

incomeSchema.index({ user: 1, date: -1 });
incomeSchema.index({ user: 1, category: 1 });

const Income = mongoose.model("Income", incomeSchema);

export default Income;