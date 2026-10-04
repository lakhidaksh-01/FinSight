import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import ApiError from "../utils/apiError.js";
import PasswordReset from "../models/PasswordReset.js";
import { sendPasswordResetOtp } from "../utils/emailService.js";

// Create JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register user
export const registerUser = async ({
  email,
  password
}) => {
  if (!email || !password) {
    throw new ApiError(
      400,
      "Email and password are required"
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(
      400,
      "Email already registered"
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  const user = await User.create({
    email,
    password: hashedPassword
  });

  return {
    token: generateToken(user._id),
    user: {
      id: user._id,
      email: user.email
    }
  };
};

// Login user
export const loginUser = async ({
  email,
  password
}) => {
  if (!email || !password) {
    throw new ApiError(
      400,
      "Email and password are required"
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password || ""
  );

  if (!passwordMatch) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  return {
    token: generateToken(user._id),
    user: {
      id: user._id,
      email: user.email
    }
  };
};

// Get profile
export const getProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "-password"
  );

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  return user;
};

// Update profile
export const updateProfile = async (
  userId,
  data
) => {
  const allowedFields = [
    "name",
    "currency",
    "preferences"
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    updates,
    {
      new: true,
      runValidators: true
    }
  ).select("-password");

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  return user;
};

// Send password reset OTP
export const forgotPassword = async (email) => {
  const normalizedEmail = email
    .toLowerCase()
    .trim();

  const user = await User.findOne({
    email: normalizedEmail
  });

  /*
   * Do not reveal whether the email exists.
   * This prevents account/email enumeration.
   */
  if (!user) {
    return {
      message:
        "If an account with that email exists, an OTP has been sent."
    };
  }

  // Remove previous password reset requests
  await PasswordReset.deleteMany({
    email: normalizedEmail
  });

  // Generate 6-digit OTP
  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  // Hash OTP before storing it
  const otpHash = await bcrypt.hash(
    otp,
    10
  );

  // OTP expires after 90 seconds
  const expiresAt = new Date(
    Date.now() + 90 * 1000
  );

  await PasswordReset.create({
    email: normalizedEmail,
    otpHash,
    expiresAt
  });

  // Send OTP to registered email
  await sendPasswordResetOtp(
    normalizedEmail,
    otp
  );

  return {
    message:
      "If an account with that email exists, an OTP has been sent."
  };
};

// Verify password reset OTP
export const verifyPasswordResetOtp = async (
  email,
  otp
) => {
  const normalizedEmail = email
    .toLowerCase()
    .trim();

  const resetRequest =
    await PasswordReset.findOne({
      email: normalizedEmail
    }).sort({
      createdAt: -1
    });

  if (!resetRequest) {
    throw new ApiError(
      400,
      "Invalid or expired OTP"
    );
  }

  // Check OTP expiry
  if (resetRequest.expiresAt < new Date()) {
    await PasswordReset.deleteOne({
      _id: resetRequest._id
    });

    throw new ApiError(
      400,
      "OTP has expired"
    );
  }

  // Prevent OTP reuse
  if (resetRequest.verified) {
    throw new ApiError(
      400,
      "OTP has already been used"
    );
  }

  // Compare entered OTP with stored hash
  const isOtpValid = await bcrypt.compare(
    otp,
    resetRequest.otpHash
  );

  if (!isOtpValid) {
    throw new ApiError(
      400,
      "Invalid or expired OTP"
    );
  }

  // Generate secure reset token
  const resetToken = crypto
    .randomBytes(32)
    .toString("hex");

  // Hash reset token before storing it
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Reset token is valid for 10 minutes
  const resetTokenExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  resetRequest.verified = true;

  resetRequest.resetTokenHash =
    resetTokenHash;

  resetRequest.resetTokenExpiresAt =
    resetTokenExpiresAt;

  await resetRequest.save();

  return {
    resetToken
  };
};

// Reset password
export const resetPassword = async (
  email,
  resetToken,
  newPassword
) => {
  const normalizedEmail = email
    .toLowerCase()
    .trim();

  // Hash the provided reset token
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const resetRequest =
    await PasswordReset.findOne({
      email: normalizedEmail,
      resetTokenHash,
      verified: true
    });

  if (!resetRequest) {
    throw new ApiError(
      400,
      "Invalid or expired reset request"
    );
  }

  // Check reset token expiry
  if (
    !resetRequest.resetTokenExpiresAt ||
    resetRequest.resetTokenExpiresAt < new Date()
  ) {
    await PasswordReset.deleteOne({
      _id: resetRequest._id
    });

    throw new ApiError(
      400,
      "Reset session has expired"
    );
  }

  const user = await User.findOne({
    email: normalizedEmail
  });

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired reset request"
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  user.password = hashedPassword;

  await user.save();

  // Make reset token unusable
  await PasswordReset.deleteOne({
    _id: resetRequest._id
  });

  return {
    message: "Password reset successfully"
  };
};