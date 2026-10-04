import express from "express";
import {
  addBudget,
  getAllBudgets,
  getSingleBudget,
  editBudget,
  removeBudget
} from "../controllers/budgetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create budget
router.post("/", protect, addBudget);

// Get all budgets
router.get("/", protect, getAllBudgets);

// Get one budget
router.get("/:id", protect, getSingleBudget);

// Update budget
router.put("/:id", protect, editBudget);

// Delete budget
router.delete("/:id", protect, removeBudget);

export default router;