import express from "express";
import {
  addBudget,
  getAllBudgets,
  getSingleBudget,
  editBudget,
  removeBudget
} from "../controllers/budgetController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createBudgetValidator, updateBudgetValidator } from "../validators/budgetValidator.js";
import { validate, validateObjectIdParam } from "../middleware/validateMiddleware.js";
import { query } from "express-validator";

const budgetQueryValidator = [
  query("month").optional().isInt({ min: 1, max: 12 }).withMessage("Month must be between 1 and 12"),
  query("year").optional().isInt({ min: 2000 }).withMessage("Year must be 2000 or later"),
  query("search").optional().trim().isLength({ max: 100 }),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];

const router = express.Router();

// Create budget
router.post("/", protect, createBudgetValidator, validate, addBudget);

// Get all budgets
router.get("/", protect, budgetQueryValidator, validate, getAllBudgets);

// Get one budget
router.get("/:id", protect, validateObjectIdParam, validate, getSingleBudget);

// Update budget
router.put("/:id", protect, validateObjectIdParam, validate, updateBudgetValidator, validate, editBudget);

// Delete budget
router.delete("/:id", protect, validateObjectIdParam, validate, removeBudget);

export default router;