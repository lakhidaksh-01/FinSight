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

const router = express.Router();

// Add expense
router.post("/", protect, addExpense);

// Get all expenses
router.get("/", protect, getAllExpenses);

// Get one expense
router.get("/:id", protect, getSingleExpense);

// Update expense
router.put("/:id", protect, editExpense);

// Delete one expense
router.delete("/:id", protect, removeExpense);

// Delete all expenses
router.delete("/", protect, removeAllExpenses);

export default router;