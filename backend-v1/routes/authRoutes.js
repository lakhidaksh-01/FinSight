import express from "express";

import {
  register,
  login,
  forgotPasswordController,
  verifyOtpController,
  resetPasswordController
} from "../controllers/authController.js";

import {
  forgotPasswordValidator,
  verifyOtpValidator,
  resetPasswordValidator
} from "../validators/authValidator.js";

import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Register
router.post(
  "/register",
  register
);

// Login
router.post(
  "/login",
  login
);

// Forgot password - send OTP
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  forgotPasswordController
);

// Verify OTP
router.post(
  "/verify-otp",
  verifyOtpValidator,
  validate,
  verifyOtpController
);

// Reset password
router.post(
  "/reset-password",
  resetPasswordValidator,
  validate,
  resetPasswordController
);

export default router;