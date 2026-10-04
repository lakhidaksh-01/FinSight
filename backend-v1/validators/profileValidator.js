import { body } from "express-validator";

export const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("currency")
    .optional()
    .trim()
    .isLength({ min: 3, max: 5 })
    .withMessage("Currency must be between 3 and 5 characters"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object")
];