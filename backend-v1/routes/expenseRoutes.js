import express from "express";
import {
  addExpense,
  getAllExpenses,
  getSingleExpense,
  editExpense,
  removeExpense,
  removeAllExpenses
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createExpenseValidator, updateExpenseValidator } from "../validators/expenseValidator.js";
import { validate, validateObjectIdParam } from "../middleware/validateMiddleware.js";
import { query } from "express-validator";

const expenseQueryValidator = [
  query("category").optional().trim().isLength({ max: 100 }),
  query("startDate").optional().isISO8601().withMessage("startDate must be valid"),
  query("endDate").optional().isISO8601().withMessage("endDate must be valid"),
  query("search").optional().trim().isLength({ max: 100 }).withMessage("search is too long"),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be positive"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100")
];

const router = express.Router();

// Add expense
router.post("/", protect, createExpenseValidator, validate, addExpense);

// Get all expenses
router.get("/", protect, expenseQueryValidator, validate, getAllExpenses);

// Get one expense
router.get("/:id", protect, validateObjectIdParam, validate, getSingleExpense);

// Update expense
router.put("/:id", protect, validateObjectIdParam, validate, updateExpenseValidator, validate, editExpense);

// Delete one expense
router.delete("/:id", protect, validateObjectIdParam, validate, removeExpense);

// Delete all expenses
router.delete("/", protect, removeAllExpenses);

export default router;