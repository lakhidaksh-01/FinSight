import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/apiError.js";

// Protect private routes
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new ApiError(
        401,
        "Not authorized. Token required"
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      throw new ApiError(
        401,
        "Not authorized. User not found"
      );
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(
        new ApiError(401, "Invalid token")
      );
    }

    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError(401, "Token has expired")
      );
    }

    next(error);
  }
};