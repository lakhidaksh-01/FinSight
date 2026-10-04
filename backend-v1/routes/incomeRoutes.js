import express from "express";
import {
  addIncome,
  getAllIncome,
  getSingleIncome,
  editIncome,
  removeIncome
} from "../controllers/incomeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add income
router.post("/", protect, addIncome);

// Get all income
router.get("/", protect, getAllIncome);

// Get one income
router.get("/:id", protect, getSingleIncome);

// Update income
router.put("/:id", protect, editIncome);

// Delete income
router.delete("/:id", protect, removeIncome);

export default router;