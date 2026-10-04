import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    otpHash: {
      type: String,
      required: true
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true
    },

    verified: {
      type: Boolean,
      default: false
    },

    resetTokenHash: {
      type: String,
      default: null
    },

    resetTokenExpiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const PasswordReset = mongoose.model(
  "PasswordReset",
  passwordResetSchema
);

export default PasswordReset;