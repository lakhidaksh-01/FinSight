import express from "express";

import {
  register,
  login,
  forgotPasswordController,
  verifyOtpController,
  resetPasswordController
} from "../controllers/authController.js";

import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyOtpValidator,
  resetPasswordValidator
} from "../validators/authValidator.js";

import { validate } from "../middleware/validateMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Register
router.post(
  "/register",
  authRateLimiter,
  registerValidator,
  validate,
  register
);

// Login
router.post(
  "/login",
  authRateLimiter,
  loginValidator,
  validate,
  login
);

// Forgot password - send OTP
router.post(
  "/forgot-password",
  authRateLimiter,
  forgotPasswordValidator,
  validate,
  forgotPasswordController
);

// Verify OTP
router.post(
  "/verify-otp",
  authRateLimiter,
  verifyOtpValidator,
  validate,
  verifyOtpController
);

// Reset password
router.post(
  "/reset-password",
  authRateLimiter,
  resetPasswordValidator,
  validate,
  resetPasswordController
);

export default router;