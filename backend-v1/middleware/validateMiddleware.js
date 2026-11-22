import { param, validationResult } from "express-validator";

export const validateObjectIdParam = [
  param("id")
    .isMongoId()
    .withMessage("Invalid resource ID")
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()
    });
  }

  next();
};