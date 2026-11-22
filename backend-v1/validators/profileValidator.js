import { body } from "express-validator";

export const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("currency")
    .optional()
    .trim()
    .isIn(["INR", "USD", "CAD", "EUR", "GBP"])
    .withMessage("Unsupported currency"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object")
];