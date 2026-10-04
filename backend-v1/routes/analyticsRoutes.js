import express from "express";
import {
  getDashboard,
  getSpending,
  getSavings
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard analytics
router.get("/dashboard", protect, getDashboard);

// Spending analytics
router.get("/spending", protect, getSpending);

// Savings analytics
router.get("/savings", protect, getSavings);

export default router;