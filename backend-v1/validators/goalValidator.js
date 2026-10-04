import { body } from "express-validator";

export const createGoalValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Goal name is required")
    .isLength({ max: 100 })
    .withMessage("Goal name cannot exceed 100 characters"),

  body("targetAmount")
    .notEmpty()
    .withMessage("Target amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Target amount must be greater than 0"),

  body("currentAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Current amount cannot be negative"),

  body("targetDate")
    .notEmpty()
    .withMessage("Target date is required")
    .isISO8601()
    .withMessage("Target date must be valid"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage(
      "Description cannot exceed 500 characters"
    )
];

export const updateGoalValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Goal name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Goal name cannot exceed 100 characters"),

  body("targetAmount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Target amount must be greater than 0"),

  body("currentAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Current amount cannot be negative"),

  body("targetDate")
    .optional()
    .isISO8601()
    .withMessage("Target date must be valid"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage(
      "Description cannot exceed 500 characters"
    )
];