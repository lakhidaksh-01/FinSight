import { body } from "express-validator";

export const createBudgetValidator = [
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ max: 100 })
    .withMessage("Category cannot exceed 100 characters"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),

  body("month")
    .notEmpty()
    .withMessage("Month is required")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),

  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt({ min: 2000 })
    .withMessage("Year must be 2000 or later")
];

export const updateBudgetValidator = [
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Category cannot exceed 100 characters"),

  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),

  body("month")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),

  body("year")
    .optional()
    .isInt({ min: 2000 })
    .withMessage("Year must be 2000 or later")
];