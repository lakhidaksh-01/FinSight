import {
  registerUser,
  loginUser
} from "../services/authService.js";

import {
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword
} from "../services/authService.js";
// Register
export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (
  req,
  res,
  next
) => {
  try {
    const result = await forgotPassword(
      req.body.email
    );

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};


export const verifyOtpController = async (
  req,
  res,
  next
) => {
  try {
    const { email, otp } = req.body;

    const result =
      await verifyPasswordResetOtp(
        email,
        otp
      );

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {
        resetToken: result.resetToken
      }
    });
  } catch (error) {
    next(error);
  }
};


export const resetPasswordController = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      resetToken,
      newPassword
    } = req.body;

    const result = await resetPassword(
      email,
      resetToken,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};